import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { callAI, safeParseJSON, isDemoMode } from '@/lib/ai/openai';
import { FACULTY_INSIGHT_PROMPT } from '@/lib/ai/prompts';
import { FacultyInsightSchema } from '@/lib/ai/schemas';
import { getFallbackFacultyInsight } from '@/lib/ai/fallback';
import { z } from 'zod';

const InsightSchema = z.object({
  program: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  course: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'faculty') {
      return NextResponse.json({ error: 'Unauthorized. Faculty access required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { program, year, course } = InsightSchema.parse(body);

    let baseWhere = 'WHERE sp.is_synthetic = 1';
    const baseParams: any[] = [];

    if (program && program !== 'all') {
      baseWhere += ' AND p.code = ?';
      baseParams.push(program);
    }
    if (year && year !== 'all') {
      baseWhere += ' AND sp.year_of_study = ?';
      baseParams.push(parseInt(year, 10));
    }

    const [overview, topicGaps, coursePerf] = await Promise.all([
      query<any>(
        `SELECT COUNT(*) as total, ROUND(AVG(academic_health_score),1) as avg_health,
                SUM(CASE WHEN academic_health_score < 65 THEN 1 ELSE 0 END) as needing_attention
         FROM student_profiles sp JOIN programs p ON sp.program_id = p.id ${baseWhere}`,
        baseParams
      ),
      query<any>(
        `SELECT ct.name as topic_name, c.name as course_name,
                ROUND(AVG(tm.mastery_score),1) as average_mastery,
                SUM(CASE WHEN tm.mastery_score < 65 THEN 1 ELSE 0 END) as at_risk_count
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         JOIN student_profiles sp ON tm.student_id = sp.id
         JOIN programs p ON sp.program_id = p.id
         ${baseWhere}
         GROUP BY ct.id HAVING at_risk_count > 0
         ORDER BY at_risk_count DESC LIMIT 5`,
        baseParams
      ),
      query<any>(
        `SELECT c.name as course_name, c.code as course_code, ROUND(AVG(sc.score),1) as avg_score, COUNT(*) as count
         FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id
         JOIN student_profiles sp ON sc.student_id = sp.id
         JOIN programs p ON sp.program_id = p.id
         ${baseWhere}
         ${course && course !== 'all' ? 'AND c.code = ?' : ''}
         GROUP BY c.id ORDER BY avg_score ASC LIMIT 5`,
        course && course !== 'all' ? [...baseParams, course] : baseParams
      ),
    ]);

    const stats = overview[0] || {};
    const context = {
      total_students: stats.total || 42,
      average_health: stats.avg_health || 71.0,
      needing_attention: stats.needing_attention || 8,
      topic_gaps: topicGaps,
      course_performance: coursePerf,
      program_filter: program && program !== 'all' ? program : null,
      year_filter: year && year !== 'all' ? year : null,
      course_filter: course && course !== 'all' ? course : null,
    };

    let insight: any = null;

    if (!isDemoMode()) {
      const rawResponse = await callAI(FACULTY_INSIGHT_PROMPT(context), 'Generate faculty insight.');
      const parsed = safeParseJSON<any>(rawResponse);
      if (parsed) {
        const v = FacultyInsightSchema.safeParse(parsed);
        if (v.success) insight = v.data;
      }
    }

    if (!insight) {
      insight = getFallbackFacultyInsight(context);
    }

    return NextResponse.json({ insight, demo_mode: isDemoMode() });
  } catch (error) {
    console.error('Faculty insight error:', error);
    return NextResponse.json({ error: 'Failed to generate faculty insight.' }, { status: 500 });
  }
}
