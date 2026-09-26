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

    const [courses, topicMastery, dlProfile, badges, oceanRows, archetypeRows] = await Promise.all([
      query<any>(
        `SELECT sc.score, sc.grade, sc.status, c.id, c.code, c.name, c.credits, c.semester
         FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id
         WHERE sc.student_id = ?`,
        [profile.id]
      ),
      query<any>(
        `SELECT tm.mastery_score, tm.attempts_count, tm.last_assessed_at,
                ct.id as topic_id, ct.name as topic_name, c.name as course_name, ct.difficulty_level
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         WHERE tm.student_id = ?
         ORDER BY tm.mastery_score ASC`,
        [profile.id]
      ),
      query<any>(
        `SELECT * FROM dynamic_learning_profiles WHERE student_id = ?`,
        [profile.id]
      ),
      query<any>(
        `SELECT b.id, b.code, b.name, b.description, b.icon, b.category, sb.unlocked_at
         FROM student_badges sb
         JOIN badges b ON sb.badge_id = b.id
         WHERE sb.student_id = ?
         ORDER BY sb.unlocked_at DESC`,
        [profile.id]
      ),
      query<any>(
        `SELECT * FROM ocean_profiles WHERE student_id = ?`,
        [profile.id]
      ),
      query<any>(
        `SELECT soa.*, 
                oa1.name as primary_name, oa1.description as primary_description, oa1.primary_traits, oa1.learning_tendency,
                oa2.name as secondary_name, oa2.description as secondary_description
         FROM student_ocean_archetypes soa
         JOIN ocean_archetypes oa1 ON soa.primary_archetype_code = oa1.code
         LEFT JOIN ocean_archetypes oa2 ON soa.secondary_archetype_code = oa2.code
         WHERE soa.student_id = ?`,
        [profile.id]
      ),
    ]);

    return NextResponse.json({
      profile,
      courses,
      topic_mastery: topicMastery,
      dynamic_profile: dlProfile[0] || null,
      badges,
      ocean_profile: oceanRows[0] || null,
      ocean_archetype: archetypeRows[0] || null,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 });
  }
}
