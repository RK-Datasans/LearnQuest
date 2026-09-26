// Script to generate comprehensive, internally-consistent seed data for LearnQuest AI
// Generates database/seed.sql and combines with database/schema.sql to create database/learnquest_full.sql

const fs = require('fs');
const path = require('path');

let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  bcrypt = null;
}

const saltRounds = 10;
const demoPassword = 'Demo123!';
// Standard bcrypt hash for 'Demo123!' with salt if bcryptjs is not yet resolved
const defaultDemoHash = bcrypt 
  ? bcrypt.hashSync(demoPassword, saltRounds)
  : '$2a$10$X8qYn7G2/JbU3G7ZgU.G2e7sT0rM2oE6hJ2d4pG4.gYvUfI7f/vQoK';

console.log('Demo password hash generated:', defaultDemoHash);

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

// 1. Users
const users = [
  // Student 1: Rahul Sharma (STU-2026-1042)
  { id: 1, name: 'Rahul Sharma', email: 'student@learnquest.local', password_hash: defaultDemoHash, role: 'student', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  // Faculty: Dr. Priya Mehta
  { id: 2, name: 'Dr. Priya Mehta', email: 'faculty@learnquest.local', password_hash: defaultDemoHash, role: 'faculty', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
];

// Names for synthetic students
const firstNames = [
  'Aarav', 'Aditi', 'Ananya', 'Aryan', 'Deepak', 'Divya', 'Ishaan', 'Kavya', 'Manish', 'Neha',
  'Pooja', 'Pranav', 'Rhea', 'Rohan', 'Sakshi', 'Sameer', 'Shreya', 'Siddharth', 'Tanvi', 'Varun',
  'Vikram', 'Anjali', 'Kunal', 'Meera', 'Nikhil', 'Priyanka', 'Rishabh', 'Sneha', 'Tarun', 'Vidya',
  'Akash', 'Bhavna', 'Chetan', 'Geeta', 'Harsh', 'Isha', 'Jatin', 'Kiran', 'Lalit', 'Mansi', 'Naveen'
];
const lastNames = [
  'Patel', 'Iyer', 'Nair', 'Verma', 'Singh', 'Reddy', 'Chopra', 'Gupta', 'Deshmukh', 'Bose',
  'Menon', 'Kulkarni', 'Joshi', 'Kapoor', 'Malhotra', 'Sinha', 'Bhat', 'Rao', 'Pandey', 'Saxena',
  'Chatterjee', 'Mishra', 'Bhattacharya', 'Dubey', 'Trivedi', 'Agarwal', 'Sen', 'Pillai', 'Rangan', 'Shukla'
];

for (let i = 0; i < 41; i++) {
  const fName = firstNames[i % firstNames.length];
  const lName = lastNames[(i * 3) % lastNames.length];
  const id = i + 3; // users 3 to 43
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${id}@university.edu`;
  users.push({
    id,
    name: `${fName} ${lName}`,
    email,
    password_hash: defaultDemoHash,
    role: 'student',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fName}${lName}`
  });
}

// 2. Departments
const departments = [
  { id: 1, code: 'CSE', name: 'Department of Computer Science & Engineering' },
  { id: 2, code: 'ECE', name: 'Department of Electronics & Communication Engineering' },
  { id: 3, code: 'MGMT', name: 'School of Management & Business Analytics' },
  { id: 4, code: 'DES', name: 'Department of Design & Interaction' },
  { id: 5, code: 'IT', name: 'Department of Information Technology' }
];

// 3. Programs
const programs = [
  { id: 1, department_id: 1, degree: 'B.Tech', name: 'Computer Science and Engineering', code: 'BT-CSE', total_semesters: 8, total_credits: 160 },
  { id: 2, department_id: 2, degree: 'B.Tech', name: 'Electronics and Communication', code: 'BT-ECE', total_semesters: 8, total_credits: 160 },
  { id: 3, department_id: 5, degree: 'B.Tech', name: 'Information Technology', code: 'BT-IT', total_semesters: 8, total_credits: 160 },
  { id: 4, department_id: 3, degree: 'BBA', name: 'Business Analytics', code: 'BBA-BA', total_semesters: 6, total_credits: 120 },
  { id: 5, department_id: 4, degree: 'B.Des', name: 'Interaction Design', code: 'BDES-ID', total_semesters: 8, total_credits: 160 },
  { id: 6, department_id: 3, degree: 'MBA', name: 'Technology Management', code: 'MBA-TM', total_semesters: 4, total_credits: 80 },
  { id: 7, department_id: 1, degree: 'MCA', name: 'Computer Applications', code: 'MCA', total_semesters: 4, total_credits: 80 }
];

// 4. Courses
const courses = [
  // CSE Courses
  { id: 1, program_id: 1, code: 'CS101', name: 'Advanced Programming in C++/Python', credits: 3, semester: 4 },
  { id: 2, program_id: 1, code: 'CS201', name: 'Data Structures and Algorithms', credits: 4, semester: 4 },
  { id: 3, program_id: 1, code: 'CS202', name: 'Database Systems', credits: 4, semester: 4 },
  { id: 4, program_id: 1, code: 'CS203', name: 'Operating Systems', credits: 4, semester: 4 },
  { id: 5, program_id: 1, code: 'CS204', name: 'Computer Networks', credits: 4, semester: 4 },
  { id: 6, program_id: 1, code: 'CS301', name: 'Software Engineering & Agile Methodologies', credits: 3, semester: 5 },
  { id: 7, program_id: 1, code: 'CS302', name: 'Artificial Intelligence & Machine Learning', credits: 4, semester: 6 },
  // ECE Courses
  { id: 8, program_id: 2, code: 'EC201', name: 'Digital Signal Processing', credits: 4, semester: 4 },
  { id: 9, program_id: 2, code: 'EC202', name: 'Embedded Systems & Microcontrollers', credits: 4, semester: 4 },
  { id: 10, program_id: 2, code: 'EC203', name: 'VLSI Circuit Design', credits: 4, semester: 4 },
  { id: 11, program_id: 2, code: 'EC101', name: 'Signals and Systems', credits: 3, semester: 3 },
  // BBA BA Courses
  { id: 12, program_id: 4, code: 'BA201', name: 'Predictive Analytics & Forecasting', credits: 4, semester: 4 },
  { id: 13, program_id: 4, code: 'BA202', name: 'Business Intelligence & Data Visualization', credits: 4, semester: 4 },
  { id: 14, program_id: 4, code: 'BA203', name: 'Financial Modeling & Valuation', credits: 3, semester: 4 },
  { id: 15, program_id: 4, code: 'BA101', name: 'Business Statistics', credits: 3, semester: 2 },
  // B.Des Courses
  { id: 16, program_id: 5, code: 'DS201', name: 'User Experience & Information Architecture', credits: 4, semester: 4 },
  { id: 17, program_id: 5, code: 'DS202', name: 'Interactive Prototyping & Motion Design', credits: 4, semester: 4 },
  { id: 18, program_id: 5, code: 'DS101', name: 'Design Systems & Human Computer Ergonomics', credits: 3, semester: 3 },
  // MBA Courses
  { id: 19, program_id: 6, code: 'MB201', name: 'Strategic Product Management', credits: 4, semester: 2 },
  { id: 20, program_id: 6, code: 'MB202', name: 'Technology Commercialization & Venture Scale', credits: 4, semester: 2 },
  { id: 21, program_id: 6, code: 'MB101', name: 'Data-Driven Executive Decision Making', credits: 3, semester: 1 },
  // IT Courses
  { id: 22, program_id: 3, code: 'IT201', name: 'Web Architectures & Cloud Microservices', credits: 4, semester: 4 },
  { id: 23, program_id: 3, code: 'IT202', name: 'Cybersecurity Fundamentals & Cryptography', credits: 4, semester: 4 },
  // MCA Course
  { id: 24, program_id: 7, code: 'MC201', name: 'Enterprise Software Systems & Architecture', credits: 4, semester: 2 }
];

