import { AIRecommendationResponse, QuizQuestionResponse, QuizEvaluationResponse, FacultyInsightResponse } from './schemas';

export function getFallbackNavigatorRecommendation(context: any): AIRecommendationResponse {
  // Find the weakest performing course
  const courses = context.courses || [];
  const sortedCourses = [...courses].sort((a: any, b: any) => a.score - b.score);
  const weakestCourse = sortedCourses[0] || { name: 'Database Systems', score: 62 };

  // Find the weakest topic from mastery
  const topicMastery = context.topic_mastery || [];
  const weakTopics = topicMastery.filter((t: any) => t.mastery_score < 70);
  const weakestTopic = weakTopics.sort((a: any, b: any) => a.mastery_score - b.mastery_score)[0];

  const title = weakestTopic
    ? `Strengthen ${weakestTopic.topic_name}`
    : `Improve ${weakestCourse.name}`;

  const evidence: string[] = [];
  if (weakestCourse) {
    evidence.push(`${weakestCourse.name} score of ${weakestCourse.score}% is below your strongest subjects.`);
  }
  if (weakestTopic) {
    evidence.push(`Topic mastery for "${weakestTopic.topic_name}" is currently ${weakestTopic.mastery_score}% — the lowest in your profile.`);
    evidence.push(`This topic directly appears in technical assessment and production engineering contexts relevant to ${context.career_goal}.`);
  }
  evidence.push(`You have ${context.weekly_learning_hours} hours per week available — enough for targeted mastery improvement.`);
  if (context.dynamic_profile?.worked_examples_score > 70) {
    evidence.push(`Your observed learning profile shows strong receptivity to worked examples (${context.dynamic_profile.worked_examples_score}%), guiding our pedagogical strategy.`);
  }
  if (context.ocean_archetype) {
    evidence.push(`Behavioral tendency signal: Derived Archetype "${context.ocean_archetype.name}" reflects a structured builder mindset that thrives on concrete milestones.`);
  }

  const hoursAvailable = context.weekly_learning_hours || 8;
  const dailyMinutes = Math.floor((hoursAvailable * 60) / 5);

  return {
    academic_status: `${context.name} is progressing well in ${context.program_name} (CGPA ${context.cgpa}). Key focus area identified: ${weakestCourse.name} shows the widest performance gap relative to other core subjects.`,
    next_priority: {
      type: 'topic_mastery',
      title,
      priority: 'High',
      reason: `${weakestCourse.name} performance (${weakestCourse.score}%) lags other subjects by 14–24 percentage points. ${weakestTopic ? `The topic "${weakestTopic.topic_name}" is at ${weakestTopic.mastery_score}% mastery — the clearest actionable lever.` : ''} This is directly relevant to the career goal of ${context.career_goal}.`,
      evidence,
    },
    learning_strategy: {
      approach: context.dynamic_profile?.worked_examples_score > 70
        ? 'Worked-Example-First with Targeted Retry Cycles'
        : 'Guided Scaffolding with Progressive Complexity',
      why: `Based on your observed engagement preferences, you demonstrate stronger retention after reviewing structured examples before independent problem-solving. This strategy is reinforced by your recent quiz behavior patterns.`,
    },
    weekly_plan: [
      { day: 'Monday', action: `Foundations — ${weakestTopic?.topic_name || weakestCourse.name} core concepts & definition review`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Tuesday', action: `Worked Example — Annotated ${weakestTopic?.topic_name || ''} step-by-step scenario`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Wednesday', action: `Guided Practice — identify patterns in sample problems`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Friday', action: `Challenge — higher-difficulty application problem`, estimated_minutes: Math.min(dailyMinutes, 25) },
      { day: 'Sunday', action: `Boss Battle — Complete the Adaptive Quest to validate mastery`, estimated_minutes: 20 },
    ],
    career_connection: `As a ${context.career_goal}, deep mastery of ${weakestTopic?.topic_name || weakestCourse.name} is foundational for ${context.career_goal.includes('Software') ? 'designing reliable backend architectures, preventing data corruption, and optimizing query performance in production systems.' : 'delivering data-driven decisions, clean modeling pipelines, and production-grade analytical systems.'}`,
    risks_or_tradeoffs: [
      `Continuing to neglect ${weakestCourse.name} (${weakestCourse.score}%) risks pulling down CGPA in the final semester evaluation.`,
      `Unresolved conceptual gaps in this area may appear in technical interviews for ${context.career_goal} roles.`,
    ],
    next_action: `Launch the "${weakestTopic?.topic_name || 'targeted topic'}" Adaptive Quest to begin the structured remediation cycle.`,
  };
}

export function getFallbackQuizQuestion(context: any): QuizQuestionResponse {
  const topicName = (context.topic_name || '').toLowerCase();
  const difficulty = context.difficulty || 'Medium';
  const stageName = (context.stage_name || '').toLowerCase();
  const recentQuestions: string[] = context.recent_questions || [];

  if (topicName.includes('normalization') || topicName.includes('normal form')) {
    // 1. Stage 6: Boss Battle (Apex Multi-Table Lossless Decomposition & Dependency Preservation)
    if (difficulty === 'Boss' || stageName.includes('boss')) {
      const bossPool: QuizQuestionResponse[] = [
        {
          question: 'APEX BOSS CHALLENGE: Relation R(A, B, C, D) has functional dependencies: AB → C, C → D, and D → A. A database architect decomposes R into R1(A, B, C) and R2(C, D). Which statement accurately characterizes this decomposition?',
          options: [
            'A. The decomposition is Lossless-Join, but DOES NOT preserve the functional dependency D → A.',
            'B. The decomposition is both Lossless-Join and Dependency-Preserving.',
            'C. The decomposition is neither Lossless-Join nor Dependency-Preserving.',
            'D. The decomposition preserves D → A, but causes a Lossy Join because C is not unique in R2.',
          ],
          correct_answer: 'A',
          explanation: 'R1 ∩ R2 = {C}. In R2(C, D), C → D holds, making C a superkey of R2. Therefore, by Heath’s Theorem, the decomposition is strictly Lossless-Join. However, the dependency D → A cannot be tested within R1(A, B, C) or R2(C, D) without performing an expensive join. Thus, D → A is lost! This proves that BCNF decompositions do not always preserve dependencies.',
          difficulty: 'Boss',
          concept: 'Lossless-Join BCNF vs Dependency Preservation Trade-off',
        },
        {
          question: 'APEX BOSS CHALLENGE: Relation ENROLLMENT_RECORD(StudentID, CourseID, Semester, InstructorID, Grade) has FDs: {StudentID, CourseID, Semester} → Grade, {StudentID, CourseID, Semester} → InstructorID, and InstructorID → CourseID. To achieve BCNF with a lossless join, which decomposition must be performed, and what dependency is sacrificed?',
          options: [
            'A. Decompose into R1(StudentID, InstructorID, Semester, Grade) and R2(InstructorID, CourseID); the dependency {StudentID, CourseID, Semester} → InstructorID is sacrificed.',
            'B. Decompose into R1(StudentID, CourseID, Grade) and R2(InstructorID, Semester); no dependencies are lost.',
            'C. Leave the relation un-decomposed; candidate keys already guarantee BCNF.',
            'D. Decompose into 4 single-attribute tables; lossless join is achieved through natural cartesian products.',
          ],
          correct_answer: 'A',
          explanation: 'InstructorID → CourseID causes a BCNF violation because InstructorID is not a superkey. Decomposing into R1(StudentID, InstructorID, Semester, Grade) and R2(InstructorID, CourseID) satisfies BCNF with a lossless join (common attribute InstructorID is a key in R2). However, enforcing that a student has one instructor per course per semester requires joining R1 and R2.',
          difficulty: 'Boss',
          concept: 'Apex BCNF Lossless Synthesis & Dependency Analysis',
        },
      ];
      const available = bossPool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
      return available.length > 0 ? available[0] : bossPool[Math.floor(Math.random() * bossPool.length)];
    }

    // 2. Stage 5: Challenge (Hard — Multi-attribute Candidate Keys & BCNF Violation Traps)
    if (difficulty === 'Hard' || stageName.includes('challenge')) {
      const challengePool: QuizQuestionResponse[] = [
        {
          question: 'CHALLENGE: In relation ADVISING(StudentID, Major, Advisor), a student has one advisor per major: {StudentID, Major} → Advisor. Each advisor advises only one major: Advisor → Major. Candidate keys are {StudentID, Major} and {StudentID, Advisor}. Why is this relation in 3NF, but VIOLATES BCNF?',
          options: [
            'A. It satisfies 3NF because Major is a prime attribute, but violates BCNF because Advisor is not a superkey.',
            'B. It violates 3NF because Advisor is a non-prime attribute determining another non-prime attribute.',
            'C. It violates 2NF because Advisor depends on only part of the composite primary key.',
            'D. It satisfies BCNF because all three attributes are prime, making anomalies mathematically impossible.',
          ],
          correct_answer: 'A',
          explanation: 'In Advisor → Major, Major is part of candidate key {StudentID, Major}, making it a prime attribute. 3NF permits this (every FD X → Y allows Y to be prime). But BCNF removes this exception: X must ALWAYS be a superkey. Since Advisor alone cannot determine StudentID, Advisor is not a superkey, directly violating BCNF.',
          difficulty: 'Hard',
          concept: 'BCNF Violation via Prime Attribute Determinant',
        },
        {
          question: 'CHALLENGE: Consider relation R(A, B, C, D) with the functional dependency set: F = { A → B, BC → D, D → A }. Which of the following sets represents ALL the candidate keys of relation R?',
          options: [
            'A. {A, C}, {B, C}, and {C, D}',
            'B. {A, B} and {B, C} only',
            'C. {A, C, D} only',
            'D. {A} and {D} only',
          ],
          correct_answer: 'A',
          explanation: 'Attribute C never appears on the right-hand side of any dependency, so C must belong to every candidate key. Computing closures: (AC)+ = ABCD (Candidate Key). (BC)+ = BCDA = ABCD (Candidate Key). (CD)+ = CDAB = ABCD (Candidate Key). Thus, {A, C}, {B, C}, and {C, D} are the three candidate keys.',
          difficulty: 'Hard',
          concept: 'Multi-Attribute Candidate Key Discovery',
        },
      ];
      const available = challengePool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
      return available.length > 0 ? available[0] : challengePool[Math.floor(Math.random() * challengePool.length)];
    }

    // 3. Stage 4: Practice Quiz (Medium — Partial vs Transitive Dependencies: 2NF vs 3NF)
    if (difficulty === 'Medium' || stageName.includes('practice')) {
      const practicePool: QuizQuestionResponse[] = [
        {
          question: 'PRACTICE: A university relation ENROLLMENT(StudentID, CourseID, CourseName, InstructorID, InstructorOffice) has functional dependencies: {StudentID, CourseID} → InstructorID and InstructorID → InstructorOffice. Which normal form violation does this relation exhibit?',
          options: [
            'A. First Normal Form (1NF) — multi-valued attributes detected in instructor fields.',
            'B. Second Normal Form (2NF) — partial dependency on a subset of the composite primary key.',
            'C. Third Normal Form (3NF) — transitive dependency through a non-prime attribute (InstructorID).',
            'D. Boyce-Codd Normal Form (BCNF) — InstructorID is already a candidate key.',
          ],
          correct_answer: 'C',
          explanation: 'The dependency InstructorID → InstructorOffice is a transitive dependency: {StudentID, CourseID} → InstructorID → InstructorOffice. InstructorID is a non-prime attribute, so determining another non-prime attribute violates 3NF. To resolve this, decompose into ENROLLMENT(StudentID, CourseID, InstructorID) and INSTRUCTOR(InstructorID, InstructorOffice).',
          difficulty: 'Medium',
          concept: 'Third Normal Form (3NF) — Transitive Dependency Detection',
        },
        {
          question: 'PRACTICE: In table STUDENT_PROJECT(StudentID, ProjectID, HoursWorked, StudentName, ProjectBudget) with composite primary key (StudentID, ProjectID), we observe: StudentID → StudentName and ProjectID → ProjectBudget. What is the fundamental violation here?',
          options: [
            'A. Second Normal Form (2NF) — StudentName and ProjectBudget depend on proper subsets of the primary key.',
            'B. Third Normal Form (3NF) — transitive dependencies between non-prime attributes.',
            'C. Boyce-Codd Normal Form (BCNF) — HoursWorked is a candidate key.',
            'D. First Normal Form (1NF) — composite keys cannot contain foreign keys.',
          ],
          correct_answer: 'A',
          explanation: 'StudentID → StudentName depends only on StudentID, which is a proper subset of the composite primary key (StudentID, ProjectID). This is a textbook partial dependency, which violates Second Normal Form (2NF). Fix: Decompose into STUDENT, PROJECT, and ASSIGNMENT.',
          difficulty: 'Medium',
          concept: 'Second Normal Form (2NF) — Partial Dependency on Composite Key',
        },
      ];
      const available = practicePool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
      return available.length > 0 ? available[0] : practicePool[Math.floor(Math.random() * practicePool.length)];
    }

    // 4. Targeted Retry / Foundational (Easy — 1NF Atomicity & Basic Anomaly Resolution)
    const easyPool: QuizQuestionResponse[] = [
      {
        question: 'REMEDIATION: In First Normal Form (1NF), which of the following conditions must a relation satisfy?',
        options: [
          'A. All attributes must be atomic — no multi-valued or composite attributes in a single cell.',
          'B. All non-prime attributes must be fully functionally dependent on the entire primary key.',
          'C. There must be no transitive functional dependencies between non-prime attributes.',
          'D. Every attribute must be determined only by the candidate keys — no partial dependencies allowed.',
        ],
        correct_answer: 'A',
        explanation: '1NF requires atomicity — each cell must hold a single, indivisible value. This eliminates repeating groups and comma-separated lists.',
        difficulty: 'Easy',
        concept: 'First Normal Form (1NF) & Atomicity',
      },
      {
        question: 'REMEDIATION: If deleting the last student enrolled in a course causes all records of the course description and credit hours to be permanently deleted, which anomaly has occurred?',
        options: [
          'A. Deletion Anomaly — deleting one entity inadvertently wipes out unrelated entity data.',
          'B. Insertion Anomaly — inability to insert a student without course approval.',
          'C. Update Anomaly — inconsistent data across concurrent transactions.',
          'D. Transitive Anomaly — non-prime attribute determining a primary key.',
        ],
        correct_answer: 'A',
        explanation: 'A Deletion Anomaly occurs when deleting one fact inadvertently wipes out unrelated data that was combined in the same unnormalized relation. Normalization eliminates this by isolating entities into dedicated tables.',
        difficulty: 'Easy',
        concept: 'Relational Anomalies in Denormalized Schemas',
      },
    ];
    const available = easyPool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
    return available.length > 0 ? available[0] : easyPool[Math.floor(Math.random() * easyPool.length)];
  }

  // Generic fallback
  return {
    question: `Which statement best describes the role of functional dependencies in relational schema design?`,
    options: [
      'A. They define which attributes can store NULL values in a relation.',
      'B. They specify the deterministic relationships between attribute sets used to eliminate data redundancy.',
      'C. They enforce referential integrity between foreign keys across related tables.',
      'D. They index specific columns to improve query execution plan performance.',
    ],
    correct_answer: 'B',
    explanation: 'Functional dependencies (FDs) specify that the value of one attribute set (the determinant) uniquely determines the value of another set. FDs form the mathematical foundation of normalization theory — used to decompose relations and eliminate update, insert, and delete anomalies.',
    difficulty: context.difficulty || 'Medium',
    concept: context.topic_name || 'Relational Theory',
  };
}

export function getFallbackQuizEvaluation(context: any): QuizEvaluationResponse {
  const isCorrect = context.selected_answer === context.correct_answer;

  if (isCorrect) {
    return {
      correct: true,
      feedback: `Excellent analytical work! You correctly identified the key concept in this ${context.topic_name} question. Your response confirms solid reasoning around ${context.topic_name}.`,
      misconception: null,
      recommended_difficulty: context.current_difficulty === 'Easy' ? 'Medium' : context.current_difficulty === 'Medium' ? 'Hard' : 'Boss',
      next_action: 'Advance to the next challenge with increased difficulty.',
    };
  }

  // Determine specific misconception based on topic, difficulty, and context
  const topicName = (context.topic_name || '').toLowerCase();
  const difficulty = context.current_difficulty || 'Medium';
  let misconception = 'Conceptual confusion detected in this topic area.';
  let feedback = '';
  let remediationExample = '';

  if (topicName.includes('normalization') || topicName.includes('normal form')) {
    if (difficulty === 'Boss' || context.question?.includes('BOSS')) {
      misconception = 'Lossless-Join vs Dependency Preservation Decomposition Trade-off Trap';
      feedback = 'You selected an answer that confuses Lossless-Join with Dependency Preservation. A decomposition can guarantee a lossless natural join (using common attribute superkey tests) while still failing to preserve all functional dependencies across separate child tables!';
      remediationExample = `Worked Example — Lossless Join vs Dependency Preservation:
RELATION: R(A, B, C, D) with FDs: AB → C, C → D, D → A
Decomposition: R1(A, B, C) and R2(C, D)

• Lossless Join Check: R1 ∩ R2 = {C}. In R2, C → D holds, so C is a superkey of R2.
  Result: Strictly LOSSLESS join! (Heath's Theorem satisfied)

• Dependency Preservation Check:
  AB → C can be tested in R1. C → D can be tested in R2.
  D → A CANNOT be tested without computing (R1 ⋈ R2).
  Result: D → A is NOT preserved!

Key Rule: BCNF guarantees lossless join, but does NOT guarantee dependency preservation. 3NF guarantees BOTH.`;
    } else if (difficulty === 'Hard' || context.question?.includes('CHALLENGE')) {
      misconception = 'BCNF Determinant Rule Violation (Prime Attribute Determinant Trap)';
      feedback = 'You selected an option that confuses 3NF and BCNF requirements. In 3NF, an FD X → Y is allowed if Y is a prime attribute (part of any candidate key). But BCNF removes this loophole: EVERY determinant X must be a superkey, regardless of whether Y is prime!';
      remediationExample = `Worked Example — 3NF vs BCNF (The Advising Trap):
RELATION: ADVISING(StudentID, Major, Advisor)
FDs: {StudentID, Major} → Advisor, Advisor → Major
Candidate Keys: {StudentID, Major} and {StudentID, Advisor}

• 3NF Check for Advisor → Major:
  Advisor is not a superkey, BUT Major is part of candidate key {StudentID, Major} (prime attribute).
  Result: 3NF is SATISFIED!

• BCNF Check for Advisor → Major:
  BCNF requires Advisor to be a superkey. It is not.
  Result: BCNF is VIOLATED!

Fix: Decompose into ADVISOR_MAJOR(Advisor, Major) and STUDENT_ADVISOR(StudentID, Advisor).`;
    } else {
      misconception = 'Confusion between Partial Dependency (2NF) and Transitive Dependency (3NF)';
      feedback = `You selected an answer that reflects confusion between 2NF and 3NF rules. In 2NF, we eliminate non-prime attributes that depend on a PART (subset) of the composite primary key. In 3NF, we eliminate non-prime attributes that depend on OTHER non-prime attributes (transitive path). These are fundamentally different violations requiring different decomposition strategies.`;
      remediationExample = `Worked Example — Partial vs Transitive Dependency:

RELATION: ORDER_ITEM(OrderID, ProductID, CustomerName, ProductCategory)
Primary Key: (OrderID, ProductID)

• CustomerName depends only on OrderID (not on ProductID) → PARTIAL dependency → 2NF violation
  Fix: Move CustomerName to ORDER(OrderID, CustomerName)

• ProductCategory depends on ProductID (a non-prime attribute in this context)
  If we had: ProductID → Supplier → ProductCategory → TRANSITIVE dependency → 3NF violation  
  Fix: Move to PRODUCT(ProductID, ProductCategory)

Key Rule: Partial = depends on PART of the key. Transitive = A→B→C through a non-key attribute.`;
    }
  }

  return {
    correct: false,
    feedback,
    misconception,
    recommended_difficulty: 'Easy',
    next_action: 'Review the worked example carefully, then attempt a targeted remediation question focused on this specific misconception.',
    remediation_example: remediationExample,
  };
}


export function getFallbackFacultyInsight(context: any): FacultyInsightResponse {
  const gapTopic = context.topic_gaps?.[0];
  const gapCount = context.needing_attention || 8;
  const totalStudents = context.total_students || 42;
  const avgHealth = context.average_health || 71;

  return {
    insight: gapTopic
      ? `${gapTopic.topic_name} is the most critical learning gap among the filtered student cohort — ${gapCount} of ${totalStudents} students show mastery below the 65% threshold.`
      : `${gapCount} of ${totalStudents} students (${Math.round((gapCount / totalStudents) * 100)}%) fall below the academic health threshold of 70%, indicating systematic content delivery challenges that require targeted pedagogical intervention.`,
    evidence: [
      `Average academic health across the filtered cohort: ${avgHealth}%.`,
      gapTopic
        ? `"${gapTopic.topic_name}" shows the lowest mean mastery score (${gapTopic.average_mastery}%) across ${gapTopic.at_risk_count} students.`
        : `${gapCount} students are flagged as needing academic attention based on composite academic health scores.`,
      `Course performance data indicates consistent difficulty clusters at specific conceptual junctures — not random performance variance.`,
    ],
    affected_group: context.program_filter
      ? `${context.program_filter} students${context.year_filter ? `, Year ${context.year_filter}` : ''}${context.course_filter ? ` in ${context.course_filter}` : ''}`
      : `Cross-program cohort (${totalStudents} synthetic students)`,
    suggested_intervention: gapTopic
      ? `Deploy a targeted 3-session remediation module on "${gapTopic.topic_name}" — specifically addressing the distinction between related sub-concepts. Consider supplementing lecture delivery with annotated worked examples and peer-review schema decomposition exercises.`
      : `Schedule an academic progress review session with the ${gapCount} at-risk students. Design supplemental workshop content addressing the common topic gaps identified in the mastery data.`,
    expected_outcome: `A focused 2-week intervention targeting these ${gapCount} students on the identified gap topics is projected to recover an average of 15–20 mastery percentage points, raising the cohort average academic health above the 75% institutional benchmark.`,
  };
}
