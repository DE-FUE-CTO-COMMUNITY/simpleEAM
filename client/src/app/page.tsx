'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
} from '@mui/material'
import {
  Business as BusinessIcon,
  Apps as AppsIcon,
  DataObject as DataObjectIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { useSnackbar } from 'notistack'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useAuth, login } from '@/lib/auth'
import { GET_CAPABILITIES_COUNT } from '@/graphql/capability'
import { GET_APPLICATIONS_COUNT } from '@/graphql/application'
import { GET_DATA_OBJECTS_COUNT } from '@/graphql/dataObject'

const Dashboard = () => {
  const { authenticated } = useAuth()
  const router = useRouter()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  // Weiterleitung zum Login, falls nicht authentifiziert
  useEffect(() => {
    if (authenticated === false) {
      login()
    }
  }, [authenticated])

  // Daten für Dashboard laden
  const {
    data: capabilitiesData,
    loading: capabilitiesLoading,
    error: capabilitiesError,
  } = useQuery(GET_CAPABILITIES_COUNT, { skip: !authenticated })

  const {
    data: applicationsData,
    loading: applicationsLoading,
    error: applicationsError,
  } = useQuery(GET_APPLICATIONS_COUNT, { skip: !authenticated })

  const {
    data: dataObjectsData,
    loading: dataObjectsLoading,
    error: dataObjectsError,
  } = useQuery(GET_DATA_OBJECTS_COUNT, { skip: !authenticated })

  // Fehlerbehandlung
  useEffect(() => {
    if (capabilitiesError) {
      enqueueSnackbar('Fehler beim Laden der Business Capabilities', { variant: 'error' })
      console.error('Capabilities error:', capabilitiesError)
    }
    if (applicationsError) {
      enqueueSnackbar('Fehler beim Laden der Anwendungen', { variant: 'error' })
      console.error('Applications error:', applicationsError)
    }
    if (dataObjectsError) {
      enqueueSnackbar('Fehler beim Laden der Datenobjekte', { variant: 'error' })
      console.error('DataObjects error:', dataObjectsError)
    }
  }, [capabilitiesError, applicationsError, dataObjectsError, enqueueSnackbar])

  // Anzahl der Elemente - angepasst für die neue Datenstruktur
  const capabilitiesCount =
    capabilitiesData?.businessCapabilitiesConnection?.aggregate?.count?.nodes || 0
  const applicationsCount = applicationsData?.applicationsConnection?.aggregate?.count?.nodes || 0
  const dataObjectsCount = dataObjectsData?.dataObjectsConnection?.aggregate?.count?.nodes || 0
  const totalCount = capabilitiesCount + applicationsCount + dataObjectsCount

  // Daten für das Balkendiagramm
  const chartData = [
    { name: 'Business Capabilities', count: capabilitiesCount },
    { name: 'Anwendungen', count: applicationsCount },
    { name: 'Datenobjekte', count: dataObjectsCount },
  ]

  const isLoading = capabilitiesLoading || applicationsLoading || dataObjectsLoading

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'capability':
        return <BusinessIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
      case 'application':
        return <AppsIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />
      case 'dataObject':
        return <DataObjectIcon sx={{ fontSize: 48, color: theme.palette.info.main }} />
      default:
        return <ConstructionIcon sx={{ fontSize: 48, color: theme.palette.grey[500] }} />
    }
  }

  const getChartColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
    ]
    return colors[index % colors.length]
  }

  return (
    <Box sx={{ py: 2, px: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Business Capabilities
                </Typography>
                <Typography variant="h3">{isLoading ? '...' : capabilitiesCount}</Typography>
              </Box>
              {getCardIcon('capability')}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Anwendungen
                </Typography>
                <Typography variant="h3">{isLoading ? '...' : applicationsCount}</Typography>
              </Box>
              {getCardIcon('application')}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Datenobjekte
                </Typography>
                <Typography variant="h3">{isLoading ? '...' : dataObjectsCount}</Typography>
              </Box>
              {getCardIcon('dataObject')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Übersicht der Architekturelemente" />
        <Divider />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="count" name="Anzahl" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Architekturlandschaft" />
        <Divider />
        <CardContent>
          <Typography variant="body1" paragraph>
            Die Enterprise-Architektur-Management-Plattform zeigt Ihnen einen Überblick über die
            vollständige IT-Landschaft.
          </Typography>
          <Typography variant="body1" paragraph>
            Gesamt wurden <strong>{totalCount}</strong> Architekturelemente erfasst.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Verwenden Sie die Navigation auf der linken Seite, um detaillierte Informationen zu
              den einzelnen Architekturkomponenten zu erhalten.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
