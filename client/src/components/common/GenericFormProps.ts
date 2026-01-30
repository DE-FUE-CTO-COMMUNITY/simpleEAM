// Standardisiertes Interface für alle Form-Komponenten
// Diese Datei löst das Problem der entity-spezifischen Props in GenericTable

export interface GenericFormProps<T = any, F = any> {
  // Standardisierte Props, die alle Form-Komponenten verwenden sollten
  data?: T | null // Die Entity-Daten (generisch)
  mode: 'create' | 'edit' | 'view' // Form-Modus
  isOpen: boolean // Dialog-Zustand
  onClose: () => void // Dialog schließen
  onSubmit: (data: F) => Promise<void> // Form-Daten übermitteln
  onDelete?: (id: string) => Promise<void> // Entity löschen
  loading?: boolean // Loading-Zustand
  onEditMode?: () => void // In Edit-Modus wechseln

  // Zusätzliche Props können von GenericTable über additionalProps übergeben werden
  [key: string]: any
}

// Helper function for Migration: Erstellt Props-Mapping für bestehende Komponenten
export function createLegacyFormProps<T>(
  entityName: string,
  data: T | null,
  baseProps: Omit<GenericFormProps<T>, 'data'>
): Record<string, any> {
  return {
    ...baseProps,
    // Legacy entity-spezifische Prop
    [entityName]: data,
    // Neue standardisierte Prop
    data: data,
  }
}
