'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  Compass,
  Brain,
  Target,
  Sparkles,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function NavigatorPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  function loadData() {
    fetch('/api/navigator')
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, [router]);

  async function handleRegenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/navigator/generate', { method: 'POST' });
      const d = await res.json();
      if (d?.recommendation) {
        setData((prev: any) => ({ ...prev, recommendation: d.recommendation }));
      }
    } catch (err) {
      console.error('Failed to regenerate', err);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <LoadingSpinner message="AI Academic Navigator is synthesizing your profile signals..." />
      </div>
    );
  }

  const { recommendation, profile, courses, topic_mastery, dynamic_profile } = data || {};
  const rec = recommendation;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar
        userRole={profile?.role || 'student'}
        userName={profile?.name}
        studentId={profile?.student_id}
      />
      <DemoModeBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multi-Signal Decision Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Academic Navigator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Reasoning across academic performance, career goal ({profile?.career_goal}), {profile?.weekly_learning_hours}h weekly availability, and OCEAN archetype ({data?.ocean_archetype?.primary_name || 'Creative Builder'}).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all shadow-xs disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 text-indigo-600 ${generating ? 'animate-spin' : ''}`} />
              <span>{generating ? 'Synthesizing...' : 'Regenerate Analysis'}</span>
            </button>
            <button
              onClick={() => router.push('/quest/1')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
            >
              <span>Launch Quest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Signal Input Chips (5 Core Signals) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs">
            <span className="text-slate-400 block mb-0.5 font-medium">1. Academic Context</span>
            <span className="font-bold text-slate-800">
              {profile?.degree} {profile?.program_code} (Sem {profile?.current_semester})
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs">
            <span className="text-slate-400 block mb-0.5 font-medium">2. Career Destination</span>
            <span className="font-bold text-slate-800">{profile?.career_goal}</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs">
            <span className="text-slate-400 block mb-0.5 font-medium">3. Available Time</span>
            <span className="font-bold text-slate-800">{profile?.weekly_learning_hours} Hours / Week</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs">
            <span className="text-slate-400 block mb-0.5 font-medium">4. Observed Preference</span>
            <span className="font-bold text-indigo-600">Worked Examples (82%)</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs">
            <span className="text-slate-400 block mb-0.5 font-medium">5. OCEAN Archetype</span>
            <span className="font-bold text-violet-700">
              {data?.ocean_archetype?.primary_name || 'Creative Builder'}
            </span>
          </div>
        </div>

        {/* Main Recommendation Synthesis Card */}
        {rec ? (
          <div className="space-y-6">
            {/* Priority & Rationale */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {rec.priority || 'High'} Priority
                </span>
                <span className="text-xs text-slate-400">&middot; Focus Recommendation</span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
                {rec.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed mb-6 font-normal">
                {rec.reason}
              </p>

              {/* Evidence Synthesized */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Evidence Synthesized by AI:
                </h4>
                {rec.evidence?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Pedagogical Strategy */}
              {rec.strategy && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs">
                  <div className="font-bold text-indigo-950 mb-1 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span>Learning Strategy: {rec.strategy.approach}</span>
                  </div>
                  <p className="text-indigo-900 leading-relaxed">{rec.strategy.why}</p>
                </div>
              )}
            </motion.div>

            {/* Personalized Weekly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Personalized Weekly Learning Plan
                  </h3>
                </div>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Capped at {profile?.weekly_learning_hours}h budget</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {rec.weekly_plan?.map((dayPlan: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-2">
                        {dayPlan.day}
                      </span>
                      <p className="text-xs text-slate-800 font-semibold leading-snug mb-3">
                        {dayPlan.action}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{dayPlan.estimated_minutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Career Connection & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Career Trajectory Connection</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.career_connection}
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Risks If Gap Is Left Unaddressed</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-2">
                  {rec.risks_or_tradeoffs?.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">&bull;</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Compass className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base mb-2">No Active Recommendation</h3>
            <p className="text-xs text-slate-500 mb-6">Click below to synthesize a tailored recommendation from your database records.</p>
            <button
              onClick={handleRegenerate}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Generate Recommendation
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
