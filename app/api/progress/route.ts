import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const [courses, topicMastery, dlProfile, badges, xpHistory, quests, quizHistory] = await Promise.all([
      query<any>(
        `SELECT c.name, c.code, sc.score, sc.grade FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id WHERE sc.student_id = ?`,
        [profile.id]
      ),
      query<any>(
        `SELECT ct.name as topic_name, c.name as course_name, tm.mastery_score, tm.attempts_count, tm.last_assessed_at
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         WHERE tm.student_id = ? ORDER BY tm.mastery_score DESC`,
        [profile.id]
      ),
      query<any>('SELECT * FROM dynamic_learning_profiles WHERE student_id = ?', [profile.id]),
      query<any>(
        `SELECT b.code, b.name, b.description, b.icon, b.category, sb.unlocked_at
         FROM student_badges sb JOIN badges b ON sb.badge_id = b.id
         WHERE sb.student_id = ? ORDER BY sb.unlocked_at DESC`,
        [profile.id]
      ),
      query<any>(
        `SELECT amount, description, source_type, created_at
         FROM xp_events WHERE student_id = ? ORDER BY created_at DESC LIMIT 20`,
        [profile.id]
      ),
      query<any>(
        `SELECT title, status, progress_pct, difficulty FROM quests WHERE student_id = ? ORDER BY updated_at DESC`,
        [profile.id]
      ),
      query<any>(
        `SELECT is_correct, difficulty, misconception_detected, feedback_text, created_at, xp_earned,
                ct.name as topic_name
         FROM quiz_attempts qa
         JOIN course_topics ct ON qa.topic_id = ct.id
         WHERE qa.student_id = ? ORDER BY qa.created_at ASC LIMIT 50`,
        [profile.id]
      ),
    ]);

    const totalAttempts = quizHistory.length;
    const correctAttempts = quizHistory.filter((q: any) => q.is_correct).length;
    const quizAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    const misconceptionsResolved = quizHistory.filter((q: any) => !q.is_correct && q.misconception_detected).length;

    return NextResponse.json({
      profile,
      courses,
      topic_mastery: topicMastery,
      dynamic_profile: dlProfile[0] || null,
      badges,
      xp_history: xpHistory,
      quests,
      quiz_accuracy: quizAccuracy,
      total_attempts: totalAttempts,
      misconceptions_resolved: misconceptionsResolved,
      quiz_history: quizHistory,
    });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json({ error: 'Failed to load progress.' }, { status: 500 });
  }
}
