import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const questions = await query<any>(
      `SELECT q.id, q.dimension_code, d.name as dimension_name, q.scenario_context, q.question_text, q.order_index
       FROM mfc_questions q
       JOIN mfc_dimensions d ON q.dimension_code = d.code
       ORDER BY q.order_index`,
      []
    );

    const optionsRows = await query<any>(
      `SELECT id, question_id, option_label, option_text, weight, style_indicator FROM mfc_options`,
      []
    );

    const questionsWithOptions = questions.map((q: any) => ({
      ...q,
      options: optionsRows.filter((o: any) => o.question_id === q.id),
    }));

    return NextResponse.json({ questions: questionsWithOptions });
  } catch (error) {
    console.error('MFC fetch error:', error);
    return NextResponse.json({ error: 'Failed to load MFC questions.' }, { status: 500 });
  }
}
