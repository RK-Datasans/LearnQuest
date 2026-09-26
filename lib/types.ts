export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  student_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  program_id: number;
  program_name: string;
  program_code: string;
  degree: string;
  department_id: number;
  department_name: string;
  department_code: string;
  specialization: string;
  academic_year: number;
  year_of_study: number;
  current_semester: number;
  cgpa: number;
  credits_completed: number;
  expected_graduation_year: number;
  career_goal: string;
  interests: string;
  weekly_learning_hours: number;
  current_streak: number;
  total_xp: number;
  level: number;
  academic_health_score: number;
  is_synthetic: boolean;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester: number;
  program_id: number;
}

export interface StudentCourse {
  id: number;
  student_id: number;
  course_id: number;
  code: string;
  name: string;
  credits: number;
  semester: number;
  score: number;
  grade: string;
  status: 'enrolled' | 'completed';
}

export interface CourseTopic {
  id: number;
  course_id: number;
  course_name?: string;
  name: string;
  description: string;
  order_index: number;
  difficulty_level: string;
  mastery_score?: number;
}

export interface TopicMastery {
  id: number;
  student_id: number;
  topic_id: number;
  topic_name: string;
  course_name: string;
  mastery_score: number;
  attempts_count: number;
  last_assessed_at: string;
}

export interface MFCDimension {
  code: string;
  name: string;
  description: string;
  left_label: string;
  right_label: string;
}

export interface MFCOption {
  id: number;
  question_id: number;
  option_label: string;
  option_text: string;
  weight: number;
  style_indicator: string;
}

export interface MFCQuestion {
  id: number;
  dimension_code: string;
  dimension_name?: string;
  scenario_context: string;
  question_text: string;
  order_index: number;
  options: MFCOption[];
}

export interface DynamicLearningProfile {
  id: number;
  student_id: number;
  worked_examples_score: number;
  practice_first_score: number;
  guided_learning_score: number;
  visual_structure_score: number;
  reflection_score: number;
  challenge_score: number;
  session_structure_score: number;
  collaboration_score: number;
  confidence_score: number;
  recent_behavior_evidence: string;
  last_updated: string;
}

export interface QuestStage {
  id: number;
  name: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  xp: number;
}

export interface Quest {
  id: number;
  student_id: number;
  course_id: number;
  course_name?: string;
  course_code?: string;
  topic_id: number;
  topic_name?: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  current_stage: number;
  total_stages: number;
  progress_pct: number;
  reward_xp: number;
  status: 'available' | 'active' | 'completed';
  stages_data: QuestStage[];
}

export interface Badge {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked_at?: string;
}

export interface XPEvent {
  id: number;
  student_id: number;
  amount: number;
  source_type: string;
  description: string;
  created_at: string;
}

export interface WeeklyPlanItem {
  day: string;
  action: string;
  estimated_minutes: number;
}

export interface AIRecommendation {
  id?: number;
  student_id?: number;
  academic_status: string;
  next_priority: {
    type: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    reason: string;
    evidence: string[];
  };
  learning_strategy: {
    approach: string;
    why: string;
  };
  weekly_plan: WeeklyPlanItem[];
  career_connection: string;
  risks_or_tradeoffs: string[];
  next_action: string;
}

export interface FacultyStats {
  total_students: number;
  average_academic_health: number;
  students_improving: number;
  students_needing_attention: number;
  common_topic_gap: string;
  program_distribution: {
    program_name: string;
    program_code: string;
    student_count: number;
  }[];
  course_performance: {
    course_name: string;
    course_code: string;
    average_score: number;
    student_count: number;
  }[];
  topic_gaps: {
    topic_name: string;
    course_name: string;
    average_mastery: number;
    at_risk_count: number;
  }[];
}

export interface FacultyAIInsight {
  insight: string;
  evidence: string[];
  affected_group: string;
  suggested_intervention: string;
  expected_outcome: string;
}

export interface OCEANProfile {
  id: number;
  student_id: number;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  created_at?: string;
  updated_at?: string;
}

export interface OCEANArchetype {
  code: string;
  name: string;
  description: string;
  primary_traits: string;
  learning_tendency: string;
}

export interface StudentOCEANArchetype {
  id: number;
  student_id: number;
  primary_archetype_code: string;
  secondary_archetype_code?: string | null;
  primary_name?: string;
  primary_description?: string;
  secondary_name?: string;
  supporting_evidence: string;
  updated_at?: string;
}

