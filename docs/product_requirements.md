# Simple-EAM: Product Requirement Document

## Dokumentinformationen

| Dokument | Product Requirement Document für Simple-EAM |
| -------- | ------------------------------------------- |
| Datum    | 12. Mai 2025                                |
| Version  | 1.0                                         |
| Status   | Entwurf                                     |

## 1. Einführung

### 1.1 Zweck

Simple-EAM ist eine Enterprise Architecture Management-Lösung, die Unternehmen dabei unterstützt, ihre IT-Landschaft zu dokumentieren, zu analysieren und zu optimieren. Dieses Dokument beschreibt die funktionalen und nicht-funktionalen Anforderungen an das System.

### 1.2 Projektübersicht

Simple-EAM besteht aus mehreren Komponenten, die als Docker-Container bereitgestellt werden:

- Neo4j-Datenbank zur Speicherung des Enterprise Architecture Models als Graph
- GraphQL-Server als API-Schicht
- Keycloak für Authentifizierung und Autorisierung
- Next.js-Frontend für die Benutzeroberfläche

### 1.3 Zielgruppe

- Enterprise Architekten
- IT-Manager und -Planer
- Business-Analysten
- IT-Governance-Verantwortliche

## 2. Funktionale Anforderungen

### 2.1 Business Capabilities Management

#### FR-BC-01: Erfassung von Business Capabilities

**Beschreibung:** Das System muss die Erstellung und Verwaltung von Business Capabilities ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Benutzer können neue Business Capabilities anlegen mit folgenden Attributen:
  - Name
  - Beschreibung
  - Verantwortlicher
  - Reifegrad (Level 1-5)
  - Hierarchische Zuordnung (Parent-Child-Beziehungen)
  - Status (aktiv, in Planung, außer Betrieb)
  - Geschäftswert
  - Tags/Kategorien
- Capabilities können hierarchisch strukturiert werden (L1, L2, L3, etc.)
- Capabilities können bearbeitet, gelöscht oder archiviert werden

#### FR-BC-02: Capability Maps

**Beschreibung:** Das System muss die Erstellung von hierarchischen Capability Maps unterstützen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Benutzer können hierarchische Capability Maps erstellen und visualisieren
- Heat Maps basierend auf Attributen wie Reifegrad oder Geschäftswert

#### FR-BC-03: Capability Zuordnung

**Beschreibung:** Das System muss die Zuordnung von Business Capabilities zu anderen EAM-Elementen unterstützen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Business Capabilities können mit Business-Applikationen verknüpft werden
- Business Capabilities können mit Business-Datenobjekten verknüpft werden
- Beziehungen können mit Attributen wie "unterstützt", "ermöglicht", "realisiert" etc. klassifiziert werden

### 2.2 Business-Applikationen Management

#### FR-APP-01: Erfassung von Business-Applikationen

**Beschreibung:** Das System muss die Erstellung und Verwaltung von Business-Applikationen ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Benutzer können neue Business-Applikationen anlegen mit folgenden Attributen:
  - Name
  - Beschreibung
  - Verantwortlicher
  - Status (aktiv, in Entwicklung, außer Betrieb)
  - Kritikalität
  - Technologie-Stack
  - Version
  - Hosting-Umgebung
  - Lieferant/Hersteller
  - Kosten
  - Einführungsdatum
  - End-of-Life-Datum
- Applikationen können bearbeitet, gelöscht oder archiviert werden

#### FR-APP-02: Applikationslandschaft

**Beschreibung:** Das System muss eine Übersicht der gesamten Applikationslandschaft ermöglichen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Benutzer können Applikationen nach verschiedenen Kriterien filtern und gruppieren
- Konfigurierbare Ansichten (z.B. nach Geschäftsbereich, Status, Technologie)

#### FR-APP-03: Applikationszuordnung

**Beschreibung:** Das System muss die Zuordnung von Applikationen zu anderen EAM-Elementen unterstützen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Applikationen können mit Business Capabilities verknüpft werden
- Applikationen können mit Datenobjekten verknüpft werden
- Applikationen können mit anderen Applikationen verknüpft werden (Schnittstellen)
- Beziehungen können mit Attributen wie "nutzt", "liefert Daten an", "bezieht Daten von" klassifiziert werden

### 2.3 Business-Datenobjekte Management

