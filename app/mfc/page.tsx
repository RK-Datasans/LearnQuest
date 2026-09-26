'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function MFCPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [resultProfile, setResultProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mfc')
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d?.questions) setQuestions(d.questions);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleSelectOption(questionId: number, optionId: number) {
    setResponses((prev) => ({ ...prev, [questionId]: optionId }));
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const formattedResponses = Object.entries(responses).map(([qId, oId]) => ({
        question_id: parseInt(qId, 10),
        selected_option_id: oId,
      }));

      const res = await fetch('/api/mfc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: formattedResponses }),
      });
      const data = await res.json();
      if (data.dynamic_profile) {
        setResultProfile(data.dynamic_profile);
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <LoadingSpinner message="Loading Multi-Dimensional Forced Choice scenarios..." />
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const allAnswered = questions.length > 0 && Object.keys(responses).length === questions.length;

  const radarData = resultProfile
    ? [
        { dimension: 'Worked Examples', value: resultProfile.worked_examples_score },
        { dimension: 'Guided Learning', value: resultProfile.guided_learning_score },
        { dimension: 'Reflection', value: resultProfile.reflection_score },
        { dimension: 'Visual Schema', value: resultProfile.visual_structure_score },
        { dimension: 'Challenge Ramp', value: resultProfile.challenge_score },
        { dimension: 'Session Sprints', value: resultProfile.session_structure_score },
        { dimension: 'Collaboration', value: resultProfile.collaboration_score },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <DemoModeBanner />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Dimensional Forced Choice Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Your Observed Learning Preferences
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto leading-relaxed">
            Choose the option that aligns naturally with how you work through difficult technical challenges.
            This calibrates your Dynamic Learning Profile.
          </p>
        </div>

        {/* RESULTS SCREEN */}
        {resultProfile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Assessment Complete!</h2>
                <p className="text-xs text-slate-500">Your Dynamic Learning Profile has been updated in MySQL.</p>
              </div>
            </div>

            {/* Crucial Pedagogical Disclaimers */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950 mb-8 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Observed Preferences, Not Fixed Learning Styles</span>
              </div>
              <p>
                These scores reflect your demonstrated engagement preferences based on current assessment responses and learning activity.
                <strong className="text-indigo-900"> Your profile evolves dynamically as you complete quests and quizzes.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Radar
                      name="Demonstrated Preference"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {radarData.map((d: any, i: number) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">{d.dimension}</span>
                      <span className="text-indigo-600 font-bold">{d.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setResultProfile(null);
                  setCurrentIndex(0);
                  setResponses({});
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Assessment</span>
              </button>

              <button
                onClick={() => router.push('/navigator')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Feed into AI Navigator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ACTIVE ASSESSMENT STEPPER */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500">
                  Scenario {currentIndex + 1} of {questions.length}
                </span>
                <span className="font-bold text-indigo-600">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {currentQ && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                      Scenario Context &middot; {currentQ.dimension_name || 'Learning Preference'}
                    </span>
                    <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
                      {currentQ.scenario_context}
                    </p>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {currentQ.question_text}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQ.options?.map((opt: any) => {
                      const selected = responses[currentQ.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQ.id, opt.id)}
                          className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            selected
                              ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              selected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.option_label}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {opt.option_text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  disabled={!responses[currentQ?.id]}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                >
                  <span>Next Scenario</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={!allAnswered || submitting}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-40"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit & Generate Profile</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
