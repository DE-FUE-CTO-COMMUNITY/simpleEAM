'use client'

import React, { useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  MenuItem,
  Button,
  Alert,
  Divider,
  Typography,
} from '@mui/material'
import { useApolloClient } from '@apollo/client'

// Vorhandene, leichte CHECK-Queries wiederverwenden
import { CHECK_ARCHITECTURE_EXISTS } from '@/graphql/architecture'
import { CHECK_ARCHITECTURE_PRINCIPLE_EXISTS } from '@/graphql/architecturePrinciple'
import { CHECK_CAPABILITY_EXISTS } from '@/graphql/capability'
import { CHECK_APPLICATION_EXISTS } from '@/graphql/application'
import { CHECK_DATA_OBJECT_EXISTS } from '@/graphql/dataObject'
import { CHECK_APPLICATION_INTERFACE_EXISTS } from '@/graphql/applicationInterface'
import { CHECK_INFRASTRUCTURE_EXISTS } from '@/graphql/infrastructure'
import { CHECK_PERSON_EXISTS } from '@/graphql/person'

type ElementKey =
  | 'architecture'
  | 'principle'
  | 'capability'
  | 'application'
  | 'dataObject'
  | 'interface'
  | 'infrastructure'
  | 'person'

const elementOptions: { key: ElementKey; label: string }[] = [
  { key: 'architecture', label: 'Architecture' },
  { key: 'principle', label: 'Principle' },
  { key: 'capability', label: 'Capability' },
  { key: 'application', label: 'Application' },
  { key: 'dataObject', label: 'Data Object' },
  { key: 'interface', label: 'Interface' },
  { key: 'infrastructure', label: 'Infrastructure' },
  { key: 'person', label: 'Person' },
]

// Mapping: Entität -> Query-Dokument + Ergebnis-Feld (Root)
const queryMap = {
  architecture: { doc: CHECK_ARCHITECTURE_EXISTS, root: 'architectures' },
  principle: { doc: CHECK_ARCHITECTURE_PRINCIPLE_EXISTS, root: 'architecturePrinciples' },
  capability: { doc: CHECK_CAPABILITY_EXISTS, root: 'businessCapabilities' },
  application: { doc: CHECK_APPLICATION_EXISTS, root: 'applications' },
  dataObject: { doc: CHECK_DATA_OBJECT_EXISTS, root: 'dataObjects' },
  interface: { doc: CHECK_APPLICATION_INTERFACE_EXISTS, root: 'applicationInterfaces' },
  infrastructure: { doc: CHECK_INFRASTRUCTURE_EXISTS, root: 'infrastructures' },
  person: { doc: CHECK_PERSON_EXISTS, root: 'people' },
} as const

export default function TenantTestPage() {
  const [element, setElement] = useState<ElementKey>('application')
  const [id, setId] = useState('')

  const current = useMemo(() => queryMap[element], [element])
  const client = useApolloClient()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [called, setCalled] = useState(false)

  const onQuery = async () => {
    if (!id) return
    try {
      setLoading(true)
      setCalled(true)
      setError(null)
      const res = await client.query({
        query: current.doc as any,
        variables: { id },
        fetchPolicy: 'no-cache',
      })
      setData(res.data)
    } catch (e: any) {
      setError(e)
    }
    setLoading(false)
  }

  // Ergebnis interpretieren
  const resultRoot = current.root
  const resultArray = (data && (data as any)[resultRoot]) || []
  const found = Array.isArray(resultArray) && resultArray.length > 0

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader title="Mandantenfähigkeit — Testmenü" subheader="Nicht-Admin: Zugriff per ID prüfen" />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              select
              label="Element-Typ"
              value={element}
              onChange={e => setElement(e.target.value as ElementKey)}
              size="small"
              sx={{ minWidth: 240 }}
            >
              {elementOptions.map(opt => (
                <MenuItem key={opt.key} value={opt.key}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="ID"
              placeholder="UUID einfügen"
              value={id}
              onChange={e => setId(e.target.value)}
              size="small"
              sx={{ minWidth: 320 }}
            />

            <Button variant="contained" onClick={onQuery} disabled={!id || loading}>
              {loading ? 'Wird abgefragt…' : 'Query ausführen'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {!called && <Typography variant="body2">Noch keine Abfrage durchgeführt.</Typography>}

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Anfrage-Fehler: {error.message}
            </Alert>
          )}

          {called && !loading && !error && (
            <>
              {found ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Sichtbar: Datensatz gefunden (mindestens ID ist lesbar)
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Keine Daten gefunden. Entweder existiert die ID nicht oder der Zugriff ist durch
                  Mandanten-Regeln gefiltert.
                </Alert>
              )}

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rohdaten (gekürzt):
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: theme => theme.palette.action.hover,
                  maxHeight: 300,
                  overflow: 'auto',
                  fontSize: 12,
                }}
              >
                {JSON.stringify(data, null, 2)}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