#### FR-DO-01: Erfassung von Business-Datenobjekten

**Beschreibung:** Das System muss die Erstellung und Verwaltung von Business-Datenobjekten ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Benutzer können neue Business-Datenobjekte anlegen mit folgenden Attributen:
  - Name
  - Beschreibung
  - Eigentümer/Verantwortlicher
  - Datenklassifikation (öffentlich, intern, vertraulich, streng vertraulich)
  - Datenquellen (Applikationen)
  - Format
  - Lebenszyklusinformationen
- Datenobjekte können bearbeitet, gelöscht oder archiviert werden

#### FR-DO-02: Attribut- und Metadaten-Management

**Beschreibung:** Das System muss die Verwaltung von Attributen und Metadaten für Business-Datenobjekte ermöglichen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Benutzer können Attribute für Datenobjekte definieren
- Benutzer können Metadaten für Datenobjekte verwalten

#### FR-DO-03: Datenobjekt-Zuordnung

**Beschreibung:** Das System muss die Zuordnung von Datenobjekten zu anderen EAM-Elementen unterstützen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Datenobjekte können mit Business Capabilities verknüpft werden
- Datenobjekte können mit Applikationen verknüpft werden
- Datenobjekte können mit anderen Datenobjekten verknüpft werden (z.B. Referenzen)
- Datenobjekte können mit Schnittstellen verknüpft werden
- Beziehungen können mit Attributen wie "erstellt", "liest", "aktualisiert", "löscht" klassifiziert werden

### 2.4 Schnittstellen-Management

#### FR-IF-01: Erfassung von Schnittstellen

**Beschreibung:** Das System muss die Erstellung und Verwaltung von Schnittstellen zwischen EAM-Elementen ermöglichen.
**Priorität:** Hoch
**Akzeptanzkriterien:**

- Benutzer können neue Schnittstellen anlegen mit folgenden Attributen:
  - Name
  - Beschreibung
  - Typ (API, Datenbank, Datei, etc.)
  - Quelle ( Applikation, )
  - Ziele (Applikationen )
  - Datenobjekte (Datenobjekte)
  - Protokoll (REST, SOAP, GraphQL, etc.)
  - Version
  - Status (aktiv, in Entwicklung, außer Betrieb)
  - Verantwortlicher
  - Einführungsdatum
  - End-of-Life-Datum
- Schnittstellen können bearbeitet, gelöscht oder archiviert werden

#### FR-IF-02: Schnittstellen-Dokumentation

**Beschreibung:** Das System muss die Dokumentation von Schnittstellen unterstützen.
**Priorität:** Mittel
**Akzeptanzkriterien:**

- Benutzer können technische Details zu Schnittstellen dokumentieren (z.B. Endpunkte, Authentifizierung, Datenformate)
- Unterstützung für OpenAPI/Swagger-Dokumentation
- Möglichkeit, Schnittstellendokumentation zu exportieren

#### FR-IF-03: Schnittstellen-Zuordnung

**Beschreibung:** Das System muss die Zuordnung von Schnittstellen zu anderen EAM-Elementen unterstützen.
**Priorität:** Hoch
**Akzeptanzkriterien:**

- Schnittstellen können mit Applikationen verknüpft werden
- Schnittstellen können mit Datenobjekten verknüpft werden
- Schnittstellen können mit anderen Schnittstellen verknüpft werden (z.B. für API-Ketten)

### 2.4 Datenbank-Integration

#### FR-DB-01: Neo4j-Datenspeicherung

**Beschreibung:** Das System muss alle EAM-Elemente und ihre Beziehungen in der Neo4j-Graphdatenbank speichern.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Alle EAM-Elemente werden als Knoten in der Graphdatenbank gespeichert
- Alle Beziehungen werden als Kanten in der Graphdatenbank gespeichert
- Das Datenmodell unterstützt effiziente Abfragen und Analysen

#### FR-DB-02: GraphQL-API

**Beschreibung:** Das System muss eine GraphQL-API für den Zugriff auf die EAM-Daten bereitstellen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- CRUD-Operationen für alle EAM-Elemente
- Komplexe Abfragen über mehrere EAM-Elementtypen hinweg
- Filterung, Sortierung und Paginierung
- Effiziente Abfrage von Beziehungen und verschachtelten Daten
- Nutzung der Neo4J GraphQL Library

