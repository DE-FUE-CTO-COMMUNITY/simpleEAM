import * as XLSX from 'xlsx'

interface ExcelExportData {
  [key: string]: string | number | boolean | Date
}

interface ExcelExportOptions {
  filename: string
  sheetName: string
  format: 'xlsx' | 'csv'
  includeHeaders: boolean
}

/**
 * Formatiert den aktuellen Timestamp für Dateinamen
 */
const formatTimestampForFilename = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

interface MultiTabExportOptions {
  filename: string
  format: 'xlsx'
  includeHeaders: boolean
}

/**
 * Exportiert Daten in eine Excel- oder CSV-Datei
 */
export const exportToExcel = async (
  data: ExcelExportData[],
  options: ExcelExportOptions
): Promise<void> => {
  if (!data || data.length === 0) {
    throw new Error('Keine Daten zum Exportieren vorhanden')
  }

  // Erstelle ein neues Arbeitsblatt
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: options.includeHeaders ? undefined : [],
  })

  // Erstelle ein neues Arbeitsbuch
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, options.sheetName)

  // Bestimme den MIME-Type und die Dateiendung basierend auf dem Format
  const mimeType =
    options.format === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv'

  // Schreibe die Datei
  const wbout = XLSX.write(workbook, {
    bookType: options.format,
    type: 'array',
  })

  // Erstelle Blob und nutze fileSave für sicheren Download
  const blob = new Blob([wbout], { type: mimeType })

  // Verwende fileSave für benutzerinitiierte Downloads (verhindert "unsafe download blocked")
  const fileExtension = options.format === 'xlsx' ? 'xlsx' : 'csv'
  const baseName = options.filename.replace(/\.(xlsx|csv)$/i, '')
  const timestamp = formatTimestampForFilename()
  const filenameWithTimestamp = `${baseName}_${timestamp}.${fileExtension}`

  // @ts-expect-error - browser-fs-access module resolution
  const { fileSave } = await import('browser-fs-access')
  await fileSave(blob, {
    fileName: filenameWithTimestamp,
    description: `${options.format.toUpperCase()} file`,
    extensions: [`.${fileExtension}`],
    mimeTypes: [mimeType],
  })
}

/**
 * Exportiert Multi-Tab-Daten in eine Excel-Datei (Admin-Funktion)
 */
export const exportMultiTabToExcel = async (
  data: { [tabName: string]: ExcelExportData[] },
  options: MultiTabExportOptions
): Promise<void> => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error('Keine Daten zum Exportieren vorhanden')
  }

  // Erstelle ein neues Arbeitsbuch
  const workbook = XLSX.utils.book_new()

  // Füge für jeden Entity-Typ ein Tab hinzu
  Object.entries(data).forEach(([tabName, tabData]) => {
    if (tabData && tabData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(tabData, {
        header: options.includeHeaders ? undefined : [],
      })
      XLSX.utils.book_append_sheet(workbook, worksheet, tabName)
    }
  })

  // Schreibe die Datei
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  // Erstelle Blob und nutze fileSave für sicheren Download
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  // Verwende fileSave für benutzerinitiierte Downloads (verhindert "unsafe download blocked")
  const baseName = options.filename.replace(/\.xlsx$/i, '')
  const timestamp = formatTimestampForFilename()
  const filenameWithTimestamp = `${baseName}_${timestamp}.xlsx`

  // @ts-expect-error - browser-fs-access type resolution issue
  const { fileSave } = await import('browser-fs-access')
  await fileSave(blob, {
    fileName: filenameWithTimestamp,
    description: 'Excel file',
    extensions: ['.xlsx'],
    mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  })
}

/**
 * Liest eine Excel- oder CSV-Datei und gibt die Daten zurück
 */
