import React from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Info as InfoIcon } from '@mui/icons-material'
import { useTranslations } from 'next-intl'

import { ExportSettings } from './types'
import { useCompanyContext } from '@/contexts/CompanyContext'
import { entityTypeLabels, entityTypeOrder } from './constants'

interface ExportDialogProps {
  exportSettings: ExportSettings
  onEntityTypeChange: (entityType: string) => void
  onFormatChange: (format: string) => void
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  exportSettings,
  onEntityTypeChange,
  onFormatChange,
}) => {
  const t = useTranslations('importExport.export')
  const tEntityTypes = useTranslations('importExport.entityTypes')
  const tFileFormats = useTranslations('importExport.fileFormats')
  const { selectedCompanyId, companies } = useCompanyContext()
  const selectedCompanyName = companies.find(c => c.id === selectedCompanyId)?.name
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('title')}
            </Typography>

            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              <Typography variant="body2">
                {selectedCompanyName
                  ? `Export wird auf die ausgewählte Company gefiltert: ${selectedCompanyName}`
                  : 'Export wird auf die ausgewählte Company gefiltert.'}
              </Typography>
            </Alert>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('dataType')}</InputLabel>
                  <Select
                    value={exportSettings.entityType}
                    label={t('dataType')}
                    onChange={e => onEntityTypeChange(e.target.value)}
                  >
                    {entityTypeOrder.map(entityType => (
                      <MenuItem key={entityType} value={entityType}>
                        {tEntityTypes(entityType as keyof typeof entityTypeLabels) || entityType}
                      </MenuItem>
                    ))}
                    <MenuItem key="all" value="all">
                      {tEntityTypes('all')}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('fileFormat')}</InputLabel>
                  <Select
                    value={exportSettings.format}
                    label={t('fileFormat')}
                    onChange={e => onFormatChange(e.target.value)}
                  >
                    <MenuItem value="xlsx">{tFileFormats('xlsx')}</MenuItem>
                    <MenuItem value="csv" disabled={exportSettings.entityType === 'all'}>
                      {tFileFormats('csv')}
                    </MenuItem>
                    <MenuItem value="json">{tFileFormats('json')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('preview')}
            </Typography>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                {t('previewText', {
                  entityType: tEntityTypes(exportSettings.entityType) || exportSettings.entityType,
                  format: exportSettings.format.toUpperCase(),
                })}
              </Typography>
            </Alert>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>{t('graphqlFields')}:</strong>
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(() => {
                  // GraphQL-Felder für alle Entitätstypen
                  const entityFieldsMapping = {
                    businessCapabilities: [
                      'id',
                      'name',
                      'description',
                      'maturityLevel',
                      'status',
                      'type',
                      'businessValue',
                      'sequenceNumber',
                      'introductionDate',
                      'endDate',
                      'owners',
                      'tags',
                      'createdAt',
                      'updatedAt',
                      'children',
                      'parents',
                      'supportedByApplications',
                      'partOfArchitectures',
                      'relatedDataObjects',
                      'depictedInDiagrams',
                    ],
                    applications: [
                      'id',
                      'name',
                      'description',
                      'status',
                      'criticality',
                      'timeCategory',
                      'sevenRStrategy',
                      'costs',
                      'vendor',
                      'version',
                      'hostingEnvironment',
                      'technologyStack',
                      'planningDate',
                      'introductionDate',
                      'endOfUseDate',
                      'endOfLifeDate',
                      'owners',
                      'createdAt',
                      'updatedAt',
                      'supportsCapabilities',
                      'usesDataObjects',
                      'sourceOfInterfaces',
                      'targetOfInterfaces',
                      'partOfArchitectures',
                      'depictedInDiagrams',
                      'parents',
                      'components',
                      'predecessors',
                      'successors',
                      'implementsPrinciples',
                      'hostedOn',
                    ],
                    dataObjects: [
                      'id',
                      'name',
                      'description',
                      'owners',
                      'classification',
                      'format',
                      'planningDate',
                      'introductionDate',
                      'endOfUseDate',
                      'endOfLifeDate',
                      'dataSources',
                      'usedByApplications',
                      'relatedToCapabilities',
                      'partOfArchitectures',
                      'depictedInDiagrams',
                      'createdAt',
                      'updatedAt',
                    ],
                    interfaces: [
                      'id',
                      'name',
                      'description',
                      'interfaceType',
                      'protocol',
                      'version',
                      'status',
                      'planningDate',
                      'introductionDate',
                      'endOfUseDate',
                      'endOfLifeDate',
                      'createdAt',
                      'updatedAt',
                      'owners',
                      'sourceApplications',
                      'targetApplications',
                      'dataObjects',
                      'predecessors',
                      'successors',
                      'partOfArchitectures',
                      'depictedInDiagrams',
                    ],
                    persons: [
                      'id',
                      'firstName',
                      'lastName',
                      'email',
                      'department',
                      'role',
                      'phone',
                      'createdAt',
                      'updatedAt',
                      'ownedCapabilities',
                      'ownedApplications',
                      'ownedDataObjects',
                    ],
                    architectures: [
                      'id',
                      'name',
                      'description',
                      'domain',
                      'type',
                      'timestamp',
                      'tags',
                      'createdAt',
                      'updatedAt',
                      'owners',
                      'containsApplications',
                      'containsCapabilities',
                      'containsDataObjects',
                      'containsInterfaces',
                      'containsInfrastructure',
                      'diagrams',
                      'childArchitectures',
                      'parentArchitecture',
                      'appliedPrinciples',
                    ],
                    // Diagrams are displayed differently depending on format
                    diagrams:
                      exportSettings.format === 'json'
                        ? [
                            'id',
                            'title',
                            'description',
                            'diagramType',
                            'diagramJson',
                            'createdAt',
                            'updatedAt',
                            'creator',
                            'architecture',
                            'containsCapabilities',
                            'containsApplications',
                            'containsDataObjects',
                            'containsInterfaces',
                            'containsInfrastructure',
                          ]
                        : [
                            'id',
                            'title',
                            'description',
                            'diagramType',
                            // 'diagramJson' wird bei Excel/CSV-Export ausgeschlossen
                            'createdAt',
                            'updatedAt',
                            'creator',
                            'architecture',
                            'containsCapabilities',
                            'containsApplications',
                            'containsDataObjects',
                            'containsInterfaces',
                            'containsInfrastructure',
                          ],
                    architecturePrinciples: [
                      'id',
                      'name',
                      'description',
                      'category',
                      'priority',
                      'rationale',
                      'implications',
                      'tags',
                      'isActive',
                      'createdAt',
                      'updatedAt',
                      'owners',
                      'appliedInArchitectures',
                      'implementedByApplications',
                    ],
                    infrastructures: [
                      'id',
                      'name',
                      'description',
                      'infrastructureType',
                      'status',
                      'vendor',
                      'version',
                      'capacity',
                      'location',
                      'ipAddress',
                      'operatingSystem',
                      'specifications',
                      'maintenanceWindow',
                      'costs',
                      'planningDate',
                      'introductionDate',
                      'endOfUseDate',
                      'endOfLifeDate',
                      'owners',
                      'parentInfrastructure',
                      'childInfrastructures',
                      'hostsApplications',
                      'partOfArchitectures',
                      'depictedInDiagrams',
                      'createdAt',
                      'updatedAt',
                    ],
                    aicomponents: [
                      'id',
                      'name',
                      'description',
                      'aiType',
                      'model',
                      'version',
                      'status',
                      'accuracy',
                      'trainingDate',
                      'lastUpdated',
                      'provider',
                      'license',
                      'costs',
                      'tags',
                      'owners',
                      'supportsCapabilities',
                      'usedByApplications',
                      'trainedWithDataObjects',
                      'hostedOn',
                      'partOfArchitectures',
                      'implementsPrinciples',
                      'depictedInDiagrams',
                      'createdAt',
                      'updatedAt',
                    ],
                    all: [] as string[], // Für "Alle Entitäten" zeigen wir eine spezielle Behandlung
                  }

                  const fields = entityFieldsMapping[exportSettings.entityType] || []

                  if (exportSettings.entityType === 'all') {
                    return (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {t('allEntitiesInfo')}
                        </Typography>
                        {exportSettings.format !== 'json' && (
                          <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>{t('diagramExportWarning')}</strong>
                            </Typography>
                          </Alert>
                        )}
                        {Object.entries(entityFieldsMapping)
                          .filter(([key]) => key !== 'all')
                          .map(([entityType, entityFields]) => (
                            <Box key={entityType} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {entityTypeLabels[entityType as keyof typeof entityTypeLabels]}:
                                {entityType === 'diagrams' && exportSettings.format !== 'json' && (
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ ml: 1 }}
                                  >
                                    (ohne diagramJson)
                                  </Typography>
                                )}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                {entityFields.map((field, index) => (
                                  <Typography
                                    key={index}
                                    variant="body2"
                                    component="span"
                                    sx={{
                                      backgroundColor: 'primary.main',
                                      color: 'primary.contrastText',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      fontSize: '0.75rem',
                                    }}
                                  >
                                    {field}
                                  </Typography>
                                ))}
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    )
                  }

                  // Note for individual diagram exports
                  if (
                    exportSettings.entityType === 'diagrams' &&
                    exportSettings.format !== 'json'
                  ) {
                    return (
                      <Box sx={{ width: '100%' }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>{t('singleDiagramExportWarning')}</strong>
                          </Typography>
                        </Alert>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          {fields.map((field, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              component="span"
                              sx={{
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.75rem',
                              }}
                            >
                              {field}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )
                  }

                  return fields.map((field, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      component="span"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      {field}
                    </Typography>
                  ))
                })()}
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                {t('relationInfo')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ExportDialog
