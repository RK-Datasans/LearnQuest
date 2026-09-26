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

    const quests = await query<any>(
      `SELECT q.id, q.title, q.description, q.difficulty, q.current_stage, q.total_stages,
              q.progress_pct, q.reward_xp, q.status, q.stages_data,
              c.name as course_name, c.code as course_code,
              ct.name as topic_name, q.updated_at
       FROM quests q
       JOIN courses c ON q.course_id = c.id
       LEFT JOIN course_topics ct ON q.topic_id = ct.id
       WHERE q.student_id = ?
       ORDER BY FIELD(q.status,'active','available','completed'), q.updated_at DESC`,
      [profile.id]
    );

    const parsed = quests.map((q: any) => ({
      ...q,
      stages_data: q.stages_data ? JSON.parse(q.stages_data) : [],
    }));

    return NextResponse.json({ quests: parsed, profile });
  } catch (error) {
    console.error('Quest list error:', error);
    return NextResponse.json({ error: 'Failed to load quests.' }, { status: 500 });
  }
}
