'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Badge,
  Toolbar,
  Popover,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ClearAll as ClearAllIcon,
  Clear as ClearIcon,
  ViewColumn as ViewColumnIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material'
import { Table, VisibilityState } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { clearTableSettings } from '@/utils/columnVisibilityUtils'

export interface GenericToolbarProps {
  /**
   * Der aktuelle Suchbegriff für die globale Suche
   */
  globalFilter: string

  /**
   * Callback-Funktion, die aufgerufen wird, wenn sich der globale Suchbegriff ändert
   */
  onGlobalFilterChange: (value: string) => void

  /**
   * Die Anzahl der aktiven Filter
   */
  activeFiltersCount: number

  /**
   * Callback-Funktion, die aufgerufen wird, wenn auf die Filter-Schaltfläche geklickt wird
   */
  onFilterClick: () => void

  /**
   * Callback-Funktion, die aufgerufen wird, wenn die Filter zurückgesetzt werden sollen
   */
  onResetFilters: () => void

  /**
   * Platzhaltertext für das Suchfeld
   * @default "Suchen..."
   */
  searchPlaceholder?: string

  /**
   * Tooltiptext für den Filter-Button, wenn keine aktiven Filter vorhanden sind
   * @default "Filter hinzufügen"
   */
  filterTooltip?: string

  /**
   * Tooltiptext für den Filter-Button, wenn aktive Filter vorhanden sind
   * @default "Filter bearbeiten"
   */
  editFilterTooltip?: string

  /**
   * Tooltiptext für den Reset-Button
   * @default "Filter zurücksetzen"
   */
  resetFilterTooltip?: string

  /**
   * Ob ein Löschen-Button im Suchfeld angezeigt werden soll
   * @default true
   */
  showClearSearchButton?: boolean

  /**
   * Die Mindestbreite des Suchfelds
   * @default "300px"
   */
  searchFieldWidth?: string

  /**
   * Die Tabellen-Instanz für Column Visibility
   */
  table?: Table<any>

  /**
   * Ob der Column Visibility Toggle angezeigt werden soll
   * @default false
   */
  enableColumnVisibilityToggle?: boolean

  /**
   * Aktueller Column Visibility State
   */
  columnVisibility?: VisibilityState

  /**
   * Tooltiptext für den Column Visibility Button
   * @default "Spalten ein-/ausblenden"
   */
  columnVisibilityTooltip?: string

  /**
   * Name der Entität für dynamische Übersetzungen
   * @default "Eintrag"
   */
  entityName?: string

  /**
   * Eindeutiger Schlüssel für die Tabelle (für persistente Speicherung)
   */
  tableKey?: string

  /**
   * Callback-Funktion zum Zurücksetzen der Spaltenvisibilität auf die Standardwerte
   */
  onResetColumnVisibility?: () => void
}

/**
 * Eine generische Toolbar-Komponente für Entitäten-Tabellen, die eine Suchfunktion und Filteroptionen bietet.
 */
