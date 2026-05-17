export interface LearnContent {
  subtopic: string
  concept: string
  formula: {
    notation: string
    parameters: { symbol: string; description: string }[]
  }
  example: {
    question: string
    steps: { instruction: string; calculation: string; result: string }[]
  }
  merkhilfe: string[]
}

const content: LearnContent[] = [
  // ── Analysis ────────────────────────────────────────────────────────────────

  {
    subtopic: 'Differentialrechnung',
    concept:
      'Die Ableitung f′(x) beschreibt die momentane Steigung des Graphen an der Stelle x – also wie schnell sich die Funktion dort verändert. An lokalen Extrempunkten ist f′(x) = 0. Mit der zweiten Ableitung f′′(x) entscheidest du, ob ein Maximum oder Minimum vorliegt: f′′(x₀) < 0 → Maximum, f′′(x₀) > 0 → Minimum.',
    formula: {
      notation: "f′(x) = lim(h→0) [f(x+h) − f(x)] / h",
      parameters: [
        { symbol: "(xⁿ)′ = n · xⁿ⁻¹", description: 'Potenzregel' },
        { symbol: "(f · g)′ = f′·g + f·g′", description: 'Produktregel' },
        { symbol: "(f ∘ g)′ = f′(g(x)) · g′(x)", description: 'Kettenregel' },
        { symbol: "(eˣ)′ = eˣ,  (ln x)′ = 1/x", description: 'Spezielle Ableitungen' },
      ],
    },
    example: {
      question: 'Gegeben: f(x) = x³ − 3x² + 2. Bestimme alle lokalen Extrempunkte.',
      steps: [
        {
          instruction: 'Erste Ableitung bilden',
          calculation: 'f′(x) = 3x² − 6x = 3x(x − 2)',
          result: 'f′(x) = 3x(x − 2)',
        },
        {
          instruction: 'Nullstellen von f′(x) bestimmen',
          calculation: '3x(x − 2) = 0  →  x₁ = 0,  x₂ = 2',
          result: 'Kandidaten: x = 0 und x = 2',
        },
        {
          instruction: 'Zweite Ableitung bilden',
          calculation: 'f′′(x) = 6x − 6',
          result: 'f′′(x) = 6x − 6',
        },
        {
          instruction: 'Vorzeichen von f′′ prüfen und y-Werte berechnen',
          calculation:
            'f′′(0) = −6 < 0  →  Maximum: y = f(0) = 2\nf′′(2) = +6 > 0  →  Minimum: y = f(2) = 8 − 12 + 2 = −2',
          result: 'HP(0 | 2),  TP(2 | −2)',
        },
      ],
    },
    merkhilfe: [
      "f′(x₀) = 0 ist notwendig, nicht hinreichend – prüfe immer noch f′′(x₀) oder den Vorzeichenwechsel von f′.",
      "Vergiss nicht, die y-Koordinaten der Extrempunkte durch Einsetzen in f(x) zu berechnen.",
      "Ist f′′(x₀) = 0, ist der Test nicht eindeutig – untersuche dann das Vorzeichen von f′ links und rechts von x₀.",
    ],
  },

  {
    subtopic: 'Integralrechnung',
    concept:
      'Das bestimmte Integral ∫ₐᵇ f(x) dx berechnet den orientierten Flächeninhalt zwischen dem Graphen und der x-Achse. Liegt der Graph unter der x-Achse, wird die Fläche negativ gezählt. Zum Berechnen suchst du eine Stammfunktion F mit F′ = f und wertest dann F(b) − F(a) aus.',
    formula: {
      notation: '∫ₐᵇ f(x) dx = [F(x)]ₐᵇ = F(b) − F(a)',
      parameters: [
        { symbol: "F′(x) = f(x)", description: 'F ist Stammfunktion von f' },
        { symbol: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C", description: 'Potenzregel (n ≠ −1)' },
        { symbol: "∫ eˣ dx = eˣ + C", description: 'Exponentialfunktion' },
        { symbol: "∫ 1/x dx = ln|x| + C", description: 'Natürlicher Logarithmus' },
      ],
    },
    example: {
      question: 'Berechne das bestimmte Integral ∫₁³ (2x² − 4x + 3) dx.',
      steps: [
        {
          instruction: 'Stammfunktion F(x) bestimmen',
          calculation: 'F(x) = (2/3)x³ − 2x² + 3x',
          result: 'F(x) = ⅔x³ − 2x² + 3x',
        },
        {
          instruction: 'Obere Grenze einsetzen: F(3)',
          calculation: 'F(3) = (2/3)·27 − 2·9 + 3·3 = 18 − 18 + 9',
          result: 'F(3) = 9',
        },
        {
          instruction: 'Untere Grenze einsetzen: F(1)',
          calculation: 'F(1) = (2/3)·1 − 2·1 + 3·1 = 2/3 − 2 + 3',
          result: 'F(1) = 5/3',
        },
        {
          instruction: 'Differenz F(b) − F(a) berechnen',
          calculation: '9 − 5/3 = 27/3 − 5/3 = 22/3',
          result: '∫₁³ (2x² − 4x + 3) dx = 22/3 ≈ 7,33',
        },
      ],
    },
    merkhilfe: [
      'Flächen unterhalb der x-Achse werden negativ – für den echten Flächeninhalt musst du Teilintegrale getrennt berechnen und die Beträge addieren.',
      'Probe: Leite F(x) ab – das Ergebnis muss f(x) sein.',
      'Das +C fällt beim bestimmten Integral weg, weil es sich bei F(b) − F(a) heraushebt.',
    ],
  },

  // ── Stochastik ───────────────────────────────────────────────────────────────

  {
    subtopic: 'Binomialverteilung',
    concept:
      'Die Binomialverteilung beschreibt, wie oft ein Treffer bei n unabhängigen Versuchen auftritt, wenn jeder Versuch dieselbe Trefferwahrscheinlichkeit p hat. Voraussetzungen: feste Anzahl n, konstantes p, Unabhängigkeit der Versuche. Typische Szenarien: Münzwürfe, Qualitätsprüfungen, Multiple-Choice-Tests.',
    formula: {
      notation: 'X ~ B(n, p)',
      parameters: [
        { symbol: 'n', description: 'Anzahl der Versuche' },
        { symbol: 'p', description: 'Trefferwahrscheinlichkeit pro Versuch' },
        { symbol: 'k', description: 'Gesuchte Anzahl Treffer' },
        { symbol: 'P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ', description: 'Einzelwahrscheinlichkeit' },
        { symbol: 'C(n,k) = n! / (k! · (n−k)!)', description: 'Binomialkoeffizient' },
      ],
    },
    example: {
      question: 'Eine faire Münze wird 8 Mal geworfen. Wie groß ist P(X = 3)?',
      steps: [
        {
          instruction: 'Parameter ablesen und Verteilung notieren',
          calculation: 'n = 8,  p = 0,5,  k = 3',
          result: 'X ~ B(8; 0,5)',
        },
        {
          instruction: 'Binomialkoeffizient C(8, 3) berechnen',
          calculation: 'C(8,3) = 8! / (3! · 5!) = (8·7·6) / (3·2·1) = 336 / 6',
          result: 'C(8,3) = 56',
        },
        {
          instruction: 'Wahrscheinlichkeit einsetzen',
          calculation: 'P(X=3) = 56 · (0,5)³ · (0,5)⁵ = 56 · (0,5)⁸ = 56 / 256',
          result: 'P(X=3) = 56/256 ≈ 0,219  →  ca. 21,9 %',
        },
      ],
    },
    merkhilfe: [
      'P(X ≥ k) = 1 − P(X ≤ k−1): Nutze die Gegenwahrscheinlichkeit, wenn viele Terme anfallen.',
      'Achte auf den genauen Fragetyp: P(X = k), P(X ≤ k) oder P(X ≥ k) – lies die Aufgabe zweimal.',
      'Für große n empfiehlt sich der GTR; Binomialwahrscheinlichkeiten von Hand zu berechnen dauert zu lange.',
    ],
  },

  {
    subtopic: 'Erwartungswert',
    concept:
      'Der Erwartungswert E(X) ist der langfristige Durchschnittswert, den eine Zufallsgröße bei sehr vielen Wiederholungen annimmt. Er muss kein möglicher Wert von X sein. Bei der Binomialverteilung lässt er sich direkt aus den Parametern ablesen: E(X) = n · p.',
    formula: {
      notation: 'E(X) = Σ xᵢ · P(X = xᵢ)',
      parameters: [
        { symbol: 'xᵢ', description: 'Mögliche Werte der Zufallsgröße' },
        { symbol: 'P(X = xᵢ)', description: 'Wahrscheinlichkeit für jeden Wert' },
        { symbol: 'E(X) = n · p', description: 'Kurzformel für B(n, p)' },
        { symbol: 'Var(X) = n · p · (1−p)', description: 'Varianz bei B(n, p)' },
        { symbol: 'σ = √(n · p · (1−p))', description: 'Standardabweichung' },
      ],
    },
    example: {
      question:
        'Würfelspiel: Bei einer 6 erhält man 4 €, bei einer 5 erhält man 1 €, sonst nichts. Einsatz: 1 €. Berechne E(G).',
      steps: [
        {
          instruction: 'Mögliche Gewinne G bestimmen (Auszahlung − Einsatz)',
          calculation: 'G = 3 € (bei 6),  G = 0 € (bei 5),  G = −1 € (sonst)',
          result: 'G ∈ {3; 0; −1}',
        },
        {
          instruction: 'Wahrscheinlichkeiten zuordnen',
          calculation: 'P(G=3) = 1/6,  P(G=0) = 1/6,  P(G=−1) = 4/6',
          result: 'Verteilung vollständig aufgestellt',
        },
        {
          instruction: 'Erwartungswert berechnen',
          calculation: 'E(G) = 3·(1/6) + 0·(1/6) + (−1)·(4/6) = 3/6 − 4/6',
          result: 'E(G) = −1/6 ≈ −0,17 €  →  Das Spiel ist langfristig nachteilig.',
        },
      ],
    },
    merkhilfe: [
      'E(X) = n·p gilt nur für die Binomialverteilung – bei allgemeinen Verteilungen immer Σ xᵢ·P(X=xᵢ) berechnen.',
      'Ist E(G) < 0, verliert man langfristig Geld – egal wie gut einzelne Runden laufen.',
      'Vergiss beim Gewinn G den Einsatz abzuziehen: G = Auszahlung − Einsatz.',
    ],
  },

  // ── Geometrie ────────────────────────────────────────────────────────────────

  {
    subtopic: 'Vektoren',
    concept:
      'Vektoren beschreiben Verschiebungen im Raum – sie haben eine Richtung und eine Länge, aber keinen festen Startpunkt. Der Verbindungsvektor AB⃗ zeigt von A nach B und ergibt sich als B − A. Mit dem Skalarprodukt berechnest du Winkel zwischen Vektoren und prüfst Orthogonalität.',
    formula: {
      notation: 'v⃗ = (v₁, v₂, v₃)',
      parameters: [
        { symbol: '|v⃗| = √(v₁² + v₂² + v₃²)', description: 'Betrag (Länge) des Vektors' },
        { symbol: 'AB⃗ = B − A', description: 'Verbindungsvektor von A nach B' },
        { symbol: 'v⃗ · w⃗ = v₁w₁ + v₂w₂ + v₃w₃', description: 'Skalarprodukt' },
        { symbol: 'cos α = (v⃗·w⃗) / (|v⃗|·|w⃗|)', description: 'Winkel zwischen v⃗ und w⃗' },
        { symbol: 'v⃗ · w⃗ = 0  ⟺  v⃗ ⊥ w⃗', description: 'Orthogonalitätsbedingung' },
      ],
    },
    example: {
      question: 'Gegeben: A(1|2|3) und B(4|0|1). Berechne AB⃗, |AB⃗| und den Mittelpunkt M von AB.',
      steps: [
        {
          instruction: 'Verbindungsvektor AB⃗ berechnen',
          calculation: 'AB⃗ = B − A = (4−1 | 0−2 | 1−3)',
          result: 'AB⃗ = (3 | −2 | −2)',
        },
        {
          instruction: 'Betrag |AB⃗| berechnen',
          calculation: '|AB⃗| = √(3² + (−2)² + (−2)²) = √(9 + 4 + 4) = √17',
          result: '|AB⃗| = √17 ≈ 4,12',
        },
        {
          instruction: 'Mittelpunkt M bestimmen',
          calculation: 'M = A + ½·AB⃗ = (1 + 1,5 | 2 − 1 | 3 − 1)',
          result: 'M(2,5 | 1 | 2)',
        },
      ],
    },
    merkhilfe: [
      'AB⃗ = B − A (nicht A − B!) – der Vektor zeigt vom Startpunkt zum Zielpunkt.',
      'Skalarprodukt = 0 bedeutet genau: die Vektoren stehen senkrecht aufeinander (orthogonal).',
      'Den Betrag als exakten Wurzelausdruck stehen lassen, wenn kein Dezimalwert gefordert ist.',
    ],
  },
]

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

const learnMap: Record<string, LearnContent> = Object.fromEntries(
  content.map((c) => [c.subtopic, c]),
)

export function getLearnContent(subtopic: string): LearnContent | null {
  return learnMap[subtopic] ?? null
}
