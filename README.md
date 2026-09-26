# LEARNQUEST AI

> **"Know where you are. Know what matters. Know what to do next."**

LearnQuest AI is an AI Academic Navigator + Adaptive Gamified Learning Platform for a modern university environment. It combines observed learning preferences (Multi-Dimensional Forced Choice), academic performance, career goals, and recent behavior to guide students to their next learning action, detect conceptual misconceptions, adaptively adjust difficulty, and provide faculty with real-time aggregate learning intelligence.

---

## 1. System Requirements

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **XAMPP / MySQL**: MySQL 8.0+ running on port 3306
- **phpMyAdmin**: For manual database import (or MySQL CLI)
- **Web Browser**: Chrome, Edge, Firefox, or Safari

---

## 2. Quick Setup Guide

### Step 1: Start MySQL in XAMPP
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache** and **MySQL**.
3. Verify that MySQL is running on port **3306**.

### Step 2: Import the Database via phpMyAdmin
1. Open your browser and navigate to `http://localhost/phpmyadmin`.
2. Click **New** in the left sidebar and create a database named:
   ```
   learnquest
   ```
   *(Collation: `utf8mb4_unicode_ci`)*
3. Select the `learnquest` database, click the **Import** tab.
4. Choose the file:
   ```
   d:/EdTech/database/learnquest_full.sql
   ```
5. Click **Import** (or **Go** at the bottom).

*Alternative via Command Line:*
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS learnquest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root learnquest < database/learnquest_full.sql
```

### Step 3: Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Verify the settings inside `.env.local`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=learnquest
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
SESSION_SECRET=learnquest_ai_super_secret_session_key_2026_x!
DEMO_MODE=true
```
*(If you do not have an OpenAI API key, `DEMO_MODE=true` guarantees that all AI analysis, quiz generation, misconception detection, and faculty insights operate flawlessly via the built-in deterministic engine.)*

### Step 4: Install Dependencies & Run
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 3. Demo Credentials

| Role | Name | Email | Password | Academic Details |
|------|------|-------|----------|------------------|
| **Student** | Rahul Sharma | `student@learnquest.local` | `Demo123!` | B.Tech CSE, Yr 2, Sem 4, CGPA 8.1, DBMS 62% |
| **Faculty** | Dr. Priya Mehta | `faculty@learnquest.local` | `Demo123!` | Department of Computer Science & Engineering |

> **Pro Tip:** On the Login page (`/login`), click the **1-Click Demo Student** or **1-Click Demo Faculty** button for instant access without typing credentials!

---

## 4. Key Demo Narrative (7-Minute Presentation Script)

| Step | Page | Action | What to Explain to Judges |
|------|------|--------|---------------------------|
| **1** | `/` | Open Landing Page | Explain the 5-step loop: *Understand &rarr; Navigate &rarr; Learn &rarr; Adapt &rarr; Progress*. Highlight the core principle: *"We don't confuse preference with proficiency."* |
| **2** | `/login` | Click **Demo Student** | Instant login as Rahul Sharma (STU-2026-1042). |
| **3** | `/dashboard` | Review Student Dashboard | Point out Rahul's **Academic Health (72%)**, DBMS lag (62%), and the prominent **"YOUR NEXT BEST ACTION"**: *Strengthen Database Normalization*. Emphasize that the AI synthesized multiple signals (academics, career goal Software Engineer, available hours). |
| **4** | `/mfc` | Review / Complete MFC | Show the 10 forced-choice scenarios. Highlight that MFC measures **observed engagement preferences** (e.g. Worked Examples 82%), **NOT** fixed learning styles. Never says "you are a visual learner". |
| **5** | `/navigator` | Review AI Navigator | Show the structured AI synthesis: Next Priority, Evidence breakdown, and the balanced **Personalized Weekly Plan** capped at Rahul's 8 hours/week. |
| **6** | `/quest/1` | Open Quest "Defeat Normalization" | Show the 6-stage structured journey: Warm-up &rarr; Explanation &rarr; Worked Example &rarr; Practice &rarr; Challenge &rarr; Boss Battle. |
| **7** | `/quest/1` | **Submit Wrong Answer** on Practice Quiz | **KEY DEMO MOMENT**: Select Option B (2NF instead of 3NF). Watch the UI trigger **"Misconception Detected: Confusion between Partial and Transitive Dependency"**. Show the targeted scaffolding worked example: *"Let's fix this"*. |
| **8** | `/quest/1` | Click **Targeted Retry** | The system adaptively lowers difficulty to Easy. Submit the correct answer. The UI shows **"Concept recovered! +15 XP"**, updates topic mastery, and ramps difficulty back up. |
| **9** | `/quest/1` | Complete Stage 6 **Boss Battle** | Submit the final challenge. The victory banner appears, rewarding **+100 XP** and unlocking the **"Dependency Hunter"** badge! |
| **10** | `/progress` | Review Progress & Analytics | Show Recharts mastery trends and the **"How LearnQuest Adapted to You"** visual 7-step closed-loop timeline. |
| **11** | `/faculty` | Switch to **Dr. Priya Mehta** | Filter by `B.Tech CSE` & `Year 2`. Show real SQL aggregation across the 42 synthetic students, highlighting that **8 students have a systemic Normalization gap (< 65%)**. Click **Refresh AI Insight** to view the pedagogical recommendation. |

---

## 5. Database Schema & Architecture

The database contains 23 normalized tables with foreign keys and sensible indexes:
- `users`, `departments`, `programs`, `courses`, `course_topics`
- `student_profiles`: Tracks 42 synthetic students across 7 programs (B.Tech CSE, ECE, IT, BBA-BA, B.Des, MBA-TM, MCA)
- `student_courses`: Enrolled course grades and scores
- `topic_mastery`: Granular concept mastery scores (e.g. Normalization 52%)
- `mfc_dimensions`, `mfc_questions`, `mfc_options`, `mfc_assessments`, `mfc_responses`
- `dynamic_learning_profiles`: Tracks 8 observed dimensions (Worked Examples, Reflection, etc.)
- `quests`, `quiz_attempts`, `xp_events`, `badges`, `student_badges`, `student_goals`, `ai_recommendations`, `sessions`

Importable files located in `database/`:
- `database/learnquest_full.sql`: **Complete, self-contained SQL file for phpMyAdmin**
- `database/schema.sql`: Schema DDL only
- `database/seed.sql`: Seed data DML only

---

## 6. How Demo Mode Operates

When `OPENAI_API_KEY` is not provided or `DEMO_MODE=true`:
1. The platform executes deterministic reasoning over the **live MySQL database records** (Rahul's exact 62% in DBMS, 52% in Normalization, 8 hours availability).
2. The AI Navigator generates realistic evidence, structured weekly schedules, and career alignments.
3. The quiz runner generates targeted questions and diagnoses exact misconceptions (Partial vs Transitive dependencies).
4. Faculty intelligence queries aggregate statistics and formulates pedagogical interventions based on true student counts.
5. Zero external network failures or API rate limits can compromise the presentation.

---

## 7. How to Publish to Git Repository

To publish this project to GitHub or any remote Git repository:

```bash
# 1. Initialize Git repository
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Initial commit: LearnQuest AI Academic Navigator + Adaptive Gamified Platform"

# 4. Set main branch
git branch -M main

# 5. Add remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to remote
git push -u origin main
```
