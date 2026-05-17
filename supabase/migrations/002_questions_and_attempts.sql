-- ---------------------------------------------------------------------------
-- 002_questions_and_attempts.sql
-- Creates the questions table, seeds all 240 math questions,
-- and creates the user_attempts table with RLS.
-- ---------------------------------------------------------------------------

-- ── Questions ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS questions (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  subject         TEXT        NOT NULL,
  topic           TEXT        NOT NULL,
  subtopic        TEXT        NOT NULL,
  title           TEXT        NOT NULL DEFAULT '',
  text            TEXT        NOT NULL,
  difficulty      TEXT        NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
  max_points      INTEGER     NOT NULL,
  erwartungshorizont TEXT     NOT NULL DEFAULT '',
  locked          BOOLEAN     NOT NULL DEFAULT false,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  source          TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "questions_read_all" ON questions;
CREATE POLICY "questions_read_all" ON questions
  FOR SELECT USING (true);

-- ── Seed: real questions ─────────────────────────────────────────────────────

INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, erwartungshorizont, locked, sort_order) VALUES

-- Analysis › Differentialrechnung
('math','analysis','Differentialrechnung','easy',5,
$q$Gegeben ist die Funktion f mit f(x) = x³ − 3x² + 2 für x ∈ ℝ.

(a) Bestimmen Sie die erste Ableitung f′(x).
(b) Berechnen Sie die Nullstellen von f′(x).
(c) Untersuchen Sie mithilfe der zweiten Ableitung, ob es sich bei den gefundenen Stellen um lokale Extrempunkte handelt, und geben Sie deren Koordinaten an.$q$,
$q$f′(x) = 3x² − 6x = 3x(x − 2). Nullstellen: x₁ = 0, x₂ = 2.
f′′(x) = 6x − 6.
f′′(0) = −6 < 0 → lokales Maximum: HP(0 | 2).
f′′(2) = 6 > 0 → lokales Minimum: TP(2 | −2).
[1 Pkt f′, 1 Pkt Nullstellen, 1 Pkt f′′, 2 Pkt Extrempunkte mit Koordinaten]$q$,
false, 1),

('math','analysis','Differentialrechnung','medium',8,
$q$Gegeben ist die Funktion f mit f(x) = 2x · e^(−x) für x ∈ ℝ.

(a) Bestimmen Sie f′(x) und f′′(x). (Produktregel)
(b) Ermitteln Sie alle lokalen Extrempunkte und Wendepunkte von f.
(c) Untersuchen Sie das Grenzwertverhalten: lim(x→+∞) f(x) und lim(x→−∞) f(x).
(d) Skizzieren Sie den Graphen von f und beschriften Sie Extrempunkte und Wendepunkt.$q$,
$q$f′(x) = 2e^(−x) − 2x·e^(−x) = 2e^(−x)(1 − x).
f′′(x) = −2e^(−x)(1 − x) + 2e^(−x)(−1) = 2e^(−x)(x − 2).
Extrempunkt: f′(x)=0 → x=1 → HP(1 | 2/e ≈ 0,74). f′′(1)=−2/e<0 → Maximum.
Wendepunkt: f′′(x)=0 → x=2 → W(2 | 4/e² ≈ 0,54).
lim(x→+∞) = 0 (e^(−x) dominiert), lim(x→−∞) = −∞.
[2 Pkt Ableitungen, 2 Pkt Extrempunkt, 2 Pkt Wendepunkt, 1 Pkt Grenzwerte, 1 Pkt Skizze]$q$,
false, 2),

-- Analysis › Integralrechnung
('math','analysis','Integralrechnung','easy',4,
$q$Berechnen Sie das folgende bestimmte Integral:

∫₁³ (2x² − 4x + 3) dx

Geben Sie den vollständigen Rechenweg an.$q$,
$q$Stammfunktion F(x) = (2/3)x³ − 2x² + 3x.
F(3) = 18 − 18 + 9 = 9.
F(1) = 2/3 − 2 + 3 = 5/3.
Integral = 9 − 5/3 = 22/3 ≈ 7,33.
[1 Pkt Stammfunktion, 1 Pkt Einsetzen der Grenzen, 1 Pkt Differenz, 1 Pkt korrektes Ergebnis]$q$,
false, 1),

('math','analysis','Integralrechnung','medium',7,
$q$Die Parabel p mit p(x) = −x² + 4 und die x-Achse begrenzen eine Fläche A.

(a) Bestimmen Sie die Schnittpunkte der Parabel mit der x-Achse.
(b) Berechnen Sie den Flächeninhalt von A.
(c) Bestimmen Sie die x-Koordinate c mit 0 < c < 2, sodass die Linie x = c die Fläche A in zwei gleich große Teile teilt. Runden Sie auf zwei Dezimalstellen.$q$,
$q$(a) −x²+4=0 → x=±2. Schnittpunkte: (−2|0), (2|0).
(b) A = ∫₋₂² (−x²+4) dx = [−x³/3 + 4x]₋₂² = (−8/3+8) − (8/3−8) = 32/3 ≈ 10,67.
(c) ∫₋₂^c (−x²+4) dx = 16/3 → −c³/3+4c = 8 → c ≈ 0,57 (numerisch/GTR).
[1 Pkt Schnittpunkte, 2 Pkt Integral, 1 Pkt Fläche, 2 Pkt Gleichung+Lösung, 1 Pkt c]$q$,
false, 2),

