# Excalidraw Pfeile – Funktionsweise & Internes Modell

> Zweck: Referenz für die Ableitung eigener Strategien im Projekt. Zusammenfassung basierend auf Analyse des öffentlichen Excalidraw-Verhaltens und typischer Code-Strukturen (MIT-licensed). Kein wörtliches Kopieren ganzer Codeblöcke.

---

## 1. Überblick

Excalidraw behandelt Pfeile ("arrows") als spezielle Vektor-Elemente mit:

- einer sequenziellen Punktliste (`points`) relativ zum Ursprung (0,0) des Elements
- Start- und End-Bindings zu anderen Formen (optional)
- Pfeilspitzen (Arrowheads) am Start, Ende oder beiden Enden
- Stilparametern (Strichbreite, Farbe, Roughness, Opazität, Strichstil etc.)
- optionaler Glättung durch Rundung/`roundness` → führt zu weichen Kurven anstatt eckiger Polyline

Der visuelle Pfad entsteht aus den (x,y)-Punkten unter Anwendung eines Smoothing-/Roughness Layers (RoughJS Stil). Bindings ergänzen semantische Informationen, wie der Pfeil an der Form verankert ist.

---

## 2. Datenmodell (konzeptionell)

| Feld                          | Bedeutung                                                    |
| ----------------------------- | ------------------------------------------------------------ |
| id                            | Eindeutige Element-ID                                        |
| type                          | `arrow`                                                      |
| points                        | Array von relativen Punkten (Start immer (0,0))              |
| startBinding / endBinding     | Optionales Objekt mit { elementId, focus, gap, ... }         |
| startArrowhead / endArrowhead | z.B. `arrow`, `triangle`, `none`                             |
| strokeColor / backgroundColor | Farben                                                       |
| roundness                     | Glättungs-Parameter (0 = keine Kurve)                        |
| width / height                | Berechnetes Bounding-Box Maß (aus Punkten)                   |
| angle                         | Rotation des gesamten Elements (für Pfeile typischerweise 0) |
| version / versionNonce        | Revisionskontrolle für Kollaboration                         |
| seed                          | Zufallsbasis für Roughness/Hand-drawn Effekt                 |

### 2.1 Binding-Objekte

`startBinding` und `endBinding` beinhalten:

- `elementId`: ID der Ziel-Form
- `focus`: normalisierter Seiten-/Perimeter-Offset (≈ -1 bis +1)
- `gap`: Pixelabstand zwischen dem Pfeil-Endpunkt und der Formgrenze (logisch – reine Darstellung berücksichtigt dies beim Rendern der Linie bis zum Rand minus gap)
- `fixedPoint` (optional): Normalisierte 2D-Koordinate `{ x:0..1, y:0..1 }` innerhalb des Ziel-Bounding-Box Systems; Alternative zu `focus` für Fälle, in denen eine _explizit stabile geometrische Referenz_ (z.B. für orthogonale / elbow Routen) bevorzugt wird. Während `focus` Seiten-orientiert ist (seitenspezifische Parametrisierung), beschreibt `fixedPoint` direkt eine relative Position, wodurch spätere Größenänderungen der Form deterministisch skalieren ohne Seiten-Hysterese.
- (teilweise weitere interne Felder wie Version/Provenienz)

Verwendungskonvention (Custom / Elbow):

- Elbow-Pfade nutzen bevorzugt `fixedPoint`, weil ein einzelner seitlicher Fokus nicht ausreichend Information für mehrsegmentige orthogonale Wege liefert.
- Fallback-Regel: Wenn sowohl `focus` als auch `fixedPoint` vorhanden sind, hat `fixedPoint` Vorrang für die Rekonstruktion; `focus` kann als kompatible Reserve dienen.

---

## 3. Bindings: Ermittlung & Aktualisierung

### 3.1 Erkennung einer möglichen Bindung

Während Nutzer Pfeil-Endpunkte ziehen:

1. Cursor-Position wird in Canvas-Koordinaten transformiert.
2. Kandidaten-Formen werden über schnelle Bounding-Box Prüfung inkl. Toleranz (Hit-Threshold) gefiltert.
3. Distanz zur tatsächlichen Formkontur (Rect, Ellipse, Diamond etc.) wird approximiert oder explizit berechnet.
4. Liegt Distanz unter Grenzwert → Binding-Kandidat.
5. Entscheiden des Side-/Perimeter-Ankerpunkts & Ableitung von `focus` und `gap`.

### 3.2 Side-/Perimeter-Auswahl (Rechteck-Beispiel)

