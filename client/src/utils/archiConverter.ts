/**
 * Utility functions to convert Excalidraw JSON format to Archi (Open Exchange XML) format
 *
 * Based on ArchiMate 3.x Open Exchange Format Specification
 * @see https://github.com/archimatetool/archi
 */

export interface ExcalidrawElement {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  angle: number
  strokeColor: string
  backgroundColor: string
  fillStyle: string
  strokeWidth: number
  strokeStyle: string
  roughness: number
  opacity: number
  text?: string
  fontSize?: number
  fontFamily?: number
  textAlign?: string
  verticalAlign?: string
  points?: Array<[number, number]>
  startBinding?: any
  endBinding?: any
  startArrowhead?: string | null
  endArrowhead?: string | null
  [key: string]: any
}

export interface ExcalidrawData {
  type: string
  version: number
  source: string
  elements: ExcalidrawElement[]
  appState: any
  files?: any
}

// ArchiMate element types mapping from simple-eam types to Archi types
const ARCHIMATE_TYPE_MAPPING: Record<string, string> = {
  businessCapability: 'Capability',
  application: 'ApplicationComponent',
  dataObject: 'DataObject',
  interface: 'ApplicationInterface',
  applicationInterface: 'ApplicationInterface',
  infrastructure: 'Node',
  aiComponent: 'ApplicationComponent',
}

// Folder type mapping for Archi organization
const FOLDER_TYPE_MAPPING: Record<string, string> = {
  businessCapability: 'strategy',
  application: 'application',
  dataObject: 'application',
  interface: 'application',
  applicationInterface: 'application',
  infrastructure: 'technology',
  aiComponent: 'application',
}

/**
 * Generates a unique identifier for ArchiMate elements
 */
function generateArchiId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Escapes XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Converts Excalidraw hex color to Archi RGB format
 */
function convertColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Gets the element name from customData or falls back to text
 */
function getElementName(element: ExcalidrawElement): string {
  // First try customData (for database-linked elements)
  if (element.customData?.elementName) {
    return element.customData.elementName
  }
  // Then try originalElement name
  if (element.customData?.originalElement?.name) {
    return element.customData.originalElement.name
  }
  // Fall back to text property
  if (element.text) {
    return element.text
  }
  return 'Unnamed Element'
}

/**
 * Gets the ArchiMate element type from customData or shape type
 */
function getArchiMateType(element: ExcalidrawElement): string {
  // First try customData (for database-linked elements)
  if (element.customData?.elementType) {
    return ARCHIMATE_TYPE_MAPPING[element.customData.elementType] || 'BusinessObject'
  }
  // Fall back to shape-based mapping
  if (element.type === 'ellipse') {
    return 'BusinessActor'
  }
  if (element.type === 'diamond') {
    return 'ApplicationComponent'
  }
  return 'BusinessObject'
}

/**
 * Gets the folder type for an element
 */
function getFolderType(element: ExcalidrawElement): string {
  if (element.customData?.elementType) {
    return FOLDER_TYPE_MAPPING[element.customData.elementType] || 'business'
  }
  return 'business'
}

/**
 * Converts Excalidraw JSON data to Archi (Open Exchange XML) format
 */
