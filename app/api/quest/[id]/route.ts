import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const questId = parseInt(params.id, 10);
    const quests = await query<any>(
      `SELECT q.*, c.name as course_name, c.code as course_code,
              ct.name as topic_name, ct.id as course_topic_id
       FROM quests q
       JOIN courses c ON q.course_id = c.id
       LEFT JOIN course_topics ct ON q.topic_id = ct.id
       WHERE q.id = ? AND q.student_id = ?`,
      [questId, profile.id]
    );

    if (quests.length === 0) {
      return NextResponse.json({ error: 'Quest not found.' }, { status: 404 });
    }

    const quest = quests[0];
    const [topicMastery, recentAttempts] = await Promise.all([
      query<any>(
        `SELECT tm.mastery_score, tm.attempts_count FROM topic_mastery tm
         WHERE tm.student_id = ? AND tm.topic_id = ?`,
        [profile.id, quest.topic_id]
      ),
      query<any>(
        `SELECT is_correct, difficulty, misconception_detected, feedback_text, question_text, created_at
         FROM quiz_attempts
         WHERE student_id = ? AND quest_id = ?
         ORDER BY created_at DESC LIMIT 10`,
        [profile.id, questId]
      ),
    ]);

    return NextResponse.json({
      quest: {
        ...quest,
        stages_data: quest.stages_data ? JSON.parse(quest.stages_data) : [],
      },
      topic_mastery: topicMastery[0] || { mastery_score: 52, attempts_count: 5 },
      recent_attempts: recentAttempts,
    });
  } catch (error) {
    console.error('Quest detail error:', error);
    return NextResponse.json({ error: 'Failed to load quest.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const { stage, stages_data } = await req.json();
    const questId = parseInt(params.id, 10);
    const progress = Math.min(100, Math.round((stage / 6) * 100));
    const status = stage >= 6 ? 'completed' : 'active';

    await execute(
      `UPDATE quests SET current_stage = ?, progress_pct = ?, status = ?, stages_data = ?, updated_at = NOW()
       WHERE id = ? AND student_id = ?`,
      [stage, progress, status, JSON.stringify(stages_data), questId, profile.id]
    );

    return NextResponse.json({ success: true, stage, progress_pct: progress, status });
  } catch (error) {
    console.error('Quest update error:', error);
    return NextResponse.json({ error: 'Failed to update quest.' }, { status: 500 });
  }
}
