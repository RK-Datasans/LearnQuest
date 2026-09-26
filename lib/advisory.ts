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

  // Identify lowest performing course and topic
  const sortedCourses = [...courses].sort((a, b) => Number(a.score) - Number(b.score));
  const lowestCourse = sortedCourses[0] || { name: 'Database Systems', score: 62 };
  
  const sortedTopics = [...topicMastery].sort((a, b) => Number(a.mastery_score) - Number(b.mastery_score));
  const lowestTopic = sortedTopics[0] || { topic_name: 'Normalization (1NF, 2NF, 3NF, BCNF)', mastery_score: 52 };

  // 1. O*NET Labor Market Alignment
  const onet: ONETAlignment = {
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
  const threeMonthPlan: MonthMilestone[] = [
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
  const recommendedCourses: RecommendedCourse[] = [
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
  const campusResources: CampusResource[] = [
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
  const campusOpportunities: CampusOpportunity[] = [
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
  const basisExplanation = {
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
