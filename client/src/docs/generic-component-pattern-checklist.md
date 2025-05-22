# Checkliste für die Implementierung des GenericTable/GenericForm-Patterns

Diese Checkliste hilft dabei, das GenericTable/GenericForm-Pattern konsistent für alle Entitäten im Simple-EAM-Projekt zu implementieren. Folge diesen Schritten, um sicherzustellen, dass jede neue Entity-Implementierung (wie ApplicationInterface, Person, Architecture) dem etablierten Pattern der erfolgreichen Implementierungen (Capabilities, Applications, DataObjects) folgt.

## 1. Dateien und Ordnerstruktur

- [ ] Komponenten in `/components/<entity>/` Verzeichnis erstellen:
  - [ ] `<Entity>Table.tsx` (basiert auf GenericTable)
  - [ ] `<Entity>Form.tsx` (basiert auf GenericForm)
  - [ ] `<Entity>Toolbar.tsx` (basiert auf GenericToolbar)
  - [ ] `<Entity>FilterDialog.tsx` (basiert auf GenericFilterDialog)
  - [ ] `use<Entity>Filter.tsx` (Hook für Filter-Logik)
- [ ] Page-Komponente in `/app/<entities>/page.tsx` erstellen

## 2. GraphQL-Definitionen

- [ ] GraphQL-Operationen in `/graphql/<entity>.ts` definieren:
  - [ ] `GET_<ENTITIES>` - Query zum Laden aller Entitäten
  - [ ] `CREATE_<ENTITY>` - Mutation zum Erstellen einer neuen Entität
  - [ ] `UPDATE_<ENTITY>` - Mutation zum Aktualisieren einer Entität
  - [ ] `DELETE_<ENTITY>` - Mutation zum Löschen einer Entität
- [ ] Typ-Definitionen aus `src/gql/generated.ts` verwenden

## 3. Komponenten-Implementierungen

### 3.1 Table-Komponente

- [ ] `GenericTable` als Basis verwenden
- [ ] Spalten mit `columnHelper` und korrekter Typisierung definieren
- [ ] Alle erforderlichen Props von GenericTable übernehmen
- [ ] `mapToFormValues`-Funktion korrekt implementieren
- [ ] Rendering für komplexe Zelleninhalte implementieren (z.B. Chips, Links)
- [ ] Nur wenn nötig das `additionalProps`-Objekt für zusätzliche Daten verwenden (z.B. für verfügbare Auswahllisten)
- [ ] **WICHTIG**: NICHT `additionalProps={{ entity: null }}` verwenden, da dies das `selectedItem` überschreibt und die Dialog-Funktion bricht

### 3.2 Form-Komponente

- [ ] `GenericForm` als Basis verwenden
- [ ] Schema-Validierung mit Zod definieren
- [ ] FormValues Typen definieren und exportieren
- [ ] Default-Werte mit useMemo umschließen, um unnötige Re-Renders zu vermeiden:
  ```tsx
  const defaultValues = React.useMemo<EntityFormValues>(
    () => ({
      field1: '',
      field2: '',
      // ...weitere Felder
    }),
    []
  )
  ```
- [ ] Korrekte Formularfeld-Konfiguration definieren:
  - [ ] Textfelder, Selektionen, Mehrfachauswahlen etc.
  - [ ] Feldvalidierungsregeln
  - [ ] Feldgröße und Layout
- [ ] `onSubmit`, `onClose`, `onDelete` Handler korrekt implementieren
- [ ] **NICHT** automatisch den Dialog schließen, wenn die Entity null ist

### 3.3 Toolbar-Komponente

- [ ] `GenericToolbar` als Basis verwenden
- [ ] Filter und Suchfunktionalität korrekt integrieren
- [ ] "Neue Entity"-Button mit korrektem Handler

### 3.4 FilterDialog-Komponente

- [ ] `GenericFilterDialog` als Basis verwenden
- [ ] Entity-spezifische Filterfelder definieren
- [ ] Filter-Logik korrekt implementieren