const GenericToolbar: React.FC<GenericToolbarProps> = ({
  globalFilter,
  onGlobalFilterChange,
  activeFiltersCount,
  onFilterClick,
  onResetFilters,
  searchPlaceholder,
  filterTooltip,
  editFilterTooltip,
  resetFilterTooltip,
  showClearSearchButton = true,
  searchFieldWidth = '300px',
  table,
  enableColumnVisibilityToggle = false,
  // Der columnVisibility Prop wird nicht mehr direkt verwendet, da wir nun
  // direkt die Table-Instanz und deren Methoden verwenden, die den State verwalten
  columnVisibility: _unused, // Umbenannt, um ESLint-Warnung zu vermeiden
  columnVisibilityTooltip,
  entityName = 'Eintrag',
  tableKey,
  onResetColumnVisibility,
}) => {
  const t = useTranslations('common')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  // Lokaler State für die Spaltenvisibilität
  const [localVisibility, setLocalVisibility] = useState<Record<string, boolean>>({})

  // Bei Änderungen der Tabelle den lokalen Zustand aktualisieren
  useEffect(() => {
    if (table) {
      // Lokalen Zustand mit dem aktuellen Tabellenzustand initialisieren
      const columns = table.getAllLeafColumns()
      const visibilityState: Record<string, boolean> = {}

      columns.forEach(column => {
        if (column.id !== 'actions') {
          visibilityState[column.id] = column.getIsVisible()
        }
      })

      setLocalVisibility(visibilityState)
    }
  }, [table])

  // Funktion zum Umschalten der Spaltenvisibilität
  const handleColumnVisibilityChange = (columnId: string) => {
    // Spalte in der Tabelle umschalten
    const column = table?.getColumn(columnId)
    if (column) {
      // Aktuellen Zustand merken
      const currentVisibility = localVisibility[columnId] ?? false

      // Neuen Zustand berechnen (invertieren)
      const newVisibility = !currentVisibility

      // Lokalen Zustand direkt aktualisieren für sofortige UI-Reaktion
      setLocalVisibility(prev => ({
        ...prev,
        [columnId]: newVisibility,
      }))

      // Spalte in der Tabelle umschalten
      column.toggleVisibility()
    }
  }

  // Reset-Funktion - verwendet die bewährte clearTableSettings Funktion aus dem Admin-Bereich
  const handleResetColumnVisibility = () => {
    if (tableKey) {
      // Verwende die bewährte clearTableSettings Funktion aus dem Admin-Bereich
      clearTableSettings(tableKey)

      // Nach dem Löschen der localStorage-Einstellungen eine Seite neu laden,
      // damit die Default-Werte wieder geladen werden
      window.location.reload()
    } else if (onResetColumnVisibility) {
      // Fallback: Wenn nur eine spezifische Reset-Funktion übergeben wurde
      onResetColumnVisibility()
    }
  }

  return (
    <Toolbar
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <TextField
        placeholder={searchPlaceholder || t('searchPlaceholder', { entity: entityName })}
        variant="outlined"
        size="small"
        value={globalFilter || ''}
        onChange={e => onGlobalFilterChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment:
            showClearSearchButton && globalFilter ? (
              <InputAdornment position="end">
                <IconButton onClick={() => onGlobalFilterChange('')} size="small" edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
        }}
        sx={{ minWidth: searchFieldWidth }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip
          title={
            activeFiltersCount > 0 ? editFilterTooltip || t('filter') : filterTooltip || t('filter')
          }
        >
          <IconButton
            onClick={onFilterClick}
            color={activeFiltersCount > 0 ? 'primary' : 'default'}
          >
            {activeFiltersCount > 0 ? (
              <Badge badgeContent={activeFiltersCount} color="primary">
                <FilterIcon />
              </Badge>
            ) : (
              <FilterIcon />
            )}
          </IconButton>
        </Tooltip>
        {activeFiltersCount > 0 && (
          <Tooltip title={resetFilterTooltip || t('resetFilter')}>
            <IconButton onClick={onResetFilters}>
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        )}
        {enableColumnVisibilityToggle && table && (
          <>
            <Tooltip title={columnVisibilityTooltip || t('showColumns')}>
              <IconButton
                onClick={event => {
                  // Beim Öffnen des Popovers den lokalen Zustand aktualisieren
                  if (table) {
                    const columns = table.getAllLeafColumns()
                    const visibilityState: Record<string, boolean> = {}

                    columns.forEach(column => {
                      if (column.id !== 'actions') {
                        visibilityState[column.id] = column.getIsVisible()
                      }
                    })

                    setLocalVisibility(visibilityState)
                  }
                  setAnchorEl(event.currentTarget)
                }}
                color="default"
              >
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => {
                // Wenn das Popover geschlossen wird, aktualisieren wir den lokalen Zustand
                if (table) {
                  const columns = table.getAllLeafColumns()
                  const visibilityState: Record<string, boolean> = {}

                  columns.forEach(column => {
                    if (column.id !== 'actions') {
                      visibilityState[column.id] = column.getIsVisible()
                    }
                  })

                  setLocalVisibility(visibilityState)
                }
                setAnchorEl(null)
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 2, minWidth: 200 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {t('showColumns')}
                  </Typography>
                  {(onResetColumnVisibility || tableKey) && (
                    <Tooltip title={t('resetColumns')}>
                      <IconButton size="small" onClick={handleResetColumnVisibility} sx={{ ml: 1 }}>
                        <RestartAltIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <FormGroup>
                  {/* Spalten-Checkboxen: Aktiviert = Spalte sichtbar, Deaktiviert = Spalte ausgeblendet */}
                  {table.getAllLeafColumns().map(column => {
                    // Skip actions column from visibility toggle
                    if (column.id === 'actions') return null

                    return (
                      <FormControlLabel
                        key={column.id}
                        control={
                          <Checkbox
                            // Verwende den lokalen Zustand für eine konsistente Darstellung
                            checked={localVisibility[column.id] ?? false}
                            disabled={!column.getCanHide()}
                            onChange={() => handleColumnVisibilityChange(column.id)}
                            // Beseitigen von React-Warnings durch Entfernung des key-Props auf der Checkbox
                          />
                        }
                        label={
                          typeof column.columnDef.header === 'string'
                            ? column.columnDef.header
                            : column.id
                        }
                      />
                    )
                  })}
                </FormGroup>
              </Box>
            </Popover>
          </>
        )}
      </Box>
    </Toolbar>
  )
}

export default GenericToolbar