// 5. Course Topics (especially CS202)
const course_topics = [
  // CS202 Database Systems Topics
  { id: 1, course_id: 3, name: 'Normalization (1NF, 2NF, 3NF, BCNF)', description: 'Functional dependencies, lossless join decomposition, partial and transitive dependencies.', order_index: 1, difficulty_level: 'Medium' },
  { id: 2, course_id: 3, name: 'Transactions & Concurrency Control', description: 'ACID guarantees, serializability, two-phase locking, deadlock handling.', order_index: 2, difficulty_level: 'Hard' },
  { id: 3, course_id: 3, name: 'B-Tree Indexing & Query Optimization', description: 'Index structures, hash indices, explain plan analysis, cost-based optimizer.', order_index: 3, difficulty_level: 'Medium' },
  { id: 4, course_id: 3, name: 'Relational Algebra & Tuple Calculus', description: 'Projection, selection, Cartesian product, set differences, and join algebra.', order_index: 4, difficulty_level: 'Easy' },
  { id: 5, course_id: 3, name: 'Advanced SQL Queries & Window Functions', description: 'Aggregations, group by with having, CTEs, partition by, inner/outer joins.', order_index: 5, difficulty_level: 'Easy' },
  
  // CS201 Data Structures Topics
  { id: 6, course_id: 2, name: 'Graph Algorithms (Dijkstra, BFS, DFS)', description: 'Shortest path, topological sort, spanning trees.', order_index: 1, difficulty_level: 'Medium' },
  { id: 7, course_id: 2, name: 'Dynamic Programming & Memoization', description: 'Optimal substructure, overlapping subproblems.', order_index: 2, difficulty_level: 'Hard' },

  // CS203 Operating Systems Topics
  { id: 8, course_id: 4, name: 'Virtual Memory & Paging', description: 'Page tables, TLB, page replacement algorithms.', order_index: 1, difficulty_level: 'Medium' },
  { id: 9, course_id: 4, name: 'Process Synchronization & Semaphores', description: 'Critical section problem, mutexes, monitors.', order_index: 2, difficulty_level: 'Hard' },

  // EC202 Embedded Systems Topics
  { id: 10, course_id: 9, name: 'ARM Cortex Architecture & Interrupts', description: 'NVIC, interrupt latency, register bank.', order_index: 1, difficulty_level: 'Medium' },
  
  // BA201 Business Analytics Topics
  { id: 11, course_id: 12, name: 'Regression Modeling & Residual Analysis', description: 'Ordinary least squares, homoscedasticity, multicollinearity.', order_index: 1, difficulty_level: 'Medium' },

  // DS201 Interaction Design Topics
  { id: 12, course_id: 16, name: 'Design Heuristics & Usability Auditing', description: 'Nielsen-Molich heuristics, cognitive walkthroughs.', order_index: 1, difficulty_level: 'Medium' }
];

// 6. Student Profiles (42 total)
// Student 1: Rahul Sharma (STU-2026-1042)
const student_profiles = [
  {
    id: 1,
    user_id: 1,
    student_id: 'STU-2026-1042',
    program_id: 1, // B.Tech CSE
    specialization: 'Software Systems',
    academic_year: 2026,
    year_of_study: 2,
    current_semester: 4,
    cgpa: 8.10,
    credits_completed: 72,
    expected_graduation_year: 2028,
    career_goal: 'Software Engineer',
    interests: 'AI, Backend, Cloud',
    weekly_learning_hours: 8,
    current_streak: 4,
    total_xp: 380,
    level: 4,
    academic_health_score: 72,
    is_synthetic: 0
  }
];