- Berechne Vektor vom Formzentrum zum Pfeil-Endpunkt (oder Cursor).
- Vergleiche |dx| vs |dy|:
  - |dx| > |dy| → seitliche Bindung (links/rechts)
  - sonst → vertikale Bindung (oben/unten)
- Die Vorzeichen von dx/dy entscheiden die konkrete Seite.

### 3.3 Fokus-Berechnung

Für Rechtecke:

- Wenn horizontale Seite (oben/unten): `focus = clamp( (x_rel / (width/2)), -1, 1 )` wobei x_rel der horizontale Abstand vom Zentrum ist.
- Wenn vertikale Seite (links/rechts): `focus = clamp( (y_rel / (height/2)), -1, 1 )`.

Für Ellipse/Diamond oder komplexere Formen:

- Fokus spiegelt eine Parametrisierung der Umfangsposition wider (projektion auf Normalen / Parameter t). Interne Implementierung nähert den Perimeter an und normalisiert die relative Position.

### 3.4 Gap-Berechnung

`gap` = Distanz in Pixeln, um das Pfeilende vor der Formoberfläche zu stoppen. Typisch ein Standardwert (z.B. 4–8px) – kann erhöht werden, damit Pfeilspitzen nicht visuell mit Umriss kollidieren.

### 3.5 Stabilitäts-Update bei Bewegung

Wenn gebundene Form verschoben wird:

- Pfeil-Endpunkt wird nicht frei repositioniert; stattdessen wird eine neue absolute Endpunktposition durch Rekonstruktion: `formEdgePoint(focus, side) - directionNormalized * gap` berechnet.
- Falls Formrotation eingeführt ist (Rect Rotation), muss Fokus auf transformierte Koordinaten angewendet werden (Pivot = Formzentrum, inverse Rotation).
- Ein Side-Flip tritt nur auf, wenn Endpunkt rechnerisch eine andere Seite deutlich überschreitet (Hysterese / Schwellenwert zur Vermeidung von Flattern).

---

## 4. Visuelle Pfadkonstruktion

### 4.1 Punkte & Richtung

- `points` enthält polyline-artige Segmente vom Start (0,0) zum Endpunkt (letzter Punkt relativ). Für einfache Pfeile meist nur zwei Punkte.
- Für Kurven sorgt `roundness` + Rendering-Pipeline für Bezier-ähnliche Glättung (Segmentdaten → Smooth Path).

### 4.2 Smoothing / Roughness

- Excalidraw implementiert einen Handgezeichnet-Look: leichte Abweichungen werden pseudorandom (Seed-basiert) erzeugt.
- Rundungen werden separat vor Roughness angewendet: Algorithmus berechnet Kontrollpunkte an Eckverbindungen der Polyline.

### 4.3 Arrowheads

- Größe abhängig von Strichbreite & Zoom (skalierungssensitiv, aber UI-optimiert auf konstante visuelle Größe).
- Ausrichtung: Normalisierte Tangente am letzten Segment.
- Start-Arrowhead analog, falls aktiviert.

### 4.4 Pfeiltypen (sharp, curved, elbow – konzeptionell)

Hinweis: Excalidraw unterscheidet im Kern nicht explizit zwischen "sharp" und "curved" Typen als getrennte Element-Typen – beides sind `arrow` Elemente. Der Unterschied entsteht durch (a) Anzahl / Anordnung der Punkte und (b) aktivierte Rundung (`roundness`). Ein "elbow" Stil ist kein nativer Spezialtyp, sondern ein Muster (orthogonale Polyline) ohne Rundung.

#### 4.4.1 Sharp (Gerade / Eckig)

- Punkte: Minimal 2 (Start (0,0) & Endpunkt). Zusätzliche Punkte erzeugen harte Knicke.
- Roundness: 0 oder nicht gesetzt → keine Glättung, Segmente bleiben linear.
- Rendering: Direkt polyline → Roughness-Effekt überlagert.
- Fokus/Gap: Unabhängig vom Kurventyp; Logik identisch.
- Nutzung: Standard-Verbindungen, wenn keine Krümmung gewünscht ist oder eindeutige orthogonale / diagonale Kanten gezeigt werden sollen.

#### 4.4.2 Curved (Geglättet)

