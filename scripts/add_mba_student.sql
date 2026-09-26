-- ============================================================
-- SQL Seed: Ananya Rao (Demo Student - MBA Technology Management)
-- ============================================================

-- 1. Insert User (ID 44)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar_url`)
VALUES (
  44,
  'Ananya Rao',
  'mba@learnquest.local',
  '$2a$10$og6gTEi9yr2UeIBfb/SLFuMA28/qqcQcSu8lRZUNbuKE0LIU9J/TC',
  'student',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Insert Student Profile (ID 43)
INSERT INTO `student_profiles` (
  `id`, `user_id`, `student_id`, `program_id`, `specialization`,
  `academic_year`, `year_of_study`, `current_semester`, `cgpa`,
  `credits_completed`, `expected_graduation_year`, `career_goal`,
  `interests`, `weekly_learning_hours`, `current_streak`, `total_xp`,
  `level`, `academic_health_score`, `is_synthetic`
)
VALUES (
  43,
  44,
  'STU-2026-MBA-401',
  6, -- MBA Technology Management
  'Product Strategy & Business Analytics',
  '2025-2026',
  2,
  3,
  3.74,
  52,
  2027,
  'Technical Product Manager',
  'SaaS Metrics, Unit Economics, Go-To-Market Strategy, Product Discovery, Agile Leadership',
  14,
  6,
  820,
  3,
  76.00,
  0
)
ON DUPLICATE KEY UPDATE
  `career_goal` = VALUES(`career_goal`),
  `academic_health_score` = VALUES(`academic_health_score`);

-- 3. Additional Topics for MBA & BBA Courses
INSERT INTO `course_topics` (`id`, `course_id`, `name`) VALUES
(13, 19, 'Unit Economics, LTV/CAC & Go-To-Market'),
(14, 19, 'Product-Market Fit & Customer Discovery Archetypes'),
(15, 20, 'Technology Commercialization & S-Curves'),
(16, 14, 'Financial Modeling, DCF & Valuation'),
(17, 13, 'Executive Dashboards & Business Metrics')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. Enroll Ananya in MBA Courses
INSERT INTO `student_courses` (`student_id`, `course_id`, `score`, `grade`, `status`) VALUES
(43, 19, 64.00, 'B-', 'enrolled'), -- Strategic Product Management (Deficit Course!)
(43, 20, 84.50, 'A',  'enrolled'), -- Technology Commercialization
(43, 13, 79.00, 'B+', 'enrolled'), -- Business Intelligence
(43, 14, 72.00, 'B',  'enrolled')  -- Financial Modeling
ON DUPLICATE KEY UPDATE `score` = VALUES(`score`), `grade` = VALUES(`grade`);

-- 5. Topic Mastery for Ananya
INSERT INTO `topic_mastery` (`student_id`, `topic_id`, `mastery_score`, `attempts_count`, `last_assessed_at`) VALUES
(43, 13, 48, 5, NOW()), -- Unit Economics (Primary Deficit!)
(43, 14, 62, 3, NOW()), -- Customer Discovery
(43, 15, 88, 7, NOW()), -- Tech Commercialization
(43, 16, 70, 4, NOW()), -- Financial Modeling
(43, 17, 82, 6, NOW())  -- Executive Dashboards
ON DUPLICATE KEY UPDATE `mastery_score` = VALUES(`mastery_score`);

-- 6. Dynamic Learning Profile (MFC) for Ananya
INSERT INTO `dynamic_learning_profiles` (
  `student_id`, `worked_examples_score`, `practice_first_score`,
  `guided_learning_score`, `visual_structure_score`, `reflection_score`,
  `challenge_score`, `session_structure_score`, `collaboration_score`,
  `confidence_score`, `recent_behavior_evidence`
)
VALUES (
  43,
  78, 46,
  75, 80, 84,
  62, 70, 88,
  85,
  'Demonstrates strong preference for case-study worked examples, collaborative synthesis, and structured business reflection.'
)
ON DUPLICATE KEY UPDATE
  `worked_examples_score` = VALUES(`worked_examples_score`),
  `collaboration_score` = VALUES(`collaboration_score`);

-- 7. OCEAN Personality Profile for Ananya
-- High Openness (74), High Conscientiousness (78), High Extraversion (84), High Agreeableness (76), Low Neuroticism (32)
INSERT INTO `ocean_profiles` (
  `student_id`, `openness`, `conscientiousness`, `extraversion`, `agreeableness`, `neuroticism`
)
VALUES (
  43,
  74, 78, 84, 76, 32
)
ON DUPLICATE KEY UPDATE
  `openness` = VALUES(`openness`),
  `extraversion` = VALUES(`extraversion`);

-- 8. Archetype Classification: Team Driver (High Extraversion + High Conscientiousness)
INSERT INTO `student_ocean_archetypes` (
  `student_id`, `primary_archetype_code`, `secondary_archetype_code`,
  `supporting_evidence`
)
VALUES (
  43,
  'team_driver',
  'connector',
  'High Extraversion (84) combined with High Conscientiousness (78) drives cross-functional team leadership. Demonstrates natural inclination to organize product sprint roadmaps and align cross-functional teams.'
)
ON DUPLICATE KEY UPDATE
  `primary_archetype_code` = VALUES(`primary_archetype_code`);

-- 9. Active Quest for Ananya: "Master Unit Economics & LTV/CAC"
INSERT INTO `quests` (
  `id`, `student_id`, `course_id`, `topic_id`, `title`,
  `description`, `difficulty`, `current_stage`, `total_stages`,
  `progress_pct`, `reward_xp`, `status`, `stages_data`
)
VALUES (
  3,
  43,
  19, -- Strategic Product Management
  13, -- Unit Economics
  'Master Unit Economics & LTV/CAC',
  'Deconstruct SaaS business models, master customer acquisition cost payback, and conquer customer lifetime value formulas in a structured case-study journey.',
  'Medium',
  4,
  6,
  60,
  150,
  'active',
  '[{"id":1,"name":"Warm-up","description":"SaaS Funnel Foundations: Churn, Retention, and Burn Rate traps.","status":"completed","xp":20},{"id":2,"name":"Personalized Explanation","description":"Dissecting LTV, Gross-Margin adjusted CAC, and Payback Period.","status":"completed","xp":25},{"id":3,"name":"Worked Example","description":"Step-by-step resolution of a B2B SaaS cohort retention model.","status":"completed","xp":30},{"id":4,"name":"Practice Quiz","description":"Diagnose blended CAC vs paid CAC and cohort churn rates.","status":"active","xp":35},{"id":5,"name":"Challenge","description":"Multi-tier pricing expansion and Net Revenue Retention (NRR) traps.","status":"locked","xp":40},{"id":6,"name":"Boss Battle","description":"Venture Investment Pitch Simulation to earn the Executive Product Leader badge!","status":"locked","xp":100}]'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`);