### 2.5 Datenimport und -export

#### FR-IE-01: Excel-Import

**Beschreibung:** Das System muss den Import von EAM-Daten aus Excel-Dateien unterstützen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Import von Business Capabilities aus Excel
- Import von Business-Applikationen aus Excel
- Import von Business-Datenobjekten aus Excel
- Import von Beziehungen zwischen EAM-Elementen aus Excel
- Validierung der importierten Daten und Fehlerbericht
- Unterstützung für Bulk-Import (Massenimport)
- Mapping-Funktion für benutzerdefinierte Excel-Strukturen
- Aktualisierung vorhandener Daten mit Import-Optionen (überschreiben/zusammenführen)

#### FR-IE-02: Excel-Export

**Beschreibung:** Das System muss den Export von EAM-Daten nach Excel unterstützen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Export von Business Capabilities nach Excel
- Export von Business-Applikationen nach Excel
- Export von Business-Datenobjekten nach Excel
- Export von Beziehungen zwischen EAM-Elementen nach Excel
- Konfigurierbare Exportoptionen (Felder, Filter, Sortierung)
- Formatierung der exportierten Excel-Dateien (Stile, bedingte Formatierung)

#### FR-IE-03: Datenimport-Vorlagen

**Beschreibung:** Das System muss Vorlagen für den Datenimport bereitstellen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Vordefinierte Excel-Vorlagen für verschiedene EAM-Elementtypen
- Dokumentation und Beispieldaten in den Vorlagen
- Möglichkeit für Benutzer, eigene Importvorlagen zu speichern

### 2.6 Datenvisualisierung und Listendarstellung

#### FR-VL-01: Listendarstellung von EAM-Elementen

**Beschreibung:** Das System muss die Darstellung von EAM-Elementen in konfigurierbaren Listen ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Tabellarische Darstellung von Business Capabilities
- Tabellarische Darstellung von Business-Applikationen
- Tabellarische Darstellung von Business-Datenobjekten
- Filterung, Sortierung und Paginierung
- Konfigurierbare Spalten und Ansichten
- Gruppierung und Zusammenfassung
- Export der Listendarstellung

#### FR-VL-02: Erweiterte Tabellenfunktionen

**Beschreibung:** Das System muss erweiterte Tabellenfunktionen mit TanStack Table bieten.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Spaltenresize und -neuanordnung
- Zeilenauswahl und Mehrfachauswahl
- Inline-Bearbeitung von Daten
- Hierarchische Datenansicht (z.B. für Capability-Hierarchien)
- Aggregationsfunktionen
- Persistente Benutzereinstellungen für Tabellenansichten

### 2.7 Diagramm-Editor und Visualisierung

#### FR-DE-01: Excalidraw-Integration

**Beschreibung:** Das System muss einen Diagramm-Editor basierend auf Excalidraw bieten.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Benutzer können Diagramme erstellen und bearbeiten
- Unterstützung für verschiedene Diagrammtypen (Architekturdiagramme, Capability Maps, etc.)
- Speichern und Laden von Diagrammen
- Kollaboratives Bearbeiten von Diagrammen

#### FR-DE-02: Verknüpfung mit Datenbank-Elementen

**Beschreibung:** Das System muss die Verknüpfung von Diagrammelementen mit EAM-Elementen in der Datenbank unterstützen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Elemente im Diagramm können mit Business Capabilities verknüpft werden
- Elemente im Diagramm können mit Business-Applikationen verknüpft werden
- Elemente im Diagramm können mit Business-Datenobjekten verknüpft werden
- Metadaten aus der Datenbank werden in den Diagrammelementen angezeigt
- Aktualisierungen in der Datenbank werden in den Diagrammen widergespiegelt
- Visuelle Indikation für verknüpfte Elemente

#### FR-DE-03: Automatische Diagrammgenerierung

**Beschreibung:** Das System muss die automatische Generierung von Diagrammen basierend auf Datenbank-Inhalten unterstützen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Generierung von Capability Maps aus der Datenbank
- Generierung von Applikationslandschaft-Diagrammen
- Generierung von Datenflussdiagrammen
- Konfigurierbare Layout-Algorithmen
- Anpassung und Speicherung der generierten Diagramme

#### FR-DE-06: Hinzufügen von benachbarten Elementen

