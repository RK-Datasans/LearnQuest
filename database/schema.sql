-- LearnQuest AI Database Schema
-- Compatible with MySQL 8.0, XAMPP, and phpMyAdmin
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci

CREATE DATABASE IF NOT EXISTS `learnquest` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `learnquest`;

-- 1. DROP EXISTING TABLES IN REVERSE DEPENDENCY ORDER
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `ai_recommendations`;
DROP TABLE IF EXISTS `student_goals`;
DROP TABLE IF EXISTS `xp_events`;
DROP TABLE IF EXISTS `student_badges`;
DROP TABLE IF EXISTS `badges`;
DROP TABLE IF EXISTS `quiz_attempts`;
DROP TABLE IF EXISTS `quests`;
DROP TABLE IF EXISTS `student_ocean_archetypes`;
DROP TABLE IF EXISTS `ocean_archetypes`;
DROP TABLE IF EXISTS `ocean_profiles`;
DROP TABLE IF EXISTS `dynamic_learning_profiles`;
DROP TABLE IF EXISTS `mfc_responses`;
DROP TABLE IF EXISTS `mfc_assessments`;
DROP TABLE IF EXISTS `mfc_options`;
DROP TABLE IF EXISTS `mfc_questions`;
DROP TABLE IF EXISTS `mfc_dimensions`;
DROP TABLE IF EXISTS `topic_mastery`;
DROP TABLE IF EXISTS `student_courses`;
DROP TABLE IF EXISTS `course_topics`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `student_profiles`;
DROP TABLE IF EXISTS `programs`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `users`;