// Stream distributions for synthetic students:
// 17 more CSE (IDs 2-18), 7 ECE (19-25), 6 BBA (26-31), 5 B.Des (32-36), 4 MBA (37-40), 2 IT (41-42)
const streamConfigs = [
  // 17 CSE students: 7 of them in Year 2 with low DBMS scores to make 8 total with Rahul
  ...Array(17).fill(0).map((_, idx) => {
    const isWeakCSEYear2 = idx < 7; // exactly 7 peers + Rahul = 8 CSE Year 2 students struggling with Normalization
    return {
      program_id: 1,
      specialization: idx % 2 === 0 ? 'Software Systems' : 'Artificial Intelligence',
      year_of_study: isWeakCSEYear2 ? 2 : (idx % 3 + 1),
      current_semester: isWeakCSEYear2 ? 4 : (idx % 3 * 2 + 2),
      cgpa: isWeakCSEYear2 ? (6.8 + (idx * 0.15)) : (7.5 + (idx * 0.12)),
      credits_completed: isWeakCSEYear2 ? 70 : (idx % 3 + 1) * 36,
      career_goal: ['Software Engineer', 'Full Stack Developer', 'Cloud Engineer', 'Machine Learning Engineer'][idx % 4],
      interests: 'Backend, Systems, Cloud, Algorithms',
      weekly_learning_hours: 6 + (idx % 5),
      streak: (idx * 2) % 6,
      xp: 220 + idx * 45,
      health: isWeakCSEYear2 ? (62 + idx) : (75 + (idx % 18)),
      weakDBMS: isWeakCSEYear2
    };
  }),
  // 7 ECE students
  ...Array(7).fill(0).map((_, idx) => ({
    program_id: 2,
    specialization: 'Embedded Systems & IoT',
    year_of_study: 2,
    current_semester: 4,
    cgpa: 7.4 + (idx * 0.2),
    credits_completed: 72,
    career_goal: 'Embedded Systems Engineer',
    interests: 'Hardware, Firmware, Microcontrollers, Robotics',
    weekly_learning_hours: 7 + (idx % 4),
    streak: (idx + 1) % 5,
    xp: 250 + idx * 50,
    health: 70 + (idx * 2),
    weakDBMS: false
  })),
  // 6 BBA Business Analytics
  ...Array(6).fill(0).map((_, idx) => ({
    program_id: 4,
    specialization: 'Quantitative Analytics',
    year_of_study: 2,
    current_semester: 4,
    cgpa: 7.8 + (idx * 0.18),
    credits_completed: 60,
    career_goal: 'Data Analyst',
    interests: 'Business Intelligence, Machine Learning, Tableau, Strategy',
    weekly_learning_hours: 8,
    streak: idx % 4,
    xp: 280 + idx * 40,
    health: 73 + (idx * 2),
    weakDBMS: false
  })),
  // 5 B.Des Interaction Design
  ...Array(5).fill(0).map((_, idx) => ({
    program_id: 5,
    specialization: 'Digital Experience Design',
    year_of_study: 2,
    current_semester: 4,
    cgpa: 8.2 + (idx * 0.15),
    credits_completed: 72,
    career_goal: 'UX Designer',
    interests: 'Design Systems, User Research, Accessibility, Interaction',
    weekly_learning_hours: 9,
    streak: idx + 1,
    xp: 310 + idx * 40,
    health: 80 + idx,
    weakDBMS: false
  })),
  // 4 MBA Technology Management
  ...Array(4).fill(0).map((_, idx) => ({
    program_id: 6,
    specialization: 'Product Leadership',
    year_of_study: 1,
    current_semester: 2,
    cgpa: 8.4 + (idx * 0.1),
    credits_completed: 40,
    career_goal: 'Product Manager',
    interests: 'Agile Strategy, FinTech, Venture Scale, Enterprise SaaS',
    weekly_learning_hours: 10,
    streak: 3,
    xp: 400 + idx * 60,
    health: 82 + idx,
    weakDBMS: false
  })),
  // 2 IT students
  ...Array(2).fill(0).map((_, idx) => ({
    program_id: 3,
    specialization: 'Cloud Security',
    year_of_study: 2,
    current_semester: 4,
    cgpa: 7.6 + idx * 0.4,
    credits_completed: 72,
    career_goal: 'Cloud Solutions Architect',
    interests: 'DevOps, Cyber Defense, AWS, Distributed Systems',
    weekly_learning_hours: 8,
    streak: 2,
    xp: 290,
    health: 74,
    weakDBMS: false
  }))
];

for (let i = 0; i < 41; i++) {
  const conf = streamConfigs[i];
  const sId = i + 2;
  student_profiles.push({
    id: sId,
    user_id: sId + 1, // mapping to users table
    student_id: `STU-2026-${1042 + i + 1}`,
    program_id: conf.program_id,
    specialization: conf.specialization,
    academic_year: 2026,
    year_of_study: conf.year_of_study,
    current_semester: conf.current_semester,
    cgpa: Number(conf.cgpa.toFixed(2)),
    credits_completed: conf.credits_completed,
    expected_graduation_year: conf.academic_year ? conf.academic_year + (4 - conf.year_of_study) : 2028,
    career_goal: conf.career_goal,
    interests: conf.interests,
    weekly_learning_hours: conf.weekly_learning_hours,
    current_streak: conf.streak,
    total_xp: conf.xp,
    level: Math.floor(conf.xp / 100) + 1,
    academic_health_score: conf.health,
    is_synthetic: 1
  });
}

// 7. Student Courses & Topic Mastery
const student_courses = [];
const topic_mastery = [];

// Rahul Sharma (Student 1) exact records:
// Programming 86, Algorithms 78, Database Systems 62, Operating Systems 71, Computer Networks 74
const rahulCourses = [
  { student_id: 1, course_id: 1, semester: 4, score: 86.0, grade: 'A', status: 'enrolled' },
  { student_id: 1, course_id: 2, semester: 4, score: 78.0, grade: 'B+', status: 'enrolled' },
  { student_id: 1, course_id: 3, semester: 4, score: 62.0, grade: 'C', status: 'enrolled' }, // DBMS (Weak Focus)
  { student_id: 1, course_id: 4, semester: 4, score: 71.0, grade: 'B', status: 'enrolled' },
  { student_id: 1, course_id: 5, semester: 4, score: 74.0, grade: 'B', status: 'enrolled' },
];
student_courses.push(...rahulCourses);

// Rahul's CS202 Topic Mastery:
// Weak: Normalization (52%), Transactions (58%), Indexing (64%)
// Strong: Relational Algebra (82%), SQL Queries (85%)
const rahulMastery = [
  { student_id: 1, topic_id: 1, mastery_score: 52, attempts_count: 5 }, // Normalization
  { student_id: 1, topic_id: 2, mastery_score: 58, attempts_count: 3 }, // Transactions
  { student_id: 1, topic_id: 3, mastery_score: 64, attempts_count: 4 }, // Indexing
  { student_id: 1, topic_id: 4, mastery_score: 82, attempts_count: 2 }, // Relational Algebra
  { student_id: 1, topic_id: 5, mastery_score: 85, attempts_count: 3 }, // SQL Queries
  // CS201 Topics
  { student_id: 1, topic_id: 6, mastery_score: 80, attempts_count: 4 },
  { student_id: 1, topic_id: 7, mastery_score: 75, attempts_count: 4 },
  // CS203 Topics
  { student_id: 1, topic_id: 8, mastery_score: 70, attempts_count: 3 },
  { student_id: 1, topic_id: 9, mastery_score: 72, attempts_count: 3 }
];
topic_mastery.push(...rahulMastery);

