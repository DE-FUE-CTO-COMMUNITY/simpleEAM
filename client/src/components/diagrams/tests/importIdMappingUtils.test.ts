/**
 * Tests für Import ID Mapping Utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createIdMappingsForImport,
  applyIdMappingsToImportedData,
  processImportedDiagramData,
} from '../importIdMappingUtils'

// Mock Apollo Client
const mockApolloClient = {
  query: vi.fn(),
}

describe('Import ID Mapping Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createIdMappingsForImport', () => {
    it('should create mapping when element exists by name but not by ID', async () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'old-id-123',
              elementType: 'capability',
              isMainElement: true,
              originalElement: { name: 'Test Capability' },
            },
          },
          {
            id: 'text-1',
            type: 'text',
            text: 'Test Capability',
            containerId: 'elem-1',
          },
        ],
        appState: {},
      }

      // Mock: Element existiert nicht mit alter ID
      mockApolloClient.query
        .mockResolvedValueOnce({
          data: { businessCapabilities: [] },
        })
        // Mock: Element existiert mit neuem Namen
        .mockResolvedValueOnce({
          data: { businessCapabilities: [{ id: 'new-id-456', name: 'Test Capability' }] },
        })

      const mappings = await createIdMappingsForImport(mockApolloClient, importedData)

      expect(mappings).toHaveLength(1)
      expect(mappings[0]).toEqual({
        oldId: 'old-id-123',
        newId: 'new-id-456',
        elementType: 'capability',
        elementName: 'Test Capability',
      })
    })

    it('should not create mapping when element exists with original ID', async () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'existing-id-123',
              elementType: 'application',
              isMainElement: true,
              originalElement: { name: 'Test App' },
            },
          },
        ],
        appState: {},
      }

      // Mock: Element existiert mit Original-ID
      mockApolloClient.query.mockResolvedValueOnce({
        data: { applications: [{ id: 'existing-id-123', name: 'Test App' }] },
      })

      const mappings = await createIdMappingsForImport(mockApolloClient, importedData)

      expect(mappings).toHaveLength(0)
    })

    it('should skip non-database elements', async () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            // Kein customData.isFromDatabase
          },
        ],
        appState: {},
      }

      const mappings = await createIdMappingsForImport(mockApolloClient, importedData)

      expect(mappings).toHaveLength(0)
      expect(mockApolloClient.query).not.toHaveBeenCalled()
    })
  })

  describe('applyIdMappingsToImportedData', () => {
    it('should apply ID mappings to database elements', () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'old-id-123',
              elementType: 'capability',
            },
          },
          {
            id: 'elem-2',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'unchanged-id',
              elementType: 'application',
            },
          },
        ],
        appState: {},
      }

      const mappings = [
        {
          oldId: 'old-id-123',
          newId: 'new-id-456',
          elementType: 'capability',
          elementName: 'Test Capability',
        },
      ]

      const result = applyIdMappingsToImportedData(importedData, mappings)

      expect(result.elements[0].customData?.databaseId).toBe('new-id-456')
      expect(result.elements[1].customData?.databaseId).toBe('unchanged-id')
    })

    it('should return unchanged data when no mappings provided', () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'some-id',
              elementType: 'capability',
            },
          },
        ],
        appState: {},
      }

      const result = applyIdMappingsToImportedData(importedData, [])

      expect(result).toEqual(importedData)
    })
  })

  describe('processImportedDiagramData', () => {
    it('should process imported data and return summary', async () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'old-id-123',
              elementType: 'capability',
              isMainElement: true,
              originalElement: { name: 'Test Capability' },
            },
          },
        ],
        appState: {},
      }

      // Mock: Element existiert nicht mit alter ID
      mockApolloClient.query
        .mockResolvedValueOnce({
          data: { businessCapabilities: [] },
        })
        // Mock: Element existiert mit neuem Namen
        .mockResolvedValueOnce({
          data: { businessCapabilities: [{ id: 'new-id-456', name: 'Test Capability' }] },
        })

      const result = await processImportedDiagramData(mockApolloClient, importedData)

      expect(result.mappings).toHaveLength(1)
      expect(result.processedData.elements[0].customData?.databaseId).toBe('new-id-456')
      expect(result.summary).toContain('1 Element-IDs wurden automatisch angepasst')
      expect(result.summary).toContain('Test Capability')
    })

    it('should handle case with no mappings needed', async () => {
      const importedData = {
        elements: [
          {
            id: 'elem-1',
            type: 'rectangle',
            customData: {
              isFromDatabase: true,
              databaseId: 'existing-id',
              elementType: 'application',
              isMainElement: true,
            },
          },
        ],
        appState: {},
      }

      // Mock: Element existiert mit Original-ID
      mockApolloClient.query.mockResolvedValueOnce({
        data: { applications: [{ id: 'existing-id', name: 'Test App' }] },
      })

      const result = await processImportedDiagramData(mockApolloClient, importedData)

      expect(result.mappings).toHaveLength(0)
      expect(result.summary).toContain('Alle Element-IDs sind bereits korrekt')
    })
  })
})
