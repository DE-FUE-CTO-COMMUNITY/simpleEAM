# Arrow Creation – Aktueller Stand, Historie & Anforderungen

> Statusdatum: 18.08.2025

Dieses Dokument fasst den bisherigen Verlauf der Arbeiten an der Pfeil-/Arrow-Erstellung (arrowCreationService) zusammen, beschreibt den derzeitigen Basiszustand nach dem bewussten Reset sowie die daraus abgeleiteten funktionalen und technischen Anforderungen für die nächste Ausbaustufe.

---

## 1. Ziele der Initiative

- Vereinfachung und Modularisierung der Pfeilerstellungslogik ("pfeilberechnung generell vereinfachen").
- Visuelles und semantisches Angleichen an Excalidraw-Binding-Verhalten (focus, gap, Ankerstabilität).
- Vermeidung von Flip/Seitenwechsel und inkonsistenten Bindings nach Bewegungen.
- Grundlage für erweiterbare Strategien (verschiedene Arrow-Typen, Distribution, adaptive Krümmung, konfigurierbarer Abstand).

---

## 2. Historische Iterationen (Kurzchronik)

1. Monolithische Logik → Aufsplitten in Services (Creation, Positioning, Filtering, Template Mapping, Arrow Creation).
2. Typ-Sicherung: Präzisere Typen für ExcalidrawBaseElement, Arrow-spezifische Daten, Bindings.
3. Erstes funktionales Basisset: sharp, curved, elbow Pfeile; einfache Side-Erkennung und Quellverteilungslogik.
4. Mehrere Experimentzyklen:
   - Physischer Gap (Geometrieverkürzung) vs. reiner Binding-Gap.
   - Erweiterte Focus-Berechnung (determineFocusDistanceRect, Tangenten-/Normalen-Heuristiken).
   - Verteilung beider Enden, variable Gap-Strategien, Anker-Stabilität.
5. Probleme: Instabiler Fokus, verzögerte Gap-Anzeige, gelegentliche Flip-Effekte, unnötige Komplexität.
6. Vollständiger Reset: Rückkehr zu minimaler, robuster Basis ohne experimentelle Zusatzfunktionen.

---

## 3. Aktueller Basiszustand (Post-Reset)

| Aspekt                 | Zustand                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| Arrow-Typen            | sharp (2 Punkte), curved (4-Punkt Polyline), elbow (orthogonaler Pfad)                |
| Binding-Gap            | Fix: 8 (sharp/curved), 0 (elbow) – reiner Binding-Gap, keine physische Kürzung        |
| Fokus / fixedPoint     | elbow: fixedPoint (normalisiert); sharp/curved: einfache Fokus-Heuristik (±0.3 Clamp) |
| Verteilung             | Nur Source-Seite bei Mehrfachverbindungen; Target immer zentriert                     |
| Gap-Konfiguration      | Nicht vorhanden (hard coded)                                                          |
| Physische Verkürzung   | Nein                                                                                  |
| Adaptive Krümmung      | Nicht vorhanden (statische Heuristik)                                                 |
| Reverse / Inversion    | Keine gesonderte Logik (nur Richtung der ID-Reihenfolge)                              |
| Stabilitätsmechanismen | Minimal (keine Side-Lock oder Re-Anker-Strategie)                                     |
| Strategie-Abstraktion  | Noch monolithisch im Service; keine austauschbaren Module                             |

---

## 4. Entfernte / Revertierte Experimente

- determineFocusDistanceRect & Line-Intersection Helfer.
- Physischer Gap (Arrow-Punktverkürzung am Geometrieanfang/-ende).
- Parametrisierter gapPx durch Service-Kette.
- Erweiterte Fokus-Algorithmen (Tangent-/Normalbasierte Streuung).
- Zielseitige Anchor-Verteilung.
- Hybrid-Gap (binding + physical) Konzepte.

