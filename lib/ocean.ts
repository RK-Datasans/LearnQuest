export interface OCEANScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export type TraitBand = 'Low' | 'Moderate' | 'High';

export interface TraitAnalysis {
  name: string;
  key: keyof OCEANScores;
  score: number;
  band: TraitBand;
  description: string;
}

export interface ArchetypeDefinition {
  code: string;
  name: string;
  description: string;
  primary_traits: string;
  learning_tendency: string;
}

export const OCEAN_ARCHETYPES: Record<string, ArchetypeDefinition> = {
  creative_builder: {
    code: 'creative_builder',
    name: 'Creative Builder',
    description: 'Excels at taking novel ideas and turning them into systematic, well-architected implementations.',
    primary_traits: 'High Openness, High Conscientiousness',
    learning_tendency: 'Thrives when given architectural freedom combined with concrete milestones and rigorous worked examples.',
  },
  connector: {
    code: 'connector',
    name: 'Connector',
    description: 'Builds understanding through collaborative peer dialogue, team synthesis, and reciprocal knowledge sharing.',
    primary_traits: 'High Extraversion, High Agreeableness',
    learning_tendency: 'Thrives in interactive study groups, peer reviews, and collaborative problem-solving.',
  },
  challenger: {
    code: 'challenger',
    name: 'Challenger',
    description: 'Thrives on rigorous debate, questioning assumptions, competitive benchmarking, and proving concepts independently.',
    primary_traits: 'Low Agreeableness, High Extraversion or Conscientiousness',
    learning_tendency: 'Engages deeply with hard edge-case problems, adversarial testing, and competitive skill challenges.',
  },
  worried_achiever: {
    code: 'worried_achiever',
    name: 'Worried Achiever',
    description: 'High personal standards paired with evaluation anxiety; dedicated but vulnerable to stress over ambiguity.',
    primary_traits: 'High Neuroticism, High Conscientiousness',
    learning_tendency: 'Benefits from explicit scaffolding, transparent rubrics, frequent low-stakes checkpoints, and reassuring feedback.',
  },
  steady_executor: {
    code: 'steady_executor',
    name: 'Steady Executor',
    description: 'Methodical, calm, consistent self-pacing, and highly reliable milestone delivery without feeling overwhelmed.',
    primary_traits: 'High Conscientiousness, Low Neuroticism',
    learning_tendency: 'Flourishes with structured curriculum paths, incremental daily habits, and modular progress tracking.',
  },
  idea_explorer: {
    code: 'idea_explorer',
    name: 'Idea Explorer',
    description: 'Curious, divergent thinker who explores broad conceptual landscapes and interdisciplinary connections.',
    primary_traits: 'High Openness, Low/Moderate Conscientiousness',
    learning_tendency: 'Benefits from open-ended discovery paired with external guardrails to bring exploratory concepts to completion.',
  },
  sensitive_supporter: {
    code: 'sensitive_supporter',
    name: 'Sensitive Supporter',
    description: 'Empathetic, introspective, and highly attentive to learning context and group harmony.',
    primary_traits: 'High Agreeableness, High Neuroticism',
    learning_tendency: 'Learns best in psychological safety, supportive peer environments, and non-punitive formative quizzes.',
  },
  growth_builder: {
    code: 'growth_builder',
    name: 'Opportunity / Growth Builder',
    description: 'Ambitious, proactive pursuer of stretch opportunities, leadership challenges, and expansive horizons.',
    primary_traits: 'High Extraversion, High Openness, High Conscientiousness',
    learning_tendency: 'Motivated by high-impact portfolio projects, rapid skill expansion, and visible leadership opportunities.',
  },
  team_driver: {
    code: 'team_driver',
    name: 'Trusted Team Driver',
    description: 'Reliable, cooperative anchor who keeps group workflows organized, transparent, and mutually supportive.',
    primary_traits: 'High Agreeableness, High Conscientiousness',
    learning_tendency: 'Excels when organizing team sprints, harmonizing collective workflows, and building collective mastery.',
  },
  mixed_pattern: {
    code: 'mixed_pattern',
    name: 'Mixed OCEAN Pattern',
    description: 'Balanced distribution across Big Five trait dimensions without a single dominant polarizing archetype.',
    primary_traits: 'Balanced Moderate Scores',
    learning_tendency: 'Flexible across diverse learning environments, adopting different study strategies based on situational context.',
  },
};

