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
    subtopic: 'ganzrationale-funktionen',
    concept:
      'Die Ableitung $f\'(x)$ beschreibt die momentane Steigung des Graphen an der Stelle $x$ – also wie schnell sich die Funktion dort verändert. An lokalen Extrempunkten gilt $f\'(x) = 0$. Mit der zweiten Ableitung $f\'\'(x)$ entscheidest du, ob ein Maximum oder Minimum vorliegt: $f\'\'(x_0) < 0$ → Maximum, $f\'\'(x_0) > 0$ → Minimum.',
    formula: {
      notation: "$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$",
      parameters: [
        { symbol: "$(x^n)' = n \\cdot x^{n-1}$", description: 'Potenzregel' },
        { symbol: "$(f \\cdot g)' = f' \\cdot g + f \\cdot g'$", description: 'Produktregel' },
        { symbol: "$(f \\circ g)' = f'(g(x)) \\cdot g'(x)$", description: 'Kettenregel' },
        { symbol: "$(e^x)' = e^x, \\quad (\\ln x)' = \\tfrac{1}{x}$", description: 'Spezielle Ableitungen' },
      ],
    },
    example: {
      question: 'Gegeben: $f(x) = x^3 - 3x^2 + 2$. Bestimme alle lokalen Extrempunkte.',
      steps: [
        {
          instruction: 'Erste Ableitung bilden',
          calculation: "$f'(x) = 3x^2 - 6x = 3x(x - 2)$",
          result: "$f'(x) = 3x(x-2)$",
        },
        {
          instruction: "Nullstellen von $f'(x)$ bestimmen",
          calculation: '$3x(x - 2) = 0 \\implies x_1 = 0, \\quad x_2 = 2$',
          result: 'Kandidaten: $x = 0$ und $x = 2$',
        },
        {
          instruction: 'Zweite Ableitung bilden',
          calculation: "$f''(x) = 6x - 6$",
          result: "$f''(x) = 6x - 6$",
        },
        {
          instruction: "Vorzeichen von $f''$ prüfen, $y$-Werte berechnen",
          calculation: "$f''(0) = -6 < 0 \\implies \\text{Maximum: } y = f(0) = 2$\n$f''(2) = 6 > 0 \\implies \\text{Minimum: } y = f(2) = -2$",
          result: '$HP(0 \\mid 2), \\quad TP(2 \\mid {-2})$',
        },
      ],
    },
    merkhilfe: [
      "$f'(x_0) = 0$ ist notwendig, nicht hinreichend – prüfe immer noch $f''(x_0)$ oder den Vorzeichenwechsel von $f'$.",
      'Vergiss nicht, die $y$-Koordinaten durch Einsetzen in $f(x)$ zu berechnen.',
      "Ist $f''(x_0) = 0$, ist der Test nicht eindeutig – untersuche dann das Vorzeichen von $f'$ links und rechts von $x_0$.",
    ],
  },

  {
    subtopic: 'integralrechnung',
    concept:
      'Das bestimmte Integral $\\int_a^b f(x)\\,dx$ berechnet den orientierten Flächeninhalt zwischen dem Graphen und der $x$-Achse. Liegt der Graph unter der $x$-Achse, wird die Fläche negativ gezählt. Zum Berechnen suchst du eine Stammfunktion $F$ mit $F\' = f$ und wertest dann $F(b) - F(a)$ aus.',
    formula: {
      notation: '$$\\int_a^b f(x)\\,dx = \\Big[F(x)\\Big]_a^b = F(b) - F(a)$$',
      parameters: [
        { symbol: "$F'(x) = f(x)$", description: '$F$ ist Stammfunktion von $f$' },
        { symbol: '$\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C$', description: 'Potenzregel ($n \\neq -1$)' },
        { symbol: '$\\int e^x\\,dx = e^x + C$', description: 'Exponentialfunktion' },
        { symbol: '$\\int \\frac{1}{x}\\,dx = \\ln|x| + C$', description: 'Natürlicher Logarithmus' },
      ],
    },
    example: {
      question: 'Berechne das bestimmte Integral $\\int_1^3 (2x^2 - 4x + 3)\\,dx$.',
      steps: [
        {
          instruction: 'Stammfunktion $F(x)$ bestimmen',
          calculation: '$F(x) = \\dfrac{2}{3}x^3 - 2x^2 + 3x$',
          result: '$F(x) = \\tfrac{2}{3}x^3 - 2x^2 + 3x$',
        },
        {
          instruction: 'Obere Grenze einsetzen: $F(3)$',
          calculation: '$F(3) = \\tfrac{2}{3} \\cdot 27 - 2 \\cdot 9 + 3 \\cdot 3 = 18 - 18 + 9$',
          result: '$F(3) = 9$',
        },
        {
          instruction: 'Untere Grenze einsetzen: $F(1)$',
          calculation: '$F(1) = \\tfrac{2}{3} \\cdot 1 - 2 \\cdot 1 + 3 \\cdot 1 = \\tfrac{2}{3} - 2 + 3$',
          result: '$F(1) = \\tfrac{5}{3}$',
        },
        {
          instruction: 'Differenz $F(b) - F(a)$ berechnen',
          calculation: '$9 - \\tfrac{5}{3} = \\tfrac{27}{3} - \\tfrac{5}{3} = \\dfrac{22}{3}$',
          result: '$\\displaystyle\\int_1^3 (2x^2 - 4x + 3)\\,dx = \\dfrac{22}{3} \\approx 7{,}33$',
        },
      ],
    },
    merkhilfe: [
      'Flächen unterhalb der $x$-Achse werden negativ – für den echten Flächeninhalt musst du Teilintegrale getrennt berechnen und die Beträge addieren.',
      'Probe: Leite $F(x)$ ab – das Ergebnis muss $f(x)$ sein.',
      'Das $+C$ fällt beim bestimmten Integral weg, weil es sich bei $F(b) - F(a)$ heraushebt.',
    ],
  },

  // ── Stochastik ───────────────────────────────────────────────────────────────

  {
    subtopic: 'binomialverteilung',
    concept:
      'Die Binomialverteilung beschreibt, wie oft ein Treffer bei $n$ unabhängigen Versuchen auftritt, wenn jeder Versuch dieselbe Trefferwahrscheinlichkeit $p$ hat. Voraussetzungen: feste Anzahl $n$, konstantes $p$, Unabhängigkeit der Versuche. Typische Szenarien: Münzwürfe, Qualitätsprüfungen, Multiple-Choice-Tests.',
    formula: {
      notation: '$$P(X = k) = \\binom{n}{k} \\cdot p^k \\cdot (1-p)^{n-k}$$',
      parameters: [
        { symbol: '$n$', description: 'Anzahl der Versuche' },
        { symbol: '$p$', description: 'Trefferwahrscheinlichkeit pro Versuch' },
        { symbol: '$k$', description: 'Gesuchte Anzahl Treffer' },
        { symbol: '$\\binom{n}{k} = \\dfrac{n!}{k! \\cdot (n-k)!}$', description: 'Binomialkoeffizient' },
      ],
    },
    example: {
      question: 'Eine faire Münze wird 8 Mal geworfen. Wie groß ist $P(X = 3)$?',
      steps: [
        {
          instruction: 'Parameter ablesen und Verteilung notieren',
          calculation: '$n = 8, \\quad p = 0{,}5, \\quad k = 3$',
          result: '$X \\sim B(8;\\; 0{,}5)$',
        },
        {
          instruction: 'Binomialkoeffizient berechnen',
          calculation: '$\\binom{8}{3} = \\dfrac{8!}{3! \\cdot 5!} = \\dfrac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 56$',
          result: '$\\binom{8}{3} = 56$',
        },
        {
          instruction: 'Wahrscheinlichkeit einsetzen',
          calculation: '$P(X=3) = 56 \\cdot (0{,}5)^3 \\cdot (0{,}5)^5 = 56 \\cdot (0{,}5)^8 = \\dfrac{56}{256}$',
          result: '$P(X=3) \\approx 0{,}219 \\quad (\\approx 21{,}9\\,\\%)$',
        },
      ],
    },
    merkhilfe: [
      '$P(X \\geq k) = 1 - P(X \\leq k-1)$: Nutze die Gegenwahrscheinlichkeit, wenn viele Terme anfallen.',
      'Achte auf den genauen Fragetyp: $P(X = k)$, $P(X \\leq k)$ oder $P(X \\geq k)$ – lies die Aufgabe zweimal.',
      'Für große $n$ empfiehlt sich der GTR; Binomialwahrscheinlichkeiten von Hand zu berechnen dauert zu lange.',
    ],
  },

  {
    subtopic: 'wahrscheinlichkeit-zufallsgroessen',
    concept:
      'Der Erwartungswert $E(X)$ ist der langfristige Durchschnittswert, den eine Zufallsgröße bei sehr vielen Wiederholungen annimmt. Er muss kein möglicher Wert von $X$ sein. Bei der Binomialverteilung gilt die Kurzformel $E(X) = n \\cdot p$.',
    formula: {
      notation: '$$E(X) = \\sum_i x_i \\cdot P(X = x_i)$$',
      parameters: [
        { symbol: '$x_i$', description: 'Mögliche Werte der Zufallsgröße' },
        { symbol: '$P(X = x_i)$', description: 'Wahrscheinlichkeit für jeden Wert' },
        { symbol: '$E(X) = n \\cdot p$', description: 'Kurzformel für $B(n, p)$' },
        { symbol: '$\\sigma = \\sqrt{n \\cdot p \\cdot (1-p)}$', description: 'Standardabweichung bei $B(n,p)$' },
      ],
    },
    example: {
      question:
        'Würfelspiel: Bei einer 6 erhält man 4 €, bei einer 5 erhält man 1 €, sonst nichts. Einsatz: 1 €. Berechne $E(G)$.',
      steps: [
        {
          instruction: 'Mögliche Gewinne $G$ bestimmen (Auszahlung − Einsatz)',
          calculation: '$G = 3\\,€$ (bei 6),\\quad $G = 0\\,€$ (bei 5),\\quad $G = -1\\,€$ (sonst)',
          result: '$G \\in \\{3;\\; 0;\\; -1\\}$',
        },
        {
          instruction: 'Wahrscheinlichkeiten zuordnen',
          calculation: '$P(G=3) = \\tfrac{1}{6}, \\quad P(G=0) = \\tfrac{1}{6}, \\quad P(G=-1) = \\tfrac{4}{6}$',
          result: 'Verteilung vollständig aufgestellt',
        },
        {
          instruction: 'Erwartungswert berechnen',
          calculation: '$E(G) = 3 \\cdot \\tfrac{1}{6} + 0 \\cdot \\tfrac{1}{6} + (-1) \\cdot \\tfrac{4}{6} = \\tfrac{3}{6} - \\tfrac{4}{6}$',
          result: '$E(G) = -\\tfrac{1}{6} \\approx -0{,}17\\,€ \\implies$ langfristig nachteilig',
        },
      ],
    },
    merkhilfe: [
      '$E(X) = n \\cdot p$ gilt nur für die Binomialverteilung – bei allgemeinen Verteilungen immer $\\sum x_i \\cdot P(X=x_i)$ berechnen.',
      'Ist $E(G) < 0$, verliert man langfristig Geld – egal wie gut einzelne Runden laufen.',
      'Vergiss beim Gewinn $G$ den Einsatz abzuziehen: $G = \\text{Auszahlung} - \\text{Einsatz}$.',
    ],
  },

  {
    subtopic: 'signifikanztest',
    concept:
      'Beim einseitigen Signifikanztest prüfst du, ob eine Beobachtung mit einer angenommenen Wahrscheinlichkeit $p_0$ vereinbar ist oder ob es Belege gegen diese Annahme gibt. Du legst zuerst das Signifikanzniveau $\\alpha$ fest (meist $5\\,\\%$), bestimmst dann den Ablehnungsbereich $K$ so, dass $P(X \\in K) \\leq \\alpha$ gilt, und vergleichst den beobachteten Wert mit $K$.',
    formula: {
      notation: '$$H_0: p = p_0 \\quad \\text{vs.} \\quad H_1: p < p_0 \\text{ (oder } p > p_0\\text{)}$$',
      parameters: [
        { symbol: '$\\alpha$', description: 'Signifikanzniveau (z.B. $0{,}05$)' },
        { symbol: '$K$', description: 'Ablehnungsbereich (kritischer Bereich)' },
        { symbol: '$H_0$', description: 'Nullhypothese (zu widerlegende Annahme)' },
        { symbol: '$H_1$', description: 'Alternativhypothese' },
        { symbol: '$P(X \\leq k) \\leq \\alpha$', description: 'Bedingung für linksseitigen Ablehnungsbereich' },
      ],
    },
    example: {
      question:
        'Ein Würfel soll fair sein ($p_0 = \\tfrac{1}{6}$ für eine 6). In 60 Würfen erscheint die 6 nur 4-mal. Teste auf Niveau $\\alpha = 5\\,\\%$, ob die 6 unterdurchschnittlich häufig fällt.',
      steps: [
        {
          instruction: 'Hypothesen und Modell aufstellen',
          calculation: '$H_0: p = \\tfrac{1}{6}, \\quad H_1: p < \\tfrac{1}{6}, \\quad X \\sim B\\!\\left(60;\\,\\tfrac{1}{6}\\right)$',
          result: 'Linksseitiger Test, $\\alpha = 0{,}05$',
        },
        {
          instruction: 'Ablehnungsbereich $K = \\{0, 1, \\ldots, k^*\\}$ bestimmen',
          calculation:
            '$P(X \\leq 5) \\approx 0{,}076 > 0{,}05$ \\quad (noch nicht im Ablehnungsbereich)\n$P(X \\leq 4) \\approx 0{,}033 \\leq 0{,}05$ \\quad (Grenze gefunden)',
          result: '$K = \\{0, 1, 2, 3, 4\\}$',
        },
        {
          instruction: 'Beobachteten Wert mit $K$ vergleichen',
          calculation: '$x = 4 \\in K = \\{0,1,2,3,4\\}$',
          result: '$H_0$ wird abgelehnt – auf dem $5\\,\\%$-Niveau ist die 6 signifikant zu selten.',
        },
      ],
    },
    merkhilfe: [
      'Ablehnungsbereich immer aus $P(X \\leq k) \\leq \\alpha$ (links) oder $P(X \\geq k) \\leq \\alpha$ (rechts) bestimmen – nicht schätzen.',
      'Der Ablehnungsbereich enthält ganze Zahlen, keine Dezimalwerte.',
      '"$H_0$ ablehnen" bedeutet nicht, dass $H_1$ sicher wahr ist – nur, dass die Daten nicht mit $H_0$ vereinbar sind.',
    ],
  },

  {
    subtopic: 'normalverteilung',
    concept:
      'Die Normalverteilung $N(\\mu;\\,\\sigma^2)$ beschreibt viele natürliche Messgrößen. Ihr Graph ist die Glockenkurve, symmetrisch um den Erwartungswert $\\mu$. Mit der Standardisierung $Z = \\dfrac{X - \\mu}{\\sigma}$ lassen sich alle Wahrscheinlichkeiten auf die Standardnormalverteilung $N(0;1)$ zurückführen und am GTR oder mit der Tabelle ablesen.',
    formula: {
      notation: '$$Z = \\frac{X - \\mu}{\\sigma}, \\qquad Z \\sim N(0;\\,1)$$',
      parameters: [
        { symbol: '$\\mu$', description: 'Erwartungswert (Lage der Glockenkurve)' },
        { symbol: '$\\sigma$', description: 'Standardabweichung (Breite der Glocke)' },
        { symbol: '$\\sigma^2$', description: 'Varianz' },
        { symbol: '$\\Phi(z) = P(Z \\leq z)$', description: 'Verteilungsfunktion der Standardnormalverteilung' },
        { symbol: '$P(a \\leq X \\leq b) = \\Phi\\!\\left(\\frac{b-\\mu}{\\sigma}\\right) - \\Phi\\!\\left(\\frac{a-\\mu}{\\sigma}\\right)$', description: 'Intervallwahrscheinlichkeit' },
      ],
    },
    example: {
      question:
        'Körpergrößen von Männern: $\\mu = 178\\,\\text{cm}$, $\\sigma = 7\\,\\text{cm}$. Wie groß ist die Wahrscheinlichkeit, dass ein zufällig gewählter Mann zwischen 170 und 185 cm groß ist?',
      steps: [
        {
          instruction: 'Standardisieren: Grenzen in $z$-Werte umrechnen',
          calculation:
            '$z_1 = \\dfrac{170 - 178}{7} \\approx -1{,}14, \\qquad z_2 = \\dfrac{185 - 178}{7} = 1{,}00$',
          result: '$P(170 \\leq X \\leq 185) = \\Phi(1{,}00) - \\Phi(-1{,}14)$',
        },
        {
          instruction: '$\\Phi$-Werte ablesen (Tabelle oder GTR)',
          calculation: '$\\Phi(1{,}00) \\approx 0{,}8413, \\qquad \\Phi(-1{,}14) \\approx 0{,}1271$',
          result: 'Werte der Standardnormalverteilung',
        },
        {
          instruction: 'Differenz bilden',
          calculation: '$P = 0{,}8413 - 0{,}1271 = 0{,}7142$',
          result: '$P(170 \\leq X \\leq 185) \\approx 71{,}4\\,\\%$',
        },
      ],
    },
    merkhilfe: [
      '$\\Phi(-z) = 1 - \\Phi(z)$ – negative $z$-Werte lassen sich auf positive zurückführen (Symmetrie der Glockenkurve).',
      'Faustregel: $\\approx 68\\,\\%$ der Werte liegen in $[\\mu - \\sigma;\\, \\mu + \\sigma]$, ca. $95\\,\\%$ in $[\\mu - 2\\sigma;\\, \\mu + 2\\sigma]$.',
      'Beim GTR: normalcdf$(a,\\, b,\\, \\mu,\\, \\sigma)$ liefert $P(a \\leq X \\leq b)$ direkt ohne Standardisierung.',
    ],
  },

  // ── Geometrie ────────────────────────────────────────────────────────────────

  {
    subtopic: 'vektorrechnung',
    concept:
      'Vektoren beschreiben Verschiebungen im Raum – sie haben eine Richtung und eine Länge, aber keinen festen Startpunkt. Der Verbindungsvektor $\\overrightarrow{AB}$ zeigt von $A$ nach $B$ und ergibt sich als $B - A$. Mit dem Skalarprodukt berechnest du Winkel zwischen Vektoren und prüfst Orthogonalität.',
    formula: {
      notation: '$$\\vec{v} = \\begin{pmatrix} v_1 \\\\ v_2 \\\\ v_3 \\end{pmatrix}$$',
      parameters: [
        { symbol: '$|\\vec{v}| = \\sqrt{v_1^2 + v_2^2 + v_3^2}$', description: 'Betrag (Länge) des Vektors' },
        { symbol: '$\\overrightarrow{AB} = B - A$', description: 'Verbindungsvektor von $A$ nach $B$' },
        { symbol: '$\\vec{v} \\cdot \\vec{w} = v_1 w_1 + v_2 w_2 + v_3 w_3$', description: 'Skalarprodukt' },
        { symbol: '$\\cos \\alpha = \\dfrac{\\vec{v} \\cdot \\vec{w}}{|\\vec{v}| \\cdot |\\vec{w}|}$', description: 'Winkel zwischen $\\vec{v}$ und $\\vec{w}$' },
        { symbol: '$\\vec{v} \\cdot \\vec{w} = 0 \\iff \\vec{v} \\perp \\vec{w}$', description: 'Orthogonalitätsbedingung' },
      ],
    },
    example: {
      question: 'Gegeben: $A(1\\mid 2\\mid 3)$ und $B(4\\mid 0\\mid 1)$. Berechne $\\overrightarrow{AB}$, $|\\overrightarrow{AB}|$ und den Mittelpunkt $M$.',
      steps: [
        {
          instruction: 'Verbindungsvektor $\\overrightarrow{AB}$ berechnen',
          calculation: '$\\overrightarrow{AB} = B - A = \\begin{pmatrix} 4-1 \\\\ 0-2 \\\\ 1-3 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -2 \\\\ -2 \\end{pmatrix}$',
          result: '$\\overrightarrow{AB} = (3,\\; {-2},\\; {-2})$',
        },
        {
          instruction: 'Betrag $|\\overrightarrow{AB}|$ berechnen',
          calculation: '$|\\overrightarrow{AB}| = \\sqrt{3^2 + (-2)^2 + (-2)^2} = \\sqrt{9 + 4 + 4} = \\sqrt{17}$',
          result: '$|\\overrightarrow{AB}| = \\sqrt{17} \\approx 4{,}12$',
        },
        {
          instruction: 'Mittelpunkt $M$ bestimmen',
          calculation: '$M = A + \\tfrac{1}{2} \\cdot \\overrightarrow{AB} = \\begin{pmatrix} 1+1{,}5 \\\\ 2-1 \\\\ 3-1 \\end{pmatrix}$',
          result: '$M(2{,}5 \\mid 1 \\mid 2)$',
        },
      ],
    },
    merkhilfe: [
      '$\\overrightarrow{AB} = B - A$ (nicht $A - B$!) – der Vektor zeigt vom Startpunkt zum Zielpunkt.',
      'Skalarprodukt $= 0$ bedeutet genau: die Vektoren stehen senkrecht aufeinander.',
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
