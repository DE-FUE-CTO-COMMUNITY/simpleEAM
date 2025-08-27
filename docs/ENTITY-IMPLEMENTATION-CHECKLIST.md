# Checkliste: Neue Entity nach Standard-Pattern

## 🚀 Schnellstart

```bash
# 1. Script verwenden für automatische Erstellung
./scripts/create-entity.sh companies "Unternehmen"

# 2. GraphQL Types generieren
cd client && yarn codegen

# 3. Entwicklungsserver starten
yarn dev
```

## ✅ Detaillierte Checkliste

### Phase 1: Vorbereitung

- [ ] **GraphQL Schema analysiert**: Existiert die Entity bereits in `server/src/graphql/schema.graphql`?
- [ ] **Felder identifiziert**: Welche spezifischen Felder hat die Entity?
- [ ] **References geprüft**: Welche Beziehungen zu anderen Entities existieren?

### Phase 2: Automatische Generierung

- [ ] **Script ausgeführt**: `./scripts/create-entity.sh [name] "[Display Name]"`
- [ ] **Ordnerstruktur erstellt**: Alle Verzeichnisse vorhanden?
- [ ] **Dateien kopiert**: Alle Komponenten-Dateien erstellt?

### Phase 3: GraphQL & Types

- [ ] **Schema ergänzt**: Entity in `schema.graphql` definiert?
- [ ] **Codegen ausgeführt**: `yarn codegen` zur Type-Generierung
- [ ] **Generated Types**: Neue Types in `src/gql/generated.ts` verfügbar?
- [ ] **GraphQL Operations**: CRUD-Operationen funktional?

### Phase 4: Entity-spezifische Anpassungen

#### 📄 types.ts

- [ ] **Import angepasst**: `import { EntityName } from '../../gql/generated'`
- [ ] **FilterState definiert**: Entity-spezifische Filter-Felder
- [ ] **FormValues definiert**: Alle Formular-Felder abgedeckt
- [ ] **TypeScript Fehler behoben**: Keine Compile-Errors

#### 🛠️ utils.ts

- [ ] **Label-Funktionen**: Entity-spezifische Enum-Labels implementiert
- [ ] **Filter-Zählung**: `getActiveFilterCount` angepasst
- [ ] **Format-Funktionen**: Datum, Währung, etc. nach Bedarf

#### 🔍 use[Entity]Filter.ts

- [ ] **Filter-Logik**: Alle Filter-Felder implementiert
- [ ] **Performance**: `useMemo` korrekt verwendet
- [ ] **Return-Wert**: Struktur konsistent mit anderen Entities

### Phase 5: Komponenten-Implementierung

#### 📊 [Entity]Table.tsx

- [ ] **Generic Table**: `GenericTable<EntityType>` verwendet
- [ ] **Column Visibility**: `ENTITY_DEFAULT_COLUMN_VISIBILITY` definiert
- [ ] **Spalten-Definition**: Alle relevanten Felder als Spalten
- [ ] **Cell Renderer**: Custom Renderer für spezielle Felder
- [ ] **Sortierung**: Sortierbare Spalten definiert
- [ ] **Translations**: Alle Labels übersetzt

#### 🔧 [Entity]Toolbar.tsx

- [ ] **Generic Toolbar**: `GenericToolbar` verwendet
- [ ] **Search Placeholder**: Übersetzter Platzhalter-Text
- [ ] **Table Key**: Eindeutiger Schlüssel für persistente Spalten
- [ ] **Props weiterleitung**: Alle Props korrekt weitergegeben

#### 🔽 [Entity]FilterDialog.tsx

- [ ] **Generic Filter**: `GenericFilterDialog` verwendet
- [ ] **Filter Fields**: Alle Filter-Felder definiert
- [ ] **Field Types**: Korrekte Input-Typen (text, multiSelect, dateRange)
- [ ] **Options**: Dropdown-Optionen korrekt befüllt
- [ ] **Translations**: Filter-Labels übersetzt

#### 📝 [Entity]Form.tsx

- [ ] **Tanstack Form**: `useForm` Hook verwendet
- [ ] **Validation**: Schema-Validierung implementiert
- [ ] **Form Values**: Alle Felder im FormValues-Interface
- [ ] **Submit Handler**: CRUD-Operationen korrekt verknüpft
- [ ] **Error Handling**: Fehlerbehandlung implementiert
- [ ] **Loading States**: Loading-Indikatoren vorhanden

### Phase 6: Hauptseite Integration

#### 📃 page.tsx

- [ ] **Applications Pattern**: Exakte Struktur übernommen
- [ ] **Hooks korrekt**: `useQuery`, `useMutation`, `useFilter`
- [ ] **State Management**: Filter, Pagination, Sorting
- [ ] **Error Handling**: Loading und Error States
- [ ] **CRUD Operations**: Erstellen, Bearbeiten, Löschen
- [ ] **Permissions**: `isArchitect()` Check für Schreibzugriffe
- [ ] **Responsive Design**: Layout funktioniert auf allen Geräten

### Phase 7: Übersetzungen

#### 🇩🇪 messages/de.json

