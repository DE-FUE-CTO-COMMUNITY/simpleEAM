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

import { ExportSettings } from './types'
import { entityTypeLabels } from './constants'

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
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ width: '100%' }}>
        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export-Einstellungen
            </Typography>

            <Grid container spacing={2}>
              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Datentyp</InputLabel>
                  <Select
                    value={exportSettings.entityType}
                    label="Datentyp"
                    onChange={e => onEntityTypeChange(e.target.value)}
                  >
                    {Object.entries(entityTypeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Dateiformat</InputLabel>
                  <Select
                    value={exportSettings.format}
                    label="Dateiformat"
                    onChange={e => onFormatChange(e.target.value)}
                  >
                    <MenuItem value="xlsx" disabled={exportSettings.entityType === 'diagrams'}>
                      Excel (.xlsx)
                    </MenuItem>
                    <MenuItem
                      value="csv"
                      disabled={
                        exportSettings.entityType === 'diagrams' ||
                        exportSettings.entityType === 'all'
                      }
                    >
                      CSV (.csv)
                    </MenuItem>
                    <MenuItem value="json">JSON (.json)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Export-Vorschau
            </Typography>
            <Alert severity="info" icon={<InfoIcon />}>
              <Typography variant="body2">
                Export umfasst <strong>{entityTypeLabels[exportSettings.entityType]}</strong> im{' '}
                <strong>{exportSettings.format.toUpperCase()}</strong>-Format mit GraphQL-Feldnamen
                für direkten Re-Import.
              </Typography>
            </Alert>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>GraphQL-Felder (re-import-fähig):</strong>
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
                      'responsiblePerson',
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
                    diagrams: [
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
                    all: [] as string[], // Für "Alle Entitäten" zeigen wir eine spezielle Behandlung
                  }

                  const fields = entityFieldsMapping[exportSettings.entityType] || []

                  if (exportSettings.entityType === 'all') {
                    return (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          Export umfasst alle Entitätstypen mit ihren jeweiligen Feldern:
                        </Typography>
                        {Object.entries(entityFieldsMapping)
                          .filter(([key]) => key !== 'all')
                          .map(([entityType, entityFields]) => (
                            <Box key={entityType} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {entityTypeLabels[entityType as keyof typeof entityTypeLabels]}:
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
                ℹ️ Relationen werden als komma-getrennte IDs exportiert, um direkten Re-Import zu
                ermöglichen
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ExportDialog