**Beschreibung:** Der Diagramm Editor muss eine Funktion haben um alle mit einem Architekturelement verbundenen Elemente im Diagramm zu ergänzen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Dialog zur Auswahl der zu ergänzenden Elemente und zur Positionierung (links, rechts, oben, unten), der Anzahl der Hops und Formatierung (Pfeiltyp, Gap, Distance, Spacing).
- Folgende Default Werte der Parameter sollen verwendet werden: Positionierung: rechts, Anzahl der Hops: 1, Pfeiltyp: sharp, Gap: Mittel (8px), Distance: Breite des ausgewählten Elements, Spacing: 20px
- Bei der Auswahl der zu ergänzenden Elemente soll eine Auswahl der verschiedenen Architekturelementtypen (Business Capability, Applikation, Daten Objekt, Schnittstelle ,Infrastruktur) möglich sein. Es soll mit angegeben werden, wieviele Elemente des jeweiligen Typs benachbart sind. Für Schnittstellen soll zwischen eingehenden und ausgehenden Schnittstellen unterschieden werden können.
- Ermitteln der benachbarten Elemente aus der Datenbank (bei mehreren Hops entsprechend iterieren) und Hinzufügen zum Diagramm entsprechend der Positionierung, Distance und Spacing Vorgaben.
- Das ausgewählte Element soll dabei immer mittig zu den benachbarten Elementen liegen.
- Wenn Hops > 1 ist, muss die Positionierung anhand der Elemente des letzten Hops berechnet werden. Die elemente des jeweils vorigen Hops sollem immer in der Mitte der Elemente des aktuellen Hops liegen.
- Verbinden des ausgewählten Architekturelements mit den benachbarten Elementen mit Pfeilen des Angegebenen Pfeiltyps und Gaps. Dabei ist die EXCALIDRAW-ARRWO-FUNCTIONALITY.md Datei zu berücksichtigen.
- Beim Erstellen der Pfeile soll der Startpunkt beim ausgewählten Element auf der Seite liegen, die bei der Positionierung angegeben ist und beim benachbarten Element auf der gegenüberliegenden Seite. Das angegebene Gap soll bei der Ermittlung der Koordinaten berücksichtigt werden.
- Wenn die Beziehung als Revers angegeben ist soll der Startpunkt beim benachbarten Element liegen und der Endpunkt beim ausgewählten Element. Dazu soll die Datei relationshipValidation.ts herangezogen werden.
- Die Pfeile sollen ein Binding zu den jeweiligen Hauptelementen der Elemente haben. Die Bindings sollen entsprechend der EXCALIDRAW-ARRWO-FUNCTIONALITY.md Datei und den arrow-samples.excalidraw erstellt werden.

#### FR-DE-04: Datenbank-integrierte ArchiMate-Bibliothek

**Beschreibung:** Das System muss eine erweiterte ArchiMate-Bibliothek bereitstellen, die existierende Architektur-Elemente aus der Datenbank anzeigt und das Drag-and-Drop dieser Elemente in Diagramme ermöglicht.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Anzeige existierender Architektur-Elemente aus der Datenbank in der Excalidraw-Bibliothek
- Dropdown-Filter für Architektur-Element-Typen (Business Capability, Application, Data Object, Interface)
- Visuelle Darstellung der Datenbank-Elemente im Stil der entsprechenden ArchiMate-Symbole
- Verwendung der ArchiMate-Farbpalette aus der bestehenden archimate-symbols.excalidrawlib
- Drag-and-Drop-Funktionalität zum Hinzufügen von Datenbank-Elementen zu Diagrammen
- Erhaltung der Datenbank-ID beim Ziehen von Elementen ins Diagramm (z.B. in customData-Feld)
- Real-time Synchronisation zwischen Datenbank-Änderungen und Bibliothek-Anzeige
- Suchfunktion für Architektur-Elemente in der Bibliothek
- Hierarchische Darstellung von Business Capabilities (Parent-Child-Beziehungen)
- Tooltip-Anzeige mit Element-Metadaten (Name, Beschreibung, Status, etc.)

#### FR-DE-05: Diagramm-Export

**Beschreibung:** Das System muss den Export von Diagrammen in verschiedene Formate unterstützen.  
**Priorität:** Niedrig  
**Akzeptanzkriterien:**