- [ ] **Vollständige Struktur**: Alle Übersetzungsschlüssel vorhanden
- [ ] **Messages**: Error/Success Messages definiert
- [ ] **Form Labels**: Alle Formular-Felder übersetzt
- [ ] **Table Headers**: Alle Spalten-Überschriften
- [ ] **Actions**: Button-Texte und Aktionen

#### 🇬🇧 messages/en.json

- [ ] **Konsistenz**: Gleiche Struktur wie deutsche Übersetzungen
- [ ] **Qualität**: Professionelle englische Übersetzungen

### Phase 8: Integration & Testing

#### 🔗 Navigation (optional)

- [ ] **Menu Integration**: Eintrag in `RootLayout.tsx` hinzugefügt
- [ ] **Route funktional**: URL `/[lang]/[entity]` erreichbar
- [ ] **Permissions**: Menu-Eintrag nur für berechtigte Benutzer

#### 🧪 Funktionale Tests

- [ ] **Page Load**: Seite lädt ohne JavaScript-Fehler
- [ ] **Data Loading**: Daten werden korrekt geladen und angezeigt
- [ ] **Create**: Neue Entities können erstellt werden
- [ ] **Edit**: Bestehende Entities können bearbeitet werden
- [ ] **Delete**: Entities können gelöscht werden (mit Bestätigung)
- [ ] **Filter**: Alle Filter funktionieren korrekt
- [ ] **Search**: Globale Suche funktioniert
- [ ] **Sorting**: Spalten-Sortierung funktioniert
- [ ] **Pagination**: Bei vielen Daten funktioniert Pagination

#### 🎨 UI/UX Tests

- [ ] **Responsive**: Layout funktioniert auf Desktop, Tablet, Mobile
- [ ] **Loading States**: Angemessene Loading-Indikatoren
- [ ] **Error States**: Benutzerfreundliche Fehlermeldungen
- [ ] **Success Feedback**: Bestätigungen für erfolgreiche Aktionen
- [ ] **Accessibility**: ARIA-Labels und Keyboard-Navigation

### Phase 9: Code Quality

#### 🏗️ TypeScript

- [ ] **No any Types**: Strikte Typisierung überall
- [ ] **Generated Types**: Nur generated.ts Types verwenden
- [ ] **Interface Konsistenz**: Props-Interfaces korrekt definiert
- [ ] **Null Safety**: Korrekte Behandlung von null/undefined

#### 📏 Code Style

- [ ] **Linting**: `yarn lint` ohne Fehler
- [ ] **Formatting**: `yarn format` ausgeführt
- [ ] **Imports**: Saubere Import-Struktur
- [ ] **Naming**: Konsistente Benennungskonventionen

#### ⚡ Performance

- [ ] **useMemo**: Für aufwändige Berechnungen verwendet
- [ ] **useCallback**: Für Event-Handler verwendet
- [ ] **Component Splits**: Komponenten sinnvoll aufgeteilt
- [ ] **Bundle Size**: Keine unnötigen Abhängigkeiten

### Phase 10: Dokumentation

#### 📖 Code Documentation

- [ ] **Component JSDoc**: Alle Komponenten dokumentiert
- [ ] **Props Documentation**: Interface-Properties kommentiert
- [ ] **Complex Logic**: Komplexe Algorithmen erklärt

#### 📝 User Documentation (optional)

- [ ] **Feature Description**: Entity-Zweck dokumentiert
- [ ] **User Guide**: Bedienungsanleitung erstellt
- [ ] **Screenshots**: UI-Screenshots für Dokumentation

## 🚨 Häufige Fehlerquellen

### ❌ Was vermeiden:

- **Generic-Komponenten umgehen**: Immer GenericTable, GenericToolbar, GenericFilterDialog verwenden
- **Hardcoded Strings**: Alle Texte müssen übersetzt werden
- **Inkonsistente Patterns**: Nicht von der Applications-Struktur abweichen
- **Fehlende Error Handling**: Immer Loading und Error States implementieren
- **Performance-Probleme**: useMemo/useCallback vergessen

### ✅ Best Practices:

- **Pattern-Treue**: Exakt das Applications-Pattern befolgen
- **Generic-First**: Erst prüfen ob Generic-Komponente ausreicht
- **Type Safety**: Strikte TypeScript-Verwendung
- **User Experience**: Angemessenes Feedback für alle Aktionen
- **Code Reuse**: Wiederverwendbare Funktionen in utils.ts

## 🎯 Erfolgs-Kriterien

Eine Entity-Implementierung ist erfolgreich, wenn:

1. ✅ **Funktionalität**: Alle CRUD-Operationen funktionieren
2. ✅ **Pattern-Konsistenz**: Identisch zur Applications-Implementation
3. ✅ **Code Quality**: Keine TypeScript-Fehler, sauberer Code
4. ✅ **User Experience**: Intuitive Bedienung, angemessenes Feedback
5. ✅ **Performance**: Responsive UI, keine Performance-Probleme
6. ✅ **Wartbarkeit**: Gut strukturiert, dokumentiert, erweiterbar

---

**💡 Tipp**: Verwenden Sie diese Checkliste als GitHub Issue Template oder Markdown-Checklist für systematische Reviews!