Begründung für Entfernung: Instabilität, visuelle Artefakte, Überkomplexität vor definierten Anforderungen.

---

## 5. Problemfelder & Defizite des Baselines

1. Gap nicht konfigurierbar; keine Skalierung nach Elementabstand oder Pfeiltyp.
2. Fokus-Heuristik liefert geringe Differenzierung (Visuelle Überlagerung möglich).
3. Keine Distribution am Ziel → Enge Cluster / Overlaps bei vielen Source→Target Pfeilen.
4. Keine physische Lücke → Pfeiloptik kann wie „in Objekt hineinragend“ wirken (nur Binding-Gap unsichtbar für reine Geometrie).
5. Curved-Pfade nicht adaptiv → Bei langen Distanzen zu flach, bei kurzen Distanzen teils überakzentuiert.
6. Fehlen modularer Strategien erschwert Erweiterung & gezielte Tests.
7. Keine Stabilisierung gegen Flips (Side-Lock / heuristische Neuverankerung).
8. Kein klarer Konfigurations-Contract für Konsumenten (Options-Interface fehlt).

---

## 6. Funktionale Anforderungen (Soll)

### 6.1 Gap & Distanz

- Konfigurierbarer Gap pro Arrow-Typ (Defaults + Override).
- Unterstützt mindestens drei Modi: bindingOnly | physicalOnly | hybrid.
- Adaptive Skalierung (z.B. Distanz-basierte Ober-/Untergrenzen: minGap, maxGap, scaleFunction(distance)).

### 6.2 Fokus / Anchor Stability

- Deterministischer Fokus basierend auf relativer Ankerposition & Pfeilrichtung.
- Breiterer zulässiger Bereich (z.B. Clamp ±0.45) mit Kollisionsvermeidung.
- Side-Lock: einmal gewählte Seite bleibt stabil bis eine harte Schwelle (Threshold) überschritten wird.
- Option zur Re-Normalisierung nach Elementverschiebungen ohne Sprung (smoothed update).

### 6.3 Anchor Distribution

- Beidseitige Verteilung optional aktivierbar (sourceOnly | targetOnly | both).
- Kollisionserkennung & minimale Abstandsgarantie zwischen verteilten Punkten.
- Reihenfolge-Deterministik (z.B. Sortierung nach Gegen-Element-ID oder Erstellungszeit) zur Reproduzierbarkeit.

### 6.4 Pfad-Geometrie

- Sharp: Minimal Straight; optional Pfeilkopf-Offset integriert bei physical gap.
- Curved: Adaptiv – Krümmung proportional zur Distanz mit min/max Curvature Constraints, mittig oder tangential ausgerichtet auf Verbindungsrichtung.
- Elbow: Orthogonale Strategie mit frei konfigurierbarem Turn-Ratio (z.B. 40%/60%) oder automatischer Minimierung von Überkreuzungen.

### 6.5 Reverse / Inversion

- Option `reverse?: boolean` die Geometrie, Bindings (source<->target) & Fokus konsistent invertiert (nicht nur Parameterreihenfolge).

### 6.6 Konflikt- & Überlagerungsreduktion

- Leichte Fokus-Jitter-Strategie (deterministisch: Hash(elementIds + index) → Pseudo-Offset) zur Entzerrung.
- Optionales Clustering: Pfeile mit gleicher Richtung gruppieren und gestaffelt anzeigen.

### 6.7 Konfiguration & Erweiterbarkeit

- Zentrales `ArrowCreationOptions` Interface mit optionalen Teilobjekten: `{ gap, focus, distribution, path, reverse, debug }`.
- Strategy Pattern: `GapStrategy`, `FocusStrategy`, `DistributionStrategy`, `PathStrategy`, `BindingStrategy`.
- Plug-in Erweiterbarkeit: externe Registrierung weiterer Strategien.

### 6.8 Performance & Sicherheit