- Punkte: Mindestens 2; zusätzliche Zwischenpunkte (Midpoints) erlauben Formgestaltung.
- Roundness: >0 (in Excalidraw häufig `roundness: { type: 3 }`) aktiviert Smoothing.
- Glättungsalgorithmus: Polyline → (interne) Catmull-Rom-zu-Quadratic/Bezier Approximation; Endsegmente werden mit kontrollierter Tangente an Start/Endpunkt angenähert.
- Krümmungsintensität: Abhängig von den relativen Abständen der Punkte und der Roundness-Konfiguration; keine explizite Distanz-basierte Skalierung – Benutzer steuert durch Punktverschiebung.
- Fokus/Gap: Unverändert; Bindings beeinflussen nur Start- & Endpunkt, nicht Zwischenpunkte.
- Besonderheit: Arrowhead-Tangente wird aus dem letzten geglätteten Segment berechnet → bei starkem End-Knick kann die Spitze leicht versetzt wirken, wird aber durch Smoothing stabilisiert.

#### 4.4.3 Elbow (Orthogonal / Manhattan-Stil – Custom Pattern)

- Nicht nativ als eigener Typ – entsteht durch Platzieren von 3+ Punkten in rechtwinkligen Versätzen (z.B. L- oder Z-Form) bei Roundness=0.
- Punkte: Typisch 3 (Start → Biegepunkt → End), ggf. mehr für mehrstufige orthogonale Routen.
- Roundness: 0 empfohlen, sonst würde Glättung rechte Winkel aufweichen.
- Pfadberechnung (Custom): Biegepunkt(e) werden häufig aus relativer Horizontal-/Vertikal-Projektion (Manhattan-Routing) abgeleitet:
  - Beispiel Single-Bend: (x1,y1) → (xMid,y1) → (xMid,y2) → (x2,y2) mit xMid = x1 + ratio\*(x2 - x1) (ratio z.B. 0.5).
- Fokus/Gap: Gleiches Binding-Modell; Gap-Verkürzung wirkt nur auf Start-/Endsegmente.
- Vorteile: Lesbare orthogonale Diagrammflüsse, vermeidet Diagonalen.
- Nachteile: Kein automatisches Kreuzungs- oder Überlappungsrouting; zusätzliche Logik nötig für kompakte Layouts.

##### Elbow-spezifischer Parameter: `elbowed`

- In erweiterten Implementierungen (Custom Layer) kann ein boolesches Flag `elbowed` / `elbow` am Arrow-Objekt geführt werden.
- Zweck: Semantische Kennzeichnung, dass der Punkt-Generator und Binding-Interpreter den orthogonalen Pfadmodus anwenden sollen.
- Wirkung auf Berechnungen:
  - Pfadgenerierung: Wählt Manhattan-Routing-Heuristik (z.B. Mid-Ratio oder minimaler Kreuzungsversuch) anstatt direkter Linie / Kurven-Smoothing.
  - Binding-Auswertung: Nutzt vorrangig `fixedPoint` (falls vorhanden) zur Rekonstruktion des Endpunktes, da Seitenfokus alleine keine Richtung für die ersten orthogonalen Segmente liefert.
  - Gap-Anwendung: Physische Verkürzung wird nur entlang des ersten bzw. letzten linearen Segments ausgeführt (nicht an Zwischen-Segmenten), damit rechtwinklige Struktur erhalten bleibt.
  - Roundness-Enforcement: Falls versehentlich Roundness gesetzt ist, kann Implementierung diese auf 0 normalisieren oder ignorieren, um keine Rundungen in Ecken einzuführen.

##### `fixedPoint` vs. `focus` beim Elbow

| Aspekt            | focus                                  | fixedPoint (empfohlen)                  |
| ----------------- | -------------------------------------- | --------------------------------------- |
| Bezug             | Seitenabhängig (top/right/bottom/left) | Bounding-Box relativ (x,y in 0..1)      |
| Stabilität        | Kann Side-Flips triggern               | Kein Flipping; skaliert proportional    |
| Orthogonale Pfade | Benötigt zusätzliche Side-Kontext      | Direkte Rekonstruktion Start-/End-Anker |
| Anpassung Größe   | Re-Interpretation über Seitenlogik     | Lineare Skalierung                      |
| Komplexe Formen   | Erfordert Side-Erkennung               | Nur Bounding-Box-Koordinaten notwendig  |

Empfohlene Regel: Für `elbowed` Pfeile immer `fixedPoint` setzen; `focus` optional als Legacy-Kompatibilität beibehalten.

#### 4.4.4 Vergleichstabelle