export function convertExcalidrawToArchi(
  excalidrawData: ExcalidrawData,
  diagramName: string = 'Diagram'
): string {
  const elements = excalidrawData.elements || []

  // Maps to track elements and relationships
  const elementMap = new Map<string, string>() // excalidraw id -> archi element id
  const relationshipMap = new Map<string, { id: string; sourceId: string; targetId: string }>()

  // Find the minimum x and y coordinates to normalize to positive values
  let minX = Infinity
  let minY = Infinity

  elements.forEach(element => {
    if (element.type === 'line' || element.type === 'arrow') {
      if (element.points && element.points.length >= 2) {
        element.points.forEach(point => {
          const absoluteX = element.x + point[0]
          const absoluteY = element.y + point[1]
          minX = Math.min(minX, absoluteX)
          minY = Math.min(minY, absoluteY)
        })
      }
    } else {
      minX = Math.min(minX, element.x)
      minY = Math.min(minY, element.y)
    }
  })

  // Only offset if we have negative coordinates, and add minimal padding
  const offsetX = minX < 0 ? Math.abs(minX) + 20 : 20
  const offsetY = minY < 0 ? Math.abs(minY) + 20 : 20

  // Generate IDs for elements with customData.elementType (database-linked elements only)
  elements.forEach(element => {
    // Only process elements that have an elementType in customData
    // This filters out generic shapes that aren't linked to the database
    if (element.customData?.elementType) {
      const archiId = generateArchiId('element')
      elementMap.set(element.id, archiId)
    }
  })

  // Process line/arrow elements to create relationships
  elements.forEach(element => {
    if (element.type === 'line' || element.type === 'arrow') {
      const sourceBinding = element.startBinding
      const targetBinding = element.endBinding

      if (sourceBinding && targetBinding) {
        const sourceElementId = elementMap.get(sourceBinding.elementId)
        const targetElementId = elementMap.get(targetBinding.elementId)

        if (sourceElementId && targetElementId) {
          const relationshipId = generateArchiId('relationship')
          relationshipMap.set(element.id, {
            id: relationshipId,
            sourceId: sourceElementId,
            targetId: targetElementId,
          })
        }
      }
    }
  })

  // Build XML
  const timestamp = new Date().toISOString()
  const modelId = generateArchiId('model')
  const viewId = generateArchiId('view')

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<archimate:model xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
  xml += '                xmlns:archimate="http://www.archimatetool.com/archimate"\n'
  xml += `                name="${escapeXml(diagramName)}"\n`
  xml += `                id="${modelId}"\n`
  xml += '                version="4.9.0">\n'
  xml += `  <purpose>${escapeXml('Generated from simple-eam diagram on ' + timestamp)}</purpose>\n`

  // Group elements by folder type
  const elementsByFolder = new Map<string, Array<{ element: ExcalidrawElement; archiId: string }>>()

  elements.forEach(element => {
    if (elementMap.has(element.id)) {
      const folderType = getFolderType(element)
      if (!elementsByFolder.has(folderType)) {
        elementsByFolder.set(folderType, [])
      }
      elementsByFolder.get(folderType)!.push({
        element,
        archiId: elementMap.get(element.id)!,
      })
    }
  })

  // Create folders with their elements
  const folderNames: Record<string, string> = {
    strategy: 'Strategy',
    business: 'Business',
    application: 'Application',
    technology: 'Technology',
  }

  elementsByFolder.forEach((folderElements, folderType) => {
    const folderName = folderNames[folderType] || 'Business'
    const folderId = `folder-${folderType}`

    xml += `  <folder name="${folderName}" id="${folderId}" type="${folderType}">\n`

    folderElements.forEach(({ element, archiId }) => {
      const elementType = getArchiMateType(element)
      const name = escapeXml(getElementName(element))
      const description =
        element.customData?.originalElement?.description || element.customData?.description || ''

      xml += `    <element xsi:type="archimate:${elementType}" name="${name}" id="${archiId}"`
      if (description) {
        xml += `>\n      <documentation>${escapeXml(description)}</documentation>\n    </element>\n`
      } else {
        xml += '/>\n'
      }
    })

    xml += '  </folder>\n'
  })

  // Relationships section (folder for organization)
  if (relationshipMap.size > 0) {
    xml += '  <folder name="Relations" id="folder-relations" type="relations">\n'

    elements.forEach(element => {
      if (relationshipMap.has(element.id)) {
        const rel = relationshipMap.get(element.id)!
        const name = element.text ? escapeXml(element.text) : ''

        xml += `    <element xsi:type="archimate:AssociationRelationship" `
        if (name) {
          xml += `name="${name}" `
        }
        xml += `id="${rel.id}" source="${rel.sourceId}" target="${rel.targetId}"/>\n`
      }
    })

    xml += '  </folder>\n'
  }

  // Views section
  xml += '  <folder name="Views" id="folder-views" type="diagrams">\n'
  xml += `    <element xsi:type="archimate:ArchimateDiagramModel" name="${escapeXml(diagramName)}" id="${viewId}">\n`

  // Track node IDs for connections
  const nodeIdMap = new Map<string, string>()

  // First pass: generate node IDs
  elements.forEach(element => {
    if (elementMap.has(element.id)) {
      const nodeId = generateArchiId('node')
      nodeIdMap.set(element.id, nodeId)
    }
  })

  // Build connection information
  interface ConnectionInfo {
    id: string
    sourceNodeId: string
    targetNodeId: string
    relationshipId: string
  }
  const sourceConnections = new Map<string, ConnectionInfo[]>() // nodeId -> connections originating from this node
  const targetConnectionIds = new Map<string, string[]>() // nodeId -> connection IDs targeting this node

  elements.forEach(element => {
    if (relationshipMap.has(element.id)) {
      const rel = relationshipMap.get(element.id)!
      const sourceBinding = element.startBinding
      const targetBinding = element.endBinding

      if (sourceBinding && targetBinding) {
        const sourceNodeId = nodeIdMap.get(sourceBinding.elementId)
        const targetNodeId = nodeIdMap.get(targetBinding.elementId)

        if (sourceNodeId && targetNodeId) {
          const connectionId = generateArchiId('connection')
          const connectionInfo: ConnectionInfo = {
            id: connectionId,
            sourceNodeId,
            targetNodeId,
            relationshipId: rel.id,
          }

          // Add to source connections
          if (!sourceConnections.has(sourceNodeId)) {
            sourceConnections.set(sourceNodeId, [])
          }
          sourceConnections.get(sourceNodeId)!.push(connectionInfo)

          // Add to target connection IDs
          if (!targetConnectionIds.has(targetNodeId)) {
            targetConnectionIds.set(targetNodeId, [])
          }
          targetConnectionIds.get(targetNodeId)!.push(connectionId)
        }
      }
    }
  })

  // Second pass: render nodes with their connections
  elements.forEach(element => {
    if (elementMap.has(element.id)) {
      const nodeId = nodeIdMap.get(element.id)!
      const elementRef = elementMap.get(element.id)!
      const x = Math.round(element.x + offsetX)
      const y = Math.round(element.y + offsetY)
      const width = Math.round(element.width)
      const height = Math.round(element.height)

      // Build targetConnections attribute if this node is a target
      const targetConns = targetConnectionIds.get(nodeId)
      const targetConnAttr = targetConns ? ` targetConnections="${targetConns.join(' ')}"` : ''

      // Set textPosition: 0=top (for capabilities), 1=center (default)
      const textPosition = element.customData?.elementType === 'businessCapability' ? '0' : '1'

      xml += `      <child xsi:type="archimate:DiagramObject" id="${nodeId}"${targetConnAttr} fillColor="" textPosition="${textPosition}" archimateElement="${elementRef}" type="0">\n`
      xml += `        <bounds x="${x}" y="${y}" width="${width}" height="${height}"/>\n`

      // Add sourceConnection elements if this node is a source
      const srcConns = sourceConnections.get(nodeId)
      if (srcConns) {
        srcConns.forEach(conn => {
          xml += `        <sourceConnection xsi:type="archimate:Connection" id="${conn.id}" source="${conn.sourceNodeId}" target="${conn.targetNodeId}" archimateRelationship="${conn.relationshipId}"/>\n`
        })
      }

      xml += `      </child>\n`
    }
  })

  xml += '    </element>\n'
  xml += '  </folder>\n'
  xml += '</archimate:model>'

  return xml
}

/**
 * Downloads the Archi XML file
 */
export function downloadArchiFile(xmlContent: string, filename: string): void {
  const blob = new Blob([xmlContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.archimate`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
