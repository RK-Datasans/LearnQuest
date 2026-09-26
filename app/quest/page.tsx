'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  Swords,
  Target,
  Sparkles,
  ChevronRight,
  Trophy,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

export default function QuestLibraryPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quest')
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
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <LoadingSpinner message="Loading your adaptive quest library..." />
      </div>
    );
  }

  const { quests, profile } = data || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar
        userRole={profile?.role || 'student'}
        userName={profile?.name}
        studentId={profile?.student_id}
      />
      <DemoModeBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-bold mb-2">
              <Swords className="w-3.5 h-3.5 text-indigo-600" />
              <span>Adaptive Quest System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Quest Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Structured multi-stage challenges designed around your academic focus areas.
            </p>
          </div>
        </div>

        {/* Quests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quests?.map((q: any, i: number) => {
            const isActive = q.status === 'active';
            const isCompleted = q.status === 'completed';

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl border p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all ${
                  isActive
                    ? 'border-indigo-300 ring-2 ring-indigo-500/10'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {q.course_code}: {q.course_name}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isActive ? 'Active Quest' : isCompleted ? 'Completed' : 'Available'}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{q.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{q.description}</p>

                  {/* Stage Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">
                        Stage {q.current_stage} of {q.total_stages}
                      </span>
                      <span className="font-bold text-indigo-600">{q.progress_pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${q.progress_pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Quest Meta Tags */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-slate-700">+{q.reward_xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-500" />
                      <span>{q.difficulty} Difficulty</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/quest/${q.id}`)}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{isActive ? 'Continue Quest' : isCompleted ? 'Review Stages' : 'Start Quest'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
