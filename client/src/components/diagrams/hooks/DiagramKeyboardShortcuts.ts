import { useEffect } from 'react'
import { isViewer } from '@/lib/auth'

// Hook für Keyboard Shortcuts
export const useKeyboardShortcuts = (
  handleNewDiagram: () => void,
  handleExportJSON: () => void,
  handleExportDrawIO: () => void,
  handleImportJSON: () => void,
  handleExportPNG: () => void,
  handleManualSync: () => void,
  handleCapabilityMapGenerator: () => void,
  currentDiagram: any,
  setSaveDialogOpen: (open: boolean) => void,
  setSaveAsDialogOpen: (open: boolean) => void,
  setOpenDialogOpen: (open: boolean) => void,
  setDeleteDialogOpen: (open: boolean) => void
) => {
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Only handle shortcuts for non-viewer users
      if (isViewer()) return

      // Handle Shift+Delete for diagram deletion
      if (event.key === 'Delete' && event.shiftKey && currentDiagram) {
        event.preventDefault()
        setDeleteDialogOpen(true)
        return
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault()
            handleNewDiagram()
            break
          case 'o':
            event.preventDefault()
            setOpenDialogOpen(true)
            break
          case 's':
            event.preventDefault()
            if (event.shiftKey && currentDiagram) {
              // Ctrl+Shift+S - Save As (only when diagram exists)
              setSaveAsDialogOpen(true)
            } else {
              // Ctrl+S - Save
              setSaveDialogOpen(true)
            }
            break
          case 'd':
            event.preventDefault()
            // Ctrl+D - Export draw.io XML
            handleExportDrawIO()
            break
          case 'e':
            event.preventDefault()
            if (!event.shiftKey) {
              // Ctrl+E - Export JSON
              handleExportJSON()
            }
            break
          case 'i':
            event.preventDefault()
            // Ctrl+I - Import JSON
            handleImportJSON()
            break
          case 'p':
            event.preventDefault()
            // Ctrl+P - Export PNG
            handleExportPNG()
            break
          case 'r':
            event.preventDefault()
            // Ctrl+R - Manual Database Sync
            handleManualSync()
            break
          case 'm':
            event.preventDefault()
            // Ctrl+M - Capability Map Generator
            handleCapabilityMapGenerator()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcuts)
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts)
    }
  }, [
    handleNewDiagram,
    currentDiagram,
    handleExportJSON,
    handleExportDrawIO,
    handleImportJSON,
    handleExportPNG,
    handleManualSync,
    handleCapabilityMapGenerator,
    setSaveDialogOpen,
    setSaveAsDialogOpen,
    setOpenDialogOpen,
    setDeleteDialogOpen,
  ])
}
