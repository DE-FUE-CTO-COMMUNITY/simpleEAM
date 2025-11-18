# Guide: Automatic Relationship Creation on Diagram Save

## How It Works

Automatic relationship creation has been successfully implemented and is now active. When saving a diagram, relationships to all used database elements are automatically created.

## For Developers

### Running Tests

To test the utility functions:

1. Open the browser console in the diagram editor page
2. Execute: `testDiagramRelationshipUtils()`
3. View the output in the console

### Debugging

The SaveDiagramDialog component now logs errors during save with:

```javascript
console.error('Error saving diagram:', error)
```

### Relationship Types

The system automatically creates relationships for:

- **Capabilities** → `diagram.capabilities`
- **Applications** → `diagram.applications`
- **Data Objects** → `diagram.dataObjects`
- **Interfaces** → `diagram.interfaces`

## For Users

### Normal Usage

1. **Create diagram**: Open the diagram editor
2. **Add elements**: Drag database elements from the library
3. **Save**: Click "Save" - Relationships are automatically created
4. **Update**: On changes and re-saving, relationships are automatically updated

### What Happens Automatically

- ✅ New relationships are created for all DB elements in the diagram
- ✅ Old relationships are removed when elements are removed from the diagram
- ✅ Duplicates are prevented
- ✅ Both main and sub-elements are correctly handled

### Recognizable Elements

The system automatically recognizes:

- ArchiMate symbols from the database library
- Capabilities, Applications, Data Objects, Interfaces
- Both main shapes and text labels

### Troubleshooting

If relationships are not created correctly:

1. **Check the console** for error messages
2. **Ensure** that elements come from the database library
3. **Verify** that elements have `customData.isFromDatabase = true`
4. **Test with simple diagrams** first

## Extended GraphQL Queries

The following queries now also return relationships:

```graphql
query GetDiagram($id: ID!) {
  diagrams(where: { id: { eq: $id } }) {
    id
    title
    # ... other fields
    capabilities {
      id
      name
    }
    applications {
      id
      name
    }
    dataObjects {
      id
      name
    }
    interfaces {
      id
      name
    }
  }
}
```

## Benefits of Automatic Relationship Creation

1. **No manual work** - Relationships are automatically managed
2. **Always up-to-date** - Relationships stay in sync with diagram contents
3. **Consistent** - No forgotten or incorrect relationships
4. **Performant** - Efficient batch updates
5. **Robust** - Handles all edge cases and error scenarios

The implementation is complete and operational! 🎉