// Enroll synthetic students in their program-relevant courses
let scIdCounter = rahulCourses.length + 1;
student_profiles.slice(1).forEach((sp, idx) => {
  const isWeakCSEYear2 = idx < 7; // peers with weak DBMS Normalization
  
  if (sp.program_id === 1) { // CSE
    const dbmsScore = isWeakCSEYear2 ? (54 + (idx * 1.5)) : (72 + (idx % 15));
    const grade = dbmsScore < 60 ? 'C-' : (dbmsScore < 70 ? 'C+' : (dbmsScore < 80 ? 'B' : 'A'));
    student_courses.push(
      { student_id: sp.id, course_id: 1, semester: sp.current_semester, score: 75 + (idx % 15), grade: 'B+', status: 'enrolled' },
      { student_id: sp.id, course_id: 2, semester: sp.current_semester, score: 72 + (idx % 18), grade: 'B', status: 'enrolled' },
      { student_id: sp.id, course_id: 3, semester: sp.current_semester, score: dbmsScore, grade: grade, status: 'enrolled' },
      { student_id: sp.id, course_id: 4, semester: sp.current_semester, score: 70 + (idx % 14), grade: 'B', status: 'enrolled' },
      { student_id: sp.id, course_id: 5, semester: sp.current_semester, score: 74 + (idx % 16), grade: 'B', status: 'enrolled' }
    );
    // Topic mastery for CSE
    const normScore = isWeakCSEYear2 ? (48 + (idx * 2)) : (70 + (idx % 20)); // gives 8 students (Rahul + 7) < 65% in Normalization
    topic_mastery.push(
      { student_id: sp.id, topic_id: 1, mastery_score: normScore, attempts_count: 4 },
      { student_id: sp.id, topic_id: 2, mastery_score: 55 + (idx % 25), attempts_count: 3 },
      { student_id: sp.id, topic_id: 3, mastery_score: 60 + (idx % 25), attempts_count: 3 },
      { student_id: sp.id, topic_id: 4, mastery_score: 75 + (idx % 20), attempts_count: 2 },
      { student_id: sp.id, topic_id: 5, mastery_score: 80 + (idx % 15), attempts_count: 3 }
    );
  } else if (sp.program_id === 2) { // ECE
    student_courses.push(
      { student_id: sp.id, course_id: 8, semester: 4, score: 76 + (idx % 14), grade: 'B+', status: 'enrolled' },
      { student_id: sp.id, course_id: 9, semester: 4, score: 72 + (idx % 15), grade: 'B', status: 'enrolled' },
      { student_id: sp.id, course_id: 10, semester: 4, score: 70 + (idx % 12), grade: 'B', status: 'enrolled' },
      { student_id: sp.id, course_id: 11, semester: 3, score: 78 + (idx % 10), grade: 'B+', status: 'completed' }
    );
    topic_mastery.push(
      { student_id: sp.id, topic_id: 10, mastery_score: 74 + (idx % 16), attempts_count: 3 }
    );
  } else if (sp.program_id === 4) { // BBA-BA
    student_courses.push(
      { student_id: sp.id, course_id: 12, semester: 4, score: 78 + (idx % 12), grade: 'B+', status: 'enrolled' },
      { student_id: sp.id, course_id: 13, semester: 4, score: 82 + (idx % 10), grade: 'A', status: 'enrolled' },
      { student_id: sp.id, course_id: 14, semester: 4, score: 74 + (idx % 14), grade: 'B', status: 'enrolled' }
    );
    topic_mastery.push(
      { student_id: sp.id, topic_id: 11, mastery_score: 76 + (idx % 15), attempts_count: 3 }
    );
  } else if (sp.program_id === 5) { // B.Des
    student_courses.push(
      { student_id: sp.id, course_id: 16, semester: 4, score: 84 + (idx % 10), grade: 'A', status: 'enrolled' },
      { student_id: sp.id, course_id: 17, semester: 4, score: 80 + (idx % 12), grade: 'A', status: 'enrolled' },
      { student_id: sp.id, course_id: 18, semester: 3, score: 86 + (idx % 8), grade: 'A+', status: 'completed' }
    );
    topic_mastery.push(
      { student_id: sp.id, topic_id: 12, mastery_score: 82 + (idx % 12), attempts_count: 2 }
    );
  } else if (sp.program_id === 6) { // MBA
    student_courses.push(
      { student_id: sp.id, course_id: 19, semester: 2, score: 82 + (idx % 10), grade: 'A', status: 'enrolled' },
      { student_id: sp.id, course_id: 20, semester: 2, score: 85 + (idx % 8), grade: 'A', status: 'enrolled' }
    );
  } else if (sp.program_id === 3) { // IT
    student_courses.push(
      { student_id: sp.id, course_id: 22, semester: 4, score: 75 + (idx % 10), grade: 'B', status: 'enrolled' },
      { student_id: sp.id, course_id: 23, semester: 4, score: 78 + (idx % 8), grade: 'B+', status: 'enrolled' }
    );
  }
});

// 8. MFC Dimensions
const mfc_dimensions = [
  { code: 'worked_examples', name: 'Worked Examples vs Practice First', description: 'Preference between inspecting structured worked examples before attempting tasks versus tackling problems first and learning through iterative feedback.', left_label: 'Worked Examples First', right_label: 'Practice First' },
  { code: 'guided_learning', name: 'Guided Scaffolding vs Autonomous', description: 'Preference for structured step-by-step guidance versus open-ended autonomous conceptual exploration.', left_label: 'Step-by-Step Guidance', right_label: 'Autonomous Exploration' },
  { code: 'visual_structure', name: 'Visual Schemas vs Procedural', description: 'Preference for visual diagrams, architectural schemas, and conceptual maps over linear procedural descriptions.', left_label: 'Visual Schemas', right_label: 'Procedural Specs' },
  { code: 'reflection', name: 'Reflective Elaboration vs Rapid Trial', description: 'Preference for stopping to self-explain and consolidate mental models versus rapid trial-and-error.', left_label: 'Reflective Elaboration', right_label: 'Rapid Trial' },
  { code: 'challenge', name: 'Ramped Progression vs Immediate Challenge', description: 'Preference for gradual scaffolding ramps versus jumping directly into high-difficulty challenges.', left_label: 'Gradual Ramp', right_label: 'Immediate Challenge' },
  { code: 'session_structure', name: 'Micro-Sessions vs Deep Focus', description: 'Preference for bite-sized 25-minute sprints versus deep immersion study blocks.', left_label: 'Bite-Sized Sprints', right_label: 'Deep Focus Blocks' },
  { code: 'collaboration', name: 'Peer Discussion vs Independent Study', description: 'Preference for exchanging perspectives with peers versus quiet solitary deep study.', left_label: 'Peer Discussion', right_label: 'Solitary Study' },
  { code: 'application', name: 'Real-World Context vs Abstract Theory', description: 'Preference for anchoring concepts in production case studies versus mathematical theoretical models.', left_label: 'Real-World Case Studies', right_label: 'Abstract First Principles' }
];

