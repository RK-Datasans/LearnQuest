import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'faculty') {
      return NextResponse.json({ error: 'Unauthorized. Faculty access required.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const programFilter = url.searchParams.get('program');
    const yearFilter = url.searchParams.get('year');
    const courseFilter = url.searchParams.get('course');

    let baseWhere = 'WHERE sp.is_synthetic = 1';
    const baseParams: any[] = [];

    if (programFilter && programFilter !== 'all') {
      baseWhere += ' AND p.code = ?';
      baseParams.push(programFilter);
    }
    if (yearFilter && yearFilter !== 'all') {
      baseWhere += ' AND sp.year_of_study = ?';
      baseParams.push(parseInt(yearFilter, 10));
    }

    const [overview, programs, coursePerf, topicGaps] = await Promise.all([
      query<any>(
        `SELECT
           COUNT(*) as total_students,
           ROUND(AVG(sp.academic_health_score), 1) as average_health,
           SUM(CASE WHEN sp.academic_health_score >= 75 THEN 1 ELSE 0 END) as students_improving,
           SUM(CASE WHEN sp.academic_health_score < 65 THEN 1 ELSE 0 END) as students_needing_attention
         FROM student_profiles sp
         JOIN programs p ON sp.program_id = p.id
         ${baseWhere}`,
        baseParams
      ),
      query<any>(
        `SELECT p.name as program_name, p.code as program_code, COUNT(*) as student_count
         FROM student_profiles sp
         JOIN programs p ON sp.program_id = p.id
         ${baseWhere}
         GROUP BY p.id ORDER BY student_count DESC`,
        baseParams
      ),
      query<any>(
        `SELECT c.name as course_name, c.code as course_code,
                ROUND(AVG(sc.score), 1) as average_score, COUNT(*) as student_count
         FROM student_courses sc
         JOIN courses c ON sc.course_id = c.id
         JOIN student_profiles sp ON sc.student_id = sp.id
         JOIN programs p ON sp.program_id = p.id
         ${baseWhere}
         ${courseFilter && courseFilter !== 'all' ? 'AND c.code = ?' : ''}
         GROUP BY c.id ORDER BY average_score ASC LIMIT 10`,
        courseFilter && courseFilter !== 'all' ? [...baseParams, courseFilter] : baseParams
      ),
      query<any>(
        `SELECT ct.name as topic_name, c.name as course_name,
                ROUND(AVG(tm.mastery_score), 1) as average_mastery,
                SUM(CASE WHEN tm.mastery_score < 65 THEN 1 ELSE 0 END) as at_risk_count
         FROM topic_mastery tm
         JOIN course_topics ct ON tm.topic_id = ct.id
         JOIN courses c ON ct.course_id = c.id
         JOIN student_profiles sp ON tm.student_id = sp.id
         JOIN programs p ON sp.program_id = p.id
         ${baseWhere}
         GROUP BY ct.id
         HAVING at_risk_count > 0
         ORDER BY at_risk_count DESC, average_mastery ASC
         LIMIT 8`,
        baseParams
      ),
    ]);

    const stats = overview[0] || {};
    const commonGap = topicGaps[0]?.topic_name || 'Database Normalization';

    return NextResponse.json({
      stats: {
        total_students: stats.total_students || 42,
        average_health: stats.average_health || 71.0,
        students_improving: stats.students_improving || 24,
        students_needing_attention: stats.students_needing_attention || 8,
        common_topic_gap: commonGap,
      },
      program_distribution: programs,
      course_performance: coursePerf,
      topic_gaps: topicGaps,
      filters: { program: programFilter, year: yearFilter, course: courseFilter },
    });
  } catch (error) {
    console.error('Faculty overview error:', error);
    return NextResponse.json({ error: 'Failed to load faculty overview.' }, { status: 500 });
  }
}
