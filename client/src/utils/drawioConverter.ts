/**
 * Utility functions to convert Excalidraw JSON format to draw.io XML format
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

/**
 * Converts Excalidraw JSON data to draw.io XML format
 */
export function convertExcalidrawToDrawIO(excalidrawData: ExcalidrawData): string {
  const elements = excalidrawData.elements || []

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
  const offsetX = minX < 0 ? Math.abs(minX) + 20 : 0
  const offsetY = minY < 0 ? Math.abs(minY) + 20 : 0

  // Start building the XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml +=
    '<mxfile host="app.diagrams.net" modified="' +
    new Date().toISOString() +
    '" agent="simple-eam" version="24.7.17">\n'
  xml += '  <diagram name="Page-1" id="page-1">\n'
  xml +=
    '    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">\n'
  xml += '      <root>\n'
  xml += '        <mxCell id="0" />\n'
  xml += '        <mxCell id="1" parent="0" />\n'

  // Convert each Excalidraw element to draw.io format
  elements.forEach((element, index) => {
    // Ensure unique cell IDs by using both element ID and index
    const cellId = element.id ? `cell-${element.id}` : `cell-${index}-${element.type}`

    switch (element.type) {
      case 'rectangle':
        xml += createRectangleCell(element, cellId, offsetX, offsetY)
        break
      case 'ellipse':
        xml += createEllipseCell(element, cellId, offsetX, offsetY)
        break
      case 'diamond':
        xml += createDiamondCell(element, cellId, offsetX, offsetY)
        break
      case 'arrow':
      case 'line':
        xml += createLineCell(element, cellId, offsetX, offsetY)
        break
      case 'text':
        xml += createTextCell(element, cellId, offsetX, offsetY)
        break
      case 'freedraw':
        // Skip freedraw elements as they don't have a direct equivalent in draw.io
        break
      default:
        // Default to rectangle for unknown types
        xml += createRectangleCell(element, cellId, offsetX, offsetY)
        break
    }
  })

  xml += '      </root>\n'
  xml += '    </mxGraphModel>\n'
  xml += '  </diagram>\n'
  xml += '</mxfile>'

  return xml
}

/**
 * Creates a rectangle cell in draw.io XML format
 */
function createRectangleCell(
  element: ExcalidrawElement,
  cellId: string,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  const style = buildDrawIOStyle({
    shape: 'rectangle',
    fillColor: convertColor(element.backgroundColor),
    strokeColor: convertColor(element.strokeColor),
    strokeWidth: element.strokeWidth || 1,
    opacity: (element.opacity || 1) * 100,
    fontSize: element.fontSize || 12,
    fontColor: convertColor(element.strokeColor),
  })

  const text = element.text || ''
  const x = Math.round(element.x + offsetX)
  const y = Math.round(element.y + offsetY)
  const width = Math.round(element.width)
  const height = Math.round(element.height)

  return (
    `        <mxCell id="${cellId}" value="${escapeXML(text)}" style="${style}" vertex="1" parent="1">\n` +
    `          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />\n` +
    `        </mxCell>\n`
  )
}

/**
 * Creates an ellipse cell in draw.io XML format
 */
function createEllipseCell(
  element: ExcalidrawElement,
  cellId: string,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  const style = buildDrawIOStyle({
    shape: 'ellipse',
    fillColor: convertColor(element.backgroundColor),
    strokeColor: convertColor(element.strokeColor),
    strokeWidth: element.strokeWidth || 1,
    opacity: (element.opacity || 1) * 100,
    fontSize: element.fontSize || 12,
    fontColor: convertColor(element.strokeColor),
  })

  const text = element.text || ''
  const x = Math.round(element.x + offsetX)
  const y = Math.round(element.y + offsetY)
  const width = Math.round(element.width)
  const height = Math.round(element.height)

  return (
    `        <mxCell id="${cellId}" value="${escapeXML(text)}" style="${style}" vertex="1" parent="1">\n` +
    `          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />\n` +
    `        </mxCell>\n`
  )
}

/**
 * Creates a diamond cell in draw.io XML format
 */
function createDiamondCell(
  element: ExcalidrawElement,
  cellId: string,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  const style = buildDrawIOStyle({
    shape: 'rhombus',
    fillColor: convertColor(element.backgroundColor),
    strokeColor: convertColor(element.strokeColor),
    strokeWidth: element.strokeWidth || 1,
    opacity: (element.opacity || 1) * 100,
    fontSize: element.fontSize || 12,
    fontColor: convertColor(element.strokeColor),
  })

  const text = element.text || ''
  const x = Math.round(element.x + offsetX)
  const y = Math.round(element.y + offsetY)
  const width = Math.round(element.width)
  const height = Math.round(element.height)

  return (
    `        <mxCell id="${cellId}" value="${escapeXML(text)}" style="${style}" vertex="1" parent="1">\n` +
    `          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />\n` +
    `        </mxCell>\n`
  )
}

/**
 * Creates a line/arrow cell in draw.io XML format
 */