// 9. MFC Questions (10 Scenarios)
const mfc_questions = [
  {
    id: 1,
    dimension_code: 'worked_examples',
    scenario_context: 'You are tackling an intricate new technical topic such as Multi-Table Database Normalization or Dynamic Programming.',
    question_text: 'Which sequence helps you master the concepts most effectively?',
    order_index: 1,
    options: [
      { label: 'A', text: 'Walk through a complete, annotated worked example first, then solve a similar problem.', weight: 1, style_indicator: 'worked_example_high' },
      { label: 'B', text: 'Attempt the problem right away to test your intuition, then check a solution afterward.', weight: 1, style_indicator: 'practice_first_high' }
    ]
  },
  {
    id: 2,
    dimension_code: 'visual_structure',
    scenario_context: 'When analyzing a distributed database architecture with multiple foreign keys and replicas...',
    question_text: 'What kind of reference material do you reach for first?',
    order_index: 2,
    options: [
      { label: 'A', text: 'An Entity-Relationship schematic or visual topology map showing table connections.', weight: 1, style_indicator: 'visual_structure_high' },
      { label: 'B', text: 'A technical documentation page with comprehensive textual definitions and syntax rules.', weight: 1, style_indicator: 'procedural_high' }
    ]
  },
  {
    id: 3,
    dimension_code: 'reflection',
    scenario_context: 'After completing a challenging technical exercise or debugging a subtle query flaw...',
    question_text: 'How do you usually finalize the learning session?',
    order_index: 3,
    options: [
      { label: 'A', text: 'Spend 5 minutes summarizing key takeaways and writing a mental or physical note.', weight: 1, style_indicator: 'reflection_high' },
      { label: 'B', text: 'Immediately transition into the next practical challenge while the momentum is hot.', weight: 1, style_indicator: 'rapid_trial_high' }
    ]
  },
  {
    id: 4,
    dimension_code: 'guided_learning',
    scenario_context: 'When learning how to decompose an unnormalized table into 3NF and BCNF...',
    question_text: 'Which instructional format gives you greater confidence?',
    order_index: 4,
    options: [
      { label: 'A', text: 'A scaffolded interactive tutorial that breaks down each functional dependency step-by-step.', weight: 1, style_indicator: 'guided_high' },
      { label: 'B', text: 'An open-ended sandbox schema where you experiment with altering dependencies freely.', weight: 1, style_indicator: 'autonomous_high' }
    ]
  },
  {
    id: 5,
    dimension_code: 'challenge',
    scenario_context: 'When preparing for a comprehensive assessment or final evaluation...',
    question_text: 'What difficulty curve keeps you most engaged?',
    order_index: 5,
    options: [
      { label: 'A', text: 'A smooth progression from warm-up to moderate problems before attempting boss questions.', weight: 1, style_indicator: 'ramped_high' },
      { label: 'B', text: 'Jumping straight into complex, high-stakes boss battle scenarios to identify limits.', weight: 1, style_indicator: 'challenge_high' }
    ]
  },
  {
    id: 6,
    dimension_code: 'session_structure',
    scenario_context: 'You have dedicated 8 hours across the week for your specialized learning and quest goals.',
    question_text: 'How do you prefer scheduling this time on your calendar?',
    order_index: 6,
    options: [
      { label: 'A', text: 'Daily focused sprints of 25–35 minutes targeting one specific concept per session.', weight: 1, style_indicator: 'micro_sprints_high' },
      { label: 'B', text: 'Two intensive 3–4 hour marathon sessions over the weekend for deep uninterrupted focus.', weight: 1, style_indicator: 'deep_blocks_high' }
    ]
  },
  {
    id: 7,
    dimension_code: 'collaboration',
    scenario_context: 'You hit a conceptual roadblock when distinguishing 2NF partial dependencies from 3NF transitive dependencies.',
    question_text: 'What is your preferred recovery method?',
    order_index: 7,
    options: [
      { label: 'A', text: 'Discussing the edge case with a peer study group or academic mentor.', weight: 1, style_indicator: 'collaboration_high' },
      { label: 'B', text: 'Digging independently through textbook examples and reference implementations.', weight: 1, style_indicator: 'solitary_high' }
    ]
  },
  {
    id: 8,
    dimension_code: 'application',
    scenario_context: 'When introducing a complex theoretical principle such as ACID isolation levels in transactions...',
    question_text: 'Which perspective makes the concept resonate most deeply?',
    order_index: 8,
    options: [
      { label: 'A', text: 'Examining an industry case study of financial double-spending and e-commerce checkout locks.', weight: 1, style_indicator: 'real_world_high' },
      { label: 'B', text: 'Analyzing the mathematical proofs of serializability schedules and formal dependency graphs.', weight: 1, style_indicator: 'abstract_theory_high' }
    ]
  },
  {
    id: 9,
    dimension_code: 'worked_examples',
    scenario_context: 'You receive feedback indicating that you made an error on an indexing optimization question.',
    question_text: 'What do you want the system to present next?',
    order_index: 9,
    options: [
      { label: 'A', text: 'A detailed contrast showing where the mistaken logic deviated from the optimal execution plan.', weight: 1, style_indicator: 'worked_example_high' },
      { label: 'B', text: 'A fresh new query challenge right away so you can test if you can correct it independently.', weight: 1, style_indicator: 'practice_first_high' }
    ]
  },
  {
    id: 10,
    dimension_code: 'reflection',
    scenario_context: 'At the end of an academic week, reviewing your dashboard progress...',
    question_text: 'What visualization provides the clearest sense of direction?',
    order_index: 10,
    options: [
      { label: 'A', text: 'An analytical timeline detailing how misconceptions were detected, adapted, and resolved.', weight: 1, style_indicator: 'reflection_high' },
      { label: 'B', text: 'A gamified scoreboard tracking raw XP earned, current level, and streak counters.', weight: 1, style_indicator: 'rapid_trial_high' }
    ]
  }
];