export function getTraitBand(score: number): TraitBand {
  if (score < 40) return 'Low';
  if (score <= 65) return 'Moderate';
  return 'High';
}

export function analyzeTraits(scores: OCEANScores): TraitAnalysis[] {
  return [
    {
      name: 'Openness to Experience',
      key: 'openness',
      score: scores.openness,
      band: getTraitBand(scores.openness),
      description: 'Curiosity, receptivity to abstract concepts, and interest in novel approaches.',
    },
    {
      name: 'Conscientiousness',
      key: 'conscientiousness',
      score: scores.conscientiousness,
      band: getTraitBand(scores.conscientiousness),
      description: 'Goal-directed persistence, methodical pacing, and organizational discipline.',
    },
    {
      name: 'Extraversion',
      key: 'extraversion',
      score: scores.extraversion,
      band: getTraitBand(scores.extraversion),
      description: 'Social energy, preference for verbal dialogue, and engagement in group discussions.',
    },
    {
      name: 'Agreeableness',
      key: 'agreeableness',
      score: scores.agreeableness,
      band: getTraitBand(scores.agreeableness),
      description: 'Cooperative orientation, trust, and preference for communal learning environments.',
    },
    {
      name: 'Neuroticism (Sensitivity)',
      key: 'neuroticism',
      score: scores.neuroticism,
      band: getTraitBand(scores.neuroticism),
      description: 'Emotional reactivity to evaluative pressure, exam stress, and uncertainty.',
    },
  ];
}

export interface ArchetypeClassification {
  primary: ArchetypeDefinition;
  secondary: ArchetypeDefinition | null;
  evidence: string;
}

/**
 * Deterministic and explainable classification engine for the 9 university archetypes + Mixed fallback.
 * Strictly adheres to Section 45 rules:
 * - Deterministic
 * - Trait bands: Low (<40), Moderate (40-65), High (>65)
 * - Supporting trait evidence
 */
