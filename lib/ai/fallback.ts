import { AIRecommendationResponse, QuizQuestionResponse, QuizEvaluationResponse, FacultyInsightResponse } from './schemas';

export function getFallbackNavigatorRecommendation(context: any): AIRecommendationResponse {
  const isMba =
    context.degree === 'MBA' ||
    context.program_name?.includes('MBA') ||
    context.career_goal?.toLowerCase().includes('product') ||
    context.career_goal?.toLowerCase().includes('manager');

  // Find the weakest performing course
  const courses = context.courses || [];
  const sortedCourses = [...courses].sort((a: any, b: any) => a.score - b.score);
  const weakestCourse = sortedCourses[0] || (isMba
    ? { name: 'Strategic Product Management', score: 64 }
    : { name: 'Database Systems', score: 62 });

  // Find the weakest topic from mastery
  const topicMastery = context.topic_mastery || [];
  const weakTopics = topicMastery.filter((t: any) => t.mastery_score < 70);
  const weakestTopic = weakTopics.sort((a: any, b: any) => a.mastery_score - b.mastery_score)[0] || (isMba
    ? { topic_name: 'Unit Economics & LTV/CAC', mastery_score: 48 }
    : { topic_name: 'Normalization (1NF, 2NF, 3NF, BCNF)', mastery_score: 52 });

  const title = isMba
    ? `Bridge ${weakestTopic.topic_name} Deficit`
    : weakestTopic
    ? `Strengthen ${weakestTopic.topic_name}`
    : `Improve ${weakestCourse.name}`;

  const evidence: string[] = [];
  if (isMba) {
    evidence.push(`${weakestCourse.name} score of ${weakestCourse.score}% indicates vulnerability in core strategic and quantitative management foundations.`);
    evidence.push(`Topic mastery for "${weakestTopic.topic_name}" is currently ${weakestTopic.mastery_score}% — a vital prerequisite for tech product strategy and unit economics evaluation.`);
    evidence.push(`Directly required for ${context.career_goal} competencies: product P&L stewardship, cohort retention analytics, and technology roadmap justification.`);
    evidence.push(`Your ${context.ocean_archetype?.name || 'Team Driver'} archetype excels when quantitative modeling is paired with executive presentations and collaborative sprints.`);
  } else {
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
  }

  const hoursAvailable = context.weekly_learning_hours || 8;
  const dailyMinutes = Math.floor((hoursAvailable * 60) / 5);

  const academicStatus = isMba
    ? `${context.name} is demonstrating strong performance across ${context.program_name} (CGPA ${context.cgpa}). Key focus area: ${weakestCourse.name} requires reinforcement in quantitative technology management frameworks.`
    : `${context.name} is progressing well in ${context.program_name} (CGPA ${context.cgpa}). Key focus area identified: ${weakestCourse.name} shows the widest performance gap relative to other core subjects.`;

  const reason = isMba
    ? `${weakestCourse.name} continuous evaluation (${weakestCourse.score}%) lags other management subjects. The topic "${weakestTopic.topic_name}" is at ${weakestTopic.mastery_score}% mastery. In Technology Management, this is the foundational quantitative lever for defending product investments, cohort retention, and customer acquisition metrics.`
    : `${weakestCourse.name} performance (${weakestCourse.score}%) lags other subjects by 14–24 percentage points. ${weakestTopic ? `The topic "${weakestTopic.topic_name}" is at ${weakestTopic.mastery_score}% mastery — the clearest actionable lever.` : ''} This is directly relevant to the career goal of ${context.career_goal}.`;

  const careerConnection = isMba
    ? `As an aspiring ${context.career_goal}, deep mastery of ${weakestTopic?.topic_name || weakestCourse.name} empowers you to bridge business viability with technical execution — justifying R&D investments, modeling customer lifetime value, and aligning cross-functional teams with executive stakeholders.`
    : `As a ${context.career_goal}, deep mastery of ${weakestTopic?.topic_name || weakestCourse.name} is foundational for ${context.career_goal.includes('Software') ? 'designing reliable backend architectures, preventing data corruption, and optimizing query performance in production systems.' : 'delivering data-driven decisions, clean modeling pipelines, and production-grade analytical systems.'}`;

  const risksOrTradeoffs = isMba
    ? [
        `Gaps in unit economics and cohort analysis risk weakening your business case defense in capstone presentations and venture pitches.`,
        `Technology management and product leadership roles heavily evaluate candidates on quantitative metric telemetry and margin sustainability.`,
      ]
    : [
        `Continuing to neglect ${weakestCourse.name} (${weakestCourse.score}%) risks pulling down CGPA in the final semester evaluation.`,
        `Unresolved conceptual gaps in this area may appear in technical interviews for ${context.career_goal} roles.`,
      ];

  return {
    academic_status: academicStatus,
    next_priority: {
      type: 'topic_mastery',
      title,
      priority: 'High',
      reason,
      evidence,
    },
    learning_strategy: {
      approach: isMba
        ? 'Case-Study-First with Cohort Decomposition'
        : context.dynamic_profile?.worked_examples_score > 70
        ? 'Worked-Example-First with Targeted Retry Cycles'
        : 'Guided Scaffolding with Progressive Complexity',
      why: isMba
        ? `Your observed profile demonstrates high retention when business scenarios are deconstructed through worked spreadsheets before independent calculation.`
        : `Based on your observed engagement preferences, you demonstrate stronger retention after reviewing structured examples before independent problem-solving. This strategy is reinforced by your recent quiz behavior patterns.`,
    },
    weekly_plan: isMba ? [
      { day: 'Monday', action: `SaaS Metrics Foundations — Churn, ARPU, and MRR definitions review`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Tuesday', action: `Worked Example — Annotated LTV/CAC cohort spreadsheet modeling`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Wednesday', action: `Guided Practice — diagnose payback periods in sample startup case studies`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Friday', action: `Challenge — analyze Net Revenue Retention (NRR) and expansion loops`, estimated_minutes: Math.min(dailyMinutes, 25) },
      { day: 'Sunday', action: `Boss Battle — Defend SaaS Investment Memo in Adaptive Quest`, estimated_minutes: 25 },
    ] : [
      { day: 'Monday', action: `Foundations — ${weakestTopic?.topic_name || weakestCourse.name} core concepts & definition review`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Tuesday', action: `Worked Example — Annotated ${weakestTopic?.topic_name || ''} step-by-step scenario`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Wednesday', action: `Guided Practice — identify patterns in sample problems`, estimated_minutes: Math.min(dailyMinutes, 30) },
      { day: 'Friday', action: `Challenge — higher-difficulty application problem`, estimated_minutes: Math.min(dailyMinutes, 25) },
      { day: 'Sunday', action: `Boss Battle — Complete the Adaptive Quest to validate mastery`, estimated_minutes: 20 },
    ],
    career_connection: careerConnection,
    risks_or_tradeoffs: risksOrTradeoffs,
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

  // Unit Economics & LTV/CAC (MBA Tech Management & Venture Streams)
  if (topicName.includes('unit economics') || topicName.includes('ltv') || topicName.includes('cac')) {
    if (difficulty === 'Boss' || stageName.includes('boss')) {
      const bossPool: QuizQuestionResponse[] = [
        {
          question: 'APEX VENTURE DEFENSE: A B2B SaaS product has an ARPU of $500/month with an 80% gross margin. Total fully-loaded customer acquisition cost is $6,000 per customer. If monthly logo churn is 2.5%, what is the true LTV:CAC ratio and the CAC Payback Period (in months)?',
          options: [
            'A. LTV:CAC = 2.67:1, CAC Payback = 15 months',
            'B. LTV:CAC = 3.33:1, CAC Payback = 12 months',
            'C. LTV:CAC = 1.67:1, CAC Payback = 20 months',
            'D. LTV:CAC = 4.00:1, CAC Payback = 10 months',
          ],
          correct_answer: 'A',
          explanation: 'Monthly Gross Profit per customer = $500 * 80% = $400. Average Customer Lifetime = 1 / Churn = 1 / 0.025 = 40 months. LTV = $400 * 40 = $16,000. LTV:CAC = $16,000 / $6,000 = 2.67:1. CAC Payback Period = CAC / Monthly Gross Profit = $6,000 / $400 = 15 months. Because LTV:CAC < 3.0:1 and payback > 12 months, this venture structure requires margin or retention optimization before scaling growth capital.',
          difficulty: 'Boss',
          concept: 'Comprehensive SaaS Cohort LTV:CAC & Payback Period Modeling',
        },
        {
          question: 'APEX VENTURE DEFENSE: A startup experiences net negative revenue churn (expansion revenue exceeds churned ARR by 15% annually). If CAC is $12,000, first-year ARPU is $10,000 with 75% gross margin, how does net negative churn alter traditional static LTV calculations?',
          options: [
            'A. It makes customer lifetime unbounded in standard geometric series; LTV must be modeled via capped multi-year cohort discounting.',
            'B. It reduces CAC Payback period to zero immediately upon contract signature.',
            'C. It violates standard venture accounting and cannot be reported to institutional investors.',
            'D. It causes gross margins to decline in direct proportion to customer retention.',
          ],
          correct_answer: 'A',
          explanation: 'When Net Revenue Retention (NRR) > 100%, each surviving customer cohort expands in dollar value over time faster than accounts churn. In classic formulas (1/churn), LTV would mathematically approach infinity, which is unrealistic. Rigorous PMs and investors apply discounted cash flow (DCF) or 5-year cohort terminal caps.',
          difficulty: 'Boss',
          concept: 'Net Negative Churn & Expansion Revenue Dynamics',
        },
      ];
      const available = bossPool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
      return available.length > 0 ? available[0] : bossPool[Math.floor(Math.random() * bossPool.length)];
    }

    if (difficulty === 'Hard' || stageName.includes('challenge')) {
      const challengePool: QuizQuestionResponse[] = [
        {
          question: 'CHALLENGE: A tech startup calculates LTV using total revenue rather than gross profit (Revenue LTV = ARPU / Churn). If gross margin is 60%, monthly ARPU is $100, monthly churn is 5%, and CAC is $800, what critical error has management made, and what is the true LTV:CAC ratio?',
          options: [
            'A. They overstated LTV by 40%; the true LTV:CAC ratio is 1.5:1 (unprofitable after operating overhead), not 2.5:1.',
            'B. They underestimated CAC; the true ratio is 3.5:1.',
            'C. Total revenue LTV is standard GAAP accounting; the actual ratio is 2.5:1.',
            'D. Gross margin has no mathematical bearing on LTV in subscription software.',
          ],
          correct_answer: 'A',
          explanation: 'Revenue LTV = $100 / 0.05 = $2,000 (ratio 2.5:1). But delivering the software incurs 40% COGS! True Gross Profit LTV = ($100 * 0.60) / 0.05 = $1,200. True LTV:CAC = $1,200 / $800 = 1.5:1. An LTV:CAC below 3.0:1 leaves virtually zero contribution margin to fund R&D and general administrative overhead.',
          difficulty: 'Hard',
          concept: 'Gross Margin Adjustment in Customer Lifetime Value',
        },
        {
          question: 'CHALLENGE: Product A has CAC = $1,200, Payback = 8 months, LTV:CAC = 3.2:1. Product B has CAC = $400, Payback = 18 months, LTV:CAC = 4.5:1. In a capital-constrained high-interest rate environment, which product should the PM prioritize for marketing capital allocation?',
          options: [
            'A. Product A: 8-month payback allows capital to be recycled 2.25x faster, minimizing equity dilution and cash burn.',
            'B. Product B: The higher 4.5:1 LTV:CAC ratio is always the sole metric venture capitalists evaluate.',
            'C. Both products are mathematically identical because CAC is below $2,000.',
            'D. Neither product should be funded until payback reaches exactly 30 days.',
          ],
          correct_answer: 'A',
          explanation: 'In capital-constrained markets, cash velocity (Payback Horizon) trumps theoretical long-horizon LTV. An 8-month payback recycles cash into new customer acquisition in under a year, whereas an 18-month payback traps scarce working capital and risks insolvency if churn spikes.',
          difficulty: 'Hard',
          concept: 'Capital Efficiency: CAC Payback vs Theoretical LTV Horizon',
        },
      ];
      const available = challengePool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
      return available.length > 0 ? available[0] : challengePool[Math.floor(Math.random() * challengePool.length)];
    }

    if (difficulty === 'Medium' || stageName.includes('practice')) {
      const practicePool: QuizQuestionResponse[] = [
        {
          question: 'PRACTICE: What is the primary reason why CAC Payback Period is often considered more critical for early-stage startup cash flow than the standalone LTV:CAC ratio?',
          options: [
            'A. CAC Payback dictates cash runway and how rapidly invested marketing capital recycles to acquire new cohorts.',
            'B. LTV:CAC cannot be computed until a company goes public.',
            'C. Payback period completely ignores churn, making it a more optimistic metric for pitch decks.',
            'D. CAC Payback is a required statutory filing with the SEC for all private enterprises.',
          ],
          correct_answer: 'A',
          explanation: 'Even with a stellar theoretical LTV:CAC (e.g. 5:1 over 4 years), if CAC Payback is 24 months, a startup will run out of cash financing acquisition upfront before recovering the cash outlay. Sub-12 month payback creates a self-funding growth engine.',
          difficulty: 'Medium',
          concept: 'CAC Payback Period & Working Capital Velocity',
        },
        {
          question: 'PRACTICE: In calculating Fully-Loaded Customer Acquisition Cost (CAC), which expense category is most frequently omitted by early-stage product teams, leading to artificial underestimation?',
          options: [
            'A. Sales and marketing salaries, commissions, and overhead tools (CRM, enrichment, lead gen software).',
            'B. Server hosting costs for existing active subscribers.',
            'C. Product design depreciation and research patents.',
            'D. Payment gateway transaction fees on recurring renewals.',
          ],
          correct_answer: 'A',
          explanation: 'Pure ad spend (blended CAC) severely understates actual acquisition costs. Fully-loaded CAC must include sales reps base salaries, bonuses, SDR tooling, marketing agency fees, and overhead.',
          difficulty: 'Medium',
          concept: 'Fully-Loaded vs Blended CAC Calculation',
        },
      ];
      const available = practicePool.filter(q => !recentQuestions.some(rq => rq.includes(q.question.substring(0, 35))));
      return available.length > 0 ? available[0] : practicePool[Math.floor(Math.random() * practicePool.length)];
    }

    // Easy remediation
    const easyPool: QuizQuestionResponse[] = [
      {
        question: 'REMEDIATION: If a digital product company spends $50,000 on digital marketing campaigns and $30,000 on sales salaries in a quarter, resulting in 400 new paying customers, what is the Customer Acquisition Cost (CAC)?',
        options: [
          'A. $200 per customer',
          'B. $125 per customer',
          'C. $80 per customer',
          'D. $320 per customer',
        ],
        correct_answer: 'A',
        explanation: 'CAC = Total Acquisition Costs / Total New Customers Acquired = ($50,000 + $30,000) / 400 = $80,000 / 400 = $200 per customer.',
        difficulty: 'Easy',
        concept: 'Foundational CAC Equation',
      },
      {
        question: 'REMEDIATION: If a SaaS product charges $50/month with zero COGS and experiences a 5% monthly customer churn rate, what is the expected customer lifetime (in months)?',
        options: [
          'A. 20 months',
          'B. 5 months',
          'C. 50 months',
          'D. 12 months',
        ],
        correct_answer: 'A',
        explanation: 'Expected Customer Lifetime = 1 / Churn Rate = 1 / 0.05 = 20 months. Average LTV would be 20 months * $50 = $1,000.',
        difficulty: 'Easy',
        concept: 'Customer Lifetime & Inverse Churn Relationship',
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
  } else if (topicName.includes('unit economics') || topicName.includes('ltv') || topicName.includes('cac')) {
    if (difficulty === 'Boss' || context.question?.includes('APEX') || context.question?.includes('BOSS')) {
      misconception = 'Gross Margin Omission in Lifetime Value & Infinite Horizon Trap';
      feedback = 'You selected an answer that fails to incorporate gross margin profitability or ignores the mathematical reality of unbounded revenue lifetimes under net negative churn. In real venture economics, revenue is not profit, and surviving cohorts must be discounted over finite operational horizons.';
      remediationExample = `Worked Example — Comprehensive SaaS LTV:CAC & Payback:
ASSUMPTIONS:
• Monthly ARPU = $500
• Gross Margin = 80% (COGS = 20%)
• Monthly Logo Churn = 2.5%
• Blended CAC = $6,000

STEP-BY-STEP CALCULATION:
1. Monthly Gross Profit per Customer = $500 × 0.80 = $400
2. Customer Lifetime = 1 / Churn = 1 / 0.025 = 40 months
3. Lifetime Value (LTV) = Monthly Gross Profit × Lifetime = $400 × 40 = $16,000
4. LTV:CAC Ratio = $16,000 / $6,000 = 2.67:1  (Industry Benchmark is ≥ 3.0:1)
5. CAC Payback Period = CAC / Monthly Gross Profit = $6,000 / $400 = 15 months

DECISION: Payback exceeds 12 months and LTV:CAC is below 3x. Management must reduce CAC or improve gross margin before accelerating marketing spend.`;
    } else if (difficulty === 'Hard' || context.question?.includes('CHALLENGE')) {
      misconception = 'Revenue LTV vs Contribution Margin LTV Fallacy (Gross Margin Distortion)';
      feedback = 'You selected an answer that computes LTV from topline revenue rather than gross profit. When COGS is 40%, evaluating LTV on total subscription revenue inflates your apparent unit economics by 67%, leading to catastrophic cash burn under scale.';
      remediationExample = `Worked Example — Revenue LTV vs True Gross Profit LTV:
SCENARIO: ARPU = $100/mo, Gross Margin = 60%, Churn = 5%, CAC = $800

• FLAWED (Topline Revenue):
  LTV = $100 / 0.05 = $2,000
  Ratio = $2,000 / $800 = 2.5:1 (Looks viable!)

• ACCURATE (Gross Profit):
  Monthly GP = $100 × 0.60 = $60
  True LTV = $60 / 0.05 = $1,200
  True Ratio = $1,200 / $800 = 1.5:1 (UNVIABLE — loses money after operating expenses)

Always multiply ARPU by Gross Margin % before computing lifetime value!`;
    } else {
      misconception = 'Confusion between Working Capital Payback Horizon and Long-Term Theoretical LTV';
      feedback = 'You selected an option that confuses cash payback velocity with lifetime value. Even with healthy 4:1 LTV, an extended payback period (e.g., 18–24 months) depletes working capital and risks bankruptcy before lifetime profits are realized.';
      remediationExample = `Worked Example — Payback Period vs LTV:CAC:
• PRODUCT A: CAC = $1,200, Payback = 8 months, LTV:CAC = 3.2:1
• PRODUCT B: CAC = $400, Payback = 18 months, LTV:CAC = 4.5:1

In tight capital environments, Product A is preferred:
Because its CAC is recovered in 8 months, the company can reinvest that same dollar 1.5 times per year.
Product B locks capital for 1.5 years per iteration, exposing the business to severe cash crunches if churn shifts.`;
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