// 10. Dynamic Learning Profiles
// Rahul Sharma: Worked Examples: 82%, Guided Practice: 71%, Reflection: 84%, Visual Structure: 63%, Challenge: 68%, Session: 70%, Collaboration: 52%, Confidence: 85%
const dynamic_learning_profiles = [
  {
    id: 1,
    student_id: 1,
    worked_examples_score: 82,
    practice_first_score: 45,
    guided_learning_score: 71,
    visual_structure_score: 63,
    reflection_score: 84,
    challenge_score: 68,
    session_structure_score: 70,
    collaboration_score: 52,
    confidence_score: 85,
    recent_behavior_evidence: 'Observed strong response to structured worked examples and conceptual retrospectives when tackling relational constraints. Profile dynamically updates as quiz attempts accumulate.'
  }
];

// Seed profiles for other students with reasonable variance
for (let i = 2; i <= 42; i++) {
  dynamic_learning_profiles.push({
    id: i,
    student_id: i,
    worked_examples_score: 50 + (i * 7) % 45,
    practice_first_score: 50 + (i * 11) % 45,
    guided_learning_score: 55 + (i * 5) % 40,
    visual_structure_score: 60 + (i * 8) % 35,
    reflection_score: 50 + (i * 9) % 45,
    challenge_score: 55 + (i * 6) % 40,
    session_structure_score: 65 + (i * 4) % 30,
    collaboration_score: 45 + (i * 13) % 50,
    confidence_score: 75 + (i * 3) % 22,
    recent_behavior_evidence: 'Demonstrated steady preference across interactive modules. Dynamic learning profile calibrated against recent quiz and quest telemetry.'
  });
}

// 11. Badges
const badges = [
  { id: 1, code: 'dependency_hunter', name: 'Dependency Hunter', description: 'Conquered functional dependencies and resolved anomalous partial/transitive relations in the Normalization Boss Battle.', icon: 'Zap', category: 'Academic' },
  { id: 2, code: 'sql_master', name: 'Relational Architect', description: 'Mastered multi-table relational schema designs and integrity constraints.', icon: 'Database', category: 'Academic' },
  { id: 3, code: 'first_quest', name: 'Pathfinder', description: 'Completed your very first LearnQuest adaptive quest journey.', icon: 'Compass', category: 'Achievement' },
  { id: 4, code: 'streak_master', name: 'Consistent Explorer', description: 'Maintained a 4-day active learning streak.', icon: 'Flame', category: 'Habit' },
  { id: 5, code: 'concept_recovered', name: 'Mastery Rising', description: 'Turned a conceptual misconception into deep understanding through adaptive remediation.', icon: 'TrendingUp', category: 'Resilience' },
  { id: 6, code: 'boss_slayer', name: 'Apex Achiever', description: 'Successfully conquered a high-difficulty Boss Battle challenge.', icon: 'Trophy', category: 'Gamification' }
];

// Rahul's unlocked badges
const student_badges = [
  { id: 1, student_id: 1, badge_id: 3, unlocked_at: '2026-09-22 10:15:00' }, // Pathfinder
  { id: 2, student_id: 1, badge_id: 4, unlocked_at: '2026-09-25 18:30:00' }, // Consistent Explorer
];

// 12. Quests
// Quest 1 for Rahul: "Defeat Normalization"
// Stages: 1. Warm-up, 2. Personalized Explanation, 3. Worked Example, 4. Practice, 5. Challenge, 6. Boss Battle
const stagesData = [
  { id: 1, name: 'Warm-up', description: 'Relational Anomaly Foundations: Insert, Update, and Delete Anomalies.', status: 'completed', xp: 20 },
  { id: 2, name: 'Personalized Explanation', description: 'Dissecting 1NF, 2NF, and 3NF with visual schema models tailored to your profile.', status: 'completed', xp: 25 },
  { id: 3, name: 'Worked Example', description: 'Step-by-step resolution of a decomposed Student-Course relation.', status: 'completed', xp: 30 },
  { id: 4, name: 'Practice Quiz', description: 'Identify Partial Dependencies (2NF) vs Transitive Dependencies (3NF).', status: 'active', xp: 35 },
  { id: 5, name: 'Challenge', description: 'Multi-attribute candidate keys and BCNF violation traps.', status: 'locked', xp: 40 },
  { id: 6, name: 'Boss Battle', description: 'Final Apex Exam: Conquering the Normalization Boss Battle to earn the Dependency Hunter badge!', status: 'locked', xp: 100 }
];

const quests = [
  {
    id: 1,
    student_id: 1,
    course_id: 3, // Database Systems
    topic_id: 1, // Normalization
    title: 'Defeat Normalization',
    description: 'Master functional dependencies, eliminate relational update anomalies, and conquer 1NF through BCNF in a structured adaptive journey.',
    difficulty: 'Medium',
    current_stage: 4,
    total_stages: 6,
    progress_pct: 60,
    reward_xp: 150,
    status: 'active',
    stages_data: JSON.stringify(stagesData)
  },
  {
    id: 2,
    student_id: 1,
    course_id: 2, // Data Structures
    topic_id: 6, // Graph Algorithms
    title: 'Conquer Graph Traversals',
    description: 'Master Dijkstra, BFS, and DFS shortest path algorithms with interactive graph visualizers.',
    difficulty: 'Hard',
    current_stage: 2,
    total_stages: 5,
    progress_pct: 40,
    reward_xp: 120,
    status: 'available',
    stages_data: JSON.stringify([])
  }
];

// 13. XP Events for Rahul
const xp_events = [
  { id: 1, student_id: 1, amount: 20, source_type: 'quest_stage', description: 'Completed Normalization Warm-up stage', created_at: '2026-09-23 14:00:00' },
  { id: 2, student_id: 1, amount: 25, source_type: 'quest_stage', description: 'Completed Normalization Personalized Explanation', created_at: '2026-09-24 11:20:00' },
  { id: 3, student_id: 1, amount: 30, source_type: 'quest_stage', description: 'Worked through Scaffolding Decomposition Example', created_at: '2026-09-25 16:45:00' },
  { id: 4, student_id: 1, amount: 20, source_type: 'streak', description: 'Maintained 4-day daily learning streak bonus', created_at: '2026-09-26 09:00:00' }
];