- Export als PNG, SVG und PDF
- Einstellbare Exportqualität und -größe
- Integration in Berichte und Dashboards

### 2.8 Benutzerauthentifizierung und -verwaltung

#### FR-AU-01: Benutzeranmeldung

**Beschreibung:** Das System muss eine sichere Benutzeranmeldung über Keycloak ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Anmeldung mit Benutzername und Passwort
- Single Sign-On (SSO) Unterstützung
- Multi-Faktor-Authentifizierung
- Passwort-Richtlinien (Komplexität, Gültigkeit, etc.)
- Passwort-Reset-Funktionalität

#### FR-AU-02: Benutzerverwaltung

**Beschreibung:** Das System muss die Verwaltung von Benutzern ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Erstellen, Bearbeiten und Deaktivieren von Benutzerkonten
- Benutzerprofilverwaltung mit Kontaktdaten und Rollen
- Gruppenzuweisung für Benutzer
- Self-Service-Funktionen für Benutzer (Profilaktualisierung, Passwortänderung)

#### FR-AU-03: Rollen- und Berechtigungsverwaltung

**Beschreibung:** Das System muss die Verwaltung von Rollen und Berechtigungen ermöglichen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Vordefinierte Rollen (Admin, Architekt, Viewer, etc.)
- Benutzerdefinierte Rollen mit granularen Berechtigungen
- Berechtigungen auf Funktions- und Datenebene
- Vererbung von Berechtigungen
- Temporäre Berechtigungen und Zugriff

#### FR-AU-04: Integration mit Unternehmensverzeichnissen

**Beschreibung:** Das System muss die Integration mit LDAP/Active Directory unterstützen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Synchronisierung von Benutzern und Gruppen
- Single Sign-On über SAML, OpenID Connect oder LDAP
- Automatische Rollenzuweisung basierend auf AD-Gruppen

## 3. Nicht-funktionale Anforderungen

### 3.1 Leistung und Skalierbarkeit

#### NFR-PS-01: Reaktionszeit

**Beschreibung:** Das System muss angemessene Reaktionszeiten bieten.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Seitenladungen unter 2 Sekunden
- API-Antworten unter 1 Sekunde für typische Anfragen
- Visualisierungen laden unter 3 Sekunden für bis zu 500 Elemente

#### NFR-PS-02: Skalierbarkeit

**Beschreibung:** Das System muss mit wachsenden Datenmengen skalieren.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Unterstützung für mindestens 10.000 EAM-Elemente
- Unterstützung für mindestens 50.000 Beziehungen
- Unterstützung für mindestens 50 gleichzeitige Benutzer

### 3.2 Sicherheit

#### NFR-SE-01: Datenschutz

**Beschreibung:** Das System muss die Vertraulichkeit und Integrität der EAM-Daten gewährleisten.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Verschlüsselung sensibler Daten
- Zugriffskontrolle auf Datenebene
- Audit-Trail für Änderungen an EAM-Daten

#### NFR-SE-02: Compliance

**Beschreibung:** Das System muss relevante Compliance-Anforderungen erfüllen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- DSGVO-konformes Datenmanagement
- Exportkontrolle für sensitive Architekturinformationen
- Einhaltung der IT-Sicherheitsrichtlinien des Unternehmens

### 3.3 Benutzererlebnis

#### NFR-UX-01: Benutzerfreundlichkeit

**Beschreibung:** Das System muss benutzerfreundlich und intuitiv bedienbar sein.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Konsistente und intuitive Benutzeroberfläche
- Responsive Design für verschiedene Bildschirmgrößen
- Barrierefreiheit nach WCAG 2.1 AA-Standard

#### NFR-UX-02: Internationalisierung

**Beschreibung:** Das System muss mehrere Sprachen unterstützen.  
**Priorität:** Niedrig  
**Akzeptanzkriterien:**

- Unterstützung für mindestens Deutsch und Englisch
- Erweiterbarkeit für weitere Sprachen
- Lokalisierung von Datum, Uhrzeit und Zahlenformaten

### 3.4 Wartbarkeit und Betrieb

#### NFR-MO-01: Containerisierung

**Beschreibung:** Das System muss vollständig in Docker-Containern laufen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Docker-Container für alle Komponenten
- Docker Compose für einfache Bereitstellung
- Konfigurierbarkeit über Umgebungsvariablen