export function classifyOCEANArchetype(scores: OCEANScores): ArchetypeClassification {
  const oBand = getTraitBand(scores.openness);
  const cBand = getTraitBand(scores.conscientiousness);
  const eBand = getTraitBand(scores.extraversion);
  const aBand = getTraitBand(scores.agreeableness);
  const nBand = getTraitBand(scores.neuroticism);

  const matchedCodes: string[] = [];

  // 1. Opportunity / Growth Builder: High E + High O + High C
  if (eBand === 'High' && oBand === 'High' && cBand === 'High') {
    matchedCodes.push('growth_builder');
  }

  // 2. Creative Builder: High O + High C
  if (oBand === 'High' && cBand === 'High') {
    matchedCodes.push('creative_builder');
  }

  // 3. Steady Executor: High C + Low N
  if (cBand === 'High' && nBand === 'Low') {
    matchedCodes.push('steady_executor');
  }

  // 4. Worried Achiever: High N + High C
  if (nBand === 'High' && cBand === 'High') {
    matchedCodes.push('worried_achiever');
  }

  // 5. Connector: High E + High A
  if (eBand === 'High' && aBand === 'High') {
    matchedCodes.push('connector');
  }

  // 6. Trusted Team Driver: High A + High C
  if (aBand === 'High' && cBand === 'High') {
    matchedCodes.push('team_driver');
  }

  // 7. Challenger: Low A + (High E or High C)
  if (aBand === 'Low' && (eBand === 'High' || cBand === 'High')) {
    matchedCodes.push('challenger');
  }

  // 8. Idea Explorer: High O + (Low C or Moderate C)
  if (oBand === 'High' && cBand !== 'High') {
    matchedCodes.push('idea_explorer');
  }

  // 9. Sensitive Supporter: High A + High N
  if (aBand === 'High' && nBand === 'High') {
    matchedCodes.push('sensitive_supporter');
  }

  // De-duplicate matched codes
  const uniqueMatches = Array.from(new Set(matchedCodes));

  let primaryCode = uniqueMatches[0] || 'mixed_pattern';
  let secondaryCode = uniqueMatches.length > 1 ? uniqueMatches[1] : null;

  // If Creative Builder was matched and Growth Builder was also matched, respect primary distinction
  if (uniqueMatches.includes('growth_builder') && eBand === 'High') {
    primaryCode = 'growth_builder';
    secondaryCode = uniqueMatches.find((c) => c !== 'growth_builder') || null;
  }

  const primary = OCEAN_ARCHETYPES[primaryCode] || OCEAN_ARCHETYPES.mixed_pattern;
  const secondary = secondaryCode ? OCEAN_ARCHETYPES[secondaryCode] : null;

  // Generate explanatory trait evidence string
  let evidence = '';
  if (primaryCode === 'creative_builder') {
    evidence = `High Openness (${scores.openness}) paired with High Conscientiousness (${scores.conscientiousness}) indicates a strong tendency to conceptualize novel systems and methodically build robust solutions.`;
  } else if (primaryCode === 'steady_executor') {
    evidence = `High Conscientiousness (${scores.conscientiousness}) combined with Low Neuroticism (${scores.neuroticism}) shows steady emotional stability and disciplined, predictable execution through demanding coursework.`;
  } else if (primaryCode === 'worried_achiever') {
    evidence = `High Neuroticism (${scores.neuroticism}) alongside High Conscientiousness (${scores.conscientiousness}) reflects strong ambition coupled with performance sensitivity; benefits from clear scaffolding and low-stakes mastery validation.`;
  } else if (primaryCode === 'growth_builder') {
    evidence = `High Extraversion (${scores.extraversion}), High Openness (${scores.openness}), and High Conscientiousness (${scores.conscientiousness}) highlight an energetic, ambitious drive toward large-scale projects and technical leadership.`;
  } else if (primaryCode === 'connector') {
    evidence = `High Extraversion (${scores.extraversion}) and High Agreeableness (${scores.agreeableness}) foster active knowledge synthesis through collaborative study groups and peer dialogues.`;
  } else if (primaryCode === 'idea_explorer') {
    evidence = `High Openness (${scores.openness}) with Moderate Conscientiousness (${scores.conscientiousness}) demonstrates an exploratory mindset that benefits from concrete milestone deadlines to crystallize concepts.`;
  } else if (primaryCode === 'challenger') {
    evidence = `Low Agreeableness (${scores.agreeableness}) paired with High Conscientiousness (${scores.conscientiousness}) reflects an independent thinker who thrives on proving technical assertions through rigorous empirical tests.`;
  } else if (primaryCode === 'team_driver') {
    evidence = `High Agreeableness (${scores.agreeableness}) with High Conscientiousness (${scores.conscientiousness}) demonstrates reliable group leadership, keeping team milestones organized and transparent.`;
  } else if (primaryCode === 'sensitive_supporter') {
    evidence = `High Agreeableness (${scores.agreeableness}) and High Neuroticism (${scores.neuroticism}) indicate high emotional empathy and thoughtful reflection, thriving in supportive academic settings.`;
  } else {
    evidence = `Trait scores across Openness (${scores.openness}), Conscientiousness (${scores.conscientiousness}), Extraversion (${scores.extraversion}), Agreeableness (${scores.agreeableness}), and Neuroticism (${scores.neuroticism}) reflect a well-balanced profile with flexible situational engagement.`;
  }

  return {
    primary,
    secondary,
    evidence,
  };
}