| Merkmal                                    | Sharp                                  | Curved (Smooth)                          | Elbow (Orthogonal Pattern)                   |
| ------------------------------------------ | -------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| Native Unterstützung                       | Ja (Basiszustand)                      | Ja (durch Roundness)                     | Nein (nur manuell/pattern)                   |
| Mindestpunktanzahl                         | 2                                      | 2 (mehr für Form)                        | 3 (für 1 Biegung)                            |
| Glättung                                   | Keine                                  | Aktiv (roundness > 0)                    | Keine (roundness = 0)                        |
| Visuelle Wirkung                           | Direkt / linear                        | Organisch / weich                        | Technisch / rechtwinklig                     |
| Anpassung Krümmung                         | Nur durch mehr Punkte/Verschiebung     | Roundness + Punkteposition               | Biegepunkt(e) Position                       |
| Arrowhead Tangente                         | Letztes lineares Segment               | Letztes geglättetes Segment              | Letztes lineares Segment                     |
| Implementierungsaufwand (Custom Strategie) | Niedrig                                | Mittel (Smoothing-Kontrolle)             | Mittel (Routing-Heuristik)                   |
| Geeignete Anwendungsfälle                  | Einfache Verbindungen, geringe Distanz | Fließende Beziehungen, visuelle Betonung | Strukturierte Diagramme, System-/Datenflüsse |

#### 4.4.5 Auswirkungen auf zukünftige Strategien

- Gap-Strategien: Sharp & Curved profitieren von physischer Gap-Verkürzung identisch; Elbow benötigt Verkürzung nur auf äußersten Segmenten.
- Focus-Distribution: Curved bietet mehr Spielraum für optische Trennung (Krümmung variieren); Elbow stärker abhängig von Biegepunkt-Berechnung.
- Adaptive Krümmung: Betrifft primär Curved; Sharp bleibt konstant, Elbow optional über labyrinth-artige Mehrfach-Bends.
- Reverse/Inversion: Alle Typen gleichermaßen – Inversion kehrt Bindings und Punkte-Reihenfolge um, Achtung bei Elbow: Biegepunkt-Reihenfolge invertiert Pfadlogik.

---

## 5. Unterschiede Pfeil vs Line

| Aspekt     | Arrow                               | Line                              |
| ---------- | ----------------------------------- | --------------------------------- |
| Arrowheads | Ja (Start/End)                      | Normalerweise nein (oder nur End) |
| Bindings   | Start & Ende üblich                 | Eher selten; kann aber vorkommen  |
| Fokus/Gap  | Relevanter für Pfeile               | Weniger wichtig                   |
| UI-Handles | Endpunkte + Mittelpunkte bei Kurven | Segmente                          |

---

## 6. Edge Cases

| Fall                         | Verhalten                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Sehr kleine Distanz          | Pfeil kann zusammenfallen; Minimal-Länge erzwungen (UI verhindert komplett 0)            |
| Gleiche Start- und Ziel-Form | Selbstreferenz möglich; Fokus entscheidet Seitenanordnung; Schleife wird sehr kurz       |
| Rotation Ziel-Form           | Fokus neu interpretiert in lokal rotiertem Koordinatensystem                             |
| Änderung Größe Ziel-Form     | Fokus bleibt normiert; realer Pixel-Offset verschiebt sich proportional                  |
| Mehrere Pfeile gleiche Seite | Alle können identischen Fokus haben (keine Auto-Distribution) – potentielle Überlagerung |
| Entfernen Binding-Ziel       | start/endBinding wird gelöscht; Endpunkt bleibt in letzter absoluter Position            |

---

## 7. Performance-Überlegungen

- Bindungserkennung: Bounding-Box Vorauswahl (O(n)) für n sichtbare Shapes; ggf. räumliche Indexierung (QuadTree) reduziert auf O(log n) Durchschnitt.
- Aktualisierung: Recomputing eines Endpunkts ist O(1) – nur einfache trigonometrische oder lineare Rechnungen.
- Smoothing/Rendering: Aggregiert über Canvas-Layer; pro Pfeil keine kostspieligen Splines außerhalb der linearen Interpolation + optionaler Quadratic smoothing.

---

## 8. Empfohlene Reproduktionsstrategie für Eigenimplementierung

1. Koordinaten-Normalisierung: Lokale Punktliste mit Start (0,0), Endpunkt relativ.
2. Binding-Side Heuristik: |dx| vs |dy| + Hysterese (z.B. 10–15% Wechsel-Puffer).
3. Fokus-Berechnung als normierter Versatz entlang der gewählten Seite (Mapping zu -1..1, Clamping).
4. Gap konsistent als Projektion entlang der Pfeilrichtung subtracten (physisch) oder nur logisch für Darstellung (binding gap).
5. Rekonstruiere Endpunkt aus (Side, Focus, Gap) beim Layout-Update.
6. Optionale Kollisionsvermeidung: leichte deterministische Offset-Funktion f(index, seed) für Fokus.
7. Kurvenpfade: Adaptive Kontrolle → offset = clamp(k \* distance, min, max).

---

## 9. Potentiale Fallstricke

