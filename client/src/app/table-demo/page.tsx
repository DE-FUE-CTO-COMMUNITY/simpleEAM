'use client'

import React, { useState } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Alert,
  Chip
} from '@mui/material'
import { SortingState } from '@tanstack/react-table'
import ApplicationTableWithGenericTable from '@/components/applications/ApplicationTable'
import CapabilityTable from '@/components/capabilities/CapabilityTable'
import DataObjectTable from '@/components/dataobjects/DataObjectTable'
import PersonTable from '@/components/persons/PersonTable'

// Mock-Daten für die Demo
const mockApplications = [
  {
    id: '1',
    name: 'CRM System',
    status: 'ACTIVE',
    criticality: 'HIGH',
    timeCategory: 'INVEST',
    sevenRStrategy: 'REFACTOR',
    vendor: 'Salesforce',
    version: '2023.1',
    owners: [{ id: '1', firstName: 'Max', lastName: 'Mustermann' }],
    supportsCapabilities: [{ id: '1', name: 'Customer Management' }],
    usesDataObjects: [{ id: '1', name: 'Customer Data' }],
    costs: 50000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'ERP System',
    status: 'ACTIVE', 
    criticality: 'MEDIUM',
    timeCategory: 'TOLERATE',
    sevenRStrategy: 'REHOST',
    vendor: 'SAP',
    version: 'S/4HANA',
    owners: [{ id: '2', firstName: 'Anna', lastName: 'Schmidt' }],
    supportsCapabilities: [{ id: '2', name: 'Financial Management' }],
    usesDataObjects: [{ id: '2', name: 'Financial Data' }],
    costs: 150000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
] as any[]

const mockCapabilities = [
  {
    id: '1',
    name: 'Customer Management',
    description: 'Verwaltung von Kundendaten',
    maturityLevel: 3,
    businessValue: 8,
    status: 'ACTIVE',
    owners: [{ id: '1', firstName: 'Max', lastName: 'Mustermann' }],
    tags: ['CRM', 'Customer'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
] as any[]

const mockDataObjects = [
  {
    id: '1',
    name: 'Customer Data',
    description: 'Kundenstammdaten',
    classification: 'CONFIDENTIAL',
    owners: [{ id: '1', firstName: 'Max', lastName: 'Mustermann' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
] as any[]

const mockPersons = [
  {
    id: '1',
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    role: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
] as any[]

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function TableDemoPage() {
  const [tabValue, setTabValue] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tabellen Demo - Persistente Spaltensichtbarkeit
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Test die persistente Spaltensichtbarkeit:</strong>
            <br />
            1. Verstecke/zeige Spalten in einer der Tabellen unten
            <br />
            2. Wechsle zwischen den Tabs oder lade die Seite neu
            <br />
            3. Deine Einstellungen werden automatisch gespeichert und wiederhergestellt
            <br />
            4. Gehe zur <Chip size="small" label="Admin-Seite" /> um alle gespeicherten Einstellungen zu verwalten
          </Typography>
        </Alert>

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Applikationen" />
              <Tab label="Capabilities" />
              <Tab label="Datenobjekte" />
              <Tab label="Personen" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <ApplicationTableWithGenericTable
              applications={mockApplications}
              loading={false}
              globalFilter={globalFilter}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <CapabilityTable
              capabilities={mockCapabilities}
              loading={false}
              globalFilter={globalFilter}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DataObjectTable
              dataObjects={mockDataObjects}
              loading={false}
              globalFilter={globalFilter}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <PersonTable
              persons={mockPersons}
              loading={false}
              globalFilter={globalFilter}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  )
}
