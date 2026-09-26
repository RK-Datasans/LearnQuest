'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  Users,
  Brain,
  Filter,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [programFilter, setProgramFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);

  function loadOverview(prog = programFilter, yr = yearFilter, crs = courseFilter) {
    setLoading(true);
    const params = new URLSearchParams();
    if (prog !== 'all') params.append('program', prog);
    if (yr !== 'all') params.append('year', yr);
    if (crs !== 'all') params.append('course', crs);

    fetch(`/api/faculty/overview?${params.toString()}`)
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setData(d);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOverview('all', 'all', 'all');
  }, [router]);

  async function handleGenerateInsight() {
    setGeneratingInsight(true);
    try {
      const res = await fetch('/api/faculty/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          program: programFilter !== 'all' ? programFilter : undefined,
          year: yearFilter !== 'all' ? yearFilter : undefined,
          course: courseFilter !== 'all' ? courseFilter : undefined,
        }),
      });
      const d = await res.json();
      if (d?.insight) {
        setAiInsight(d.insight);
      }
    } catch (e) {
      console.error('Failed to generate insight', e);
    } finally {
      setGeneratingInsight(false);
    }
  }

  // Auto-generate initial insight on first load
  useEffect(() => {
    if (data && !aiInsight) {
      handleGenerateInsight();
    }
  }, [data]);

  const { stats, program_distribution, course_performance, topic_gaps } = data || {};

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#06b6d4', '#f59e0b'];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <NavBar userRole="faculty" userName="Dr. Priya Mehta" />
      <DemoModeBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                Faculty Intelligence Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Synthetic Demo Data
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cohort Academic Health & Learning Gaps
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Aggregate intelligence calculated from real MySQL records across multiple university streams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateInsight}
              disabled={generatingInsight}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${generatingInsight ? 'animate-spin' : ''}`} />
              <span>{generatingInsight ? 'Analyzing Cohort...' : 'Refresh AI Insight'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filter Cohort Segment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Academic Program</label>
              <select
                value={programFilter}
                onChange={(e) => {
                  setProgramFilter(e.target.value);
                  loadOverview(e.target.value, yearFilter, courseFilter);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Programs (42 Synthetic Students)</option>
                <option value="BT-CSE">B.Tech Computer Science (BT-CSE)</option>
                <option value="BT-ECE">B.Tech Electronics & Comm (BT-ECE)</option>
                <option value="BBA-BA">BBA Business Analytics (BBA-BA)</option>
                <option value="BDES-ID">B.Des Interaction Design (BDES-ID)</option>
                <option value="MBA-TM">MBA Tech Management (MBA-TM)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Year of Study</label>
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  loadOverview(programFilter, e.target.value, courseFilter);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Years (Years 1 to 4)</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2 (Rahul Sharma Cohort)</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Course Focus</label>
              <select
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  loadOverview(programFilter, yearFilter, e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Enrolled Courses</option>
                <option value="CS202">CS202: Database Systems</option>
                <option value="CS201">CS201: Data Structures</option>
                <option value="CS203">CS203: Operating Systems</option>
                <option value="EC202">EC202: Embedded Systems</option>
                <option value="BA201">BA201: Predictive Analytics</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Filtered Students</span>
            <span className="text-3xl font-extrabold text-slate-900">{stats?.total_students || 42}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Labeled: Synthetic Demo Data</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Average Health Index</span>
            <span className="text-3xl font-extrabold text-emerald-600">{stats?.average_health || 71.0}%</span>
            <span className="text-[11px] text-slate-400 block mt-1">Institution Target: 75%</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Students Improving</span>
            <span className="text-3xl font-extrabold text-indigo-600">{stats?.students_improving || 24}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Positive mastery momentum</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Needing Attention</span>
            <span className="text-3xl font-extrabold text-rose-600">{stats?.students_needing_attention || 8}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Below 65% threshold</span>
          </div>
        </div>

        {/* FACULTY AI INSIGHT CARD (CRUCIAL PRODUCT MOMENT) */}
        {aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-indigo-700/50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                AI Faculty Pedagogical Insight
              </span>
              <span className="ml-auto px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Actionable Bottleneck
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 leading-snug">
              {aiInsight.insight}
            </h3>

            {/* Evidence items */}
            <div className="space-y-2 mb-6">
              <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Verifiable Database Evidence:
              </h5>
              {aiInsight.evidence?.map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200">
              <span className="font-bold text-white block mb-1">Suggested Faculty Intervention:</span>
              <p className="leading-relaxed text-indigo-100">{aiInsight.suggested_intervention}</p>
            </div>
          </motion.div>
        )}

        {/* Charts & Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Critical Topic Gaps */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Systemic Topic Mastery Gaps</h3>
                <p className="text-xs text-slate-400">At-risk students per concept (mastery &lt; 65%)</p>
              </div>
            </div>

            <div className="space-y-3">
              {topic_gaps?.map((tg: any, i: number) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{tg.topic_name}</span>
                    <span className="text-[11px] text-slate-400">{tg.course_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-rose-600 block">{tg.at_risk_count} Students At Risk</span>
                    <span className="text-[11px] text-slate-400 font-mono">Avg Mastery: {tg.average_mastery}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Performance Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Course Mean Scores</h3>
            <p className="text-xs text-slate-400 mb-4">Relative subject performance across cohort</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={course_performance || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="course_code" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Average Score']} />
                  <Bar dataKey="average_score" radius={[6, 6, 0, 0]}>
                    {(course_performance || []).map((entry: any, index: number) => (
                      <Cell
                        key={index}
                        fill={entry.average_score < 70 ? '#f43f5e' : entry.average_score < 80 ? '#f59e0b' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Program Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-sm mb-1">Cross-Disciplinary Program Cohorts</h3>
          <p className="text-xs text-slate-400 mb-4">Total students enrolled by academic stream</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {program_distribution?.map((p: any, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-mono font-bold text-indigo-600 text-xs block mb-1">{p.program_code}</span>
                <span className="font-extrabold text-slate-900 text-lg block">{p.student_count} Students</span>
                <span className="text-[11px] text-slate-500 truncate block mt-0.5">{p.program_name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
