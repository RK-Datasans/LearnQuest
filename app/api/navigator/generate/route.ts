import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { callAI, safeParseJSON, isDemoMode } from '@/lib/ai/openai';
import { NAVIGATOR_PROMPT_TEMPLATE } from '@/lib/ai/prompts';
import { AIRecommendationSchema } from '@/lib/ai/schemas';
import { getFallbackNavigatorRecommendation } from '@/lib/ai/fallback';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const [courses, topicMastery, dlProfile, recentAttempts] = await Promise.all([
      query<any>(
        `SELECT c.name, c.code, sc.score, sc.grade FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id WHERE sc.student_id = ? AND sc.status = 'enrolled'
         ORDER BY sc.score ASC`,
        [profile.id]
      ),
      query<any>(
        `SELECT ct.name as topic_name, tm.mastery_score, c.name as course_name, ct.difficulty_level
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         WHERE tm.student_id = ? ORDER BY tm.mastery_score ASC`,
        [profile.id]
      ),
      query<any>('SELECT * FROM dynamic_learning_profiles WHERE student_id = ?', [profile.id]),
      query<any>(
        `SELECT qa.is_correct, qa.difficulty, qa.misconception_detected, ct.name as topic_name
         FROM quiz_attempts qa JOIN course_topics ct ON qa.topic_id = ct.id
         WHERE qa.student_id = ? ORDER BY qa.created_at DESC LIMIT 10`,
        [profile.id]
      ),
    ]);

    const recentBehavior =
      recentAttempts.length > 0
        ? `Last ${recentAttempts.length} attempts: ${recentAttempts.filter((a: any) => a.is_correct).length} correct. Common struggles: ${Array.from(
            new Set(
              recentAttempts
                .filter((a: any) => a.misconception_detected)
                .map((a: any) => a.misconception_detected)
            )
          ).join(', ')}`
        : 'Standard progression.';

    const context = {
      name: profile.name,
      student_id: profile.student_id,
      degree: profile.degree,
      program_name: profile.program_name,
      department_name: profile.department_name,
      year_of_study: profile.year_of_study,
      current_semester: profile.current_semester,
      cgpa: profile.cgpa,
      career_goal: profile.career_goal,
      interests: profile.interests,
      weekly_learning_hours: profile.weekly_learning_hours,
      courses,
      topic_mastery: topicMastery,
      dynamic_profile: dlProfile[0] || null,
      recent_behavior: recentBehavior,
    };

    let recommendation: any = null;

    if (!isDemoMode()) {
      const prompt = NAVIGATOR_PROMPT_TEMPLATE(context);
      const rawResponse = await callAI(prompt, 'Generate the academic navigation recommendation.');
      const parsed = safeParseJSON<any>(rawResponse);
      if (parsed) {
        const validated = AIRecommendationSchema.safeParse(parsed);
        if (validated.success) {
          recommendation = validated.data;
        }
      }
    }

    if (!recommendation) {
      recommendation = getFallbackNavigatorRecommendation(context);
    }

    // Dismiss existing active recommendation
    const existingRec = await query<any>(
      `SELECT id FROM ai_recommendations WHERE student_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
      [profile.id]
    );
    if (existingRec.length > 0) {
      await execute('UPDATE ai_recommendations SET status = ? WHERE id = ?', ['dismissed', existingRec[0].id]);
    }

    // Insert new recommendation
    await execute(
      `INSERT INTO ai_recommendations (student_id, recommendation_type, title, priority, reason, evidence_json, strategy_json, weekly_plan_json, career_connection, status)
       VALUES (?, 'topic_mastery', ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        profile.id,
        recommendation.next_priority.title,
        recommendation.next_priority.priority,
        recommendation.next_priority.reason,
        JSON.stringify(recommendation.next_priority.evidence),
        JSON.stringify(recommendation.learning_strategy),
        JSON.stringify(recommendation.weekly_plan),
        recommendation.career_connection,
      ]
    );

    return NextResponse.json({
      recommendation,
      demo_mode: isDemoMode(),
    });
  } catch (error) {
    console.error('Navigator generate error:', error);
    return NextResponse.json({ error: 'Failed to generate recommendation.' }, { status: 500 });
  }
}
