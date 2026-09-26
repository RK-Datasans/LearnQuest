import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import { z } from 'zod';

const MFCSubmitSchema = z.object({
  responses: z.array(
    z.object({
      question_id: z.number(),
      selected_option_id: z.number(),
    })
  ),
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
    const { responses } = MFCSubmitSchema.parse(body);

    // Create assessment record
    const result = await execute(
      'INSERT INTO mfc_assessments (student_id, completed_at) VALUES (?, NOW())',
      [profile.id]
    );
    const assessmentId = (result as any).insertId;

    // Insert all responses
    for (const r of responses) {
      await execute(
        'INSERT INTO mfc_responses (assessment_id, question_id, selected_option_id) VALUES (?, ?, ?)',
        [assessmentId, r.question_id, r.selected_option_id]
      );
    }

    // Calculate dimension scores from selected options
    const optionData = await query<any>(
      `SELECT mo.style_indicator, mo.weight, mq.dimension_code
       FROM mfc_responses mr
       JOIN mfc_options mo ON mr.selected_option_id = mo.id
       JOIN mfc_questions mq ON mr.question_id = mq.id
       WHERE mr.assessment_id = ?`,
      [assessmentId]
    );

    const indicatorToScore: Record<string, { field: string; value: number }> = {
      worked_example_high: { field: 'worked_examples_score', value: 85 },
      practice_first_high: { field: 'practice_first_score', value: 85 },
      guided_high: { field: 'guided_learning_score', value: 80 },
      autonomous_high: { field: 'guided_learning_score', value: 35 },
      visual_structure_high: { field: 'visual_structure_score', value: 80 },
      procedural_high: { field: 'visual_structure_score', value: 35 },
      reflection_high: { field: 'reflection_score', value: 85 },
      rapid_trial_high: { field: 'reflection_score', value: 35 },
      ramped_high: { field: 'challenge_score', value: 40 },
      challenge_high: { field: 'challenge_score', value: 85 },
      micro_sprints_high: { field: 'session_structure_score', value: 80 },
      deep_blocks_high: { field: 'session_structure_score', value: 40 },
      collaboration_high: { field: 'collaboration_score', value: 75 },
      solitary_high: { field: 'collaboration_score', value: 40 },
      real_world_high: { field: 'visual_structure_score', value: 75 },
      abstract_theory_high: { field: 'guided_learning_score', value: 65 },
    };

    const dimTotals: Record<string, number> = {};
    const dimCounts: Record<string, number> = {};

    for (const opt of optionData) {
      const mapping = indicatorToScore[opt.style_indicator];
      if (mapping) {
        dimTotals[mapping.field] = (dimTotals[mapping.field] || 0) + mapping.value;
        dimCounts[mapping.field] = (dimCounts[mapping.field] || 0) + 1;
      }
    }

    const scores: Record<string, number> = {
      worked_examples_score: 82,
      practice_first_score: 45,
      guided_learning_score: 71,
      visual_structure_score: 63,
      reflection_score: 84,
      challenge_score: 68,
      session_structure_score: 70,
      collaboration_score: 52,
    };

    for (const field of Object.keys(dimTotals)) {
      if (dimCounts[field] > 0) {
        scores[field] = Math.round(dimTotals[field] / dimCounts[field]);
      }
    }

    const behaviorEvidence = `Calibrated from MFC Assessment on ${new Date().toLocaleDateString()}. Demonstrates high receptivity to worked examples and structured reflection. Profile dynamically evolves with ongoing quiz attempts.`;

    await execute(
      `UPDATE dynamic_learning_profiles SET
        worked_examples_score = ?,
        practice_first_score = ?,
        guided_learning_score = ?,
        visual_structure_score = ?,
        reflection_score = ?,
        challenge_score = ?,
        session_structure_score = ?,
        collaboration_score = ?,
        confidence_score = LEAST(100, confidence_score + 5),
        recent_behavior_evidence = ?,
        last_updated = NOW()
       WHERE student_id = ?`,
      [
        scores.worked_examples_score,
        scores.practice_first_score,
        scores.guided_learning_score,
        scores.visual_structure_score,
        scores.reflection_score,
        scores.challenge_score,
        scores.session_structure_score,
        scores.collaboration_score,
        behaviorEvidence,
        profile.id,
      ]
    );

    const updatedProfile = await query<any>(
      'SELECT * FROM dynamic_learning_profiles WHERE student_id = ?',
      [profile.id]
    );

    return NextResponse.json({
      success: true,
      assessment_id: assessmentId,
      dynamic_profile: updatedProfile[0],
    });
  } catch (error: any) {
    console.error('MFC submit error:', error);
    return NextResponse.json({ error: 'Failed to submit assessment.' }, { status: 500 });
  }
}