#### NFR-MO-02: Backup und Wiederherstellung

**Beschreibung:** Das System muss regelmäßige Backups und Wiederherstellung unterstützen.  
**Priorität:** Mittel  
**Akzeptanzkriterien:**

- Automatisierte Backups der Neo4j-Datenbank
- Wiederherstellungsprozess für Datenbanken
- Export und Import der gesamten EAM-Konfiguration

## 4. Technische Anforderungen

### 4.1 Frontend

#### TR-FE-01: Next.js 15

**Beschreibung:** Das Frontend muss mit Next.js 15 entwickelt werden.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Verwendung des App-Routers
- Server Components für bessere Performance
- Optimierte Bilder und Assets

#### TR-FE-02: Material UI 7

**Beschreibung:** Das Frontend muss Material UI 7 für die Benutzeroberfläche verwenden.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Konsistentes Design mit Material UI-Komponenten
- Anpassbares Theme für Corporate Design
- Responsive Layout-Komponenten

#### TR-FE-03: TanStack Bibliotheken

**Beschreibung:** Das Frontend muss TanStack Table und TanStack Form integrieren.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- TanStack Table für erweiterte Tabellenfunktionalität
- TanStack Form für Formularverwaltung
- Integration mit React Server Components

### 4.2 Backend

#### TR-BE-01: GraphQL API

**Beschreibung:** Das Backend muss eine GraphQL-API bereitstellen.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Schema-First-Entwicklung
- Resolver-Implementierung für alle EAM-Elemente
- Abfrage-Optimierung für komplexe Beziehungen

#### TR-BE-02: Neo4j Integration

**Beschreibung:** Das Backend muss mit Neo4j integriert sein.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Verwendung des Neo4j-Treibers
- Optimierte Cypher-Abfragen
- Transaktionsmanagement

#### TR-BE-03: Keycloak Integration

**Beschreibung:** Das Backend muss mit Keycloak für Authentifizierung und Autorisierung integriert sein.  
**Priorität:** Hoch  
**Akzeptanzkriterien:**

- Token-basierte Authentifizierung
- Rollenbasierte Zugriffssteuerung
- Sicherung von GraphQL-Endpunkten

## 5. Lieferumfang und Zeitplan

### 5.1 Projektphasen

1. **Phase 1: Grundlegende EAM-Funktionalität (4 Wochen)**

   - Datenmodell für Business Capabilities, Applikationen und Datenobjekte
   - GraphQL-API für grundlegende CRUD-Operationen
   - Einfache Listendarstellung im Frontend
   - Basis-Benutzerauthentifizierung
   - Grundlegende Excalidraw-Integration

2. **Phase 2: Datenimport/-export und Visualisierung (3 Wochen)**

   - Excel-Import und -Export
   - Erweiterte Tabellenfunktionen

3. **Phase 3: Erweiterte Funktionalität (3 Wochen)**

   - Verknüpfung von Diagrammelementen mit Datenbank
   - Automatische Diagrammgenerierung
   - Erweiterte Benutzerverwaltung
   - Erweiterte Berechtigungen

4. **Phase 4: Verfeinerung und Abschluss (2 Wochen)**
   - Leistungsoptimierung
   - UI/UX-Verbesserungen
   - Dokumentation und Benutzerhandbücher
   - Abnahmetests

### 5.2 Meilensteine

1. **M1: Projektstart** - 12. Mai 2025
2. **M2: Abschluss Phase 1** - 9. Juni 2025
3. **M3: Abschluss Phase 2** - 30. Juni 2025
4. **M4: Abschluss Phase 3** - 21. Juli 2025
5. **M5: Projektabschluss** - 4. August 2025

## 6. Annahmen und Einschränkungen

### 6.1 Annahmen

- Ausreichende Entwicklungsressourcen sind verfügbar
- Benutzer haben grundlegende Kenntnisse in Enterprise Architecture Management
- Neo4j und Keycloak sind für die geplante Datenmenge und Benutzeranzahl ausreichend dimensioniert

### 6.2 Einschränkungen

- Die erste Version unterstützt nur Excel als Import-/Exportformat (keine CSV, XML, etc.)
- Die Diagramm-Bearbeitung ist auf die Funktionalität von Excalidraw beschränkt
- Keine direkte Integration mit externen EA-Tools in der ersten Version
