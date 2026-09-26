'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  GraduationCap,
  Building,
  Users,
  Award,
  BookOpen,
  Layers,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Star,
  MapPin,
  Check,
} from 'lucide-react';

export default function NavigatorPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'tactical' | 'strategic'>('tactical');

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

  const { recommendation, profile, courses, topic_mastery, dynamic_profile, advisory } = data || {};
  const rec = recommendation;
  const onet = advisory?.onet;
  const threeMonthPlan = advisory?.three_month_plan || [];
  const recommendedCourses = advisory?.recommended_courses || [];
  const campusResources = advisory?.campus_resources || [];
  const campusOpportunities = advisory?.campus_opportunities || [];
  const basisExplanation = advisory?.basis_explanation;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <NavBar
        userRole={profile?.role || 'student'}
        userName={profile?.name}
        studentId={profile?.student_id}
      />
      <DemoModeBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multi-Signal Decision Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Academic Navigator & Advisory
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit mb-8 shadow-inner">
          <button
            onClick={() => setActiveTab('tactical')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tactical'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Tactical 7-Day Plan & Active Signals</span>
          </button>

          <button
            onClick={() => setActiveTab('strategic')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'strategic'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-violet-600" />
            <span>3-Month Strategic Roadmap & University Advisory</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 text-violet-700 ml-1">
              O*NET Aligned
            </span>
          </button>
        </div>

        {/* TAB 1: TACTICAL 7-DAY PLAN & ACTIVE SIGNALS */}
        {activeTab === 'tactical' && (
          <div className="space-y-6">
            {/* Multi-Signal Input Chips (5 Core Signals) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs shadow-xs">
                <span className="text-slate-400 block mb-0.5 font-medium">1. Academic Context</span>
                <span className="font-bold text-slate-800">
                  {profile?.degree} {profile?.program_code} (Sem {profile?.current_semester})
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs shadow-xs">
                <span className="text-slate-400 block mb-0.5 font-medium">2. Career Destination</span>
                <span className="font-bold text-slate-800">{profile?.career_goal}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs shadow-xs">
                <span className="text-slate-400 block mb-0.5 font-medium">3. Available Time</span>
                <span className="font-bold text-slate-800">{profile?.weekly_learning_hours} Hours / Week</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs shadow-xs">
                <span className="text-slate-400 block mb-0.5 font-medium">4. Observed Preference</span>
                <span className="font-bold text-indigo-600">Worked Examples (82%)</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 text-xs shadow-xs">
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
          </div>
        )}

        {/* TAB 2: STRATEGIC 3-MONTH ROADMAP & UNIVERSITY ADVISORY */}
        {activeTab === 'strategic' && (
          <div className="space-y-8">
            {/* 1. O*NET Labor Market Alignment Radar */}
            {onet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                        O*NET Code: {onet.onet_code}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {onet.market_growth_rate}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      Labor Market Engineering: {onet.job_title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Standard Occupational Classification (SOC): {onet.soc_title} &middot; Median Wage: {onet.median_wage_annual}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/70 p-4 rounded-2xl shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Market Readiness</span>
                      <span className="text-2xl font-black text-indigo-600">{onet.readiness_score}%</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  {onet.labor_market_summary}
                </p>

                {/* Critical Skill Gaps vs Market Benchmark */}
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Federal O*NET Competency Benchmarks vs Your Measured Mastery:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {onet.critical_skill_gaps.map((sk: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">{sk.skill}</span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              sk.status === 'critical_gap'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : sk.status === 'in_progress'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {sk.status === 'critical_gap' ? 'Critical Deficit' : sk.status === 'in_progress' ? 'In Progress' : 'Market Ready'}
                          </span>
                        </div>
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                            <span>Your Academic Mastery:</span>
                            <span className="font-bold text-slate-700">{sk.student_mastery}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${sk.student_mastery < 65 ? 'bg-rose-500' : sk.student_mastery < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${sk.student_mastery}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{sk.labor_note}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. 3-Month Phased Strategic Progression Plan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-extrabold text-slate-900">
                      3-Month Strategic Academic Progression Plan
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Calculated over 12 academic weeks &middot; Budgeted at {profile?.weekly_learning_hours} hours/week (168 total learning hours)
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Semester Quarter Schedule
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {threeMonthPlan.map((m: any, i: number) => (
                  <div
                    key={i}
                    className={`rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                      m.status === 'active'
                        ? 'bg-gradient-to-b from-indigo-50/50 to-white border-indigo-200 shadow-md shadow-indigo-100'
                        : 'bg-white border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                          {m.phase}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'upcoming'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.status === 'active' ? '● Current Focus' : m.status === 'upcoming' ? 'Next Month' : 'Final Phase'}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">
                        {m.month_title}
                      </h3>

                      <p className="text-xs text-slate-600 mb-4 leading-relaxed font-normal">
                        {m.objective}
                      </p>

                      <div className="space-y-2 mb-4">
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                          Core Milestones & Focus:
                        </span>
                        {m.primary_focus_areas.map((f: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="p-3 bg-slate-50 rounded-2xl text-[11px]">
                        <span className="font-bold text-slate-800 block mb-0.5">Deliverable:</span>
                        <span className="text-slate-600 leading-snug">{m.key_milestone_deliverable}</span>
                      </div>

                      <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-[11px] text-emerald-950">
                        <span className="font-bold block mb-0.5 text-emerald-900">Academic Target:</span>
                        <span>{m.academic_remedy_target}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3. The Systematic Basis of the Plan (Direct Answer to "On What Basis") */}
            {basisExplanation && (
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                    Algorithmic Transparency & Framework
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold mb-3">
                  On What Basis Is Your 3-Month Plan Generated?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mb-6 leading-relaxed">
                  LearnQuest AI does not hallucinate arbitrary milestones. Your 3-month roadmap is deterministically synthesized across four empirical constraints:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-xs font-bold text-indigo-300 block mb-1">1. Academic Prerequisite Dependency</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{basisExplanation.academic_deficit_lever}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-xs font-bold text-emerald-300 block mb-1">2. Federal O*NET Labor Market Alignment</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{basisExplanation.onet_labor_alignment}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-xs font-bold text-amber-300 block mb-1">3. Weekly Cognitive Time Feasibility</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{basisExplanation.time_feasibility}</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-xs font-bold text-violet-300 block mb-1">4. OCEAN Personality Trait Resonance</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{basisExplanation.personality_resonance}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Intelligent Course & Elective Advisory */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Next Semester Course & Elective Advisory
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Synthesized for career relevance ({profile?.career_goal}), quality rating, and prerequisite readiness
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Semester {Number(profile?.current_semester || 4) + 1} Planning
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedCourses.map((c: any, i: number) => (
                  <div key={i} className="p-5 rounded-3xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {c.code} &middot; {c.credits} Credits
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{c.quality_rating}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 mb-2 leading-snug">
                        {c.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.relevance_score}% Career Fit
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {c.workload_level} Workload
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {c.why_recommended}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div
                        className={`p-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-2 ${
                          c.prereq_status === 'satisfied'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {c.prereq_status === 'satisfied' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Prerequisites Met</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Remedy DBMS (≥75%) First</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 5. Campus Resources & Faculty Office Hours Directory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Faculty & University Academic Resources
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Targeted institutional support centers aligned with your current course topics and study gaps.
                </p>

                <div className="space-y-4">
                  {campusResources.map((res: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                      <div className="mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
                          {res.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mb-1">{res.title}</h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{res.contact_or_location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{res.availability}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-3 leading-snug">{res.relevance_reason}</p>
                      <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        <span>{res.action_label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Co-Curricular & Career Radar */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-violet-600" />
                  <h3 className="text-lg font-extrabold text-slate-900">
                    University Co-Curricular & Career Radar
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Extracurricular clubs, hackathons, and research fellowships curated for your Creative Builder profile.
                </p>

                <div className="space-y-4">
                  {campusOpportunities.map((opp: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600">
                            {opp.type}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {opp.badge_xp_reward}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mb-1">{opp.title}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{opp.timing}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-2 leading-snug">{opp.archetype_alignment}</p>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 text-[11px] text-slate-700 font-medium leading-snug">
                        <strong className="text-slate-900">Career Gateway:</strong> {opp.career_benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