- Reine Berechnung O(1) pro Pfeil; Verteilung O(n) für n Pfeile zwischen gleichem Paar.
- Keine mehrfachen Re-Layouts pro Renderzyklus (Debounce / Memoization bei gleichen Inputs).

### 6.9 Debug / Observability

- Optionaler Debug-Modus der Zwischendaten (berechnete Fokuswerte, GapResult, Anchor Points) strukturiert zurückliefert oder loggt.

### 6.10 Tests

- Unit-Tests für jede Strategie (Edge Cases: minimaler Abstand, maximaler Abstand, viele parallele Pfeile).
- Snapshot-Tests für generierte Path-Punkt-Arrays.
- Deterministik-Test (gleiche Inputs → identische Outputs).

---

## 7. Technische Anforderungen / Designentscheidungen

| Bereich                  | Entscheidung                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| Strategie-Schnittstellen | Rein funktional, idempotent, keine Seiteneffekte                                                 |
| Typisierung              | Strikte TS Interfaces + readonly Arrays für Punkte                                               |
| Kollisionsfreiheit       | Post-Verteilungs-Adjuster (Resolver) schiebt minimal auseinander                                 |
| Hash-Funktion            | Stabil: FNV-1a oder einfache deterministische String→Number Map                                  |
| Curved Pfad              | Berechnung über Kontroll-Vektoren relativ zur Verbindungslinie (parametrisierte Offset-Funktion) |
| Physical Gap             | Projektion entlang Richtung → Kürzung Start/End-Punkt vor Pfad-Konstruktion                      |
| Hybrid                   | Binding-Gap für UI-Selektion, Physical Gap für visuelle Klarheit                                 |
| Konfiguration            | Optionale Deep-Partial mit Defaults via `resolveArrowOptions()`                                  |

---

## 8. Geplante Modulstruktur (Vorschlag)

```
graphics/arrow/
  index.ts
  strategies/
    gap/
      bindingGap.ts
      physicalGap.ts
      hybridGap.ts
    focus/
      deterministicFocus.ts
      jitterDecorator.ts
    distribution/
      sourceOnly.ts
      bothSides.ts
    path/
      sharpPath.ts
      curvedPath.ts
      elbowPath.ts
    binding/
      bindingBuilder.ts
  core/
    types.ts
    resolveOptions.ts
    computeAnchors.ts
    composeArrow.ts
```

Migration schrittweise: Erst Option-Layer + Gap/Fokus extrahieren, anschließend Distribution & Path.

---

## 9. Edge Cases & Testfälle (Auswahl)

| Szenario                                      | Erwartetes Verhalten                                                |
| --------------------------------------------- | ------------------------------------------------------------------- |
| Sehr kurze Distanz (< threshold)              | Curved degeneriert zu nahezu straight; Gap reduziert aber >= minGap |
| Sehr lange Distanz                            | Curvature capped; Gap skaliert bis maxGap                           |
| Viele parallele Pfeile (>10)                  | Fokus-Offsets kollisionsfrei, deterministisch                       |
| Reverse=true                                  | Geometrie & Bindings vollständig invertiert                         |
| Hybrid Gap aktiv                              | Sichtbarer physischer Abstand + logische Bindings mit Gap           |
| Nach Elementverschiebung Seite wechselt knapp | Side-Lock hält bis Threshold überschritten                          |

---

## 10. Schrittweiser Implementierungsplan (Priorisierung)

1. Options-Layer & Types (`ArrowCreationOptions`, Resolver) – Non-breaking.
2. Gap-Strategien (bindingOnly + physicalOnly + hybrid) – Feature-Flag.
3. Deterministic Focus Strategy + Jitter Decorator.
4. Beidseitige Distribution mit Kollisionstest.
5. Path Refactor (Strategy: sharp/curved/elbow) + adaptive Curvature.
6. Reverse Semantik & Physical Gap Integration in Path.
7. Stabilisierung (Side-Lock + sanfte Fokus-Neuberechnung).
8. Test-Suite & Snapshot Tests.
9. Debug Hooks & Telemetrie (optional).
10. Dokumentation & Beispielkonfigurationen.

