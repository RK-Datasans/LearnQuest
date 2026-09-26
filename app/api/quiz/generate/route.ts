import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query } from '@/lib/db';
import { callAI, safeParseJSON, isDemoMode } from '@/lib/ai/openai';
import { QUIZ_GENERATE_PROMPT } from '@/lib/ai/prompts';
import { QuizQuestionSchema } from '@/lib/ai/schemas';
import { getFallbackQuizQuestion } from '@/lib/ai/fallback';
import { z } from 'zod';

const GenerateSchema = z.object({
  topic_id: z.number(),
  quest_id: z.number().optional(),
  difficulty: z.string().default('Medium'),
  stage_name: z.string().default('Practice'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const body = await req.json();
    const { topic_id, quest_id, difficulty, stage_name } = GenerateSchema.parse(body);

    const [topicRows, masteryRows, recentMistakes] = await Promise.all([
      query<any>(
        `SELECT ct.name as topic_name, c.name as course_name FROM course_topics ct
         JOIN courses c ON ct.course_id = c.id WHERE ct.id = ?`,
        [topic_id]
      ),
      query<any>('SELECT mastery_score FROM topic_mastery WHERE student_id = ? AND topic_id = ?', [profile.id, topic_id]),
      query<any>(
        `SELECT misconception_detected FROM quiz_attempts
         WHERE student_id = ? AND topic_id = ? AND is_correct = 0 AND misconception_detected IS NOT NULL
         ORDER BY created_at DESC LIMIT 5`,
        [profile.id, topic_id]
      ),
    ]);

    const topic = topicRows[0];
    if (!topic) return NextResponse.json({ error: 'Topic not found.' }, { status: 404 });

    const mastery = masteryRows[0]?.mastery_score || 52;
    const context = {
      topic_name: topic.topic_name,
      course_name: topic.course_name,
      mastery_score: mastery,
      difficulty,
      stage_name,
      previous_mistakes: recentMistakes.map((m: any) => m.misconception_detected).filter(Boolean),
    };

    let question: any = null;

    if (!isDemoMode()) {
      const rawResponse = await callAI(QUIZ_GENERATE_PROMPT(context), 'Generate quiz question.');
      const parsed = safeParseJSON<any>(rawResponse);
      if (parsed) {
        const v = QuizQuestionSchema.safeParse(parsed);
        if (v.success) question = v.data;
      }
    }

    if (!question) {
      question = getFallbackQuizQuestion(context);
    }

    return NextResponse.json({
      question,
      topic_id,
      quest_id,
      mastery,
      demo_mode: isDemoMode(),
    });
  } catch (error) {
    console.error('Quiz generate error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz question.' }, { status: 500 });
  }
}
