import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getStudentProfileByUserId } from '@/lib/auth';
import { query, execute } from '@/lib/db';
import {
  analyzeTraits,
  classifyOCEANArchetype,
  OCEAN_ARCHETYPES,
  OCEANScores,
} from '@/lib/ocean';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const UpdateOCEANSchema = z.object({
  openness: z.number().min(0).max(100),
  conscientiousness: z.number().min(0).max(100),
  extraversion: z.number().min(0).max(100),
  agreeableness: z.number().min(0).max(100),
  neuroticism: z.number().min(0).max(100),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const [oceanRows, archetypeRows] = await Promise.all([
      query<any>('SELECT * FROM ocean_profiles WHERE student_id = ?', [profile.id]),
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

    const ocean = oceanRows[0] || {
      openness: 84,
      conscientiousness: 78,
      extraversion: 52,
      agreeableness: 68,
      neuroticism: 38,
    };

    const traits = {
      openness: ocean.openness,
      conscientiousness: ocean.conscientiousness,
      extraversion: ocean.extraversion,
      agreeableness: ocean.agreeableness,
      neuroticism: ocean.neuroticism,
    };

    const traitAnalysis = analyzeTraits(traits);
    const classification = classifyOCEANArchetype(traits);

    return NextResponse.json({
      ocean_profile: ocean,
      traits: traitAnalysis,
      archetype: archetypeRows[0] || {
        primary_archetype_code: classification.primary.code,
        primary_name: classification.primary.name,
        primary_description: classification.primary.description,
        primary_traits: classification.primary.primary_traits,
        learning_tendency: classification.primary.learning_tendency,
        secondary_archetype_code: classification.secondary?.code || null,
        secondary_name: classification.secondary?.name || null,
        supporting_evidence: classification.evidence,
      },
      classification,
      catalog: Object.values(OCEAN_ARCHETYPES),
    });
  } catch (error) {
    console.error('OCEAN profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to load OCEAN profile.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const profile = await getStudentProfileByUserId(session.userId);
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    const body = await req.json();
    const scores: OCEANScores = UpdateOCEANSchema.parse(body);

    // 1. Run deterministic classification engine
    const classification = classifyOCEANArchetype(scores);

    // 2. Upsert ocean_profiles
    const existing = await query<any>('SELECT id FROM ocean_profiles WHERE student_id = ?', [profile.id]);
    if (existing.length > 0) {
      await execute(
        `UPDATE ocean_profiles 
         SET openness = ?, conscientiousness = ?, extraversion = ?, agreeableness = ?, neuroticism = ?, updated_at = NOW()
         WHERE student_id = ?`,
        [scores.openness, scores.conscientiousness, scores.extraversion, scores.agreeableness, scores.neuroticism, profile.id]
      );
    } else {
      await execute(
        `INSERT INTO ocean_profiles (student_id, openness, conscientiousness, extraversion, agreeableness, neuroticism)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [profile.id, scores.openness, scores.conscientiousness, scores.extraversion, scores.agreeableness, scores.neuroticism]
      );
    }

    // 3. Upsert student_ocean_archetypes
    const existingArch = await query<any>('SELECT id FROM student_ocean_archetypes WHERE student_id = ?', [profile.id]);
    if (existingArch.length > 0) {
      await execute(
        `UPDATE student_ocean_archetypes 
         SET primary_archetype_code = ?, secondary_archetype_code = ?, supporting_evidence = ?, updated_at = NOW()
         WHERE student_id = ?`,
        [classification.primary.code, classification.secondary?.code || null, classification.evidence, profile.id]
      );
    } else {
      await execute(
        `INSERT INTO student_ocean_archetypes (student_id, primary_archetype_code, secondary_archetype_code, supporting_evidence)
         VALUES (?, ?, ?, ?)`,
        [profile.id, classification.primary.code, classification.secondary?.code || null, classification.evidence]
      );
    }

    const traitAnalysis = analyzeTraits(scores);

    return NextResponse.json({
      success: true,
      scores,
      traits: traitAnalysis,
      classification,
      message: `Archetype updated to ${classification.primary.name}`,
    });
  } catch (error: any) {
    console.error('OCEAN profile update error:', error);
    if (error?.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid trait scores.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update OCEAN profile.' }, { status: 500 });
  }
}