-- Stochastik › Binomialverteilung
('math','stochastik','Binomialverteilung','easy',6,
$q$Eine faire Münze wird 12 Mal geworfen. Die Zufallsvariable X gibt die Anzahl der Ergebnisse „Kopf" an.

(a) Geben Sie die Verteilung von X an (Parameter der Binomialverteilung).
(b) Berechnen Sie P(X = 6).
(c) Berechnen Sie P(X ≥ 9).
(d) Berechnen Sie P(3 ≤ X ≤ 7).$q$,
$q$X ~ B(12; 0,5).
(b) P(X=6) = C(12,6)·(0,5)^12 = 924/4096 ≈ 0,2256.
(c) P(X≥9) = P(9)+P(10)+P(11)+P(12) ≈ 0,073.
(d) P(3≤X≤7) ≈ 0,854 (Tabellenwerte akzeptiert).
[1 Pkt Parameter, 1 Pkt (b), 2 Pkt (c), 2 Pkt (d)]$q$,
false, 1),

('math','stochastik','Binomialverteilung','medium',8,
$q$Bei der Qualitätskontrolle sind erfahrungsgemäß 5 % aller Bauteile defekt. Eine Stichprobe von 20 Bauteilen wird entnommen. X sei die Anzahl defekter Bauteile.

(a) Berechnen Sie P(X = 2).
(b) Berechnen Sie P(X ≤ 3).
(c) Ab welcher Anzahl k defekter Bauteile würde man die Lieferung zurückweisen, wenn man eine Irrtumswahrscheinlichkeit von höchstens 5 % akzeptiert? (Einseitiger Test)
(d) Der Hersteller behauptet, die Defektrate sei auf 3 % gesunken. Berechnen Sie P(X ≤ 3) unter dieser neuen Annahme und vergleichen Sie.$q$,
$q$X ~ B(20; 0,05).
(a) P(X=2) = C(20,2)·(0,05)²·(0,95)^18 ≈ 0,1887.
(b) P(X≤3) ≈ 0,984.
(c) P(X≥4) ≈ 0,0159 < 0,05, P(X≥3) ≈ 0,0755 > 0,05 → ab k=4 zurückweisen.
(d) X~B(20;0,03): P(X≤3)≈0,9994. Lieferung würde fast nie abgelehnt.
[2 Pkt (a), 2 Pkt (b), 2 Pkt (c), 2 Pkt (d)]$q$,
false, 2),

-- Stochastik › Erwartungswert
('math','stochastik','Erwartungswert','easy',5,
$q$Beim Würfelspiel zahlt man 2 € Einsatz. Nach dem Wurf eines fairen Würfels gilt:
– Bei einer 6 erhält man 10 €.
– Bei einer 5 erhält man 4 €.
– Sonst erhält man nichts.

(a) Stellen Sie die Wahrscheinlichkeitsverteilung des Gewinns G (Auszahlung minus Einsatz) auf.
(b) Berechnen Sie den Erwartungswert E(G).
(c) Beurteilen Sie, ob das Spiel langfristig fair, vorteilhaft oder nachteilig für den Spieler ist.$q$,
$q$Gewinne: G = 8 mit P=1/6, G = 2 mit P=1/6, G = −2 mit P=4/6.
E(G) = 8·(1/6) + 2·(1/6) + (−2)·(4/6) = 2/6 = 1/3 ≈ 0,33 €.
Da E(G) > 0 ist das Spiel langfristig vorteilhaft für den Spieler.
[1 Pkt Verteilung, 2 Pkt Berechnung E(G), 1 Pkt Ergebnis, 1 Pkt Beurteilung]$q$,
false, 1),

('math','stochastik','Erwartungswert','medium',6,
$q$Die Zufallsvariable X ist binomialverteilt mit den Parametern n = 30 und p = 0,4.

(a) Berechnen Sie den Erwartungswert μ = E(X) und die Standardabweichung σ.
(b) Geben Sie das Intervall [μ − σ, μ + σ] an und runden Sie auf zwei Dezimalstellen.
(c) Berechnen Sie P(μ − σ ≤ X ≤ μ + σ) mithilfe eines Hilfsmittels und interpretieren Sie das Ergebnis.$q$,
$q$μ = n·p = 30·0,4 = 12. σ = √(n·p·q) = √(30·0,4·0,6) = √7,2 ≈ 2,68.
Intervall: [9,32; 14,68] → ganzzahlig [10; 14].
P(10 ≤ X ≤ 14) ≈ 0,70 (ca. 70 %).
Ca. 70 % aller Versuche liefern einen Wert in [10;14] — typisches Streuungsintervall.
[1 Pkt μ, 1 Pkt σ, 1 Pkt Intervall, 2 Pkt Wahrscheinlichkeit, 1 Pkt Interpretation]$q$,
false, 2),

