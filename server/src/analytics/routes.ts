import express from 'express'
import { z } from 'zod'

import { authenticateAnalyticsRequest, canAccessCompany, hasAnalyticsWriteAccess } from './auth'
import { loadAnalyticsChartData } from './cube'
import { syncAnalyticsProjections } from './projections'
import { analyticsDimensionKeys, analyticsElementTypes, analyticsMeasureKeys } from './schema'
import { startAnalyticsProjectionRefreshWorkflow } from './temporal-client'

const analyticsRouter = express.Router()

const elementTypeSchema = z.enum(analyticsElementTypes)
const dimensionSchema = z.enum(analyticsDimensionKeys)
const measureSchema = z.enum(analyticsMeasureKeys)
const secondDimensionSchema = dimensionSchema
  .nullable()
  .optional()
  .transform(value => value ?? null)

const companyIdField = z
  .string()
  .trim()
  .min(1)
  .nullable()
  .optional()
  .transform(value => value ?? null)

const queryInputSchema = z.object({
  companyId: companyIdField,
  elementType: elementTypeSchema.default('application'),
  dimension: dimensionSchema,
  secondDimension: secondDimensionSchema,
  measure: measureSchema,
})

const syncInputSchema = z.object({
  companyId: companyIdField,
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

analyticsRouter.post('/projections/refresh', async (req, res) => {
  const user = await authenticateAnalyticsRequest(req)
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  if (!hasAnalyticsWriteAccess(user)) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  const parsed = syncInputSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: 'Invalid refresh payload', errors: parsed.error.flatten() })
  }

  const companyId = parsed.data.companyId
  if (companyId && !canAccessCompany(user, companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  if (!companyId && !user.isAdmin) {
    return res.status(400).json({ message: 'A companyId is required for non-admin users' })
  }

  const workflowId = companyId
    ? `analytics-projection-refresh-${companyId}-${Date.now()}`
    : `analytics-projection-refresh-${Date.now()}`

  try {
    await startAnalyticsProjectionRefreshWorkflow({
      companyId,
      initiatedBy: user.sub,
      workflowId,
    })

    console.info('[ANALYTICS][PROJECTION_REFRESH][STARTED]', {
      companyId,
      workflowId,
      initiatedBy: user.sub,
    })

    return res.status(202).json({
      workflowId,
      companyId,
      status: 'STARTED',
    })
  } catch (error) {
    console.error('[analytics][projections][refresh]', error)
    return res.status(500).json({ message: 'Failed to start analytics projection refresh' })
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
  if (!companyId) {
    return res.status(400).json({ message: 'A companyId is required' })
  }

  if (companyId && !canAccessCompany(user, companyId)) {
    return res.status(403).json({ message: 'Forbidden company scope' })
  }

  const allowedCompanyIds = [companyId]

  try {
    const result = await loadAnalyticsChartData(user, {
      companyId,
      elementType: parsed.data.elementType,
      companyIds: allowedCompanyIds,
      dimension: parsed.data.dimension,
      secondDimension: parsed.data.secondDimension,
      measure: parsed.data.measure,
    })

    return res.json(result)
  } catch (error) {
    console.error('[analytics][query]', error)
    return res.status(500).json({ message: 'Failed to load analytics query results' })
  }
})

export default analyticsRouter
