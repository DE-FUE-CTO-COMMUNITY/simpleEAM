import { randomUUID } from 'crypto'
import express from 'express'
import { z } from 'zod'

import { neo4jDriver } from '../db/neo4j-client'

import { authenticateAnalyticsRequest, canAccessCompany, hasAnalyticsWriteAccess } from './auth'
import { loadAnalyticsChartData } from './cube'
import { syncAnalyticsProjections } from './projections'
import { analyticsDimensionKeys, analyticsElementTypes, analyticsMeasureKeys } from './schema'

const analyticsRouter = express.Router()

const chartTypeSchema = z.enum(['bar', 'line', 'pie'])
const elementTypeSchema = z.enum(analyticsElementTypes)
const dimensionSchema = z.enum(analyticsDimensionKeys)
const measureSchema = z.enum(analyticsMeasureKeys)

const companyIdField = z
  .string()
  .trim()
  .min(1)
  .nullable()
  .optional()
  .transform(value => value ?? null)

const reportInputSchema = z.object({
  companyId: companyIdField,
  name: z.string().trim().min(1).max(120),
  elementType: elementTypeSchema,
  chartType: chartTypeSchema,
  dimension: dimensionSchema,
  measure: measureSchema,
})

const queryInputSchema = z.object({
  companyId: companyIdField,
  elementType: elementTypeSchema.default('application'),
  dimension: dimensionSchema,
  measure: measureSchema,
})

const syncInputSchema = z.object({
  companyId: companyIdField,
})

function getCompanyIdFromQuery(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

analyticsRouter.get('/reports', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const companyId = getCompanyIdFromQuery(req.query.companyId)
  if (!canAccessCompany(user, companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (report:AnalyticsReport { ownerSub: $ownerSub })
        WHERE ($companyId IS NULL AND report.companyId IS NULL) OR report.companyId = $companyId
        RETURN report {
          .id,
          .name,
          elementType: coalesce(report.elementType, 'application'),
          .chartType,
          .dimension,
          .measure,
          .companyId,
          .createdAt,
          .updatedAt
        } AS report
        ORDER BY report.updatedAt DESC
      `,
      {
        ownerSub: user.sub,
        companyId,
      }
    )

    return res.json({ reports: result.records.map(record => record.get('report')) })
  } catch (error) {
    console.error('[analytics][reports][list]', error)
    return res.status(500).json({ message: 'Failed to load reports' })
  } finally {
    await session.close()
  }
})

analyticsRouter.post('/reports', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (!hasAnalyticsWriteAccess(user)) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  const parsed = reportInputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: 'Invalid report payload', errors: parsed.error.flatten() })
  }

  if (!canAccessCompany(user, parsed.data.companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  const reportId = randomUUID()
  const now = new Date().toISOString()
  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        CREATE (report:AnalyticsReport {
          id: $id,
          ownerSub: $ownerSub,
          ownerUsername: $ownerUsername,
          companyId: $companyId,
          name: $name,
          elementType: $elementType,
          chartType: $chartType,
          dimension: $dimension,
          measure: $measure,
          createdAt: $now,
          updatedAt: $now
        })
        RETURN report {
          .id,
          .name,
          .elementType,
          .chartType,
          .dimension,
          .measure,
          .companyId,
          .createdAt,
          .updatedAt
        } AS report
      `,
      {
        id: reportId,
        ownerSub: user.sub,
        ownerUsername: user.username,
        companyId: parsed.data.companyId,
        name: parsed.data.name,
        elementType: parsed.data.elementType,
        chartType: parsed.data.chartType,
        dimension: parsed.data.dimension,
        measure: parsed.data.measure,
        now,
      }
    )

    return res.status(201).json({ report: result.records[0]?.get('report') ?? null })
  } catch (error) {
    console.error('[analytics][reports][create]', error)
    return res.status(500).json({ message: 'Failed to create report' })
  } finally {
    await session.close()
  }
})

analyticsRouter.put('/reports/:id', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (!hasAnalyticsWriteAccess(user)) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  const parsed = reportInputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: 'Invalid report payload', errors: parsed.error.flatten() })
  }

  if (!canAccessCompany(user, parsed.data.companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (report:AnalyticsReport { id: $id, ownerSub: $ownerSub })
        SET report.name = $name,
          report.elementType = $elementType,
            report.chartType = $chartType,
            report.dimension = $dimension,
            report.measure = $measure,
            report.companyId = $companyId,
            report.updatedAt = $now
        RETURN report {
          .id,
          .name,
          .elementType,
          .chartType,
          .dimension,
          .measure,
          .companyId,
          .createdAt,
          .updatedAt
        } AS report
      `,
      {
        id: req.params.id,
        ownerSub: user.sub,
        companyId: parsed.data.companyId,
        name: parsed.data.name,
        elementType: parsed.data.elementType,
        chartType: parsed.data.chartType,
        dimension: parsed.data.dimension,
        measure: parsed.data.measure,
        now: new Date().toISOString(),
      }
    )

    const report = result.records[0]?.get('report') ?? null
    if (!report) {
      return res.status(404).json({ message: 'Report not found' })
    }

    return res.json({ report })
  } catch (error) {
    console.error('[analytics][reports][update]', error)
    return res.status(500).json({ message: 'Failed to update report' })
  } finally {
    await session.close()
  }
})

analyticsRouter.delete('/reports/:id', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const session = neo4jDriver.session()

  try {
    const result = await session.run(
      `
        MATCH (report:AnalyticsReport { id: $id, ownerSub: $ownerSub })
        WITH report, report {
          .id,
          .name,
          elementType: coalesce(report.elementType, 'application'),
          .chartType,
          .dimension,
          .measure,
          .companyId,
          .createdAt,
          .updatedAt
        } AS deletedReport
        DELETE report
        RETURN deletedReport AS report
      `,
      {
        id: req.params.id,
        ownerSub: user.sub,
      }
    )

    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Report not found' })
    }

    return res.json({ report: result.records[0].get('report') })
  } catch (error) {
    console.error('[analytics][reports][delete]', error)
    return res.status(500).json({ message: 'Failed to delete report' })
  } finally {
    await session.close()
  }
})

analyticsRouter.post('/projections/sync', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (!hasAnalyticsWriteAccess(user)) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  const parsed = syncInputSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid sync payload', errors: parsed.error.flatten() })
  }

  const companyId = parsed.data.companyId
  if (companyId && !canAccessCompany(user, companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  if (!companyId && !user.isAdmin) {
    return res.status(400).json({ message: 'A companyId is required for non-admin users' })
  }

  try {
    const result = await syncAnalyticsProjections(companyId)
    return res.json(result)
  } catch (error) {
    console.error('[analytics][projections][sync]', error)
    return res.status(500).json({ message: 'Failed to sync analytics projections' })
  }
})

analyticsRouter.post('/query', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const parsed = queryInputSchema.safeParse(req.body)
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: 'Invalid analytics query payload', errors: parsed.error.flatten() })
  }

  const companyId = parsed.data.companyId
  if (companyId && !canAccessCompany(user, companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  const allowedCompanyIds = companyId ? [companyId] : user.isAdmin ? [] : [...user.companyIds]

  try {
    const result = await loadAnalyticsChartData(user, {
      companyId,
      elementType: parsed.data.elementType,
      companyIds: allowedCompanyIds,
      dimension: parsed.data.dimension,
      measure: parsed.data.measure,
    })

    return res.json(result)
  } catch (error) {
    console.error('[analytics][query]', error)
    return res.status(500).json({ message: 'Failed to load analytics query results' })
  }
})

export default analyticsRouter
