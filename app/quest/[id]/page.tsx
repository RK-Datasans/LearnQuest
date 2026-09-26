'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  Swords,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Award,
  Zap,
  ArrowRight,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function QuestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;

  const [questData, setQuestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStageIndex, setCurrentStageIndex] = useState(3); // Stage 4: Practice Quiz by default for demo
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [misconceptionBanner, setMisconceptionBanner] = useState<any>(null);
  const [bossWon, setBossWon] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState<any>(null);

  // Load quest details
  useEffect(() => {
    fetch(`/api/quest/${questId}`)
      .then((r) => {
        if (r.status === 401) {
          router.push('/login');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setQuestData(d);
          if (d.quest?.current_stage) {
            setCurrentStageIndex(Math.max(0, d.quest.current_stage - 1));
          }
        }
      })
      .finally(() => setLoading(false));
  }, [questId, router]);

  // Load question when stage changes
  useEffect(() => {
    if (!questData?.quest) return;
    const stage = stages[currentStageIndex];
    if (stage?.isQuiz) {
      loadQuizQuestion(stage.difficulty || 'Medium', stage.name, !!stage.isBoss);
    } else {
      setActiveQuestion(null);
      setEvaluationResult(null);
      setMisconceptionBanner(null);
    }
  }, [currentStageIndex, questData]);

  async function loadQuizQuestion(difficulty: string = 'Medium', stageName: string = 'Practice', isBoss: boolean = false) {
    setSelectedAnswer(null);
    setEvaluationResult(null);
    setMisconceptionBanner(null);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: questData.quest.topic_id || 1,
          quest_id: parseInt(questId, 10),
          difficulty: isBoss ? 'Boss' : difficulty,
          stage_name: stageName,
        }),
      });
      const data = await res.json();
      if (data?.question) {
        setActiveQuestion(data.question);
      }
    } catch (e) {
      console.error('Failed to load question', e);
    }
  }

  async function handleSubmitAnswer(optLabel: string) {
    if (!activeQuestion || evaluating) return;
    setSelectedAnswer(optLabel);
    setEvaluating(true);

    const isBoss = stages[currentStageIndex]?.isBoss || false;

    try {
      const res = await fetch('/api/quiz/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: questData.quest.topic_id || 1,
          quest_id: parseInt(questId, 10),
          question: activeQuestion.question,
          options: activeQuestion.options,
          correct_answer: activeQuestion.correct_answer,
          selected_answer: optLabel,
          difficulty: activeQuestion.difficulty || 'Medium',
          is_boss: isBoss,
        }),
      });
      const data = await res.json();
      setEvaluationResult(data);

      if (!data.is_correct && data.evaluation?.misconception) {
        setMisconceptionBanner(data.evaluation);
      }

      if (data.is_correct && isBoss) {
        setBossWon(true);
        if (data.unlocked_badge) {
          setBadgeUnlocked(data.unlocked_badge);
        }
      }

      if (data.unlocked_badge && !isBoss) {
        setBadgeUnlocked(data.unlocked_badge);
      }

      // Update local topic mastery display
      if (data.mastery_after) {
        setQuestData((prev: any) => ({
          ...prev,
          topic_mastery: { ...prev.topic_mastery, mastery_score: data.mastery_after },
        }));
      }
    } catch (err) {
      console.error('Answer eval error', err);
    } finally {
      setEvaluating(false);
    }
  }

  async function handleAdvanceStage() {
    const nextStage = Math.min(stages.length, currentStageIndex + 2);
    try {
      await fetch(`/api/quest/${questId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: nextStage,
          stages_data: stages.map((s, idx) => ({
            ...s,
            status: idx < nextStage ? 'completed' : idx === nextStage - 1 ? 'active' : 'locked',
          })),
        }),
      });
      setCurrentStageIndex((prev) => Math.min(stages.length - 1, prev + 1));
      setEvaluationResult(null);
      setMisconceptionBanner(null);
    } catch (e) {
      console.error('Stage advance failed', e);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <LoadingSpinner message="Entering quest chamber & synchronizing challenge parameters..." />
      </div>
    );
  }

  const quest = questData?.quest || {};
  const topicMastery = questData?.topic_mastery?.mastery_score || 52;

  const stages = [
    {
      id: 1,
      name: 'Warm-up',
      desc: 'Relational Anomalies: Insert, Update, and Delete traps in denormalized databases.',
      isQuiz: false,
      xp: 20,
    },
    {
      id: 2,
      name: 'Personalized Explanation',
      desc: 'Deconstructing 1NF, 2NF, and 3NF with visual schema models adapted to your profile.',
      isQuiz: false,
      xp: 25,
    },
    {
      id: 3,
      name: 'Worked Example',
      desc: 'Step-by-step resolution of a decomposed Student-Course relation.',
      isQuiz: false,
      xp: 30,
    },
    {
      id: 4,
      name: 'Practice Quiz',
      desc: 'Identify Partial Dependencies (2NF) vs Transitive Dependencies (3NF).',
      isQuiz: true,
      difficulty: 'Medium',
      isBoss: false,
      xp: 35,
    },
    {
      id: 5,
      name: 'Challenge',
      desc: 'Multi-attribute candidate keys and BCNF violation traps.',
      isQuiz: true,
      difficulty: 'Hard',
      isBoss: false,
      xp: 40,
    },
    {
      id: 6,
      name: 'Boss Battle',
      desc: 'Conquer the Normalization Boss Battle to earn the Dependency Hunter badge!',
      isQuiz: true,
      difficulty: 'Boss',
      isBoss: true,
      xp: 100,
    },
  ];

  const currentStage = stages[currentStageIndex];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <NavBar />
      <DemoModeBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Quest Top Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {quest.course_name}
                </span>
                <span className="text-xs text-slate-400">&middot; Stage {currentStageIndex + 1} of {stages.length}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {quest.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{quest.description}</p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl shrink-0">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Topic Mastery</span>
                <span className={`text-xl font-extrabold ${topicMastery < 65 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {topicMastery}%
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Stepper Stages Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-8 pt-6 border-t border-slate-100">
            {stages.map((st, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => setCurrentStageIndex(idx)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : isPast
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span>Stage {st.id}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {st.isBoss && <Trophy className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-300' : 'text-amber-500'}`} />}
                  </div>
                  <div className="text-xs font-extrabold truncate leading-tight">{st.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STAGE CONTENT AREA */}
        <div className="space-y-6">
          {/* Stage 1: Warm-up Concept Review */}
          {currentStageIndex === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Stage 1: Relational Anomaly Warm-up</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Before tackling normal forms, let&apos;s revisit the core problems that occur in poorly structured relations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block mb-1">1. Insertion Anomaly</span>
                  <p className="text-xs text-slate-500 leading-relaxed">You cannot record a new course without first assigning a student, because the primary key cannot be NULL.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block mb-1">2. Deletion Anomaly</span>
                  <p className="text-xs text-slate-500 leading-relaxed">Deleting the last student enrolled in a course inadvertently wipes out all information about that course.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block mb-1">3. Update Anomaly</span>
                  <p className="text-xs text-slate-500 leading-relaxed">Changing a professor&apos;s office requires updating dozens of rows. Inconsistencies arise if any row is missed.</p>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={handleAdvanceStage} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                  <span>Continue to Explanation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stage 2: Personalized Explanation */}
          {currentStageIndex === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Stage 2: 1NF &middot; 2NF &middot; 3NF &middot; BCNF</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tailored for your observed preference in <strong className="text-indigo-600">Visual Structure</strong> and <strong className="text-indigo-600">Worked Examples</strong>:
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700">
                  <span className="font-bold text-indigo-900 block mb-1">1NF (First Normal Form): Atomic Values</span>
                  <span>Every attribute cell must hold exactly one value. No repeating groups or comma-separated lists.</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700">
                  <span className="font-bold text-amber-900 block mb-1">2NF (Second Normal Form): No Partial Dependencies</span>
                  <span>Relation must be in 1NF AND no non-prime attribute may depend on only a <em className="underline">part</em> of a composite primary key.</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700">
                  <span className="font-bold text-emerald-900 block mb-1">3NF (Third Normal Form): No Transitive Dependencies</span>
                  <span>Relation must be in 2NF AND no non-prime attribute may depend on another non-prime attribute (<em className="underline">A &rarr; B &rarr; C</em>).</span>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={handleAdvanceStage} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                  <span>Continue to Worked Example</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stage 3: Worked Example */}
          {currentStageIndex === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Stage 3: Annotated Worked Example</h2>
              <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
                <span className="text-emerald-400 font-bold">// Initial Denormalized Table:</span><br />
                ENROLLMENT(<u>StudentID</u>, <u>CourseID</u>, StudentName, CourseName, InstructorID, Office)<br /><br />
                <span className="text-amber-400 font-bold">// 1. Detect Partial Dependency (2NF Violation):</span><br />
                &bull; StudentID &rarr; StudentName (depends only on StudentID, not full key)<br />
                &bull; CourseID &rarr; CourseName (depends only on CourseID)<br />
                <span className="text-indigo-400">&rarr; Decompose into: STUDENT(<u>StudentID</u>, StudentName), COURSE(<u>CourseID</u>, CourseName)</span><br /><br />
                <span className="text-amber-400 font-bold">// 2. Detect Transitive Dependency (3NF Violation):</span><br />
                &bull; StudentID, CourseID &rarr; InstructorID &rarr; Office<br />
                <span className="text-indigo-400">&rarr; Decompose into: INSTRUCTOR(<u>InstructorID</u>, Office)</span>
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={handleAdvanceStage} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                  <span>Enter Practice Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Stages 4, 5, 6: Interactive Academic Quiz Runner */}
          {currentStage.isQuiz && (
            <div className="space-y-6">
              {/* KEY DEMO MOMENT: MISCONCEPTION DETECTION BANNER */}
              <AnimatePresence>
                {misconceptionBanner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gradient-to-br from-amber-500 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-200 animate-bounce" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-200">
                        Misconception Detected by AI
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold mb-3">
                      {misconceptionBanner.misconception || 'Confusion between Partial and Transitive Dependency'}
                    </h3>

                    <p className="text-xs sm:text-sm text-amber-100 leading-relaxed mb-6 font-normal">
                      {misconceptionBanner.feedback}
                    </p>

                    {/* Targeted Worked Example: "Let's fix this" */}
                    {misconceptionBanner.remediation_example && (
                      <div className="p-4 sm:p-5 bg-black/25 border border-white/20 rounded-2xl text-xs font-mono leading-relaxed mb-6 whitespace-pre-line text-white">
                        <span className="font-bold text-amber-300 block mb-2 font-sans text-xs uppercase tracking-wider">
                          Let&apos;s fix this &middot; Scaffolding Comparison:
                        </span>
                        {misconceptionBanner.remediation_example}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => loadQuizQuestion('Easy', 'Targeted Retry', false)}
                        className="px-6 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-extrabold hover:bg-amber-50 transition-colors shadow-md flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                        <span>Try a Targeted Retry Question (Difficulty Adapted)</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BOSS BATTLE VICTORY / BADGE UNLOCKED */}
              <AnimatePresence>
                {bossWon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-indigo-900 via-violet-900 to-indigo-950 text-white rounded-3xl p-8 text-center shadow-2xl border border-indigo-400/40 relative overflow-hidden"
                  >
                    <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 block mb-1">
                      Quest Completed &middot; Boss Conquered!
                    </span>
                    <h2 className="text-3xl font-extrabold mb-2">Normalization Boss Battle Victory!</h2>
                    <p className="text-xs sm:text-sm text-indigo-200 max-w-lg mx-auto mb-6">
                      You conquered candidate keys, eliminated update anomalies, and mastered BCNF decompositions.
                    </p>

                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-2xl mb-8">
                      <Award className="w-6 h-6 text-amber-400" />
                      <div className="text-left">
                        <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-bold">New Badge Unlocked</span>
                        <span className="text-sm font-extrabold text-white">Dependency Hunter</span>
                      </div>
                      <span className="ml-4 px-2.5 py-1 bg-amber-400 text-amber-950 rounded-lg text-xs font-extrabold">
                        +100 XP
                      </span>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => router.push('/progress')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>View Progress & Adaptation Timeline</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quiz Card */}
              {activeQuestion && !bossWon && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          activeQuestion.difficulty === 'Boss'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : activeQuestion.difficulty === 'Hard'
                            ? 'bg-amber-50 text-amber-700'
                            : activeQuestion.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {activeQuestion.difficulty} Difficulty
                      </span>
                      <span className="text-xs text-slate-400">&middot; {currentStage.name}</span>
                    </div>

                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>+{currentStage.xp} XP on completion</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
                    {activeQuestion.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {activeQuestion.options?.map((opt: string, i: number) => {
                      const label = opt.charAt(0);
                      const isSelected = selectedAnswer === label;
                      const isEvaluated = !!evaluationResult;
                      const isCorrect = evaluationResult?.is_correct && isSelected;
                      const isWrong = !evaluationResult?.is_correct && isSelected;

                      return (
                        <button
                          key={i}
                          disabled={evaluating || isEvaluated}
                          onClick={() => handleSubmitAnswer(label)}
                          className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                              : isWrong
                              ? 'bg-rose-50 border-rose-400 shadow-xs'
                              : isSelected
                              ? 'bg-indigo-50 border-indigo-400'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white'
                                : isWrong
                                ? 'bg-rose-600 text-white'
                                : isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {label}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Evaluation Feedback */}
                  {evaluationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border text-xs leading-relaxed mb-6 ${
                        evaluationResult.is_correct
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        {evaluationResult.is_correct ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct! Concept Mastered (+{evaluationResult.xp_earned} XP)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Answer Incorrect &middot; Adaptive Diagnostic Below</span>
                          </>
                        )}
                      </div>
                      <p className="mt-1">{evaluationResult.evaluation?.feedback}</p>
                    </motion.div>
                  )}

                  {/* Footer Action */}
                  {evaluationResult?.is_correct && !bossWon && (
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        onClick={handleAdvanceStage}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>Advance to Next Stage</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