-- Geometrie › Vektoren
('math','geometrie','Vektoren','easy',5,
$q$Gegeben sind die Punkte A(2 | 1 | 3), B(5 | 4 | 1) und C(3 | −1 | 2).

(a) Berechnen Sie den Vektor AB⃗ und den Betrag |AB⃗|. Runden Sie auf zwei Dezimalstellen.
(b) Bestimmen Sie den Mittelpunkt M der Strecke AB.
(c) Überprüfen Sie, ob das Dreieck ABC gleichschenklig ist, indem Sie alle drei Seitenlängen berechnen.$q$,
$q$AB⃗ = (3, 3, −2). |AB⃗| = √(9+9+4) = √22 ≈ 4,69.
M = (3,5; 2,5; 2).
AC⃗: |AC⃗| = √6 ≈ 2,45. BC⃗: |BC⃗| = √30 ≈ 5,48.
Alle drei Seiten verschieden → nicht gleichschenklig.
[1 Pkt AB⃗, 1 Pkt |AB⃗|, 1 Pkt Mittelpunkt, 2 Pkt Seitenlängen+Schlussfolgerung]$q$,
false, 1),

('math','geometrie','Vektoren','medium',6,
$q$Gegeben sind die Vektoren u⃗ = (2, −1, 3) und v⃗ = (1, 4, 1).

(a) Berechnen Sie das Skalarprodukt u⃗ · v⃗ und prüfen Sie, ob die Vektoren orthogonal sind.
(b) Berechnen Sie den Winkel α zwischen u⃗ und v⃗. Runden Sie auf eine Dezimalstelle.
(c) Bestimmen Sie alle Vektoren w⃗ = (a, 1, 0), die zu u⃗ orthogonal sind.$q$,
$q$u⃗·v⃗ = 2·1 + (−1)·4 + 3·1 = 1 ≠ 0 → nicht orthogonal.
cos α = 1 / (√14 · √18) = 1/√252 ≈ 0,063 → α ≈ 86,4°.
u⃗·w⃗ = 0: 2a − 1 = 0 → a = 0,5. Also w⃗ = (0,5; 1; 0).
[1 Pkt Skalarprodukt, 1 Pkt Orthogonalität, 2 Pkt Winkel, 2 Pkt w⃗]$q$,
false, 2);

-- ── Seed: locked placeholder questions ───────────────────────────────────────

-- Analysis › Differentialrechnung (18 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','analysis','Differentialrechnung','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,18) AS i;

-- Analysis › Integralrechnung (18 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','analysis','Integralrechnung','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,18) AS i;

-- Analysis › Kurvendiskussion (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','analysis','Kurvendiskussion','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- Analysis › Exponential- & Logarithmusfunktionen (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','analysis','Exponential- & Logarithmusfunktionen','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- Stochastik › Binomialverteilung (18 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','stochastik','Binomialverteilung','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,18) AS i;

-- Stochastik › Erwartungswert (18 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','stochastik','Erwartungswert','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,18) AS i;

-- Stochastik › Normalverteilung (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','stochastik','Normalverteilung','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- Stochastik › Hypothesentests (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','stochastik','Hypothesentests','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- Geometrie › Vektoren (18 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','geometrie','Vektoren','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,18) AS i;

-- Geometrie › Geraden & Ebenen (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','geometrie','Geraden & Ebenen','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- Geometrie › Abstände & Winkel (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','geometrie','Abstände & Winkel','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- Geometrie › Koordinatensysteme (20 locked)
INSERT INTO questions (subject, topic, subtopic, difficulty, max_points, text, locked, sort_order)
SELECT 'math','geometrie','Koordinatensysteme','medium',5,
       'Diese Aufgabe wird bald freigeschaltet.',
       true, 100 + i
FROM generate_series(1,20) AS i;

-- ── User attempts ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_attempts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id  UUID        NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  score        INTEGER     NOT NULL,
  max_score    INTEGER     NOT NULL,
  ai_feedback  TEXT,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attempts_select_own" ON user_attempts;
DROP POLICY IF EXISTS "attempts_insert_own" ON user_attempts;
DROP POLICY IF EXISTS "attempts_delete_own" ON user_attempts;

CREATE POLICY "attempts_select_own" ON user_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "attempts_insert_own" ON user_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attempts_delete_own" ON user_attempts
  FOR DELETE USING (auth.uid() = user_id);
