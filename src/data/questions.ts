export type Topic = 'analysis' | 'stochastik' | 'geometrie'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  subject: 'math'
  topic: Topic
  subtopic: string
  text: string
  difficulty: Difficulty
  max_points: number
  erwartungshorizont: string
  locked?: boolean
}

// ---------------------------------------------------------------------------
// Topic / subtopic structure (source of truth for the UI)
// ---------------------------------------------------------------------------
export const TOPICS: { id: Topic; label: string; subtopics: string[] }[] = [
  {
    id: 'analysis',
    label: 'Analysis',
    subtopics: [
      'Differentialrechnung',
      'Integralrechnung',
      'Kurvendiskussion',
      'Exponential- & Logarithmusfunktionen',
    ],
  },
  {
    id: 'stochastik',
    label: 'Stochastik',
    subtopics: [
      'Binomialverteilung',
      'Erwartungswert',
      'Normalverteilung',
      'Hypothesentests',
    ],
  },
  {
    id: 'geometrie',
    label: 'Geometrie',
    subtopics: [
      'Vektoren',
      'Geraden & Ebenen',
      'Abstände & Winkel',
      'Koordinatensysteme',
    ],
  },
]

export const QUESTIONS_PER_SUBTOPIC = 20

// ---------------------------------------------------------------------------
// Helper – generate locked placeholder questions
// ---------------------------------------------------------------------------
function makeLocked(
  count: number,
  prefix: string,
  topic: Topic,
  subtopic: string,
  startIdx = 1,
): Question[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${String(startIdx + i).padStart(3, '0')}-locked`,
    subject: 'math' as const,
    topic,
    subtopic,
    text: 'Diese Aufgabe wird bald freigeschaltet.',
    difficulty: 'medium' as const,
    max_points: 5,
    erwartungshorizont: '',
    locked: true,
  }))
}

// ---------------------------------------------------------------------------
// Real questions
// ---------------------------------------------------------------------------

const differentialrechnungReal: Question[] = [
  {
    id: 'math-diff-001',
    subject: 'math',
    topic: 'analysis',
    subtopic: 'Differentialrechnung',
    difficulty: 'easy',
    max_points: 5,
    text: `Gegeben ist die Funktion f mit f(x) = x³ − 3x² + 2 für x ∈ ℝ.

(a) Bestimmen Sie die erste Ableitung f′(x).
(b) Berechnen Sie die Nullstellen von f′(x).
(c) Untersuchen Sie mithilfe der zweiten Ableitung, ob es sich bei den gefundenen Stellen um lokale Extrempunkte handelt, und geben Sie deren Koordinaten an.`,
    erwartungshorizont: `f′(x) = 3x² − 6x = 3x(x − 2). Nullstellen: x₁ = 0, x₂ = 2.
f′′(x) = 6x − 6.
f′′(0) = −6 < 0 → lokales Maximum: HP(0 | 2).
f′′(2) = 6 > 0 → lokales Minimum: TP(2 | −2).
[1 Pkt f′, 1 Pkt Nullstellen, 1 Pkt f′′, 2 Pkt Extrempunkte mit Koordinaten]`,
  },
  {
    id: 'math-diff-002',
    subject: 'math',
    topic: 'analysis',
    subtopic: 'Differentialrechnung',
    difficulty: 'medium',
    max_points: 8,
    text: `Gegeben ist die Funktion f mit f(x) = 2x · e^(−x) für x ∈ ℝ.

(a) Bestimmen Sie f′(x) und f′′(x). (Produktregel)
(b) Ermitteln Sie alle lokalen Extrempunkte und Wendepunkte von f.
(c) Untersuchen Sie das Grenzwertverhalten: lim(x→+∞) f(x) und lim(x→−∞) f(x).
(d) Skizzieren Sie den Graphen von f und beschriften Sie Extrempunkte und Wendepunkt.`,
    erwartungshorizont: `f′(x) = 2e^(−x) − 2x·e^(−x) = 2e^(−x)(1 − x).
f′′(x) = −2e^(−x)(1 − x) + 2e^(−x)(−1) = 2e^(−x)(x − 2).
Extrempunkt: f′(x)=0 → x=1 → HP(1 | 2/e ≈ 0,74). f′′(1)=−2/e<0 → Maximum.
Wendepunkt: f′′(x)=0 → x=2 → W(2 | 4/e² ≈ 0,54).
lim(x→+∞) = 0 (e^(−x) dominiert), lim(x→−∞) = −∞.
[2 Pkt Ableitungen, 2 Pkt Extrempunkt, 2 Pkt Wendepunkt, 1 Pkt Grenzwerte, 1 Pkt Skizze]`,
  },
]

const integralrechnungReal: Question[] = [
  {
    id: 'math-int-001',
    subject: 'math',
    topic: 'analysis',
    subtopic: 'Integralrechnung',
    difficulty: 'easy',
    max_points: 4,
    text: `Berechnen Sie das folgende bestimmte Integral:

∫₁³ (2x² − 4x + 3) dx

Geben Sie den vollständigen Rechenweg an.`,
    erwartungshorizont: `Stammfunktion F(x) = (2/3)x³ − 2x² + 3x.
F(3) = 18 − 18 + 9 = 9.
F(1) = 2/3 − 2 + 3 = 5/3.
Integral = 9 − 5/3 = 22/3 ≈ 7,33.
[1 Pkt Stammfunktion, 1 Pkt Einsetzen der Grenzen, 1 Pkt Differenz, 1 Pkt korrektes Ergebnis]`,
  },
  {
    id: 'math-int-002',
    subject: 'math',
    topic: 'analysis',
    subtopic: 'Integralrechnung',
    difficulty: 'medium',
    max_points: 7,
    text: `Die Parabel p mit p(x) = −x² + 4 und die x-Achse begrenzen eine Fläche A.

(a) Bestimmen Sie die Schnittpunkte der Parabel mit der x-Achse.
(b) Berechnen Sie den Flächeninhalt von A.
(c) Bestimmen Sie die x-Koordinate c mit 0 < c < 2, sodass die Linie x = c die Fläche A in zwei gleich große Teile teilt. Runden Sie auf zwei Dezimalstellen.`,
    erwartungshorizont: `(a) −x²+4=0 → x=±2. Schnittpunkte: (−2|0), (2|0).
(b) A = ∫₋₂² (−x²+4) dx = [−x³/3 + 4x]₋₂² = (−8/3+8) − (8/3−8) = 32/3 ≈ 10,67.
(c) ∫₋₂^c (−x²+4) dx = 16/3 → [−x³/3+4x]₋₂^c = 16/3 → −c³/3+4c+8/3−8 = 16/3 → −c³/3+4c = 8 → c ≈ 0,57 (numerisch oder mit GTR).
[1 Pkt Schnittpunkte, 2 Pkt Integral, 1 Pkt Ergebnis Fläche, 2 Pkt Gleichung + Lösung, 1 Pkt Ergebnis c]`,
  },
]

const binomialverteilungReal: Question[] = [
  {
    id: 'math-binom-001',
    subject: 'math',
    topic: 'stochastik',
    subtopic: 'Binomialverteilung',
    difficulty: 'easy',
    max_points: 6,
    text: `Eine faire Münze wird 12 Mal geworfen. Die Zufallsvariable X gibt die Anzahl der Ergebnisse „Kopf" an.

(a) Geben Sie die Verteilung von X an (Parameter der Binomialverteilung).
(b) Berechnen Sie P(X = 6).
(c) Berechnen Sie P(X ≥ 9).
(d) Berechnen Sie P(3 ≤ X ≤ 7).`,
    erwartungshorizont: `X ~ B(12; 0,5).
(b) P(X=6) = C(12,6)·(0,5)^12 = 924/4096 ≈ 0,2256.
(c) P(X≥9) = P(X=9)+P(X=10)+P(X=11)+P(X=12) ≈ 0,0537+0,0161+0,0029+0,0002 ≈ 0,073.
(d) P(3≤X≤7) = ∑P(X=k) für k=3..7 ≈ 0,0161+0,0537+0,1208+0,1934+0,2256+0,1934+0,1208 ≈ [berechnet] ≈ 0,854 (Tabellenwerte akzeptiert).
[1 Pkt Parameter, 1 Pkt (b), 2 Pkt (c), 2 Pkt (d)]`,
  },
  {
    id: 'math-binom-002',
    subject: 'math',
    topic: 'stochastik',
    subtopic: 'Binomialverteilung',
    difficulty: 'medium',
    max_points: 8,
    text: `Bei der Qualitätskontrolle sind erfahrungsgemäß 5 % aller Bauteile defekt. Eine Stichprobe von 20 Bauteilen wird entnommen. X sei die Anzahl defekter Bauteile.

(a) Berechnen Sie P(X = 2).
(b) Berechnen Sie P(X ≤ 3).
(c) Ab welcher Anzahl k defekter Bauteile würde man die Lieferung zurückweisen, wenn man eine Irrtumswahrscheinlichkeit von höchstens 5 % akzeptiert? (Einseitiger Test)
(d) Der Hersteller behauptet, die Defektrate sei auf 3 % gesunken. Berechnen Sie P(X ≤ 3) unter dieser neuen Annahme und vergleichen Sie.`,
    erwartungshorizont: `X ~ B(20; 0,05).
(a) P(X=2) = C(20,2)·(0,05)²·(0,95)^18 = 190·0,0025·0,3972 ≈ 0,1887.
(b) P(X≤3) = P(0)+P(1)+P(2)+P(3) ≈ 0,3585+0,3774+0,1887+0,0596 ≈ 0,984.
(c) P(X≥k) ≤ 0,05: P(X≥5)≈0,0026 < 0,05, P(X≥4)≈0,0159 < 0,05, P(X≥3)≈0,0755 > 0,05. → ab k=4 zurückweisen.
(d) X~B(20;0,03): P(X≤3)≈0,9994. Noch sicherer, Lieferung würde fast nie abgelehnt.
[2 Pkt (a), 2 Pkt (b), 2 Pkt (c), 2 Pkt (d)]`,
  },
]

const erwartungswertReal: Question[] = [
  {
    id: 'math-erw-001',
    subject: 'math',
    topic: 'stochastik',
    subtopic: 'Erwartungswert',
    difficulty: 'easy',
    max_points: 5,
    text: `Beim Würfelspiel zahlt man 2 € Einsatz. Nach dem Wurf eines fairen Würfels gilt:
– Bei einer 6 erhält man 10 €.
– Bei einer 5 erhält man 4 €.
– Sonst erhält man nichts.

(a) Stellen Sie die Wahrscheinlichkeitsverteilung des Gewinns G (Auszahlung minus Einsatz) auf.
(b) Berechnen Sie den Erwartungswert E(G).
(c) Beurteilen Sie, ob das Spiel langfristig fair, vorteilhaft oder nachteilig für den Spieler ist.`,
    erwartungshorizont: `Gewinne: G = 8 mit P=1/6, G = 2 mit P=1/6, G = −2 mit P=4/6.
E(G) = 8·(1/6) + 2·(1/6) + (−2)·(4/6) = 8/6 + 2/6 − 8/6 = 2/6 = 1/3 ≈ 0,33 €.
Da E(G) > 0 ist das Spiel langfristig vorteilhaft für den Spieler.
[1 Pkt Verteilung, 2 Pkt Berechnung E(G), 1 Pkt Ergebnis, 1 Pkt Beurteilung]`,
  },
  {
    id: 'math-erw-002',
    subject: 'math',
    topic: 'stochastik',
    subtopic: 'Erwartungswert',
    difficulty: 'medium',
    max_points: 6,
    text: `Die Zufallsvariable X ist binomialverteilt mit den Parametern n = 30 und p = 0,4.

(a) Berechnen Sie den Erwartungswert μ = E(X) und die Standardabweichung σ.
(b) Geben Sie das Intervall [μ − σ, μ + σ] an und runden Sie auf zwei Dezimalstellen.
(c) Berechnen Sie P(μ − σ ≤ X ≤ μ + σ) mithilfe eines Hilfsmittels und interpretieren Sie das Ergebnis.`,
    erwartungshorizont: `μ = n·p = 30·0,4 = 12. σ = √(n·p·q) = √(30·0,4·0,6) = √7,2 ≈ 2,68.
Intervall: [12 − 2,68; 12 + 2,68] = [9,32; 14,68] → ganzzahlig [10; 14].
P(10 ≤ X ≤ 14) = ∑P(X=k) für k=10..14 ≈ 0,7 (ca. 70 %).
Ca. 70 % aller Versuche liefern einen Wert im Bereich [10;14] — typisches Streuungsintervall.
[1 Pkt μ, 1 Pkt σ, 1 Pkt Intervall, 2 Pkt Wahrscheinlichkeit, 1 Pkt Interpretation]`,
  },
]

const vektorenReal: Question[] = [
  {
    id: 'math-vek-001',
    subject: 'math',
    topic: 'geometrie',
    subtopic: 'Vektoren',
    difficulty: 'easy',
    max_points: 5,
    text: `Gegeben sind die Punkte A(2 | 1 | 3), B(5 | 4 | 1) und C(3 | −1 | 2).

(a) Berechnen Sie den Vektor AB⃗ und den Betrag |AB⃗|. Runden Sie auf zwei Dezimalstellen.
(b) Bestimmen Sie den Mittelpunkt M der Strecke AB.
(c) Überprüfen Sie, ob das Dreieck ABC gleichschenklig ist, indem Sie alle drei Seitenlängen berechnen.`,
    erwartungshorizont: `AB⃗ = (3, 3, −2). |AB⃗| = √(9+9+4) = √22 ≈ 4,69.
M = ((2+5)/2, (1+4)/2, (3+1)/2) = (3,5; 2,5; 2).
AC⃗ = (1,−2,−1), |AC⃗| = √6 ≈ 2,45. BC⃗ = (−2,−5,1), |BC⃗| = √30 ≈ 5,48.
Alle drei verschieden → nicht gleichschenklig.
[1 Pkt AB⃗, 1 Pkt |AB⃗|, 1 Pkt Mittelpunkt, 2 Pkt Seitenlängen + Schlussfolgerung]`,
  },
  {
    id: 'math-vek-002',
    subject: 'math',
    topic: 'geometrie',
    subtopic: 'Vektoren',
    difficulty: 'medium',
    max_points: 6,
    text: `Gegeben sind die Vektoren u⃗ = (2, −1, 3) und v⃗ = (1, 4, 1).

(a) Berechnen Sie das Skalarprodukt u⃗ · v⃗ und prüfen Sie, ob die Vektoren orthogonal sind.
(b) Berechnen Sie den Winkel α zwischen u⃗ und v⃗. Runden Sie auf eine Dezimalstelle.
(c) Bestimmen Sie alle Vektoren w⃗ = (a, 1, 0), die zu u⃗ orthogonal sind.`,
    erwartungshorizont: `u⃗·v⃗ = 2·1 + (−1)·4 + 3·1 = 2−4+3 = 1 ≠ 0 → nicht orthogonal.
cos α = 1 / (√14 · √18) = 1/√252 ≈ 0,063 → α ≈ 86,4°.
u⃗·w⃗ = 0: 2a + (−1)·1 + 3·0 = 0 → 2a = 1 → a = 0,5. Also w⃗ = (0,5; 1; 0).
[1 Pkt Skalarprodukt, 1 Pkt Orthogonalität, 2 Pkt Winkel, 2 Pkt w⃗]`,
  },
]

// ---------------------------------------------------------------------------
// Assemble all questions
// ---------------------------------------------------------------------------
export const questions: Question[] = [
  // Analysis – Differentialrechnung (2 real + 18 locked)
  ...differentialrechnungReal,
  ...makeLocked(18, 'math-diff', 'analysis', 'Differentialrechnung', 3),

  // Analysis – Integralrechnung (2 real + 18 locked)
  ...integralrechnungReal,
  ...makeLocked(18, 'math-int', 'analysis', 'Integralrechnung', 3),

  // Analysis – Kurvendiskussion (20 locked)
  ...makeLocked(20, 'math-kurv', 'analysis', 'Kurvendiskussion'),

  // Analysis – Exponential- & Logarithmusfunktionen (20 locked)
  ...makeLocked(20, 'math-expo', 'analysis', 'Exponential- & Logarithmusfunktionen'),

  // Stochastik – Binomialverteilung (2 real + 18 locked)
  ...binomialverteilungReal,
  ...makeLocked(18, 'math-binom', 'stochastik', 'Binomialverteilung', 3),

  // Stochastik – Erwartungswert (2 real + 18 locked)
  ...erwartungswertReal,
  ...makeLocked(18, 'math-erw', 'stochastik', 'Erwartungswert', 3),

  // Stochastik – Normalverteilung (20 locked)
  ...makeLocked(20, 'math-norm', 'stochastik', 'Normalverteilung'),

  // Stochastik – Hypothesentests (20 locked)
  ...makeLocked(20, 'math-hyp', 'stochastik', 'Hypothesentests'),

  // Geometrie – Vektoren (2 real + 18 locked)
  ...vektorenReal,
  ...makeLocked(18, 'math-vek', 'geometrie', 'Vektoren', 3),

  // Geometrie – Geraden & Ebenen (20 locked)
  ...makeLocked(20, 'math-ger', 'geometrie', 'Geraden & Ebenen'),

  // Geometrie – Abstände & Winkel (20 locked)
  ...makeLocked(20, 'math-abst', 'geometrie', 'Abstände & Winkel'),

  // Geometrie – Koordinatensysteme (20 locked)
  ...makeLocked(20, 'math-koor', 'geometrie', 'Koordinatensysteme'),
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getSubtopicQuestions(subtopic: string): Question[] {
  return questions.filter((q) => q.subtopic === subtopic)
}

export function getTopicQuestions(topic: Topic): Question[] {
  return questions.filter((q) => q.topic === topic)
}
