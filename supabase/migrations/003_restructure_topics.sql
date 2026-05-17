-- ---------------------------------------------------------------------------
-- 003_restructure_topics.sql
-- Restructures math questions to match official Bayern G9 Lehrplan.
-- Deletes all locked placeholder questions.
-- Remaps real question subtopics to new kebab-case IDs.
-- ---------------------------------------------------------------------------

-- 1. Delete all locked placeholder questions
--    (user_attempts referencing them cascade-delete via FK)
DELETE FROM questions
WHERE subject = 'math' AND locked = true;

-- 2. Remap Analysis subtopics
UPDATE questions SET subtopic = 'ganzrationale-funktionen'
WHERE subject = 'math' AND topic = 'analysis' AND subtopic = 'Differentialrechnung';

UPDATE questions SET subtopic = 'integralrechnung'
WHERE subject = 'math' AND topic = 'analysis' AND subtopic = 'Integralrechnung';

-- 3. Remap Stochastik subtopics
UPDATE questions SET subtopic = 'binomialverteilung'
WHERE subject = 'math' AND topic = 'stochastik' AND subtopic = 'Binomialverteilung';

UPDATE questions SET subtopic = 'wahrscheinlichkeit-zufallsgroessen'
WHERE subject = 'math' AND topic = 'stochastik' AND subtopic = 'Erwartungswert';

-- 4. Remap Geometrie → Analytische Geometrie (topic + subtopic)
UPDATE questions
SET topic = 'analytische-geometrie', subtopic = 'vektorrechnung'
WHERE subject = 'math' AND topic = 'geometrie' AND subtopic = 'Vektoren';
