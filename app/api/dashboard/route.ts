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

    const [courses, topicMastery, dlProfile, activeQuest, activeRec, recentXP, badges, archetypeRows] = await Promise.all([
      query<any>(
        `SELECT sc.score, sc.grade, c.id, c.code, c.name, c.credits
         FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id
         WHERE sc.student_id = ? AND sc.status = 'enrolled'
         ORDER BY sc.score ASC`,
        [profile.id]
      ),
      query<any>(
        `SELECT tm.mastery_score, ct.name as topic_name, c.name as course_name
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         WHERE tm.student_id = ?
         ORDER BY tm.mastery_score ASC
         LIMIT 5`,
        [profile.id]
      ),
      query<any>(
        `SELECT worked_examples_score, practice_first_score, guided_learning_score,
                visual_structure_score, reflection_score, challenge_score,
                session_structure_score, collaboration_score, confidence_score
         FROM dynamic_learning_profiles WHERE student_id = ?`,
        [profile.id]
      ),
      query<any>(
        `SELECT q.id, q.title, q.description, q.difficulty, q.progress_pct,
                q.current_stage, q.total_stages, q.reward_xp, q.status,
                c.name as course_name
         FROM quests q
         JOIN courses c ON q.course_id = c.id
         WHERE q.student_id = ? AND q.status = 'active'
         ORDER BY q.updated_at DESC LIMIT 1`,
        [profile.id]
      ),
      query<any>(
        `SELECT id, title, priority, reason, evidence_json FROM ai_recommendations
         WHERE student_id = ? AND status = 'active'
         ORDER BY created_at DESC LIMIT 1`,
        [profile.id]
      ),
      query<any>(
        `SELECT amount, description, created_at FROM xp_events
         WHERE student_id = ?
         ORDER BY created_at DESC LIMIT 5`,
        [profile.id]
      ),
      query<any>(
        `SELECT b.code, b.name, b.icon, sb.unlocked_at
         FROM student_badges sb
         JOIN badges b ON sb.badge_id = b.id
         WHERE sb.student_id = ?
         ORDER BY sb.unlocked_at DESC LIMIT 3`,
        [profile.id]
      ),
      query<any>(
        `SELECT soa.primary_archetype_code, oa.name as primary_name, oa.primary_traits
         FROM student_ocean_archetypes soa
         JOIN ocean_archetypes oa ON soa.primary_archetype_code = oa.code
         WHERE soa.student_id = ?`,
        [profile.id]
      ),
    ]);

    const rawRec = activeRec[0];
    const cleanReason = rawRec?.reason
      ? rawRec.reason
          .replace(/ÔÇÖ/g, '—')
          .replace(/â€”/g, '—')
          .replace(/â€"/g, '–')
          .replace(/â€™/g, "'")
      : '';

    let parsedEvidence: string[] = [];
    if (rawRec?.evidence_json) {
      try {
        parsedEvidence = JSON.parse(rawRec.evidence_json);
      } catch {
        parsedEvidence = [];
      }
    }

    const recommendation = rawRec
      ? {
          id: rawRec.id,
          title: rawRec.title,
          priority: rawRec.priority,
          reason: cleanReason,
          evidence: parsedEvidence,
        }
      : null;

    return NextResponse.json({
      profile,
      courses,
      topic_mastery: topicMastery,
      dynamic_profile: dlProfile[0] || null,
      active_quest: activeQuest[0] || null,
      recommendation,
      recent_xp: recentXP,
      badges,
      ocean_archetype: archetypeRows[0] || null,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard.' }, { status: 500 });
  }
}
