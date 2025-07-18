'use client'

import React, { useState } from 'react'
import { Button, Box } from '@mui/material'
import GenericForm from '@/components/common/GenericForm'
import { FieldConfig } from '@/components/common/GenericForm'
import { useForm } from '@tanstack/react-form'

/**
 * Beispielkomponente zur Demonstration des displayText-Feldtyps
 */
const DisplayTextExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Beispieldaten
  const exampleData = {
    id: 'A12345',
    name: 'Architektur-Element',
    status: 'Aktiv',
    description: 'Dies ist eine Beschreibung des Elements.\nEs kann auch mehrzeilig sein.',
    createdAt: '2023-12-05T14:30:00',
    updatedAt: '2023-12-15T09:45:00',
  }

  // TanStack Form Instanz erstellen
  const form = useForm({
    defaultValues: exampleData,
    onSubmit: async ({ value }) => {
      setIsOpen(false)
    },
  })

  // Felddefinitionen für das Formular
  const fields: FieldConfig[] = [
    {
      name: 'id',
      label: 'ID',
      type: 'displayText',
      defaultValue: exampleData.id,
      variant: 'subtitle1',
      sx: { fontWeight: 'bold' },
      helperText: 'Dies ist die eindeutige Kennung des Elements',
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      defaultValue: exampleData.name,
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'displayText',
      defaultValue: exampleData.status,
      variant: 'body1',
      sx: { color: exampleData.status === 'Aktiv' ? 'success.main' : 'error.main' },
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'displayText',
      defaultValue: exampleData.description,
      preserveWhitespace: true,
      variant: 'body2',
    },
    {
      name: 'createdAt',
      label: 'Erstellt am',
      type: 'displayText',
      defaultValue: new Date(exampleData.createdAt).toLocaleString('de-DE'),
      variant: 'caption',
    },
    {
      name: 'updatedAt',
      label: 'Aktualisiert am',
      type: 'displayText',
      defaultValue: new Date(exampleData.updatedAt).toLocaleString('de-DE'),
      variant: 'caption',
    },
  ]

  // Formular öffnen
  const handleOpen = () => {
    setIsOpen(true)
  }

  // Formular schließen
  const handleClose = () => {
    setIsOpen(false)
  }

  // Formular absenden (wird durch die Form API behandelt)
  const handleSubmit = async (_data: any) => {
    // Die eigentliche Submission wird durch die Form API in useForm() behandelt
    // Diese Funktion ist für Kompatibilität mit GenericForm vorhanden
  }

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" onClick={handleOpen}>
        Beispiel anzeigen
      </Button>

      <GenericForm
        title="Beispiel für displayText"
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        mode="edit"
        fields={fields}
        form={form}
      />
    </Box>
  )
}

export default DisplayTextExample