---

## 11. Risikoanalyse & Mitigation

| Risiko                         | Auswirkung                     | Mitigation                                     |
| ------------------------------ | ------------------------------ | ---------------------------------------------- |
| API Bruch                      | Refactoring blockiert Frontend | Schrittweise Einführung + Defaults beibehalten |
| Performance Degradation        | Ruckler bei vielen Pfeilen     | O(n) Distribution optimieren, Memoization      |
| Unstabile Fokuswerte           | Visuelles Springen             | Side-Lock + smoothing Function                 |
| Zu komplexe Strategiematrix    | Wartungsaufwand                | Modularität + klare minimale Contracts         |
| Regression in bestehendem Flow | Nutzerirritation               | Snapshot & Golden Master Tests vor Merge       |

---

## 12. Akzeptanzkriterien (Definition of Done – erste Ausbaustufe)

1. createArrowBetweenElements akzeptiert `ArrowCreationOptions` (alle optional) ohne Breaking Change.
2. Mindestens drei Gap-Strategien wählbar; Default identisch zum heutigen Verhalten (bindingOnly gap=8).
3. Fokus-Strategie liefert deterministisch reproduzierbare Werte und reduziert Überlagerungen (>50% der vorherigen Overlaps eliminiert in Test-Datensatz).
4. Option `distribution: 'both'` verteilt Anker beider Seiten kollisionsarm (minimaler Abstand definierbar, Default ≥ 4px).
5. Curved-Pfeile zeigen bei Distanz > X (konfig.) erhöhte, bei Distanz < Y reduzierte Krümmung – Tests decken beide Grenzen ab.
6. Alle neuen Funktionen sind unit-getestet (Coverage Arrow-Modul ≥ 80%).
7. Dokumentation (dieses Dokument + Kurz-README im Modul) aktualisiert.

---

## 13. Nächste Konkrete Schritte (Kurz)

1. Einführung `core/types.ts` + Options-Resolver.
2. Extraktion Gap-Logik aus aktuellem Service → bindingGapStrategy.
3. Platzhalter für physicalGapStrategy (noch ohne Kürzungslogik) + TODO Marker.
4. Minimaler DeterministicFocus (Seitenwinkel + normalisierte Position) extrahieren.

---

## 14. Glossar (Auszug)

| Begriff       | Bedeutung                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------- |
| Binding-Gap   | Logischer Abstand innerhalb der Excalidraw-Binding-Struktur (focus/gap Werte).                |
| Physical Gap  | Sichtbare Verkürzung der Liniengeometrie, sodass der Pfeil nicht bis zur Elementkante reicht. |
| Fokus (focus) | Wert zur seitlichen Verschiebung innerhalb der gebundenen Seite, normalisiert (−1..1).        |
| fixedPoint    | Normierter Punkt (x,y in 0..1) für elbow-Bindings.                                            |
| Distribution  | Algorithmus zur Platzierung mehrerer Pfeilanker entlang einer Elementkante.                   |
| Side-Lock     | Mechanismus zur Stabilisierung der gewählten Kontaktseite trotz kleiner Lageänderungen.       |

---

## 15. Anhang / Referenzen

- Interne frühere Docs & Commit-Historie (Experimente: Focus/Gaps).
- Excalidraw interne Binding-Konventionen (Beobachtungen, kein direkter Code übernommen).
- Dieses Dokument dient als Living Specification – Änderungen via PR mit Änderungslog.

---

## 16. Änderungslog

| Datum      | Änderung                                 |
| ---------- | ---------------------------------------- |
| 18.08.2025 | Initiale Erstellung nach Reset & Analyse |

---

Ende des Dokuments.