### 3.5 Filter-Hook

- [ ] Filter-Zustand und -Logik in einem eigenen Hook kapseln
- [ ] Filterfunktionen für alle Filtertypen implementieren
- [ ] Funktion zum Zurücksetzen der Filter

## 4. Page-Komponente

- [ ] State für Formulare (new, edit, view), Filter, Globalen Filter definieren
- [ ] GraphQL-Queries und Mutations einbinden
- [ ] Mutation-Handler implementieren:
  - [ ] `handleCreate<Entity>`
  - [ ] `handleUpdate<Entity>`
  - [ ] `handleDelete<Entity>`
- [ ] Event-Handler für UI-Interaktionen implementieren:
  - [ ] `handleView<Entity>` (leere Implementierung für die GenericTable-Dialog-Nutzung, OHNE router.push!)
  - [ ] `handleEdit<Entity>` (leere Implementierung für die GenericTable-Dialog-Nutzung, OHNE router.push!)
- [ ] Komponenten korrekt rendern und verknüpfen

## 5. GraphQL-Mutation-Implementierungen

### 5.1 CREATE-Mutation

- [ ] Format exakt wie bei `CREATE_CAPABILITY` verwenden
- [ ] Array-Format für Input verwenden: `input: [{...}]`
- [ ] Bei Relationen `connect`-Pattern verwenden:

```typescript
connectRelations: relationIds?.length
  ? {
      connect: relationIds.map(id => ({
        where: {
          node: { id: { eq: id } },
        },
      })),
    }
  : undefined,
```

### 5.2 UPDATE-Mutation

- [ ] Format exakt wie bei `UPDATE_CAPABILITY` verwenden
- [ ] Für jedes Feld `{ set: value }` Format verwenden
- [ ] Bei Relationen disconnect/connect-Pattern verwenden:

```typescript
relations: relationIds?.length
  ? {
      disconnect: [{ where: {} }], // Alle bestehenden Verbindungen trennen
      connect: relationIds.map(id => ({
        where: {
          node: { id: { eq: id } },
        },
      })),
    }
  : undefined,
```

### 5.3 DELETE-Mutation

- [ ] Format exakt wie bei `DELETE_CAPABILITY` verwenden
- [ ] Nur die ID als Variable übergeben

## 6. Fehlerbehandlung

- [ ] Fehlerbehandlung für alle GraphQL-Operationen implementieren
- [ ] Snackbar-Benachrichtigungen für Erfolg/Fehler anzeigen
- [ ] Validierungsfehler im Formular anzeigen

## 7. Vergleich mit Referenzimplementierung

- [ ] Fertige Implementierung mit den Person-Komponenten vergleichen (NICHT mit den Capability-Komponenten):
  - [ ] `/app/persons/page.tsx` (Korrekte Implementierung ohne router.push)
  - [ ] `/components/persons/PersonTable.tsx`
  - [ ] `/components/persons/PersonForm.tsx`
  - [ ] `/components/persons/PersonToolbar.tsx`
  - [ ] `/components/persons/PersonFilterDialog.tsx`
  - [ ] `/components/persons/usePersonFilter.tsx`
  - [ ] `/graphql/person.ts`

> **WICHTIGER HINWEIS:** Die Implementierung in `/app/capabilities/page.tsx` enthält einen Fehler bei `handleViewCapability` und `handleEditCapability`, die fälschlicherweise `router.push` verwenden. Dies widerspricht dem GenericTable-Pattern und sollte NICHT kopiert werden. Das richtige Dialog-basierte Pattern wurde in der Person-Implementierung korrekt umgesetzt.

## 8. GenericTable-Integration und Dialog-Verhalten

