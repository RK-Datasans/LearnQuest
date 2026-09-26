export interface ONETSkillGap {
  skill: string;
  market_importance: number; // 0-100
  student_mastery: number; // 0-100
  status: 'proficient' | 'in_progress' | 'critical_gap';
  labor_note: string;
}

export interface ONETAlignment {
  job_title: string;
  onet_code: string;
  soc_title: string;
  market_growth_rate: string;
  median_wage_annual: string;
  readiness_score: number;
  critical_skill_gaps: ONETSkillGap[];
  labor_market_summary: string;
}

export interface MonthMilestone {
  month_number: number;
  month_title: string;
  phase: string;
  objective: string;
  allocated_hours_per_week: number;
  primary_focus_areas: string[];
  key_milestone_deliverable: string;
  academic_remedy_target: string;
  co_curricular_action: string;
  status: 'active' | 'upcoming' | 'planned';
}

export interface RecommendedCourse {
  code: string;
  name: string;
  credits: number;
  semester: number;
  relevance_score: number; // 0-100
  quality_rating: number; // 0-5.0
  workload_level: 'Light' | 'Moderate' | 'Heavy';
  prereq_status: 'satisfied' | 'in_progress' | 'deficit_needs_fix';
  why_recommended: string;
}

export interface CampusResource {
  category: 'Faculty Office Hours' | 'Peer Tutoring Desk' | 'Academic Success Lab' | 'Career & Research';
  title: string;
  contact_or_location: string;
  availability: string;
  relevance_reason: string;
  action_label: string;
}

export interface CampusOpportunity {
  type: 'Club & Chapter' | 'Hackathon & Competition' | 'Research Lab' | 'Industry Conference';
  title: string;
  timing: string;
  archetype_alignment: string;
  career_benefit: string;
  badge_xp_reward: string;
}

export interface StrategicAdvisoryData {
  onet: ONETAlignment;
  three_month_plan: MonthMilestone[];
  recommended_courses: RecommendedCourse[];
  campus_resources: CampusResource[];
  campus_opportunities: CampusOpportunity[];
  basis_explanation: {
    academic_deficit_lever: string;
    onet_labor_alignment: string;
    time_feasibility: string;
    personality_resonance: string;
  };
}