// 14. Student Goals
const student_goals = [
  { id: 1, student_id: 1, title: 'Master Database Normalization & Indexing for Software Engineering Interviews', target_date: '2026-10-15', status: 'in_progress', progress_pct: 60 },
  { id: 2, student_id: 1, title: 'Achieve 8.5+ CGPA in 4th Semester', target_date: '2026-12-20', status: 'in_progress', progress_pct: 75 }
];

// 15. AI Recommendations
const rahulEvidence = [
  'Database Systems performance (62%) is 14-24 points lower than other core subjects (Programming 86%, OS 71%).',
  'Normalization topic mastery is currently 52% with repeated errors in distinguishing 2NF from 3NF.',
  'Target career goal Software Engineer requires deep mastery of schema design to prevent data anomalies in production microservices.',
  'Dynamic learning profile highlights strong receptivity to Worked Examples (82%) and Reflection (84%).',
  'Weekly available time budget: 8 hours.'
];

const rahulStrategy = {
  approach: 'Worked-Example Scaffolding with Targeted Retry',
  why: 'Rahul demonstrates highest retention when shown step-by-step relational transformations before tackling independent dependency identification.'
};

const rahulWeeklyPlan = [
  { day: 'Monday', action: 'Normalization Foundations & Anomaly Types', estimated_minutes: 25 },
  { day: 'Tuesday', action: 'Worked Example: Decomposing Partial Dependencies (2NF)', estimated_minutes: 30 },
  { day: 'Wednesday', action: 'Guided Practice: Identifying Transitive Dependencies (3NF)', estimated_minutes: 30 },
  { day: 'Friday', action: 'Challenge: BCNF Multi-Key Decomposition', estimated_minutes: 25 },
  { day: 'Sunday', action: 'Boss Battle: Complete Quest & Earn Dependency Hunter Badge', estimated_minutes: 20 }
];

const ai_recommendations = [
  {
    id: 1,
    student_id: 1,
    recommendation_type: 'topic_mastery',
    title: 'Strengthen Database Normalization',
    priority: 'High',
    reason: 'Database Systems performance is lower than other subjects (62%), Normalization mastery is weak (52%), and recent quiz telemetry shows confusion between 2NF and 3NF. Normalization connects directly to your career goal as a Software Engineer designing reliable backend architectures.',
    evidence_json: JSON.stringify(rahulEvidence),
    strategy_json: JSON.stringify(rahulStrategy),
    weekly_plan_json: JSON.stringify(rahulWeeklyPlan),
    career_connection: 'Production software engineers must design normalized database schemas to ensure transactional consistency, eliminate data duplication, and avoid costly write lock contention.',
    status: 'active'
  }
];