export const importFromExcel = (file: File): Promise<ExcelExportData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Nehme das erste Arbeitsblatt
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Konvertiere zu JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Erste Zeile als Header verwenden
          defval: '', // Standardwert für leere Zellen
        }) as string[][]

        if (jsonData.length === 0) {
          reject(new Error('Die Datei enthält keine Daten'))
          return
        }

        // Erste Zeile als Header verwenden
        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1)

        // Konvertiere zu Objekten
        const result: ExcelExportData[] = rows.map(row => {
          const obj: ExcelExportData = {}
          headers.forEach((header, index) => {
            obj[header] = row[index] || ''
          })
          return obj
        })

        resolve(result)
      } catch (error) {
        reject(
          new Error(
            `Fehler beim Lesen der Datei: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
          )
        )
      }
    }

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Liest eine Multi-Tab Excel-Datei und gibt die Daten strukturiert zurück (Admin-Funktion)
 */
export const importMultiTabFromExcel = (
  file: File
): Promise<{ [tabName: string]: ExcelExportData[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        if (workbook.SheetNames.length === 0) {
          reject(new Error('Die Datei enthält keine Arbeitsblätter'))
          return
        }

        const result: { [tabName: string]: ExcelExportData[] } = {}

        // Verarbeite alle Arbeitsblätter
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName]

          // Konvertiere zu JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1, // Erste Zeile als Header verwenden
            defval: '', // Standardwert für leere Zellen
          }) as string[][]

          if (jsonData.length > 0) {
            // Erste Zeile als Header verwenden
            const headers = jsonData[0] as string[]
            const rows = jsonData.slice(1)

            // Konvertiere zu Objekten
            const tabData: ExcelExportData[] = rows.map(row => {
              const obj: ExcelExportData = {}
              headers.forEach((header, index) => {
                obj[header] = row[index] || ''
              })
              return obj
            })

            result[sheetName] = tabData
          }
        })

        resolve(result)
      } catch (error) {
        reject(
          new Error(
            `Fehler beim Lesen der Multi-Tab-Datei: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`
          )
        )
      }
    }

    reader.onerror = () => {
      reject(new Error('Fehler beim Lesen der Datei'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Exportiert Daten als JSON-Datei
 */
export const exportToJson = async (data: any, options: { filename: string }): Promise<void> => {
  if (!data) {
    throw new Error('Keine Daten zum Exportieren vorhanden')
  }

  // Umwandlung in JSON-String mit Einrückung für bessere Lesbarkeit
  const jsonString = JSON.stringify(data, null, 2)

  // Erstelle Blob für Download
  const blob = new Blob([jsonString], { type: 'application/json' })

  // Verwende fileSave für benutzerinitiierte Downloads (verhindert "unsafe download blocked")
  const baseName = options.filename.replace(/\.json$/i, '')

  // @ts-expect-error - browser-fs-access type resolution issue
  const { fileSave } = await import('browser-fs-access')
  await fileSave(blob, {
    fileName: `${baseName}.json`,
    description: 'JSON file',
    extensions: ['.json'],
    mimeTypes: ['application/json'],
  })
}

/**
 * Exportiert Multi-Tab-Daten als JSON-Datei (Admin-Funktion)
 */
export const exportMultiTabToJson = async (
  data: { [tabName: string]: any[] },
  options: { filename: string }
): Promise<void> => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error('Keine Daten zum Exportieren vorhanden')
  }

  // Umwandlung in JSON-String mit Einrückung für bessere Lesbarkeit
  const jsonString = JSON.stringify(data, null, 2)

  // Erstelle Blob für Download
  const blob = new Blob([jsonString], { type: 'application/json' })

  // Verwende fileSave für benutzerinitiierte Downloads (verhindert "unsafe download blocked")
  const baseName = options.filename.replace(/\.json$/i, '')

  // @ts-expect-error - browser-fs-access type resolution issue
  const { fileSave } = await import('browser-fs-access')
  await fileSave(blob, {
    fileName: `${baseName}.json`,
    description: 'JSON file',
    extensions: ['.json'],
    mimeTypes: ['application/json'],
  })
}

/**
 * Erstellt Mock-Daten für Business Capabilities
 */

/**
 * Liest eine Multi-Tab JSON-Datei und gibt die Daten strukturiert zurück (Admin-Funktion)
 */

/**
 * Erstellt Mock-Daten für Business Capabilities
 */
export const createBusinessCapabilitiesMockData = (): ExcelExportData[] => {
  return [
    {
      ID: 'BC001',
      Name: 'Kundenmanagement',
      Beschreibung: 'Verwaltung von Kundendaten und -beziehungen',
      Level: 1,
      Status: 'Aktiv',
      Owner: 'Marketing Team',
      'Erstellt am': new Date('2024-01-15').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
    {
      ID: 'BC002',
      Name: 'Vertriebsprozesse',
      Beschreibung: 'Abwicklung von Verkaufsprozessen',
      Level: 1,
      Status: 'Aktiv',
      Owner: 'Sales Team',
      'Erstellt am': new Date('2024-02-10').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-11-15').toLocaleDateString('de-DE'),
    },
    {
      ID: 'BC003',
      Name: 'Produktentwicklung',
      Beschreibung: 'Entwicklung neuer Produkte und Services',
      Level: 1,
      Status: 'In Planung',
      Owner: 'R&D Team',
      'Erstellt am': new Date('2024-03-20').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
    {
      ID: 'BC004',
      Name: 'Qualitätsmanagement',
      Beschreibung: 'Überwachung und Sicherstellung der Produktqualität',
      Level: 2,
      Status: 'Aktiv',
      Owner: 'Quality Team',
      'Erstellt am': new Date('2024-01-30').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-10-20').toLocaleDateString('de-DE'),
    },
    {
      ID: 'BC005',
      Name: 'Finanzmanagement',
      Beschreibung: 'Verwaltung der Unternehmensfinanzen',
      Level: 1,
      Status: 'Aktiv',
      Owner: 'Finance Team',
      'Erstellt am': new Date('2024-02-05').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-11-30').toLocaleDateString('de-DE'),
    },
  ]
}

/**
 * Erstellt Mock-Daten für Applications
 */
export const createApplicationsMockData = (): ExcelExportData[] => {
  return [
    {
      ID: 'APP001',
      Name: 'CRM System',
      Beschreibung: 'Customer Relationship Management System',
      Typ: 'Business Application',
      Status: 'Produktiv',
      Version: '2.1.0',
      Anbieter: 'Salesforce',
      Kritikalität: 'Hoch',
      'Erstellt am': new Date('2023-06-15').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
    {
      ID: 'APP002',
      Name: 'ERP System',
      Beschreibung: 'Enterprise Resource Planning System',
      Typ: 'Business Application',
      Status: 'Produktiv',
      Version: '12.5',
      Anbieter: 'SAP',
      Kritikalität: 'Kritisch',
      'Erstellt am': new Date('2022-03-10').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-11-20').toLocaleDateString('de-DE'),
    },
    {
      ID: 'APP003',
      Name: 'Project Management Tool',
      Beschreibung: 'Tool für Projektmanagement und -verfolgung',
      Typ: 'Productivity Tool',
      Status: 'Entwicklung',
      Version: '1.0.0-beta',
      Anbieter: 'Jira',
      Kritikalität: 'Mittel',
      'Erstellt am': new Date('2024-08-01').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
  ]
}

/**
 * Erstellt Mock-Daten für Data Objects
 */
export const createDataObjectsMockData = (): ExcelExportData[] => {
  return [
    {
      ID: 'DO001',
      Name: 'Kundendaten',
      Beschreibung: 'Stammdaten der Kunden',
      Typ: 'Master Data',
      Format: 'JSON',
      'Größe (MB)': 250,
      Sensitive: true,
      'Retention (Jahre)': 7,
      'Erstellt am': new Date('2023-01-15').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
    {
      ID: 'DO002',
      Name: 'Produktkatalog',
      Beschreibung: 'Informationen zu allen Produkten',
      Typ: 'Reference Data',
      Format: 'XML',
      'Größe (MB)': 150,
      Sensitive: false,
      'Retention (Jahre)': 10,
      'Erstellt am': new Date('2023-05-20').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-11-25').toLocaleDateString('de-DE'),
    },
    {
      ID: 'DO003',
      Name: 'Transaktionslogs',
      Beschreibung: 'Protokolle aller Systemtransaktionen',
      Typ: 'Log Data',
      Format: 'CSV',
      'Größe (MB)': 1200,
      Sensitive: true,
      'Retention (Jahre)': 3,
      'Erstellt am': new Date('2023-01-01').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
  ]
}

/**
 * Erstellt Mock-Daten für Interfaces
 */
export const createInterfacesMockData = (): ExcelExportData[] => {
  return [
    {
      ID: 'IF001',
      Name: 'CRM-ERP Integration',
      Beschreibung: 'Datenaustausch zwischen CRM und ERP System',
      Typ: 'REST API',
      Quelle: 'CRM System',
      Ziel: 'ERP System',
      Protokoll: 'HTTPS',
      Frequenz: 'Real-time',
      Status: 'Aktiv',
      'Erstellt am': new Date('2023-07-10').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-11-30').toLocaleDateString('de-DE'),
    },
    {
      ID: 'IF002',
      Name: 'Payment Gateway',
      Beschreibung: 'Schnittstelle für Zahlungsabwicklung',
      Typ: 'SOAP API',
      Quelle: 'E-Commerce Portal',
      Ziel: 'Payment Provider',
      Protokoll: 'HTTPS',
      Frequenz: 'On-demand',
      Status: 'Aktiv',
      'Erstellt am': new Date('2023-09-15').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-12-01').toLocaleDateString('de-DE'),
    },
    {
      ID: 'IF003',
      Name: 'Data Warehouse ETL',
      Beschreibung: 'Extract, Transform, Load Prozess für Data Warehouse',
      Typ: 'Batch Process',
      Quelle: 'Various Systems',
      Ziel: 'Data Warehouse',
      Protokoll: 'SFTP',
      Frequenz: 'Täglich',
      Status: 'Wartung',
      'Erstellt am': new Date('2023-04-01').toLocaleDateString('de-DE'),
      'Aktualisiert am': new Date('2024-10-15').toLocaleDateString('de-DE'),
    },
  ]
}

/**
 * Holt Mock-Daten basierend auf dem Entity-Typ
 */
export const getMockDataByEntityType = (
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): ExcelExportData[] => {
  switch (entityType) {
    case 'businessCapabilities':
      return createBusinessCapabilitiesMockData()
    case 'applications':
      return createApplicationsMockData()
    case 'dataObjects':
      return createDataObjectsMockData()
    case 'interfaces':
      return createInterfacesMockData()
    default:
      return []
  }
}

/**
 * Erstellt eine Excel-Template-Datei für einen bestimmten Entity-Typ (DEPRECATED - verwende downloadTemplateWithRealFields)
 */
export const downloadTemplate = async (
  entityType: 'businessCapabilities' | 'applications' | 'dataObjects' | 'interfaces'
): Promise<void> => {
  const templateData = getMockDataByEntityType(entityType)

  // Nimm nur die erste Zeile als Template (Header + eine Beispielzeile)
  const template = templateData.length > 0 ? [templateData[0]] : []

  const entityTypeLabels = {
    businessCapabilities: 'Business Capabilities',
    applications: 'Applications',
    dataObjects: 'Data Objects',
    interfaces: 'Interfaces',
    persons: 'Persons',
    architectures: 'Architectures',
    diagrams: 'Diagrams',
    architecturePrinciples: 'Architecture Principles',
  }

  await exportToExcel(template, {
    filename: `${entityTypeLabels[entityType]}_Template`,
    sheetName: 'Template',
    format: 'xlsx',
    includeHeaders: true,
  })
}

/**
 * Erstellt eine Excel-Template-Datei mit echten GraphQL-Feldnamen
 */
export const downloadTemplateWithRealFields = async (
  entityType:
    | 'businessCapabilities'
    | 'applications'
    | 'dataObjects'
    | 'interfaces'
    | 'persons'
    | 'architectures'
    | 'diagrams' // Für JSON-Export verfügbar
    | 'architecturePrinciples'
    | 'infrastructures'
    | 'aicomponents'
    | 'all'
): Promise<void> => {
  // Dynamischen Import für ES-Module-Kompatibilität verwenden
  const moduleImport = await import('./excelDataService')
  const {
    getTemplateByEntityType,
    getBusinessCapabilitiesTemplate,
    getApplicationsTemplate,
    getDataObjectsTemplate,
    getInterfacesTemplate,
    getPersonsTemplate,
    getArchitecturesTemplate,
    getArchitecturePrinciplesTemplate,
    getInfrastructuresTemplate,
    // getDiagramsTemplate, - Ausgeblendet für Excel-Export
  } = moduleImport

  if (entityType === 'all') {
    // Multi-tab template for admin (Diagrams are hidden in Excel)
    const allTemplates = {
      'Business Capabilities': [getBusinessCapabilitiesTemplate()],
      Applications: [getApplicationsTemplate()],
      'Data Objects': [getDataObjectsTemplate()],
      Interfaces: [getInterfacesTemplate()],
      Persons: [getPersonsTemplate()],
      Architectures: [getArchitecturesTemplate()],
      'Architecture Principles': [getArchitecturePrinciplesTemplate()],
      Infrastructures: [getInfrastructuresTemplate()],
      // Diagrams: [getDiagramsTemplate()], - Ausgeblendet für Excel (zu große JSON-Daten)
    }

    await exportMultiTabToExcel(allTemplates, {
      filename: 'SimpleEAM_Complete_Import_Template',
      format: 'xlsx',
      includeHeaders: true,
    })
    return
  }

  // TypeScript knows that entityType here is not "all"
  if (entityType === 'aicomponents') {
    // Temporäre Lösung für AI Components Template
    const aicomponentsTemplate = {
      id: '',
      name: '',
      description: '',
      version: '',
      modelType: '',
      trainingData: '',
      accuracy: '',
      vendor: '',
      license: '',
      apiEndpoint: '',
      isActive: '',
      createdAt: '',
      updatedAt: '',
    }

    await exportToExcel([aicomponentsTemplate], {
      filename: 'AI_Components_Import_Template',
      sheetName: 'Import Template',
      format: 'xlsx',
      includeHeaders: true,
    })
    return
  }

  const template = getTemplateByEntityType(
    entityType as Exclude<typeof entityType, 'all' | 'aicomponents'>
  )

  const entityTypeLabels = {
    businessCapabilities: 'Business Capabilities',
    applications: 'Applications',
    dataObjects: 'Data Objects',
    interfaces: 'Interfaces',
    persons: 'Persons',
    architectures: 'Architectures',
    diagrams: 'Diagrams', // Für JSON-Export verfügbar
    architecturePrinciples: 'Architecture Principles',
    infrastructures: 'Infrastructures',
    aicomponents: 'AI Components',
  }

  await exportToExcel([template], {
    filename: `${entityTypeLabels[entityType as keyof typeof entityTypeLabels]}_Import_Template`,
    sheetName: 'Import Template',
    format: 'xlsx',
    includeHeaders: true,
  })
}