- [ ] Sicherstellen, dass für jede Entity-Komponente die korrekten Props an die FormComponent übergeben werden:
  - [ ] In `<Entity>Table` KEIN `additionalProps`-Objekt mit der Entity-spezifischen Prop auf null setzen (z.B. NICHT `person: null` übergeben)
  - [ ] In `<Entity>Form` die richtige Entity-Prop erwarten (z.B. `person?: Person | null`)
  - [ ] GenericTable übergibt automatisch das `selectedItem` an die FormComponent
- [ ] View- und Edit-Buttons in der GenericTable nutzen die integrierte Dialog-Funktionalität:
  - [ ] Leere Implementierung für `handleView<Entity>` und `handleEdit<Entity>` in der Page-Komponente verwenden
  - [ ] **WICHTIG:** KEINE `router.push(...)` Aufrufe in diesen Handlern verwenden, da dies das GenericTable Dialog-Verhalten unterbrechen würde
  - [ ] Die GenericTable-Komponente übernimmt selbst das Anzeigen der Formulare im Dialog-Modus

### 8.1 Häufige Fehler vermeiden

- [ ] NICHT das selectedItem in additionalProps überschreiben (beispielsweise NICHT `additionalProps={{ person: null }}` verwenden)
- [ ] NICHT router.push in den handler-Funktionen verwenden
- [ ] KEINE automatische Dialog-Schließung implementieren, wenn die Entity null ist
- [ ] Sicherstellen, dass defaultValues mit useMemo gewrappt sind, um unnötige Re-Renders zu vermeiden

## 9. Anweisungen für GitHub Copilot

Bei der Verwendung von GitHub Copilot für die Implementierung des GenericTable/GenericForm-Patterns können folgende Anweisungen helfen:

```
Implementiere die <Entity>-Komponenten nach dem Pattern der PERSON-Komponenten (NICHT der Capability-Komponenten).
Verwende die gleiche Struktur mit GenericTable, GenericForm, GenericToolbar und GenericFilterDialog.

Erstelle für die <Entity>-Implementierung folgende Dateien und halte dich strikt an dieses Pattern:
1. <Entity>Table.tsx - basierend auf GenericTable
2. <Entity>Form.tsx - basierend auf GenericForm
3. <Entity>Toolbar.tsx - basierend auf GenericToolbar
4. <Entity>FilterDialog.tsx - basierend auf GenericFilterDialog
5. use<Entity>Filter.tsx - für die Filterlogik
6. page.tsx - Als Container, der alles zusammenfügt

Wichtige Punkte beim Implementieren:
1. In der Page-Komponente müssen handleView<Entity> und handleEdit<Entity> leere Funktionen sein und DÜRFEN KEINEN router.push verwenden
2. GenericTable übernimmt selbst das Öffnen der Dialoge mit dem entsprechenden selectedItem

Beim Implementieren der GraphQL-Mutations:
1. CREATE_<ENTITY> muss den Array-Input verwenden: input: [{ fields... }]
2. UPDATE_<ENTITY> muss für jedes Feld { set: values.fieldName } verwenden
3. Bei Relationsfeldern: erst disconnect [{ where: {} }], dann connect mit map über IDs
4. Beim Verwenden der GenericTable KEIN additionalProps mit entity: null setzen, da dies selectedItem überschreibt
```

## 10. Unterschiede zwischen Dialog-basiertem Ansatz und Routing-Ansatz

| Dialog-basierter Ansatz (RICHTIG)                               | Routing-basierter Ansatz (FALSCH)                         |
| --------------------------------------------------------------- | --------------------------------------------------------- |
| Nutzt GenericTable's integrierte Dialog-Funktionalität          | Verwendet Next.js Routing mit router.push                 |
| handleView/Edit sind leere Funktionen oder haben minimale Logik | handleView/Edit rufen router.push('/entities/id') auf     |
| Entity-Details werden im selben Ansicht als Dialog angezeigt    | Entity-Details werden auf einer separaten Seite angezeigt |
| Schnellere Benutzererfahrung ohne Seitenwechsel                 | Vollständiger Seitenwechsel bei jeder Aktion              |
| Entspricht dem Design-Pattern des Projekts                      | Inkonsistent mit dem Projekt-Design-Pattern               |

