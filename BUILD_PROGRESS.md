# LearnQuest AI — Build Progress & Continuation Tracker

**Product:** LEARNQUEST AI  
**Tagline:** *"Know where you are. Know what matters. Know what to do next."*  
**Architecture:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + MySQL 8 (mysql2 direct pool, XAMPP/phpMyAdmin compatible) + OpenAI / Deterministic Fallback  
**Last Updated:** September 26, 2026

---

## 1. Demo Credentials & Database Status

- **Database Name:** `learnquest` (MySQL on `localhost:3306`)
- **Status:** **LIVE & IMPORTED** (`database/learnquest_full.sql` imported and verified)
- **Demo Accounts:**
  - **Student:** `student@learnquest.local` / `Demo123!` (Rahul Sharma, STU-2026-1042, B.Tech CSE Year 2 Sem 4, CGPA 8.1, DBMS 62%)
  - **Faculty:** `faculty@learnquest.local` / `Demo123!` (Dr. Priya Mehta, Department of Computer Science)
- **Synthetic Data:** 42 synthetic students seeded across 7 programs (B.Tech CSE, ECE, IT, BBA-BA, B.Des, MBA-TM, MCA)
- **Systemic Gap:** 8 students in B.Tech CSE Year 2 with weak Database Normalization mastery (< 65%) for faculty analytics.

---

## 2. Completed Components (ALL COMPLETED & VERIFIED)

### Database & Setup
- [x] `database/schema.sql` — 23 tables, foreign keys, indexes, utf8mb4.
- [x] `database/seed.sql` — 42 synthetic students, courses, topics, MFC, quests, badges.
- [x] `database/learnquest_full.sql` — Combined self-contained file importable via phpMyAdmin / MySQL CLI.
- [x] `scripts/generate_seed.js` — Seed data generator script.
- [x] `package.json` — All dependencies installed (`next`, `react`, `mysql2`, `bcryptjs`, `zod`, `lucide-react`, `framer-motion`, `recharts`, `openai`, `tailwindcss`).
- [x] `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`.
- [x] `.env.local.example` & `.env.local` configured with MySQL & fallback `DEMO_MODE=true`.

### Core Backend & AI Libraries
- [x] `lib/db.ts` — MySQL connection pool using `mysql2/promise` with error resilience.
- [x] `lib/types.ts` — Full TypeScript interfaces for user, student profile, courses, topics, quests, MFC, faculty stats.
- [x] `lib/session.ts` — Secure session cookie + MySQL `sessions` table tracking.
- [x] `lib/auth.ts` — Password verification (bcrypt), demo quick login, profile loader.
- [x] `lib/gamification.ts` — XP rewards, level formula `floor(totalXP / 100) + 1`, streak bonuses, badge unlocker.
- [x] `lib/utils.ts` — Tailwind class mergers and formatters.
- [x] `lib/ai/schemas.ts` — Zod validation schemas for Navigator, Quiz generation, Quiz evaluation, Faculty insight.
- [x] `lib/ai/prompts.ts` — Central AI system prompt (strict prohibition of fixed "learning styles" / "visual learner" labels; dynamic learning profile).
- [x] `lib/ai/openai.ts` — OpenAI client with availability check and safe JSON parser.
- [x] `lib/ai/fallback.ts` — Deterministic fallback engine reading live database context so demo works without external API key.

### API Routes (`app/api/`)
- [x] `app/api/auth/login/route.ts` — Email/password login with session creation.
- [x] `app/api/auth/logout/route.ts` — Session destruction.
- [x] `app/api/auth/me/route.ts` — Current user/profile info.
- [x] `app/api/auth/demo/route.ts` — 1-click quick demo login for student or faculty.
- [x] `app/api/profile/route.ts` — Profile retrieval with courses, topic mastery, dynamic profile, badges.
- [x] `app/api/dashboard/route.ts` — Student dashboard aggregator (profile, health, DBMS focus, quest, recommendation, XP).
- [x] `app/api/mfc/route.ts` — Get 10 MFC forced-choice scenarios.
- [x] `app/api/mfc/submit/route.ts` — Submit MFC responses, compute 8 dimension scores, update dynamic profile.
- [x] `app/api/navigator/route.ts` — Get active recommendation & weekly plan.
- [x] `app/api/navigator/generate/route.ts` — Synthesize multi-signal AI analysis and generate new weekly plan.
- [x] `app/api/quest/route.ts` — List student quests.
- [x] `app/api/quest/[id]/route.ts` — Quest details, stages data, stage progression update.
- [x] `app/api/quiz/generate/route.ts` — Dynamic academic quiz question generator.
- [x] `app/api/quiz/evaluate/route.ts` — Evaluate student answer, detect misconceptions (partial vs transitive dependency), update mastery, reward XP (+15 or +100), unlock badges ("Dependency Hunter").
- [x] `app/api/progress/route.ts` — Academic health, accuracy trends, XP history, quiz history.
- [x] `app/api/faculty/overview/route.ts` — Multi-filter aggregated SQL analytics across 42 students.
- [x] `app/api/faculty/insight/route.ts` — AI-powered pedagogical insight based on real DB stats.

### UI Shared Components
- [x] `app/globals.css` — Tailwind directives and base styles.
- [x] `app/layout.tsx` — Root layout with Inter font and metadata.
- [x] `components/ui/NavBar.tsx` — Navigation bar with role badge and logout.
- [x] `components/ui/LoadingSpinner.tsx` — AI-specific loading spinner.
- [x] `components/ui/DemoModeBanner.tsx` — Floating demo indicator.

### App Pages
- [x] `app/page.tsx` — Landing page with value proposition and 5-step loop.
- [x] `app/login/page.tsx` — Login card with 1-click demo buttons.
- [x] `app/dashboard/page.tsx` — Student dashboard with Academic Health (72%), DBMS focus (62%), Next Best Action, Active Quest, Dynamic Profile radar.
- [x] `app/profile/page.tsx` — Tabbed view: General, Academic, Career, Dynamic Learning Profile.
- [x] `app/mfc/page.tsx` — Interactive 10-scenario MFC test + dynamic radar profile.
- [x] `app/navigator/page.tsx` — AI Navigator dashboard + weekly plan + career connection.
- [x] `app/quest/page.tsx` — Quest library.
- [x] `app/quest/[id]/page.tsx` — 6-stage quest runner + Misconception Detection demo + Boss Battle + Dependency Hunter badge.
- [x] `app/progress/page.tsx` — Recharts graphs + "How LearnQuest Adapted" visual sequence.
- [x] `app/faculty/page.tsx` — Faculty dashboard with real SQL filters and AI insight.

### Documentation & Verification
- [x] `README.md` — Complete documentation with setup, demo script, and Git publish commands.

---

## 3. How to Run the Application

1. Open PowerShell or Command Prompt in `d:\EdTech`.
2. Ensure MySQL is running in XAMPP on port 3306 (database `learnquest` is live).
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   ```
   http://localhost:3000
   ```
5. Use 1-click demo login buttons or manual credentials:
   - **Student:** `student@learnquest.local` / `Demo123!`
   - **Faculty:** `faculty@learnquest.local` / `Demo123!`