-- 2. USERS TABLE
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. DEPARTMENTS TABLE
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PROGRAMS TABLE
CREATE TABLE `programs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_id` INT NOT NULL,
  `degree` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `code` VARCHAR(30) NOT NULL UNIQUE,
  `total_semesters` INT DEFAULT 8,
  `total_credits` INT DEFAULT 160,
  INDEX `idx_programs_dept` (`department_id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. STUDENT PROFILES TABLE
CREATE TABLE `student_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL UNIQUE,
  `student_id` VARCHAR(50) NOT NULL UNIQUE,
  `program_id` INT NOT NULL,
  `specialization` VARCHAR(100) DEFAULT NULL,
  `academic_year` INT DEFAULT 2026,
  `year_of_study` INT DEFAULT 1,
  `current_semester` INT DEFAULT 1,
  `cgpa` DECIMAL(3,2) DEFAULT 0.00,
  `credits_completed` INT DEFAULT 0,
  `expected_graduation_year` INT DEFAULT 2028,
  `career_goal` VARCHAR(150) DEFAULT 'Software Engineer',
  `interests` VARCHAR(255) DEFAULT 'AI, Backend, Cloud',
  `weekly_learning_hours` INT DEFAULT 8,
  `current_streak` INT DEFAULT 0,
  `total_xp` INT DEFAULT 0,
  `level` INT DEFAULT 1,
  `academic_health_score` INT DEFAULT 70,
  `is_synthetic` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_sp_program` (`program_id`),
  INDEX `idx_sp_year_sem` (`year_of_study`, `current_semester`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COURSES TABLE
CREATE TABLE `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `program_id` INT NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `credits` INT DEFAULT 3,
  `semester` INT DEFAULT 1,
  INDEX `idx_courses_program_sem` (`program_id`, `semester`),
  FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. COURSE TOPICS TABLE
CREATE TABLE `course_topics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `order_index` INT DEFAULT 1,
  `difficulty_level` VARCHAR(20) DEFAULT 'Medium',
  INDEX `idx_topics_course` (`course_id`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. STUDENT COURSES TABLE
CREATE TABLE `student_courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `semester` INT DEFAULT 1,
  `score` DECIMAL(5,2) DEFAULT 75.00,
  `grade` VARCHAR(5) DEFAULT 'B',
  `status` ENUM('enrolled', 'completed') DEFAULT 'enrolled',
  INDEX `idx_sc_student` (`student_id`),
  INDEX `idx_sc_course` (`course_id`),
  UNIQUE KEY `unique_student_course` (`student_id`, `course_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TOPIC MASTERY TABLE
CREATE TABLE `topic_mastery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `topic_id` INT NOT NULL,
  `mastery_score` INT DEFAULT 50,
  `attempts_count` INT DEFAULT 0,
  `last_assessed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_tm_student` (`student_id`),
  INDEX `idx_tm_topic` (`topic_id`),
  UNIQUE KEY `unique_student_topic` (`student_id`, `topic_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`topic_id`) REFERENCES `course_topics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. MFC DIMENSIONS TABLE
CREATE TABLE `mfc_dimensions` (
  `code` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `left_label` VARCHAR(100) NOT NULL,
  `right_label` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. MFC QUESTIONS TABLE
CREATE TABLE `mfc_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dimension_code` VARCHAR(50) NOT NULL,
  `scenario_context` TEXT NOT NULL,
  `question_text` TEXT NOT NULL,
  `order_index` INT DEFAULT 1,
  INDEX `idx_mq_dim` (`dimension_code`),
  FOREIGN KEY (`dimension_code`) REFERENCES `mfc_dimensions`(`code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. MFC OPTIONS TABLE
CREATE TABLE `mfc_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question_id` INT NOT NULL,
  `option_label` VARCHAR(5) NOT NULL,
  `option_text` TEXT NOT NULL,
  `weight` INT DEFAULT 1,
  `style_indicator` VARCHAR(50) NOT NULL,
  INDEX `idx_mo_question` (`question_id`),
  FOREIGN KEY (`question_id`) REFERENCES `mfc_questions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. MFC ASSESSMENTS TABLE
CREATE TABLE `mfc_assessments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `summary_notes` TEXT,
  INDEX `idx_mfc_ass_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. MFC RESPONSES TABLE
CREATE TABLE `mfc_responses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assessment_id` INT NOT NULL,
  `question_id` INT NOT NULL,
  `selected_option_id` INT NOT NULL,
  `recorded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_mr_assessment` (`assessment_id`),
  FOREIGN KEY (`assessment_id`) REFERENCES `mfc_assessments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`question_id`) REFERENCES `mfc_questions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`selected_option_id`) REFERENCES `mfc_options`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. DYNAMIC LEARNING PROFILES TABLE
CREATE TABLE `dynamic_learning_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL UNIQUE,
  `worked_examples_score` INT DEFAULT 75,
  `practice_first_score` INT DEFAULT 50,
  `guided_learning_score` INT DEFAULT 70,
  `visual_structure_score` INT DEFAULT 65,
  `reflection_score` INT DEFAULT 80,
  `challenge_score` INT DEFAULT 65,
  `session_structure_score` INT DEFAULT 70,
  `collaboration_score` INT DEFAULT 55,
  `confidence_score` INT DEFAULT 85,
  `recent_behavior_evidence` TEXT,
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. OCEAN PROFILES TABLE (Big Five Trait Scores: 0-100 normalized)
CREATE TABLE `ocean_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL UNIQUE,
  `openness` INT NOT NULL DEFAULT 50,
  `conscientiousness` INT NOT NULL DEFAULT 50,
  `extraversion` INT NOT NULL DEFAULT 50,
  `agreeableness` INT NOT NULL DEFAULT 50,
  `neuroticism` INT NOT NULL DEFAULT 50,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_op_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. OCEAN ARCHETYPES CATALOG TABLE
CREATE TABLE `ocean_archetypes` (
  `code` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `primary_traits` VARCHAR(100) NOT NULL,
  `learning_tendency` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. STUDENT OCEAN ARCHETYPES TABLE
CREATE TABLE `student_ocean_archetypes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL UNIQUE,
  `primary_archetype_code` VARCHAR(50) NOT NULL,
  `secondary_archetype_code` VARCHAR(50) DEFAULT NULL,
  `supporting_evidence` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_soa_student` (`student_id`),
  INDEX `idx_soa_primary` (`primary_archetype_code`),
  INDEX `idx_soa_secondary` (`secondary_archetype_code`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`primary_archetype_code`) REFERENCES `ocean_archetypes`(`code`) ON DELETE CASCADE,
  FOREIGN KEY (`secondary_archetype_code`) REFERENCES `ocean_archetypes`(`code`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. QUESTS TABLE
CREATE TABLE `quests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `topic_id` INT DEFAULT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `difficulty` VARCHAR(20) DEFAULT 'Medium',
  `current_stage` INT DEFAULT 1,
  `total_stages` INT DEFAULT 6,
  `progress_pct` INT DEFAULT 0,
  `reward_xp` INT DEFAULT 150,
  `status` ENUM('available', 'active', 'completed') DEFAULT 'active',
  `stages_data` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_quests_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. QUIZ ATTEMPTS TABLE
CREATE TABLE `quiz_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `quest_id` INT DEFAULT NULL,
  `topic_id` INT NOT NULL,
  `question_text` TEXT NOT NULL,
  `options_json` JSON NOT NULL,
  `selected_answer` VARCHAR(10) NOT NULL,
  `correct_answer` VARCHAR(10) NOT NULL,
  `is_correct` BOOLEAN NOT NULL,
  `difficulty` VARCHAR(20) DEFAULT 'Medium',
  `misconception_detected` VARCHAR(255) DEFAULT NULL,
  `feedback_text` TEXT,
  `xp_earned` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_qa_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`topic_id`) REFERENCES `course_topics`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. BADGES TABLE
CREATE TABLE `badges` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(50) DEFAULT 'Award',
  `category` VARCHAR(50) DEFAULT 'Academic'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. STUDENT BADGES TABLE
CREATE TABLE `student_badges` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `badge_id` INT NOT NULL,
  `unlocked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_student_badge` (`student_id`, `badge_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. XP EVENTS TABLE
CREATE TABLE `xp_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `amount` INT NOT NULL,
  `source_type` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_xp_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. STUDENT GOALS TABLE
CREATE TABLE `student_goals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `target_date` DATE DEFAULT NULL,
  `status` ENUM('pending', 'in_progress', 'completed') DEFAULT 'in_progress',
  `progress_pct` INT DEFAULT 0,
  INDEX `idx_goals_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. AI RECOMMENDATIONS TABLE
CREATE TABLE `ai_recommendations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `recommendation_type` VARCHAR(50) DEFAULT 'topic_mastery',
  `title` VARCHAR(150) NOT NULL,
  `priority` VARCHAR(20) DEFAULT 'High',
  `reason` TEXT NOT NULL,
  `evidence_json` JSON DEFAULT NULL,
  `strategy_json` JSON DEFAULT NULL,
  `weekly_plan_json` JSON DEFAULT NULL,
  `career_connection` TEXT,
  `status` ENUM('active', 'completed', 'dismissed') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_rec_student` (`student_id`),
  FOREIGN KEY (`student_id`) REFERENCES `student_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. SESSIONS TABLE
CREATE TABLE `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_sessions_token` (`token`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
