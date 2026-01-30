/**
 * JSON-spezifische Import/Export-Funktionen
 * Getrennt von Excel-Funktionen für bessere Wartbarkeit
 */

/**
 * Importiert Daten aus einer JSON-Datei
 */
export const importFromJson = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const jsonContent = e.target?.result as string
        const data = JSON.parse(jsonContent)

        // JSON can be either array or object
        if (Array.isArray(data)) {
          resolve(data)
        } else if (typeof data === 'object' && data !== null) {
          // If it is an object, take the first array property
          const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]))
          if (firstArrayKey) {
            resolve(data[firstArrayKey])
          } else {
            resolve([data]) // Single object as array
          }
        } else {
          reject(new Error('JSON enthält keine gültigen Daten'))
        }
      } catch (error) {
        reject(
          new Error(
            `Fehler beim Parsen der JSON-Datei: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
          )
        )
      }
    }
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'))
    reader.readAsText(file)
  })
}

/**
 * Importiert Multi-Tab-Daten aus einer JSON-Datei
 * Erwartet ein Objekt mit Tab-Namen als Keys und Arrays als Werte
 */
export const importMultiTabFromJson = async (file: File): Promise<{ [tabName: string]: any[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const jsonContent = e.target?.result as string
        const data = JSON.parse(jsonContent)

        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          // Validate that all values are arrays
          const result: { [tabName: string]: any[] } = {}

          for (const [tabName, tabData] of Object.entries(data)) {
            if (Array.isArray(tabData)) {
              result[tabName] = tabData
            } else {
              console.warn(`Tab "${tabName}" enthält keine Array-Daten und wird übersprungen`)
            }
          }

          resolve(result)
        } else {
          reject(new Error('JSON muss ein Objekt mit Tab-Namen als Keys enthalten'))
        }
      } catch (error) {
        reject(
          new Error(
            `Fehler beim Parsen der JSON-Datei: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
          )
        )
      }
    }
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Datei'))
    reader.readAsText(file)
  })
}

/**
 * Exportiert Daten als JSON-Datei
 */
export const exportToJson = (
  data: any[] | { [tabName: string]: any[] },
  options: {
    filename: string
    pretty?: boolean
  }
): void => {
  try {
    const jsonData = JSON.stringify(data, null, options.pretty ? 2 : 0)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${options.filename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(
      `Fehler beim JSON-Export: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
    )
  }
}

/**
 * Exportiert Multi-Tab-Daten als JSON-Datei
 */
export const exportMultiTabToJson = (
  data: { [tabName: string]: any[] },
  options: {
    filename: string
    pretty?: boolean
  }
): void => {
  exportToJson(data, options)
}

/**
 * Konvertiert JSON-Daten zu Excel-kompatiblem Format
 * Nützlich für die Konvertierung zwischen Formaten
 */
export const convertJsonToExcelData = (jsonData: any[]): any[] => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return []
  }

  return jsonData.map(item => {
    const converted: any = {}

    for (const [key, value] of Object.entries(item)) {
      if (value === null || value === undefined) {
        converted[key] = ''
      } else if (Array.isArray(value)) {
        // Arrays zu kommagetrennte Strings für Excel-Kompatibilität
        converted[key] = value
          .map(v => (typeof v === 'object' && v !== null && 'id' in v ? v.id : String(v)))
          .join(',')
      } else if (typeof value === 'object' && value !== null) {
        // Objects to ID or string representation
        if ('id' in value) {
          converted[key] = value.id
        } else {
          converted[key] = JSON.stringify(value)
        }
      } else {
        converted[key] = value
      }
    }

    return converted
  })
}

/**
 * Konvertiert Excel-Daten zu JSON-kompatiblem Format
 * Nützlich für die Konvertierung zwischen Formaten
 */
export const convertExcelToJsonData = (excelData: any[]): any[] => {
  if (!Array.isArray(excelData) || excelData.length === 0) {
    return []
  }

  return excelData.map(item => {
    const converted: any = {}

    for (const [key, value] of Object.entries(item)) {
      if (value === '' || value === null || value === undefined) {
        converted[key] = null
      } else if (typeof value === 'string' && value.includes(',')) {
        // Comma-separated strings to arrays (if they contain IDs)
        const parts = value
          .split(',')
          .map(part => part.trim())
          .filter(part => part !== '')
        converted[key] = parts.length > 0 ? parts : null
      } else {
        converted[key] = value
      }
    }

    return converted
  })
}

/**
 * Validiert JSON-Struktur vor dem Import
 */
export const validateJsonStructure = (data: any): { isValid: boolean; error?: string } => {
  try {
    if (typeof data !== 'object' || data === null) {
      return { isValid: false, error: 'JSON muss ein Objekt oder Array sein' }
    }

    if (Array.isArray(data)) {
      // Array format is valid
      return { isValid: true }
    }

    // Object format: Check if it has tab structure
    const hasArrayValues = Object.values(data).some(value => Array.isArray(value))
    if (hasArrayValues) {
      return { isValid: true }
    }

    return { isValid: false, error: 'JSON muss Arrays enthalten oder ein einzelnes Array sein' }
  } catch (error) {
    return {
      isValid: false,
      error: `Ungültige JSON-Struktur: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
    }
  }
}

/**
 * Erstellt ein Template-JSON-File für Download
 */
export const createJsonTemplate = (entityType: string): any[] => {
  const templates: { [key: string]: any } = {
    businessCapabilities: [
      {
        id: 'example-cap-1',
        name: 'Beispiel Business Capability',
        description: 'Beschreibung der Business Capability',
        level: 'L1',
        status: 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    applications: [
      {
        id: 'example-app-1',
        name: 'Beispiel Application',
        description: 'Beschreibung der Application',
        version: '1.0.0',
        status: 'Active',
        type: 'Web Application',
        criticality: 'Medium',
        technology: 'React',
        vendor: 'Internal',
        license: 'MIT',
        introductionDate: new Date().toISOString(),
        endOfLifeDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    dataObjects: [
      {
        id: 'example-data-1',
        name: 'Beispiel Data Object',
        description: 'Beschreibung des Data Objects',
        type: 'Database',
        format: 'JSON',
        classification: 'Internal',
        retentionPeriod: '7 Jahre',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    // Additional templates can be added here
  }

  return (
    templates[entityType] || [
      {
        id: 'example-1',
        name: 'Beispiel-Element',
        description: 'Beispiel-Beschreibung',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  )
}

/**
 * Exportiert ein JSON-Template für einen spezifischen Entity-Type
 */
export const exportJsonTemplate = (entityType: string): void => {
  const templateData = createJsonTemplate(entityType)

  exportToJson(templateData, {
    filename: `${entityType}_template`,
    pretty: true,
  })
}
