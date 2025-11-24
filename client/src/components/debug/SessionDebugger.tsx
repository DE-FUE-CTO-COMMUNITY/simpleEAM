'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  BugReport as BugReportIcon,
  Security as SecurityIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material'
import { keycloak } from '@/lib/auth'
import { getTokenInfo } from '@/utils/sessionUtils'
import { useTranslations } from 'next-intl'
import { useRuntimeConfig } from '@/lib/runtime-config'

interface SessionDebuggerProps {
  isOpen: boolean
  onClose: () => void
}

const SessionDebugger: React.FC<SessionDebuggerProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('debug.session')
  const runtimeConfig = useRuntimeConfig()
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (isOpen) {
      refreshTokenInfo()
    }
  }, [isOpen, refreshKey])

  const refreshTokenInfo = () => {
    setTokenInfo(getTokenInfo())
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 0) return 'Abgelaufen'

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const renderKeycloakStatus = () => {
    if (!keycloak) {
      return <Alert severity="error">{t('keycloakNotInitialized')}</Alert>
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={keycloak.authenticated ? t('authenticated') : t('notAuthenticated')}
            color={keycloak.authenticated ? 'success' : 'error'}
          />
          <Chip label={`Flow: ${keycloak.flow || 'Unbekannt'}`} variant="outlined" />
          <Chip
            label={`Response Mode: ${keycloak.responseMode || 'Unbekannt'}`}
            variant="outlined"
          />
        </Box>

        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Eigenschaft</strong>
                </TableCell>
                <TableCell>
                  <strong>Wert</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Server URL</TableCell>
                <TableCell>{keycloak.authServerUrl || 'Not set'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Realm</TableCell>
                <TableCell>{keycloak.realm || 'Not set'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Client ID</TableCell>
                <TableCell>{keycloak.clientId || 'Not set'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subject (User ID)</TableCell>
                <TableCell>{keycloak.subject || 'Not available'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Login erforderlich bei Load</TableCell>
                <TableCell>{keycloak.loginRequired ? 'Ja' : 'Nein'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  const renderTokenInfo = () => {
    if (!tokenInfo) {
      return <Alert severity="warning">No token information available</Alert>
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={tokenInfo.isValid ? 'Token valid' : 'Token expired'}
            color={tokenInfo.isValid ? 'success' : 'error'}
            icon={<SecurityIcon />}
          />
          <Chip
            label={`Expires in: ${formatDuration(tokenInfo.timeToExpiry)}`}
            color={
              tokenInfo.timeToExpiry > 300
                ? 'success'
                : tokenInfo.timeToExpiry > 60
                  ? 'warning'
                  : 'error'
            }
            icon={<AccessTimeIcon />}
          />
        </Box>

        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Token-Eigenschaft</strong>
                </TableCell>
                <TableCell>
                  <strong>Wert</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Benutzer</TableCell>
                <TableCell>{tokenInfo.user || 'Unbekannt'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ablaufzeit</TableCell>
                <TableCell>{formatDate(tokenInfo.expiresAt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Verbleibende Zeit</TableCell>
                <TableCell>{formatDuration(tokenInfo.timeToExpiry)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rollen</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {tokenInfo.roles.map((role: string) => (
                      <Chip key={role} label={role} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )
  }

  const renderEnvironmentInfo = () => {
    return (
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Runtime Configuration</strong>
              </TableCell>
              <TableCell>
                <strong>Wert</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>KEYCLOAK_URL</TableCell>
              <TableCell>{runtimeConfig.keycloak.url || 'Not set'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>KEYCLOAK_REALM</TableCell>
              <TableCell>{runtimeConfig.keycloak.realm || 'Not set'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>KEYCLOAK_CLIENT_ID</TableCell>
              <TableCell>{runtimeConfig.keycloak.clientId || 'Not set'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>GRAPHQL_URL</TableCell>
              <TableCell>{runtimeConfig.graphql.url || 'Not set'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>EXCALIDRAW_WS_SERVER_URL</TableCell>
              <TableCell>{runtimeConfig.excalidraw.wsServerUrl || 'Not set'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>NODE_ENV</TableCell>
              <TableCell>{process.env.NODE_ENV || 'Not set'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  const testTokenRefresh = async () => {
    if (!keycloak) {
      alert('Keycloak not available')
      return
    }

    try {
      const refreshed = await keycloak.updateToken(0) // Force refresh
      if (refreshed) {
        alert('Token erfolgreich aktualisiert')
        handleRefresh()
      } else {
        alert('Token was still valid, no refresh needed')
      }
    } catch (error) {
      alert(`Token-Refresh fehlgeschlagen: ${error}`)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BugReportIcon />
          Session-Debugger
          <Tooltip title="Aktualisieren">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          Dieses Tool hilft bei der Diagnose von Session- und Authentifizierungsproblemen. Verwenden
          Sie es nur in der Entwicklungsumgebung.
        </Alert>

        {/* Keycloak Status */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Keycloak Status</Typography>
          </AccordionSummary>
          <AccordionDetails>{renderKeycloakStatus()}</AccordionDetails>
        </Accordion>

        {/* Token Informationen */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Token Informationen</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderTokenInfo()}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={testTokenRefresh}
                disabled={!keycloak?.authenticated}
              >
                Token-Refresh testen
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Umgebungskonfiguration */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Umgebungskonfiguration</Typography>
          </AccordionSummary>
          <AccordionDetails>{renderEnvironmentInfo()}</AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SessionDebugger
