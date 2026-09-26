'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import NavBar from '@/components/ui/NavBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DemoModeBanner from '@/components/ui/DemoModeBanner';
import {
  User,
  GraduationCap,
  Briefcase,
  Brain,
  Award,
  BookOpen,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'academic' | 'career' | 'dynamic' | 'ocean'>('general');

  // Interactive OCEAN simulator state
  const [oceanScores, setOceanScores] = useState({
    openness: 84,
    conscientiousness: 78,
    extraversion: 52,
    agreeableness: 68,
    neuroticism: 38,
  });
  const [updatingOcean, setUpdatingOcean] = useState(false);
  const [oceanFeedback, setOceanFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/profile')
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
          if (d.ocean_profile) {
            setOceanScores({
              openness: d.ocean_profile.openness,
              conscientiousness: d.ocean_profile.conscientiousness,
              extraversion: d.ocean_profile.extraversion,
              agreeableness: d.ocean_profile.agreeableness,
              neuroticism: d.ocean_profile.neuroticism,
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleRecalibrateOcean() {
    setUpdatingOcean(true);
    setOceanFeedback(null);
    try {
      const res = await fetch('/api/ocean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oceanScores),
      });
      const result = await res.json();
      if (result.success && result.classification) {
        setData((prev: any) => ({
          ...prev,
          ocean_profile: result.scores,
          ocean_archetype: {
            ...prev.ocean_archetype,
            primary_name: result.classification.primary.name,
            primary_description: result.classification.primary.description,
            primary_traits: result.classification.primary.primary_traits,
            learning_tendency: result.classification.primary.learning_tendency,
            secondary_name: result.classification.secondary?.name || null,
            supporting_evidence: result.classification.evidence,
          },
        }));
        setOceanFeedback(`Archetype dynamically recalibrated to: ${result.classification.primary.name}`);
      }
    } catch (e) {
      console.error('Failed to recalibrate OCEAN', e);
    } finally {
      setUpdatingOcean(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavBar />
        <LoadingSpinner message="Retrieving academic profile records..." />
      </div>
    );
  }

  const { profile, courses, topic_mastery, dynamic_profile, badges } = data || {};

  const dlpData = dynamic_profile
    ? [
        { dimension: 'Worked Examples', value: dynamic_profile.worked_examples_score },
        { dimension: 'Guided Learning', value: dynamic_profile.guided_learning_score },
        { dimension: 'Reflection', value: dynamic_profile.reflection_score },
        { dimension: 'Visual Schema', value: dynamic_profile.visual_structure_score },
        { dimension: 'Challenge Ramp', value: dynamic_profile.challenge_score },
        { dimension: 'Session Sprints', value: dynamic_profile.session_structure_score },
        { dimension: 'Collaboration', value: dynamic_profile.collaboration_score },
      ]
    : [];

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
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-200">
                {profile?.name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile?.name}</h1>
                  <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-md">
                    {profile?.student_id}
                  </span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  {profile?.degree} &middot; {profile?.program_name} ({profile?.department_name})
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span>Year {profile?.year_of_study}, Semester {profile?.current_semester}</span>
                  <span>&middot;</span>
                  <span>CGPA: <strong className="text-slate-800">{profile?.cgpa}</strong></span>
                  <span>&middot;</span>
                  <span>{profile?.credits_completed} Credits</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/mfc')}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors border border-indigo-200 flex items-center gap-1.5"
              >
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>Take MFC Assessment</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100 overflow-x-auto">
            {[
              { id: 'general', label: 'General Information', icon: User },
              { id: 'academic', label: 'Academic Performance', icon: GraduationCap },
              { id: 'career', label: 'Career & Interests', icon: Briefcase },
              { id: 'dynamic', label: 'Dynamic Learning Profile', icon: Brain },
              { id: 'ocean', label: 'OCEAN & Archetype', icon: Sparkles },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: General Information */}
        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Institutional Student Identity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Full Legal Name</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Student University ID</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{profile?.student_id}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Degree Title</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.degree}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Academic Program</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.program_name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Academic Department</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.department_name}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Specialization Stream</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.specialization || 'Software Systems'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Year of Study & Semester</span>
                  <span className="font-bold text-slate-800 text-sm">Year {profile?.year_of_study}, Semester {profile?.current_semester}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Current Academic Year</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.academic_year}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Expected Graduation</span>
                  <span className="font-bold text-slate-800 text-sm">{profile?.expected_graduation_year}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Academic Information */}
        {activeTab === 'academic' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Enrolled Courses & Academic Standing</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <span className="text-xs text-indigo-600 font-semibold block mb-1">CGPA Standing</span>
                  <span className="text-2xl font-extrabold text-indigo-900">{profile?.cgpa}</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                  <span className="text-xs text-emerald-600 font-semibold block mb-1">Credits Completed</span>
                  <span className="text-2xl font-extrabold text-emerald-900">{profile?.credits_completed} / 160</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                  <span className="text-xs text-amber-600 font-semibold block mb-1">Academic Health Index</span>
                  <span className="text-2xl font-extrabold text-amber-900">{profile?.academic_health_score}%</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Code</th>
                      <th className="py-3 px-3">Course Title</th>
                      <th className="py-3 px-3">Credits</th>
                      <th className="py-3 px-3">Score</th>
                      <th className="py-3 px-3">Grade</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses?.map((c: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{c.code}</td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">{c.name}</td>
                        <td className="py-3.5 px-3 text-slate-500 font-mono">{c.credits} Cr</td>
                        <td className="py-3.5 px-3 font-bold text-slate-800">{c.score}%</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md ${
                              c.score < 70
                                ? 'bg-rose-50 text-rose-700'
                                : c.score < 80
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {c.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium text-[11px]">
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Career & Interests */}
        {activeTab === 'career' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Target Career Alignment & Learning Capacity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Target Career Role</span>
                  <span className="font-extrabold text-slate-900 text-base">{profile?.career_goal}</span>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    The AI Academic Navigator prioritizes competencies essential for entry and promotion in this field (e.g., Relational Normalization, Indexing, Systems Architecture).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block mb-1">Weekly Learning Availability</span>
                  <span className="font-extrabold text-slate-900 text-base">{profile?.weekly_learning_hours} Hours / Week</span>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Study schedules generated by the AI Navigator are strictly balanced across 5 daily sprints to avoid cognitive overload.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-slate-400 block mb-2">Technical Interests & Aspirations</span>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests?.split(',').map((interest: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold text-xs"
                      >
                        {interest.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 4: Dynamic Learning Profile */}
        {activeTab === 'dynamic' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span>Dynamic Learning Profile (Observed Preferences)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Demonstrated preferences based on MFC assessments & quiz telemetry &middot; Evolves dynamically
                  </p>
                </div>
                <button
                  onClick={() => router.push('/mfc')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Retake Assessment
                </button>
              </div>

              {/* Principle Alert Box */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-600 mb-8 leading-relaxed">
                <span className="font-bold text-slate-800">Pedagogical Framework: </span>
                These are observed behavioral preferences, <span className="font-bold underline">not fixed cognitive styles</span>. LearnQuest never categorizes students into unscientific labels such as &ldquo;visual learner&rdquo;. Instead, this profile tracks how you engage best under different learning conditions.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={dlpData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Radar
                        name="Observed Tendency"
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
                  {dlpData.map((d: any, i: number) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-700">{d.dimension}</span>
                        <span className="text-indigo-600 font-bold">{d.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${d.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Log */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs">
                <span className="font-bold text-indigo-950 block mb-1">Recent Behavioral Evidence:</span>
                <p className="text-indigo-900 leading-relaxed">
                  {dynamic_profile?.recent_behavior_evidence ||
                    'Observed strong retention when step-by-step worked examples precede independent puzzle resolution. Calibrated against latest assessment.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 5: OCEAN Personality Profile & Derived Archetypes */}
        {activeTab === 'ocean' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-extrabold text-slate-900">
                      OCEAN Personality Profile & Derived Archetype
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Big Five trait tendencies (0–100 scale) with explicit Low / Moderate / High bands &middot; Section 45 compliant
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full self-start sm:self-auto">
                  Derived Signal &middot; Not a Diagnosis
                </span>
              </div>

              {/* Crucial Ethical / Pedagogical Distinction Banner */}
              <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 text-xs leading-relaxed mb-8 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Foundational Principle: Personality, Preference & Proficiency Are Different Constructs</span>
                </div>
                <p className="text-slate-300 font-normal">
                  &bull; <strong className="text-white">Personality (OCEAN):</strong> Answers what behavioral tendencies are represented in this student&apos;s trait pattern.<br />
                  &bull; <strong className="text-white">Preference (MFC):</strong> Answers what learning engagement modes the student has demonstrated.<br />
                  &bull; <strong className="text-white">Proficiency (Academics):</strong> Answers what the student actually knows and where the knowledge gaps exist.<br />
                  <span className="text-amber-200 font-semibold block pt-1">
                    Rule: OCEAN is NEVER used as a learning-style label, a deterministic career predictor, or an excuse to bypass actual academic gaps.
                  </span>
                </p>
              </div>

              {/* Primary Archetype Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white mb-8 border border-indigo-700/50 shadow-lg">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">
                    Primary Derived Archetype
                  </span>
                  {data?.ocean_archetype?.secondary_name && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300 border border-white/20">
                      Secondary: {data.ocean_archetype.secondary_name}
                    </span>
                  )}
                </div>

                <h4 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
                  {data?.ocean_archetype?.primary_name || 'Creative Builder'}
                </h4>

                <div className="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 rounded-xl text-xs font-bold text-indigo-200 mb-4">
                  {data?.ocean_archetype?.primary_traits || 'High Openness, High Conscientiousness'}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {data?.ocean_archetype?.learning_tendency ||
                    'Thrives when given architectural freedom combined with concrete milestones and rigorous worked examples.'}
                </p>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-indigo-100">
                  <strong className="text-white block mb-1">Supporting Trait Evidence:</strong>
                  {data?.ocean_archetype?.supporting_evidence ||
                    'High Openness (84) combined with High Conscientiousness (78) demonstrates a natural tendency to ideate innovative software architectures and execute reliable, well-tested implementations.'}
                </div>
              </div>

              {/* 5 Big Five Trait Breakdown Cards with Explicit Bands */}
              <h4 className="font-extrabold text-slate-900 text-sm mb-3">Big Five Trait Dimension Scores</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
                {[
                  {
                    name: 'Openness',
                    key: 'openness',
                    score: oceanScores.openness,
                    desc: 'Intellectual curiosity & abstract ideation',
                  },
                  {
                    name: 'Conscientiousness',
                    key: 'conscientiousness',
                    score: oceanScores.conscientiousness,
                    desc: 'Discipline, methodical pacing & grit',
                  },
                  {
                    name: 'Extraversion',
                    key: 'extraversion',
                    score: oceanScores.extraversion,
                    desc: 'Social energy & verbal dialogue',
                  },
                  {
                    name: 'Agreeableness',
                    key: 'agreeableness',
                    score: oceanScores.agreeableness,
                    desc: 'Cooperative spirit & team orientation',
                  },
                  {
                    name: 'Neuroticism',
                    key: 'neuroticism',
                    score: oceanScores.neuroticism,
                    desc: 'Sensitivity to evaluation pressure',
                  },
                ].map((t) => {
                  const band = t.score < 40 ? 'Low' : t.score <= 65 ? 'Moderate' : 'High';
                  const bandColor =
                    band === 'High'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : band === 'Moderate'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200';

                  return (
                    <div
                      key={t.key}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs text-slate-800">{t.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${bandColor}`}>
                            {band}
                          </span>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 mb-2">{t.score}</div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${t.score}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-tight">{t.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Trait Tuning Simulator (Key Demo Feature from Section 45) */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Interactive Archetype Recalibration Simulator
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Test Dynamic Archetype Transitions</span>
                </div>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Adjust any of the 5 trait sliders below and click <strong>&ldquo;Recalibrate Archetype&rdquo;</strong> to verify that changing trait scores deterministically reclassifies the student into one of the 9 university archetypes!
                </p>

                <div className="space-y-4 mb-6">
                  {[
                    { key: 'openness', label: 'Openness (Intellectual Curiosity)' },
                    { key: 'conscientiousness', label: 'Conscientiousness (Disciplined Execution)' },
                    { key: 'extraversion', label: 'Extraversion (Social / Collaborative Energy)' },
                    { key: 'agreeableness', label: 'Agreeableness (Team Harmony & Cooperation)' },
                    { key: 'neuroticism', label: 'Neuroticism (Sensitivity / Stress Reactivity)' },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{field.label}</span>
                        <span className="font-mono text-indigo-600 font-bold">
                          {(oceanScores as any)[field.key]} / 100
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(oceanScores as any)[field.key]}
                        onChange={(e) =>
                          setOceanScores((prev) => ({
                            ...prev,
                            [field.key]: parseInt(e.target.value, 10),
                          }))
                        }
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {oceanFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{oceanFeedback}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() =>
                      setOceanScores({
                        openness: 84,
                        conscientiousness: 78,
                        extraversion: 52,
                        agreeableness: 68,
                        neuroticism: 38,
                      })
                    }
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Reset to Rahul&apos;s Baseline (Creative Builder)
                  </button>

                  <button
                    onClick={handleRecalibrateOcean}
                    disabled={updatingOcean}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${updatingOcean ? 'animate-spin' : ''}`} />
                    <span>{updatingOcean ? 'Recalibrating...' : 'Recalibrate Archetype'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
