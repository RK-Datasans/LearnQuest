'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Star,
  Flame,
  Trophy,
  ChevronRight,
  Award,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard')
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
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <LoadingSpinner message="Analyzing your academic profile & active learning signals..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800 mb-1">Session Required</h2>
          <p className="text-xs text-slate-500 mb-4">{error || 'Please sign in to view your dashboard.'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const {
    profile,
    courses,
    topic_mastery,
    dynamic_profile,
    active_quest,
    recommendation,
    recent_xp,
    badges,
  } = data;

  const healthScore = profile?.academic_health_score || 72;
  const healthColor =
    healthScore >= 80 ? 'text-emerald-600' : healthScore >= 65 ? 'text-amber-600' : 'text-rose-600';
  const healthBg =
    healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 65 ? 'bg-amber-500' : 'bg-rose-500';

  const courseChartData =
    courses?.map((c: any) => ({
      name: c.code,
      score: Number(c.score),
      fullName: c.name,
      fill: c.score < 70 ? '#f43f5e' : c.score < 80 ? '#f59e0b' : '#10b981',
    })) || [];

  const dlpData = dynamic_profile
    ? [
        { dimension: 'Worked Examples', value: dynamic_profile.worked_examples_score },
        { dimension: 'Guided Learning', value: dynamic_profile.guided_learning_score },
        { dimension: 'Reflection', value: dynamic_profile.reflection_score },
        { dimension: 'Visual Schema', value: dynamic_profile.visual_structure_score },
        { dimension: 'Challenge Ramp', value: dynamic_profile.challenge_score },
        { dimension: 'Collaboration', value: dynamic_profile.collaboration_score },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar
        userRole={profile.role || 'student'}
        userName={profile.name}
        studentId={profile.student_id}
      />
      <DemoModeBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {profile.name?.split(' ')[0]} 👋
              </h1>
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-md">
                {profile.student_id}
              </span>
              {data?.ocean_archetype?.primary_name && (
                <span className="px-2.5 py-0.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-600" />
                  <span>Archetype: {data.ocean_archetype.primary_name}</span>
                </span>
              )}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {profile.degree} in {profile.program_name} &middot; Year {profile.year_of_study}, Semester {profile.current_semester} &middot; Expected Graduation {profile.expected_graduation_year}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/navigator')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs transition-colors border border-indigo-200"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Open AI Navigator</span>
            </button>
            <button
              onClick={() => router.push('/quest')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
            >
              <span>Quest Journey</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Academic Health',
              value: `${healthScore}%`,
              sub: 'Across 5 enrolled courses',
              icon: TrendingUp,
              color: 'emerald',
            },
            {
              label: 'Cumulative CGPA',
              value: profile.cgpa?.toFixed(2) || '8.10',
              sub: `${profile.credits_completed} credits completed`,
              icon: Star,
              color: 'indigo',
            },
            {
              label: 'Gamified Level & XP',
              value: `Level ${profile.level}`,
              sub: `${profile.total_xp} Total XP earned`,
              icon: Trophy,
              color: 'amber',
            },
            {
              label: 'Daily Study Streak',
              value: `${profile.current_streak} Days`,
              sub: `Target: 8 hrs / week`,
              icon: Flame,
              color: 'orange',
            },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <m.icon className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{m.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Next Best Action + Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* HIGHLIGHT: YOUR NEXT BEST ACTION CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/50"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Your Next Best Action
                </span>
                <span className="ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  High Priority
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">
                {recommendation?.title || 'Strengthen Database Normalization'}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal max-w-2xl">
                {recommendation?.reason ||
                  'DBMS performance (62%) is lower than other core subjects. Normalization mastery is weak (52%) with repeated confusion between 2NF partial dependencies and 3NF transitive dependencies. Resolving this aligns directly with your Software Engineer goal.'}
              </p>

              {/* Rationale Bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>DBMS score (62%) is 14–24 points behind other subjects</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Normalization topic mastery is weak at 52%</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Directly required for Software Engineer backend roles</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Calibrated to your Worked-Examples preference (82%)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => router.push('/quest/1')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Target className="w-4 h-4" />
                  <span>Start Recommended Quest</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => router.push('/navigator')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Full Reasoning & Weekly Plan
                </button>
              </div>
            </motion.div>

            {/* Course Academic Performance */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Semester 4 Course Performance</h3>
                  <p className="text-xs text-slate-500">Benchmark comparison across all enrolled subjects</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> &gt;80%</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 70–80%</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> &lt;70% (Focus)</span>
                </div>
              </div>

              {courseChartData.length > 0 && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(val: any) => [`${val}%`, 'Score']}
                        labelFormatter={(lbl: any) => {
                          const item = courseChartData.find((x: any) => x.name === lbl);
                          return item ? `${item.name}: ${item.fullName}` : lbl;
                        }}
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {courseChartData.map((entry: any, index: number) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Course List Detail */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {courses?.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-700 w-16">{c.code}</span>
                      <span className="text-slate-600 font-medium truncate max-w-xs">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono">{c.credits} Cr</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          c.score < 70
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : c.score < 80
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {c.score}% ({c.grade})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Mastery Focus Areas */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Key Topic Mastery Insights</h3>
                  <p className="text-xs text-slate-500">Fine-grained conceptual understanding</p>
                </div>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer" onClick={() => router.push('/progress')}>
                  View all in Progress &rarr;
                </span>
              </div>

              <div className="space-y-3">
                {topic_mastery?.slice(0, 5).map((tm: any, i: number) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div>
                        <span className="font-bold text-slate-800">{tm.topic_name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">&middot; {tm.course_name}</span>
                      </div>
                      <span
                        className={`font-extrabold ${
                          tm.mastery_score < 65
                            ? 'text-rose-600'
                            : tm.mastery_score < 80
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {tm.mastery_score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          tm.mastery_score < 65
                            ? 'bg-rose-500'
                            : tm.mastery_score < 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${tm.mastery_score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Active Quest + Dynamic Profile + Badges */}
          <div className="space-y-6">
            {/* Active Quest Card */}
            {active_quest && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Target className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Quest</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    +{active_quest.reward_xp} XP
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-slate-900 mb-1">{active_quest.title}</h4>
                <p className="text-xs text-slate-500 mb-4">{active_quest.course_name} &middot; {active_quest.difficulty} Difficulty</p>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">
                      Stage {active_quest.current_stage} of {active_quest.total_stages}
                    </span>
                    <span className="font-bold text-indigo-600">{active_quest.progress_pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${active_quest.progress_pct}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/quest/${active_quest.id}`)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Resume Quest</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dynamic Learning Profile (MFC Summary) */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Dynamic Learning Profile</h4>
                  <p className="text-[11px] text-slate-400">Observed preferences &middot; Not fixed styles</p>
                </div>
                <button
                  onClick={() => router.push('/mfc')}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Retake MFC &rarr;
                </button>
              </div>

              {dlpData.length > 0 ? (
                <div className="h-48 w-full -my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={dlpData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9, fill: '#64748b' }} />
                      <Radar
                        name="Observed Preference"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">No profile data yet. Complete MFC.</div>
              )}

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-[11px] text-indigo-900 leading-relaxed">
                <span className="font-bold">Worked Examples (82%)</span> and <span className="font-bold">Reflection (84%)</span> are your most pronounced observed tendencies. LearnQuest adapts content presentation accordingly.
              </div>
            </div>

            {/* Recent XP Activity */}
            {recent_xp?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h4 className="font-extrabold text-slate-900 text-sm mb-3">Recent XP Feed</h4>
                <div className="space-y-2.5">
                  {recent_xp.map((x: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-600 truncate max-w-[200px]">{x.description}</span>
                      <span className="font-bold text-amber-600 shrink-0 ml-2">+{x.amount} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Earned */}
            {badges?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
                <h4 className="font-extrabold text-slate-900 text-sm mb-3">Badges Showcase</h4>
                <div className="flex flex-wrap gap-2">
                  {badges.map((b: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl"
                    >
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-900">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