| Risiko                                    | Beschreibung                                                                 | Mitigation                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| Fokus-Flattern                            | Schneller Wechsel zwischen Seiten wenn Endpunkt über Diagonal-Grenze springt | Hysterese + sideLockTimeout                             |
| Überlagerte Pfeile                        | Mehrere Bindings identischer Fokus                                           | Verteilungs-Strategie / Jitter                          |
| Sichtbarer Pfeil „berührt“ Form trotz Gap | Nur logischer Gap, keine physische Verkürzung                                | Physische Kürzung beim Renderpfad                       |
| Skalierung inkonsistent                   | Zoom beeinflusst visuelle Lücke unterschiedlich                              | Gap in px beibehalten; Arrowheads invariabel skalieren  |
| Rotierte Zielobjekte                      | Fehlende Transformationsanwendung auf Fokus                                  | Transformationsmatrix anwenden vor Fokus-Rekonstruktion |

---

## 10. Vergleich: Excalidraw Basis vs Custom Anforderungen

| Thema                    | Excalidraw                         | Custom Ziel (Dok ARROW-CREATION-REQUIREMENTS)  |
| ------------------------ | ---------------------------------- | ---------------------------------------------- |
| Zielseitige Distribution | Nicht automatisch                  | Optional beide Seiten verteilen                |
| Fokus-Spanne             | Effektiv -1..1                     | Evtl. enger/breiter + deterministischer Jitter |
| Gap Modi                 | Ein einfacher gap                  | bindingOnly / physical / hybrid                |
| Elbow Pfade              | Nicht nativ (Skripte oder manuell) | Eigener elbow Typ                              |
| Strategie-Pattern        | Implizit im Code verstreut         | Explizite Strategien pro Concern               |

---

## 11. Empfohlene Kennzahlen / Tests

| Kennzahl            | Beschreibung                                                   |
| ------------------- | -------------------------------------------------------------- |
| Side Stability Rate | Anteil Bewegungen ohne unerwünschten Flip                      |
| Overlap Count       | Anzahl überlagerter Arrow-Endpunkte an gleicher Seite          |
| Gap Accuracy        | Abweichung zwischen konfiguriertem und visuellem Pixel-Abstand |
| Recompute Cost      | Zeit pro 100 Pfeilupdates (ms)                                 |

---

## 12. Minimaler Pseudocode (abstrakt)

```pseudo
function bindEndpoint(point, shape):
  local = point - shape.center
  if abs(local.x) > abs(local.y): side = local.x > 0 ? RIGHT : LEFT
  else side = local.y > 0 ? BOTTOM : TOP
  focus = computeFocus(local, side, shape)
  gap = defaultGap
  return { elementId: shape.id, side, focus, gap }

function computeFocus(local, side, shape):
  switch side:
    case LEFT, RIGHT:
      return clamp(local.y / (shape.height/2), -1, 1)
    case TOP, BOTTOM:
      return clamp(local.x / (shape.width/2), -1, 1)

function endpointFromBinding(binding, shape):
  basePoint = sideCenter(shape, binding.side)
  offset = focusOffsetVector(binding.focus, binding.side, shape)
  edgePoint = basePoint + offset
  dir = normalize(edgePoint - shape.center)
  return edgePoint + dir * binding.gap * (-1)
```

Hinweis: Vereinfachtes Modell – tatsächliche Implementierung berücksichtigt Rotation, Formtypen und Roughness.

---

## 13. Offene Punkte für Vertiefung

- Exakte Behandlung von Ellipsen & Diamanten: Parametrisierung des Umfangs.
- Integration von Text-Bindings in gleiche Mechanik (Konflikte focus/gap?).
- Multi-User Kollaboration: Versionierungs-Felder & Mergewiderstände.
- Performance bei sehr vielen Pfeilen (>1000) – Bedarf an spatial indexing.

---

## 14. Fazit

Excalidraws Pfeilmechanik stützt sich auf ein kompaktes Binding-Modell (focus + gap + side) und eine einfache polyline-basierte Geometrie mit glättender Darstellungsschicht. Für erweiterte Anforderungen (Distributionsstrategien, hybride Gaps, Elbow-Pfade) ist eine modulare Re-Implementierung sinnvoll, die auf denselben Prinzipien (normierter Fokus, stabilisierte Seitenwahl, deterministische Rekonstruktion) aufsetzt.

---

## 15. Änderungslog

| Datum      | Änderung                                         |
| ---------- | ------------------------------------------------ |
| 19.08.2025 | Initiale Erstellung                              |
| 19.08.2025 | Ergänzung: `fixedPoint` Binding + `elbowed` Flag |

---

Ende des Dokuments.