function createLineCell(
  element: ExcalidrawElement,
  cellId: string,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  if (!element.points || element.points.length < 2) {
    return '' // Skip invalid line elements
  }

  const startPoint = element.points[0]
  const endPoint = element.points[element.points.length - 1]

  // Calculate absolute coordinates
  const startX = Math.round(element.x + startPoint[0] + offsetX)
  const startY = Math.round(element.y + startPoint[1] + offsetY)
  const endX = Math.round(element.x + endPoint[0] + offsetX)
  const endY = Math.round(element.y + endPoint[1] + offsetY)

  const hasStartArrow = element.startArrowhead && element.startArrowhead !== null
  const hasEndArrow = element.endArrowhead && element.endArrowhead !== null

  let edgeStyle = 'rounded=0;html=1;'

  // Only add arrows if they are explicitly set
  if (hasStartArrow) {
    edgeStyle += 'startArrow=classic;'
  } else {
    edgeStyle += 'startArrow=none;'
  }

  if (hasEndArrow) {
    edgeStyle += 'endArrow=classic;'
  } else {
    edgeStyle += 'endArrow=none;'
  }

  edgeStyle += `strokeColor=${convertColor(element.strokeColor)};`
  edgeStyle += `strokeWidth=${element.strokeWidth || 1};`

  // Handle multi-point lines (bent lines) with waypoints
  let geometryXML = ''
  if (element.points.length > 2) {
    // For bent lines, we need to include waypoints
    geometryXML = `          <mxGeometry width="160" height="160" relative="1" as="geometry">\n`
    geometryXML += `            <mxPoint x="${startX}" y="${startY}" as="sourcePoint" />\n`
    geometryXML += `            <mxPoint x="${endX}" y="${endY}" as="targetPoint" />\n`

    // Add waypoints for intermediate points
    if (element.points.length > 2) {
      geometryXML += `            <Array as="points">\n`
      for (let i = 1; i < element.points.length - 1; i++) {
        const waypointX = Math.round(element.x + element.points[i][0] + offsetX)
        const waypointY = Math.round(element.y + element.points[i][1] + offsetY)
        geometryXML += `              <mxPoint x="${waypointX}" y="${waypointY}" />\n`
      }
      geometryXML += `            </Array>\n`
    }

    geometryXML += `          </mxGeometry>\n`
  } else {
    // Simple straight line
    geometryXML = `          <mxGeometry width="160" height="160" relative="1" as="geometry">\n`
    geometryXML += `            <mxPoint x="${startX}" y="${startY}" as="sourcePoint" />\n`
    geometryXML += `            <mxPoint x="${endX}" y="${endY}" as="targetPoint" />\n`
    geometryXML += `          </mxGeometry>\n`
  }

  const lineXML =
    `        <mxCell id="${cellId}" value="" style="${edgeStyle}" edge="1" parent="1">\n` +
    geometryXML +
    `        </mxCell>\n`

  return lineXML
}

/**
 * Creates a text cell in draw.io XML format
 */
function createTextCell(
  element: ExcalidrawElement,
  cellId: string,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  const style = buildDrawIOStyle({
    shape: 'label',
    fillColor: 'none',
    strokeColor: 'none',
    fontSize: element.fontSize || 12,
    fontColor: convertColor(element.strokeColor),
    align: convertTextAlign(element.textAlign),
    verticalAlign: convertVerticalAlign(element.verticalAlign),
  })

  const text = element.text || ''
  const x = Math.round(element.x + offsetX)
  const y = Math.round(element.y + offsetY)
  const width = Math.round(element.width || 100)
  const height = Math.round(element.height || 20)

  return (
    `        <mxCell id="${cellId}" value="${escapeXML(text)}" style="${style}" vertex="1" parent="1">\n` +
    `          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry" />\n` +
    `        </mxCell>\n`
  )
}

/**
 * Builds a draw.io style string from style properties
 */
function buildDrawIOStyle(styleProps: Record<string, any>): string {
  const stylePairs: string[] = []

  Object.entries(styleProps).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      stylePairs.push(`${key}=${value}`)
    }
  })

  return stylePairs.join(';') + ';'
}

/**
 * Converts Excalidraw color format to draw.io color format
 */
function convertColor(color: string): string {
  if (!color || color === 'transparent') {
    return 'none'
  }

  // If it's already a hex color, return as is
  if (color.startsWith('#')) {
    return color
  }

  // Convert common color names to hex
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#ffffff',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    orange: '#ffa500',
    purple: '#800080',
    gray: '#808080',
    grey: '#808080',
  }

  return colorMap[color.toLowerCase()] || color
}

/**
 * Converts Excalidraw text alignment to draw.io format
 */
function convertTextAlign(align?: string): string {
  switch (align) {
    case 'left':
      return 'left'
    case 'right':
      return 'right'
    case 'center':
      return 'center'
    default:
      return 'center'
  }
}

/**
 * Converts Excalidraw vertical alignment to draw.io format
 */
function convertVerticalAlign(vAlign?: string): string {
  switch (vAlign) {
    case 'top':
      return 'top'
    case 'bottom':
      return 'bottom'
    case 'middle':
      return 'middle'
    default:
      return 'middle'
  }
}

/**
 * Escapes XML special characters
 */
function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Downloads the draw.io XML content as a file
 */
export function downloadDrawIOFile(xmlContent: string, filename: string = 'diagram.drawio'): void {
  const blob = new Blob([xmlContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.drawio') ? filename : `${filename}.drawio`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