// Generate SQL
let sql = `-- LearnQuest AI Seed Data
-- Compatible with MySQL 8.0, XAMPP, and phpMyAdmin
USE \`learnquest\`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. DEPARTMENTS
INSERT INTO \`departments\` (\`id\`, \`code\`, \`name\`) VALUES
${departments.map(d => `(${d.id}, ${escapeSql(d.code)}, ${escapeSql(d.name)})`).join(',\n')};

-- 2. PROGRAMS
INSERT INTO \`programs\` (\`id\`, \`department_id\`, \`degree\`, \`name\`, \`code\`, \`total_semesters\`, \`total_credits\`) VALUES
${programs.map(p => `(${p.id}, ${p.department_id}, ${escapeSql(p.degree)}, ${escapeSql(p.name)}, ${escapeSql(p.code)}, ${p.total_semesters}, ${p.total_credits})`).join(',\n')};

-- 3. USERS
INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`role\`, \`avatar_url\`) VALUES
${users.map(u => `(${u.id}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.password_hash)}, ${escapeSql(u.role)}, ${escapeSql(u.avatar_url)})`).join(',\n')};

-- 4. STUDENT PROFILES
INSERT INTO \`student_profiles\` (\`id\`, \`user_id\`, \`student_id\`, \`program_id\`, \`specialization\`, \`academic_year\`, \`year_of_study\`, \`current_semester\`, \`cgpa\`, \`credits_completed\`, \`expected_graduation_year\`, \`career_goal\`, \`interests\`, \`weekly_learning_hours\`, \`current_streak\`, \`total_xp\`, \`level\`, \`academic_health_score\`, \`is_synthetic\`) VALUES
${student_profiles.map(sp => `(${sp.id}, ${sp.user_id}, ${escapeSql(sp.student_id)}, ${sp.program_id}, ${escapeSql(sp.specialization)}, ${sp.academic_year}, ${sp.year_of_study}, ${sp.current_semester}, ${sp.cgpa}, ${sp.credits_completed}, ${sp.expected_graduation_year}, ${escapeSql(sp.career_goal)}, ${escapeSql(sp.interests)}, ${sp.weekly_learning_hours}, ${sp.current_streak}, ${sp.total_xp}, ${sp.level}, ${sp.academic_health_score}, ${sp.is_synthetic})`).join(',\n')};

-- 5. COURSES
INSERT INTO \`courses\` (\`id\`, \`program_id\`, \`code\`, \`name\`, \`credits\`, \`semester\`) VALUES
${courses.map(c => `(${c.id}, ${c.program_id}, ${escapeSql(c.code)}, ${escapeSql(c.name)}, ${c.credits}, ${c.semester})`).join(',\n')};

-- 6. COURSE TOPICS
INSERT INTO \`course_topics\` (\`id\`, \`course_id\`, \`name\`, \`description\`, \`order_index\`, \`difficulty_level\`) VALUES
${course_topics.map(t => `(${t.id}, ${t.course_id}, ${escapeSql(t.name)}, ${escapeSql(t.description)}, ${t.order_index}, ${escapeSql(t.difficulty_level)})`).join(',\n')};

-- 7. STUDENT COURSES
INSERT INTO \`student_courses\` (\`student_id\`, \`course_id\`, \`semester\`, \`score\`, \`grade\`, \`status\`) VALUES
${student_courses.map(sc => `(${sc.student_id}, ${sc.course_id}, ${sc.semester}, ${sc.score}, ${escapeSql(sc.grade)}, ${escapeSql(sc.status)})`).join(',\n')};

-- 8. TOPIC MASTERY
INSERT INTO \`topic_mastery\` (\`student_id\`, \`topic_id\`, \`mastery_score\`, \`attempts_count\`) VALUES
${topic_mastery.map(tm => `(${tm.student_id}, ${tm.topic_id}, ${tm.mastery_score}, ${tm.attempts_count})`).join(',\n')};

-- 9. MFC DIMENSIONS
INSERT INTO \`mfc_dimensions\` (\`code\`, \`name\`, \`description\`, \`left_label\`, \`right_label\`) VALUES
${mfc_dimensions.map(d => `(${escapeSql(d.code)}, ${escapeSql(d.name)}, ${escapeSql(d.description)}, ${escapeSql(d.left_label)}, ${escapeSql(d.right_label)})`).join(',\n')};

-- 10. MFC QUESTIONS
INSERT INTO \`mfc_questions\` (\`id\`, \`dimension_code\`, \`scenario_context\`, \`question_text\`, \`order_index\`) VALUES
${mfc_questions.map(q => `(${q.id}, ${escapeSql(q.dimension_code)}, ${escapeSql(q.scenario_context)}, ${escapeSql(q.question_text)}, ${q.order_index})`).join(',\n')};

-- 11. MFC OPTIONS
INSERT INTO \`mfc_options\` (\`question_id\`, \`option_label\`, \`option_text\`, \`weight\`, \`style_indicator\`) VALUES
${mfc_questions.flatMap(q => q.options.map(o => `(${q.id}, ${escapeSql(o.label)}, ${escapeSql(o.text)}, ${o.weight}, ${escapeSql(o.style_indicator)})`)).join(',\n')};

-- 12. DYNAMIC LEARNING PROFILES
INSERT INTO \`dynamic_learning_profiles\` (\`id\`, \`student_id\`, \`worked_examples_score\`, \`practice_first_score\`, \`guided_learning_score\`, \`visual_structure_score\`, \`reflection_score\`, \`challenge_score\`, \`session_structure_score\`, \`collaboration_score\`, \`confidence_score\`, \`recent_behavior_evidence\`) VALUES
${dynamic_learning_profiles.map(dp => `(${dp.id}, ${dp.student_id}, ${dp.worked_examples_score}, ${dp.practice_first_score}, ${dp.guided_learning_score}, ${dp.visual_structure_score}, ${dp.reflection_score}, ${dp.challenge_score}, ${dp.session_structure_score}, ${dp.collaboration_score}, ${dp.confidence_score}, ${escapeSql(dp.recent_behavior_evidence)})`).join(',\n')};

-- 13. BADGES
INSERT INTO \`badges\` (\`id\`, \`code\`, \`name\`, \`description\`, \`icon\`, \`category\`) VALUES
${badges.map(b => `(${b.id}, ${escapeSql(b.code)}, ${escapeSql(b.name)}, ${escapeSql(b.description)}, ${escapeSql(b.icon)}, ${escapeSql(b.category)})`).join(',\n')};

-- 14. STUDENT BADGES
INSERT INTO \`student_badges\` (\`id\`, \`student_id\`, \`badge_id\`, \`unlocked_at\`) VALUES
${student_badges.map(sb => `(${sb.id}, ${sb.student_id}, ${sb.badge_id}, ${escapeSql(sb.unlocked_at)})`).join(',\n')};

-- 15. QUESTS
INSERT INTO \`quests\` (\`id\`, \`student_id\`, \`course_id\`, \`topic_id\`, \`title\`, \`description\`, \`difficulty\`, \`current_stage\`, \`total_stages\`, \`progress_pct\`, \`reward_xp\`, \`status\`, \`stages_data\`) VALUES
${quests.map(q => `(${q.id}, ${q.student_id}, ${q.course_id}, ${q.topic_id}, ${escapeSql(q.title)}, ${escapeSql(q.description)}, ${escapeSql(q.difficulty)}, ${q.current_stage}, ${q.total_stages}, ${q.progress_pct}, ${q.reward_xp}, ${escapeSql(q.status)}, ${escapeSql(q.stages_data)})`).join(',\n')};

-- 16. XP EVENTS
INSERT INTO \`xp_events\` (\`id\`, \`student_id\`, \`amount\`, \`source_type\`, \`description\`, \`created_at\`) VALUES
${xp_events.map(x => `(${x.id}, ${x.student_id}, ${x.amount}, ${escapeSql(x.source_type)}, ${escapeSql(x.description)}, ${escapeSql(x.created_at)})`).join(',\n')};

-- 17. STUDENT GOALS
INSERT INTO \`student_goals\` (\`id\`, \`student_id\`, \`title\`, \`target_date\`, \`status\`, \`progress_pct\`) VALUES
${student_goals.map(g => `(${g.id}, ${g.student_id}, ${escapeSql(g.title)}, ${escapeSql(g.target_date)}, ${escapeSql(g.status)}, ${g.progress_pct})`).join(',\n')};

-- 18. AI RECOMMENDATIONS
INSERT INTO \`ai_recommendations\` (\`id\`, \`student_id\`, \`recommendation_type\`, \`title\`, \`priority\`, \`reason\`, \`evidence_json\`, \`strategy_json\`, \`weekly_plan_json\`, \`career_connection\`, \`status\`) VALUES
${ai_recommendations.map(r => `(${r.id}, ${r.student_id}, ${escapeSql(r.recommendation_type)}, ${escapeSql(r.title)}, ${escapeSql(r.priority)}, ${escapeSql(r.reason)}, ${escapeSql(r.evidence_json)}, ${escapeSql(r.strategy_json)}, ${escapeSql(r.weekly_plan_json)}, ${escapeSql(r.career_connection)}, ${escapeSql(r.status)})`).join(',\n')};

SET FOREIGN_KEY_CHECKS = 1;
`;

fs.writeFileSync(path.join(__dirname, '../database/seed.sql'), sql, 'utf8');
console.log('database/seed.sql generated successfully!');

// Combine schema and seed into learnquest_full.sql
const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
const fullSql = `${schemaSql}\n\n-- ==================================================\n-- SEED DATA\n-- ==================================================\n\n${sql}`;
fs.writeFileSync(path.join(__dirname, '../database/learnquest_full.sql'), fullSql, 'utf8');
console.log('database/learnquest_full.sql generated successfully!');