export function generateStrategicAdvisory(
  profile: any,
  courses: any[] = [],
  topicMastery: any[] = [],
  oceanArchetype: any = null
): StrategicAdvisoryData {
  const careerGoal = profile?.career_goal || 'Full Stack Developer';
  const weeklyHours = profile?.weekly_learning_hours || 14;
  const archetypeCode = oceanArchetype?.primary_archetype_code || 'creative_builder';
  const archetypeName = oceanArchetype?.primary_name || 'Creative Builder';

  // Identify if student is MBA / Tech Management stream
  const isMba =
    profile?.degree === 'MBA' ||
    profile?.program_name?.includes('MBA') ||
    profile?.program_id === 6 ||
    (careerGoal && careerGoal.toLowerCase().includes('product'));

  // Identify lowest performing course and topic
  const sortedCourses = [...courses].sort((a, b) => Number(a.score) - Number(b.score));
  const lowestCourse = sortedCourses[0] || (isMba
    ? { name: 'Strategic Product Management', score: 64 }
    : { name: 'Database Systems', score: 62 });
  
  const sortedTopics = [...topicMastery].sort((a, b) => Number(a.mastery_score) - Number(b.mastery_score));
  const lowestTopic = sortedTopics[0] || (isMba
    ? { topic_name: 'Unit Economics & LTV/CAC', mastery_score: 48 }
    : { topic_name: 'Normalization (1NF, 2NF, 3NF, BCNF)', mastery_score: 52 });

  // 1. O*NET Labor Market Alignment
  const onet: ONETAlignment = isMba ? {
    job_title: careerGoal || 'Technical Product Manager',
    onet_code: '15-1299.09',
    soc_title: 'Information Technology Project & Product Managers',
    market_growth_rate: '+18% (Much faster than average 2022-2032)',
    median_wage_annual: '$142,530 / year (BLS & O*NET data)',
    readiness_score: 76,
    critical_skill_gaps: [
      {
        skill: 'Unit Economics & Customer Acquisition Cost (CAC / LTV Modeling)',
        market_importance: 96,
        student_mastery: Number(lowestTopic.mastery_score) || 48,
        status: 'critical_gap',
        labor_note: 'Non-negotiable for tech PMs responsible for product P&L, cohort retention, and margin sustainability.',
      },
      {
        skill: 'Product Roadmapping & Agile Sprint Prioritization',
        market_importance: 92,
        student_mastery: 82,
        status: 'proficient',
        labor_note: 'Standard industry requirement for cross-functional engineering-to-business alignment.',
      },
      {
        skill: 'Data-Driven Experimentation & A/B Testing Analytics',
        market_importance: 89,
        student_mastery: 74,
        status: 'in_progress',
        labor_note: 'Essential benchmark for feature validation, user funnel conversion, and growth loops.',
      },
      {
        skill: 'Go-to-Market (GTM) Strategy & Customer Discovery',
        market_importance: 85,
        student_mastery: 84,
        status: 'proficient',
        labor_note: 'Key leadership capability for early-stage commercialization and product-market fit.',
      },
    ],
    labor_market_summary: `Federal labor market data (O*NET 15-1299.09) projects sustained 18% demand growth for ${careerGoal}s. While your go-to-market and product roadmapping foundations are strong (84%), your quantitative unit economics proficiency (${lowestTopic.mastery_score}%) forms your primary bottleneck for executive readiness.`,
  } : {
    job_title: careerGoal,
    onet_code: '15-1252.00',
    soc_title: 'Software Developers & Quality Assurance Analysts',
    market_growth_rate: '+25% (Much faster than average 2022-2032)',
    median_wage_annual: '$127,260 / year (BLS & O*NET data)',
    readiness_score: 74,
    critical_skill_gaps: [
      {
        skill: 'Relational Database Schema Design (SQL, 3NF, BCNF)',
        market_importance: 94,
        student_mastery: Number(lowestTopic.mastery_score) || 52,
        status: 'critical_gap',
        labor_note: 'Crucial for multi-tenant data integrity, ACID compliance, and backend performance.',
      },
      {
        skill: 'RESTful API Engineering & Server-Side Logic',
        market_importance: 91,
        student_mastery: 78,
        status: 'in_progress',
        labor_note: 'Standard industry requirement for backend service integration and microservices.',
      },
      {
        skill: 'Algorithms, Data Structures & Complexity',
        market_importance: 88,
        student_mastery: 85,
        status: 'proficient',
        labor_note: 'Essential benchmark tested in technical screening interviews.',
      },
      {
        skill: 'Cloud Deployment, Containerization & CI/CD',
        market_importance: 82,
        student_mastery: 65,
        status: 'in_progress',
        labor_note: 'High differentiator for junior to mid-level engineering roles.',
      },
    ],
    labor_market_summary: `Federal labor market data (O*NET 15-1252.00) indicates sustained 25% demand growth for ${careerGoal}s. While your algorithmic and data structure foundations are strong (85%), your relational database proficiency (${lowestTopic.mastery_score}%) forms your primary bottleneck for production readiness.`,
  };

  // 2. 3-Month Strategic Phased Roadmap
  const threeMonthPlan: MonthMilestone[] = isMba ? [
    {
      month_number: 1,
      month_title: 'Month 1: Financial Modeling & Unit Economics Deficit Recovery',
      phase: 'Weeks 1–4 · Quantitative Prerequisite Remediation',
      objective: `Eliminate the critical deficit in ${lowestCourse.name} and master LTV/CAC ratios, cohort churn modeling, and payback horizons.`,
      allocated_hours_per_week: weeklyHours,
      primary_focus_areas: [
        `Targeted Quest: "Master Unit Economics & LTV/CAC" — 6-stage quantitative cohort modeling drills`,
        `SaaS P&L and contribution margin sensitivity analysis in Excel & Python`,
        `Weekly executive case teardowns (matched to your Team Driver collaborative preference)`,
        `Office hours consultation with Prof. Vikram Malhotra (${lowestCourse.name})`,
      ],
      key_milestone_deliverable: `Achieve ≥ 75% on Unit Economics Topic Mastery assessment and unlock the "Venture Architect" badge.`,
      academic_remedy_target: `Recover ${lowestCourse.name} grade from ${lowestCourse.score}% to 75%+.`,
      co_curricular_action: `Join the Graduate Product Management Club (GPMC) case sprint series.`,
      status: 'active',
    },
    {
      month_number: 2,
      month_title: 'Month 2: Strategic Product Spec & Customer Discovery Sprint',
      phase: 'Weeks 5–8 · Cross-Functional Integration & Midterms',
      objective: `Channel your ${archetypeName} leadership strengths into conducting user discovery, drafting PRDs (Product Requirement Docs), and acing midterms.`,
      allocated_hours_per_week: weeklyHours,
      primary_focus_areas: [
        `Author an exhaustive PRD with technical API feasibility and business ROI justifications`,
        `Design behavioral cohort funnels and retention analysis using simulated analytics telemetry`,
        `Midterm examination revision sprints across all enrolled MBA management modules`,
        `Facilitate mock cross-functional sprint planning sessions with campus engineering leads`,
      ],
      key_milestone_deliverable: `Complete and present an end-to-end Product Spec & Pricing Model for an AI SaaS platform to faculty evaluators.`,
      academic_remedy_target: `Secure Grade A or B+ across all mid-term MBA courses.`,
      co_curricular_action: `Register for the National B-School Venture Challenge (VentureQuest 2026).`,
      status: 'upcoming',
    },
    {
      month_number: 3,
      month_title: 'Month 3: Capstone Pitch, Portfolio & Executive Gateways',
      phase: 'Weeks 9–12 · Final Synthesis & Venture Defense',
      objective: `Synthesize technology commercialization, financial viability, and executive presentation into a PM leadership portfolio ready for corporate recruiting.`,
      allocated_hours_per_week: weeklyHours,
      primary_focus_areas: [
        `Executive board pitch deck simulation covering CAC payback, market sizing, and moat defense`,
        `Final Exam comprehensive case simulations under timed board-meeting constraints`,
        `Executive portfolio review with MBA Career Director and Alumni Tech PM Mentors`,
        `O*NET 15-1299.09 skill alignment and leadership behavioral interview preparation`,
      ],
      key_milestone_deliverable: `Full Technical Product Manager portfolio containing verified PRDs, financial models, and executive pitch deck.`,
      academic_remedy_target: `Final Semester SGPA ≥ 3.8 with zero course deficits below 75%.`,
      co_curricular_action: `Present your venture commercialization strategy at the Graduate Business Showcase.`,
      status: 'planned',
    },
  ] : [
    {
      month_number: 1,
      month_title: 'Month 1: Deficit Recovery & Relational Foundations',
      phase: 'Weeks 1–4 · Prerequisite Remediation',
      objective: `Eliminate the critical academic gap in ${lowestCourse.name} and master relational functional dependencies before midterm evaluations.`,
      allocated_hours_per_week: weeklyHours,
      primary_focus_areas: [
        `Targeted Quest: "Defeat Normalization" — 1NF through BCNF decomposition drills`,
        `SQL Query Optimization & Transaction Isolation anomalies review`,
        `Daily 30-minute structured worked example sessions (matched to your MFC profile)`,
        `Office hours consultation with ${lowestCourse.name} faculty`,
      ],
      key_milestone_deliverable: `Achieve ≥ 75% on the Database Systems Topic Mastery assessment and unlock the "Dependency Hunter" badge.`,
      academic_remedy_target: `Recover ${lowestCourse.name} continuous evaluation grade from ${lowestCourse.score}% to 75%+.`,
      co_curricular_action: `Attend the Open Source Society kickoff meeting to discover portfolio team projects.`,
      status: 'active',
    },
    {
      month_number: 2,
      month_title: 'Month 2: Applied Architecture & Midterm Sprint',
      phase: 'Weeks 5–8 · Integration & Midterms',
      objective: `Channel your ${archetypeName} strengths into building an end-to-end full-stack database application and ace midterm exams.`,
      allocated_hours_per_week: weeklyHours,
      primary_focus_areas: [
        `Architect a multi-entity database schema using 3NF/BCNF principles for a production web app`,
        `Build Node.js/Next.js CRUD backend with strict foreign-key integrity constraints`,
        `Midterm examination revision sprints across all enrolled courses`,
        `Pair-programming review with campus developer group`,
      ],
      key_milestone_deliverable: `Deploy a production-ready Full-Stack prototype with normalized schema to GitHub with complete technical documentation.`,
      academic_remedy_target: `Secure Grade B+ or higher across all mid-term subject examinations.`,
      co_curricular_action: `Enter the Annual University Hackathon (HackTheCampus) under the Scalable Web track.`,
      status: 'upcoming',
    },
    {
      month_number: 3,
      month_title: 'Month 3: Apex Synthesis & Career Gateways',
      phase: 'Weeks 9–12 · Final Mastery & Portfolio',
      objective: `Achieve final course mastery, complete capstone synthesis, and package your academic achievements into a verified developer portfolio.`,
      allocated_hours_per_week: weeklyHours,
      primary_focus_areas: [
        `Apex Boss Battle Simulations covering multi-table query indexing and concurrency`,
        `Final Exam mock tests under timed conditions to mitigate performance friction`,
        `Portfolio review with Department Academic Advisor and University Career Center`,
        `Resume alignment with O*NET 15-1252.00 skill keywords`,
      ],
      key_milestone_deliverable: `Comprehensive end-of-semester mastery portfolio ready for internship recruiting and faculty recommendation letters.`,
      academic_remedy_target: `Final Semester SGPA $\\ge$ 8.5 with zero course deficits below 75%.`,
      co_curricular_action: `Present your database web application at the Department Undergraduate Project Showcase.`,
      status: 'planned',
    },
  ];

  // 3. Recommended Next Semester Courses
  const recommendedCourses: RecommendedCourse[] = isMba ? [
    {
      code: 'MB301',
      name: 'Enterprise Product Strategy & Platform Ecosystems',
      credits: 4,
      semester: Number(profile?.current_semester || 3) + 1,
      relevance_score: 98,
      quality_rating: 4.9,
      workload_level: 'Heavy',
      prereq_status: Number(lowestCourse.score) >= 70 ? 'satisfied' : 'deficit_needs_fix',
      why_recommended: `Essential capstone course for Technical Product Managers. Deep dives into network effects, two-sided platform economics, and developer API ecosystems.`,
    },
    {
      code: 'MB305',
      name: 'Technology Commercialization & Venture Capital',
      credits: 4,
      semester: Number(profile?.current_semester || 3) + 1,
      relevance_score: 95,
      quality_rating: 4.8,
      workload_level: 'Moderate',
      prereq_status: 'satisfied',
      why_recommended: `Direct alignment with venture growth and product financing. Covers term sheets, cap tables, valuation modeling, and post-launch scaling strategies.`,
    },
    {
      code: 'BA302',
      name: 'Executive Data Visualization & Business Dashboards',
      credits: 3,
      semester: Number(profile?.current_semester || 3) + 1,
      relevance_score: 90,
      quality_rating: 4.7,
      workload_level: 'Light',
      prereq_status: 'satisfied',
      why_recommended: `Complements strategic leadership with visual storytelling, executive Tableau/PowerBI reporting, and KPI metric telemetry design.`,
    },
  ] : [
    {
      code: 'CS304',
      name: 'Distributed Systems & Cloud Architecture',
      credits: 4,
      semester: Number(profile?.current_semester || 4) + 1,
      relevance_score: 96,
      quality_rating: 4.8,
      workload_level: 'Moderate',
      prereq_status: Number(lowestCourse.score) >= 70 ? 'satisfied' : 'deficit_needs_fix',
      why_recommended: `Essential for modern ${careerGoal} roles. Builds directly on database indexing and networking primitives.`,
    },
    {
      code: 'CS308',
      name: 'Advanced Full-Stack Engineering & Microservices',
      credits: 4,
      semester: Number(profile?.current_semester || 4) + 1,
      relevance_score: 98,
      quality_rating: 4.9,
      workload_level: 'Heavy',
      prereq_status: 'satisfied',
      why_recommended: `Direct capstone alignment with your career goal. Covers Next.js, Docker, API gateways, and production CI/CD.`,
    },
    {
      code: 'CS312',
      name: 'Human-Computer Interaction & Design Systems',
      credits: 3,
      semester: Number(profile?.current_semester || 4) + 1,
      relevance_score: 87,
      quality_rating: 4.6,
      workload_level: 'Light',
      prereq_status: 'satisfied',
      why_recommended: `Balances cognitive workload alongside heavy technical labs while polishing frontend design sensibilities.`,
    },
  ];

  // 4. Campus & Faculty Resources Directory
  const campusResources: CampusResource[] = isMba ? [
    {
      category: 'Faculty Office Hours',
      title: 'Prof. Vikram Malhotra — MB201 Strategic Product Mgmt Chair',
      contact_or_location: 'Faculty Cabin MGMT-204 · School of Business',
      availability: 'Wednesdays & Fridays · 3:00 PM – 5:00 PM',
      relevance_reason: `Recommended consultation point for addressing your ${lowestTopic.topic_name} diagnostic gaps and SaaS financial modeling directly with faculty.`,
      action_label: 'Book Office Hours Slot',
    },
    {
      category: 'Peer Tutoring Desk',
      title: 'MBA Quantitative Finance & Analytics Clinic',
      contact_or_location: 'Executive Lounge, 2nd Floor Business Tower',
      availability: 'Monday – Thursday · 4:00 PM – 7:00 PM',
      relevance_reason: 'Peer-assisted financial modeling, SaaS cohort retention spreadsheets, and unit economics peer review with senior teaching fellows.',
      action_label: 'Schedule Modeling Session',
    },
    {
      category: 'Academic Success Lab',
      title: 'Center for Executive Communication & Case Analysis',
      contact_or_location: 'Business Library Room B-102',
      availability: 'Drop-in sessions daily · 2:00 PM – 4:00 PM',
      relevance_reason: 'Provides structured practice on executive memo writing, board presentations, and case competition frameworks.',
      action_label: 'View Workshop Schedule',
    },
    {
      category: 'Career & Research',
      title: 'Graduate Career Services — Technology & Product Practice Cell',
      contact_or_location: 'Venture Tower, 3rd Floor',
      availability: 'Appointment via Student Portal',
      relevance_reason: 'PM resume audits, case interview simulations, and O*NET skill alignment reviews with alumni tech PMs.',
      action_label: 'Request PM Coaching',
    },
  ] : [
    {
      category: 'Faculty Office Hours',
      title: 'Dr. Priya Mehta — CS201 DBMS Lead Instructor',
      contact_or_location: 'Faculty Cabin CS-304 · Academic Block B',
      availability: 'Tuesdays & Thursdays · 2:00 PM – 4:00 PM',
      relevance_reason: `Recommended consultation point for addressing your ${lowestTopic.topic_name} diagnostic gaps directly with faculty.`,
      action_label: 'Book Office Hours Slot',
    },
    {
      category: 'Peer Tutoring Desk',
      title: 'Computer Science Department Learning Center',
      contact_or_location: 'CS Lab 2, Ground Floor (Walk-in or Schedule)',
      availability: 'Monday – Friday · 10:00 AM – 6:00 PM',
      relevance_reason: 'Peer-assisted code reviews and schema normalization whiteboard drills with senior graduate teaching assistants.',
      action_label: 'Schedule Peer Session',
    },
    {
      category: 'Academic Success Lab',
      title: 'University Logic & Quantitative Reasoning Clinic',
      contact_or_location: 'Central Library, Room L-210',
      availability: 'Drop-in sessions daily · 3:00 PM – 5:00 PM',
      relevance_reason: 'Provides step-by-step scaffolding on relational calculus, predicate logic, and discrete dependency proofs.',
      action_label: 'View Clinic Schedule',
    },
    {
      category: 'Career & Research',
      title: 'University Career Center — Tech Industry Advisory Cell',
      contact_or_location: 'Student Activity Center, 1st Floor',
      availability: 'Appointment via Student Portal',
      relevance_reason: 'Resume audits, O*NET skill alignment verification, and mock technical interview simulations.',
      action_label: 'Request Career Review',
    },
  ];

  // 5. University Co-Curricular & Career Radar
  const campusOpportunities: CampusOpportunity[] = isMba ? [
    {
      type: 'Club & Chapter',
      title: 'Graduate Product Management Club (GPMC)',
      timing: 'Bi-weekly meetings · Tuesdays 6:00 PM',
      archetype_alignment: `High Resonance for ${archetypeName}: Cross-functional leadership, product tear-downs, and case competitions.`,
      career_benefit: 'Builds direct executive network with alumni product leaders and PM interview circles.',
      badge_xp_reward: '+50 XP · Campus PM Leader Badge',
    },
    {
      type: 'Hackathon & Competition',
      title: 'Annual University Venture Challenge (VentureQuest 2026)',
      timing: 'October 22–24, 2026 · School of Business Auditorium',
      archetype_alignment: `Perfect fit for your high Extraversion (84) and Conscientiousness (78) in pitching and commercialization.`,
      career_benefit: 'Fast-tracks seed angel funding and executive mentor matching with VC sponsors.',
      badge_xp_reward: '+150 XP · Venture Finalist Badge',
    },
    {
      type: 'Research Lab',
      title: 'Digital Transformation & Platform Economy Research Center',
      timing: 'Spring Graduate Research Fellowship · 5 hrs/week',
      archetype_alignment: 'Directly bridges your coursework with cutting-edge research in two-sided marketplaces and AI product strategy.',
      career_benefit: 'Opportunity for co-authored HBR/Ivey case study publication.',
      badge_xp_reward: '+200 XP · Case Author Badge',
    },
    {
      type: 'Industry Conference',
      title: 'National Product & Innovation Summit (ProductCon 2026)',
      timing: 'November 12, 2026 · Hybrid / Convention Center',
      archetype_alignment: 'High-energy keynotes from VP/CPO leaders at top tech companies.',
      career_benefit: 'Direct access to Senior Product Directors and executive recruiters.',
      badge_xp_reward: '+75 XP · Product Fellow Badge',
    },
  ] : [
    {
      type: 'Club & Chapter',
      title: 'Open Source Developers Society (OSDS)',
      timing: 'Bi-weekly meetings · Wednesdays 5:30 PM',
      archetype_alignment: `High Resonance for ${archetypeName}: Hands-on collaboration, architecture design, and tangible pull-requests.`,
      career_benefit: 'Builds public GitHub contributions and demonstrates teamwork to prospective employers.',
      badge_xp_reward: '+50 XP · Campus Builder Badge',
    },
    {
      type: 'Hackathon & Competition',
      title: 'Annual Inter-Collegiate Hackathon (HackTheCampus 2026)',
      timing: 'November 14–16, 2026 · Registration opens next week',
      archetype_alignment: `Perfect fit for your high Openness (84) and Conscientiousness (78).`,
      career_benefit: 'Fast-tracks interviews with hiring sponsors and awards project portfolio cred.',
      badge_xp_reward: '+150 XP · Hackathon Contender Badge',
    },
    {
      type: 'Research Lab',
      title: 'Data Systems & Scalable Infrastructure Research Lab',
      timing: 'Fall Undergraduate Research Fellowship · 5 hrs/week',
      archetype_alignment: 'Directly bridges your DBMS coursework with advanced research in distributed databases.',
      career_benefit: 'Opportunity for co-authored paper publication and strong faculty recommendation letters.',
      badge_xp_reward: '+200 XP · Junior Researcher Badge',
    },
    {
      type: 'Industry Conference',
      title: 'National Student Developer Summit (DevCon Student)',
      timing: 'December 4, 2026 · Hybrid Campus Hub',
      archetype_alignment: 'Inspiring keynote sessions on modern full-stack architectures and AI integration.',
      career_benefit: 'Direct access to senior engineering managers and alumni recruiters.',
      badge_xp_reward: '+75 XP · Industry Explorer Badge',
    },
  ];

  // 6. Systematic Basis Explanation
  const basisExplanation = isMba ? {
    academic_deficit_lever: `Rooted in continuous course evaluation data: ${lowestCourse.name} is currently your primary academic gap (${lowestCourse.score}%), with ${lowestTopic.topic_name} at ${lowestTopic.mastery_score}%. Prerequisite dependency rules require resolving this quantitative foundation before enrolling in Enterprise Product Strategy.`,
    onet_labor_alignment: `Grounded in federal labor market benchmarks (O*NET 15-1299.09) for "${careerGoal}". Employers mandate unit economics, cohort retention metrics, and customer lifetime value as prerequisite competencies for product management roles.`,
    time_feasibility: `Calibrated to your verified weekly learning capacity of ${weeklyHours} hours/week over 12 academic weeks (192 total hours), designed for executive balance between coursework and case competitions.`,
    personality_resonance: `Tailored to your derived OCEAN Archetype (${archetypeName} — E: 84, C: 78, O: 74, N: 32), emphasizing collaborative leadership, cross-functional sprints, structured case deliverables, and low-friction iterative checkpoints.`,
  } : {
    academic_deficit_lever: `Rooted in continuous course evaluation data: ${lowestCourse.name} is currently your widest academic gap (${lowestCourse.score}%), with ${lowestTopic.topic_name} at ${lowestTopic.mastery_score}%. Prerequisite dependency rules require resolving this before moving into Advanced Distributed Systems.`,
    onet_labor_alignment: `Grounded in federal labor market benchmarks (O*NET 15-1252.00) for "${careerGoal}". Employers mandate relational schema integrity and API design as baseline competencies.`,
    time_feasibility: `Calibrated to your verified weekly learning capacity of ${weeklyHours} hours/week over 12 academic weeks (168 total hours), preventing cognitive overload or burnout.`,
    personality_resonance: `Tailored to your derived OCEAN Archetype (${archetypeName} — O: 84, C: 78, N: 38), emphasizing concrete milestone targets, autonomous project deliverables, and low-friction iterative checkpoints.`,
  };

  return {
    onet,
    three_month_plan: threeMonthPlan,
    recommended_courses: recommendedCourses,
    campus_resources: campusResources,
    campus_opportunities: campusOpportunities,
    basis_explanation: basisExplanation,
  };
}