## 11. Beispiel-Implementierung von View- und Edit-Handlern

### 11.1 Korrekte Implementierung (Dialog-basiert)

```tsx
// Korrekte View/Edit Handler - leere Implementierungen, da GenericTable die Dialog-Logik übernimmt
const handleViewEntity = (id: string) => {
  // Absichtlich leer - GenericTable übernimmt das Öffnen des Dialogs
  console.log('View entity requested:', id)
}

const handleEditEntity = (id: string) => {
  // Absichtlich leer - GenericTable übernimmt das Öffnen des Dialogs
  console.log('Edit entity requested:', id)
}
```

### 11.2 Falsche Implementierung (Routing-basiert)

```tsx
// FALSCHE Implementierung - verwendet Routing, was das GenericTable-Pattern bricht
const handleViewEntity = (id: string) => {
  router.push(`/entities/${id}`) // FALSCH - unterbricht die GenericTable Dialog-Funktion
}

const handleEditEntity = (id: string) => {
  router.push(`/entities/edit/${id}`) // FALSCH - unterbricht die GenericTable Dialog-Funktion
}
```

### 11.3 Korrekte GenericTable-Verwendung

```tsx
// Korrekte Verwendung - Keine Überschreibung von selectedItem in additionalProps
return (
  <GenericTable
    data={entities}
    loading={loading}
    globalFilter={globalFilter}
    sorting={sorting}
    onSortingChange={onSortingChange}
    onRowClick={handleViewEntity}
    onEditClick={handleEditEntity}
    columns={columns}
    onCreate={onCreateEntity}
    onUpdate={onUpdateEntity}
    onDelete={onDeleteEntity}
    emptyMessage="Keine Entitäten gefunden."
    createButtonLabel="Neue Entität erstellen"
    entityName="Entity"
    FormComponent={EntityForm}
    getIdFromData={(item: Entity) => item.id}
    mapDataToFormValues={mapToFormValues}
    additionalProps={{
      // Nur zusätzliche Daten hier - KEIN entity: null!
      availableTags,
      otherData,
    }}
  />
)
```

## 12. Anleitung zur Korrektur der Capability-Implementierung

Die aktuelle Capability-Implementierung enthält einen Fehler, der korrigiert werden sollte, um dem korrekten GenericTable/GenericForm-Pattern zu entsprechen. Hier sind die notwendigen Änderungen:

### 12.1 Korrektur der `handleViewCapability` und `handleEditCapability` Funktionen

Statt:

```tsx
// FALSCH - verwendet Router
const handleViewCapability = (id: string) => {
  router.push(`/capabilities/${id}`)
}

const handleEditCapability = (id: string) => {
  router.push(`/capabilities/edit/${id}`)
}
```

Sollte es heißen:

```tsx
// RICHTIG - lässt die GenericTable die Dialog-Funktionalität übernehmen
const handleViewCapability = (id: string) => {
  // Absichtlich leer - GenericTable übernimmt das Öffnen des Dialogs
  console.log('View capability requested:', id)
}

const handleEditCapability = (id: string) => {
  // Absichtlich leer - GenericTable übernimmt das Öffnen des Dialogs
  console.log('Edit capability requested:', id)
}
```

### 12.2 Weitere potenzielle Korrekturen in der Capability-Implementierung

1. Überprüfen, dass keine automatische Dialog-Schließung in der Form-Komponente implementiert ist, wenn die Capability null ist
2. Sicherstellen, dass defaultValues mit useMemo gewrappt sind
3. Sicherstellen, dass bei der Table-Implementierung keine additionalProps die selectedItem-Prop überschreiben

---

Diese Checkliste hilft dabei, eine konsistente Implementierung des GenericTable/GenericForm-Patterns in der gesamten Anwendung sicherzustellen und vermeidet Probleme, die bei abweichenden Implementierungen auftreten können.
