'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  Users,
  ChevronRight,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  async function handleQuickStart(role: 'student' | 'faculty') {
    try {
      await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      router.push(role === 'faculty' ? '/faculty' : '/dashboard');
    } catch {
      router.push('/login');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight">LearnQuest <span className="text-indigo-400">AI</span></span>
            <span className="block text-[10px] text-slate-400 font-medium">Academic Decision Support</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuickStart('faculty')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-all"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Faculty Portal
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>Sign In</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-900/40 border border-indigo-700/50 rounded-full text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>AI Academic Navigator + Adaptive Gamified Learning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Know where you are.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-300">
              Know what matters.
            </span>
            <br />
            Know what to do next.
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            LearnQuest AI combines academic performance, student goals, observed learning preferences,
            and adaptive assessment to guide every student&apos;s next learning action.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => handleQuickStart('student')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Launch Demo — Student (Rahul Sharma)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => handleQuickStart('faculty')}
              className="px-7 py-4 bg-white/5 hover:bg-white/10 border border-white/15 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 hover:border-white/30"
            >
              <Users className="w-4 h-4 text-violet-400" />
              <span>Faculty Intelligence (Dr. Priya Mehta)</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>MySQL 8 / XAMPP Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>42 Synthetic Students Seeded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Crash Demo Fallback</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Central 5-Step Loop Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">The Feedback Loop</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-3">How LearnQuest AI Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From profiling to adaptive remediation and aggregate faculty intelligence in five continuous steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              icon: Users,
              title: 'Understand',
              desc: 'Profile academic history, degree context, career goal, available weekly hours, and observed engagement preferences.',
            },
            {
              step: '02',
              icon: Brain,
              title: 'Navigate',
              desc: 'AI synthesizes all signals (not just lowest scores) to identify the highest-leverage next learning action and weekly plan.',
            },
            {
              step: '03',
              icon: BookOpen,
              title: 'Learn',
              desc: 'Students embark on adaptive multi-stage quests tailored with worked examples and conceptual scaffolding.',
            },
            {
              step: '04',
              icon: Target,
              title: 'Adapt',
              desc: 'When mistakes occur, AI identifies specific cognitive misconceptions, lowers difficulty, and serves targeted retry questions.',
            },
            {
              step: '05',
              icon: TrendingUp,
              title: 'Progress',
              desc: 'Mastery updates, XP is earned, badges unlock, and aggregate insights flow back to professors.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all group relative"
            >
              <div className="text-xs font-bold text-indigo-400 mb-3 tracking-widest">{item.step}</div>
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Core Highlights / Philosophical Principle */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-tr from-indigo-900/60 via-slate-900 to-indigo-950/60 border border-indigo-700/40 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase block mb-3">Our Core Pedagogical Principle</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
              &ldquo;We don&apos;t confuse preference with proficiency.&rdquo;
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
              MFC (Multi-Dimensional Forced Choice) tells us about observed student engagement preferences.
              Academic performance tells us what the student actually knows.
              Career goals tell us where the student wants to go.
              The AI combines all three signals to prescribe a purposeful next learning action — without ever labeling students with rigid, outdated &ldquo;learning styles&rdquo;.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold text-slate-300">
                Dynamic Learning Profile
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold text-slate-300">
                Misconception Detection
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold text-slate-300">
                Multi-Stream University Support
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">LearnQuest AI</span>
            <span>&middot; University Hackathon Prototype</span>
          </div>
          <div className="text-slate-400">
            Demo Credentials: <span className="text-indigo-300 font-mono">student@learnquest.local</span> / <span className="text-indigo-300 font-mono">faculty@learnquest.local</span> (Password: <span className="text-indigo-300 font-mono">Demo123!</span>)
          </div>
        </div>
      </footer>
    </div>
  );
}
