import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { callAI, safeParseJSON, isDemoMode } from '@/lib/ai/openai';
import { QUIZ_EVALUATE_PROMPT } from '@/lib/ai/prompts';
import { QuizEvaluationSchema } from '@/lib/ai/schemas';
import { getFallbackQuizEvaluation } from '@/lib/ai/fallback';
import { awardXp, unlockBadge, XP_REWARDS } from '@/lib/gamification';
import { z } from 'zod';

const EvaluateSchema = z.object({
  topic_id: z.number(),
  quest_id: z.number().optional(),
  question: z.string(),
  options: z.array(z.string()),
  correct_answer: z.string(),
  selected_answer: z.string(),
  difficulty: z.string().default('Medium'),
  is_boss: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const body = await req.json();
    const { topic_id, quest_id, question, options, correct_answer, selected_answer, difficulty, is_boss } =
      EvaluateSchema.parse(body);

    const [masteryRows, priorMistakes, topicRows] = await Promise.all([
      query<any>('SELECT mastery_score, attempts_count FROM topic_mastery WHERE student_id = ? AND topic_id = ?', [
        profile.id,
        topic_id,
      ]),
      query<any>(
        `SELECT misconception_detected FROM quiz_attempts
         WHERE student_id = ? AND topic_id = ? AND is_correct = 0 AND misconception_detected IS NOT NULL
         ORDER BY created_at DESC LIMIT 5`,
        [profile.id, topic_id]
      ),
      query<any>('SELECT name FROM course_topics WHERE id = ?', [topic_id]),
    ]);

    const topicName = topicRows[0]?.name || 'Database Normalization';
    const currentMastery = masteryRows[0]?.mastery_score || 52;
    const attemptsCount = masteryRows[0]?.attempts_count || 5;

    const context = {
      topic_name: topicName,
      question,
      options,
      correct_answer,
      selected_answer,
      current_difficulty: difficulty,
      prior_misconceptions: priorMistakes.map((m: any) => m.misconception_detected),
    };

    let evaluation: any = null;

    if (!isDemoMode()) {
      const rawResponse = await callAI(QUIZ_EVALUATE_PROMPT(context), 'Evaluate student answer.');
      const parsed = safeParseJSON<any>(rawResponse);
      if (parsed) {
        const v = QuizEvaluationSchema.safeParse(parsed);
        if (v.success) evaluation = v.data;
      }
    }

    if (!evaluation) {
      evaluation = getFallbackQuizEvaluation(context);
    }

    const isCorrect = evaluation.correct;
    let xpEarned = 0;

    if (isCorrect) {
      xpEarned = is_boss
        ? XP_REWARDS.BOSS_BATTLE
        : difficulty === 'Hard'
        ? XP_REWARDS.HARD_QUESTION
        : difficulty === 'Medium'
        ? XP_REWARDS.MEDIUM_QUESTION
        : XP_REWARDS.EASY_QUESTION;
    }

    // Adaptive mastery delta: +10 if correct hard/boss, +7 if correct medium/easy, -4 if incorrect
    const masteryDelta = isCorrect ? (is_boss ? 15 : difficulty === 'Hard' ? 10 : 7) : -4;
    const newMastery = Math.min(100, Math.max(20, currentMastery + masteryDelta));

    // Record quiz attempt
    await execute(
      `INSERT INTO quiz_attempts (student_id, quest_id, topic_id, question_text, options_json, selected_answer, correct_answer, is_correct, difficulty, misconception_detected, feedback_text, xp_earned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id,
        quest_id || null,
        topic_id,
        question,
        JSON.stringify(options),
        selected_answer,
        correct_answer,
        isCorrect ? 1 : 0,
        difficulty,
        evaluation.misconception || null,
        evaluation.feedback,
        xpEarned,
      ]
    );

    // Update topic mastery
    if (masteryRows.length > 0) {
      await execute(
        'UPDATE topic_mastery SET mastery_score = ?, attempts_count = ?, last_assessed_at = NOW() WHERE student_id = ? AND topic_id = ?',
        [newMastery, attemptsCount + 1, profile.id, topic_id]
      );
    } else {
      await execute(
        'INSERT INTO topic_mastery (student_id, topic_id, mastery_score, attempts_count) VALUES (?, ?, ?, 1)',
        [profile.id, topic_id, newMastery]
      );
    }

    // Update academic health score dynamically if mastery increased
    if (isCorrect && newMastery > currentMastery) {
      await execute(
        'UPDATE student_profiles SET academic_health_score = LEAST(100, academic_health_score + 1) WHERE id = ?',
        [profile.id]
      );
    }

    let gamification: any = null;
    let unlockedBadge: any = null;

    if (isCorrect && xpEarned > 0) {
      const xpResult = await awardXp(
        profile.id,
        xpEarned,
        is_boss ? 'boss_battle' : 'quiz_answer',
        is_boss ? 'Boss Battle victory: Defeat Normalization!' : `Solved ${difficulty} question on ${topicName}`
      );
      gamification = xpResult;

      if (is_boss) {
        const br = await unlockBadge(profile.id, 'dependency_hunter');
        if (br.unlocked) unlockedBadge = br.badge;
      } else if (newMastery > 60) {
        const br = await unlockBadge(profile.id, 'concept_recovered');
        if (br.unlocked) unlockedBadge = br.badge;
      }
    }

    return NextResponse.json({
      evaluation,
      is_correct: isCorrect,
      xp_earned: xpEarned,
      mastery_before: currentMastery,
      mastery_after: newMastery,
      gamification,
      unlocked_badge: unlockedBadge,
      demo_mode: isDemoMode(),
    });
  } catch (error) {
    console.error('Quiz evaluate error:', error);
    return NextResponse.json({ error: 'Failed to evaluate answer.' }, { status: 500 });
  }
}
