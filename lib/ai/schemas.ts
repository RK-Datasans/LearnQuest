import { z } from 'zod';

export const AIRecommendationSchema = z.object({
  academic_status: z.string(),
  next_priority: z.object({
    type: z.string(),
    title: z.string(),
    priority: z.enum(['High', 'Medium', 'Low']),
    reason: z.string(),
    evidence: z.array(z.string()),
  }),
  learning_strategy: z.object({
    approach: z.string(),
    why: z.string(),
  }),
  weekly_plan: z.array(
    z.object({
      day: z.string(),
      action: z.string(),
      estimated_minutes: z.number(),
    })
  ),
  career_connection: z.string(),
  risks_or_tradeoffs: z.array(z.string()),
  next_action: z.string(),
});

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correct_answer: z.string(),
  explanation: z.string(),
  difficulty: z.string(),
  concept: z.string(),
});

export const QuizEvaluationSchema = z.object({
  correct: z.boolean(),
  feedback: z.string(),
  misconception: z.string().nullable(),
  recommended_difficulty: z.string(),
  next_action: z.string(),
  remediation_example: z.string().optional(),
});

export const FacultyInsightSchema = z.object({
  insight: z.string(),
  evidence: z.array(z.string()),
  affected_group: z.string(),
  suggested_intervention: z.string(),
  expected_outcome: z.string(),
});

export type AIRecommendationResponse = z.infer<typeof AIRecommendationSchema>;
export type QuizQuestionResponse = z.infer<typeof QuizQuestionSchema>;
export type QuizEvaluationResponse = z.infer<typeof QuizEvaluationSchema>;
export type FacultyInsightResponse = z.infer<typeof FacultyInsightSchema>;