-- 10. AI Recommendation for Ananya
INSERT INTO `ai_recommendations` (
  `student_id`, `recommendation_type`, `title`, `priority`, `reason`,
  `evidence_json`, `strategy_json`, `weekly_plan_json`, `career_connection`, `status`
)
VALUES (
  43,
  'topic_mastery',
  'Bridge Unit Economics & LTV/CAC Deficit',
  'High',
  'Strategic Product Management score of 64% is 15 points below your other courses. "Unit Economics, LTV/CAC" is currently at 48% mastery — a vital topic for technical product management recruiting and roadmap justification.',
  '["Strategic Product Management score (64%) indicates vulnerability in quantitative business models.", "Topic mastery for Unit Economics is 48% — the lowest in your MBA profile.", "Directly required for Technical Product Manager job competencies per O*NET 15-1299.09.", "Your Team Driver archetype excels when combining quantitative metrics with group presentation deliverables."]',
  '{"approach":"Case-Study-First with Cohort Decomposition", "why":"Your observed profile demonstrates high retention when business scenarios are deconstructed through worked spreadsheets before independent calculation."}',
  '[{"day":"Monday","action":"SaaS Metrics Foundations — Churn, ARPU, and MRR definitions review","estimated_minutes":30},{"day":"Tuesday","action":"Worked Example — Annotated LTV/CAC cohort spreadsheet modeling","estimated_minutes":30},{"day":"Wednesday","action":"Guided Practice — diagnose payback periods in sample startup case studies","estimated_minutes":30},{"day":"Friday","action":"Challenge — analyze Net Revenue Retention (NRR) and expansion loops","estimated_minutes":25},{"day":"Sunday","action":"Boss Battle — Defend SaaS Investment Memo in Adaptive Quest","estimated_minutes":25}]',
  'As an aspiring Technical Product Manager, mastering unit economics ensures you can defend engineering resource investments and compute customer acquisition payback with executive stakeholders.',
  'active'
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `reason` = VALUES(`reason`);

-- 11. Initial Badges & XP for Ananya
INSERT INTO `student_badges` (`student_id`, `badge_id`, `unlocked_at`)
VALUES
  (43, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)), -- First Quest
  (43, 2, DATE_SUB(NOW(), INTERVAL 2 DAY))  -- 3-Day Streak
ON DUPLICATE KEY UPDATE `unlocked_at` = VALUES(`unlocked_at`);

INSERT INTO `xp_events` (`student_id`, `amount`, `source_type`, `description`, `created_at`)
VALUES
  (43, 100, 'quest_stage', 'Completed Warm-up Stage in Unit Economics', DATE_SUB(NOW(), INTERVAL 4 DAY)),
  (43, 125, 'quest_stage', 'Completed Personalized Explanation Stage in Unit Economics', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  (43, 150, 'quest_stage', 'Completed Worked Example in Cohort Modeling', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (43, 50,  'daily_login', 'Daily login streak reward', NOW())
ON DUPLICATE KEY UPDATE `amount` = VALUES(`amount`);
