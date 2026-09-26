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

    const [recs, courses, topicMastery, dlProfile] = await Promise.all([
      query<any>(
        `SELECT * FROM ai_recommendations WHERE student_id = ? AND status = 'active'
         ORDER BY created_at DESC LIMIT 1`,
        [profile.id]
      ),
      query<any>(
        `SELECT sc.score, sc.grade, c.code, c.name FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id WHERE sc.student_id = ? AND sc.status = 'enrolled'
         ORDER BY sc.score ASC`,
        [profile.id]
      ),
      query<any>(
        `SELECT ct.name as topic_name, tm.mastery_score, c.name as course_name
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         WHERE tm.student_id = ? ORDER BY tm.mastery_score ASC`,
        [profile.id]
      ),
      query<any>(
        `SELECT * FROM dynamic_learning_profiles WHERE student_id = ?`,
        [profile.id]
      ),
    ]);

    const rec = recs[0];
    let parsedRec = null;

    if (rec) {
      parsedRec = {
        id: rec.id,
        title: rec.title,
        priority: rec.priority,
        reason: rec.reason,
        evidence: rec.evidence_json ? JSON.parse(rec.evidence_json) : [],
        strategy: rec.strategy_json ? JSON.parse(rec.strategy_json) : null,
        weekly_plan: rec.weekly_plan_json ? JSON.parse(rec.weekly_plan_json) : [],
        career_connection: rec.career_connection,
        status: rec.status,
      };
    }

    return NextResponse.json({
      recommendation: parsedRec,
      profile,
      courses,
      topic_mastery: topicMastery,
      dynamic_profile: dlProfile[0] || null,
    });
  } catch (error) {
    console.error('Navigator fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch navigator data.' }, { status: 500 });
  }
}
