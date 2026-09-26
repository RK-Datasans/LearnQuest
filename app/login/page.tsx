'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Mail, Lock, ChevronRight, GraduationCap, Users, ShieldAlert, ArrowLeft, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid login credentials.');
        return;
      }
      router.push(data.user.role === 'faculty' ? '/faculty' : '/dashboard');
    } catch {
      setError('Connection error. Please ensure MySQL is running in XAMPP.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(role: 'student' | 'faculty' | 'mba') {
    setDemoLoading(role);
    setError('');
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Demo login failed.');
        return;
      }
      router.push(role === 'faculty' ? '/faculty' : '/dashboard');
    } catch {
      setError('Connection error. Please ensure MySQL is running in XAMPP.');
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center px-4 py-12">
      <button
        onClick={() => router.push('/')}
        className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign in to LearnQuest AI</h1>
          <p className="text-slate-400 text-xs mt-1">Select demo role or enter university credentials</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {/* 1-Click Quick Demo Access */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">1-Click Demo Login</span>
              <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">Recommended</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                disabled={!!demoLoading}
                className="flex flex-col items-center justify-center gap-1 p-2.5 bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/40 rounded-2xl text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-center"
              >
                <GraduationCap className="w-4 h-4 text-indigo-200" />
                <span className="text-[11px] font-bold leading-tight">Rahul</span>
                <span className="text-[9px] text-indigo-200">B.Tech CSE</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('mba')}
                disabled={!!demoLoading}
                className="flex flex-col items-center justify-center gap-1 p-2.5 bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 rounded-2xl text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-center"
              >
                <Briefcase className="w-4 h-4 text-emerald-200" />
                <span className="text-[11px] font-bold leading-tight">Ananya</span>
                <span className="text-[9px] text-emerald-200">MBA Tech</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('faculty')}
                disabled={!!demoLoading}
                className="flex flex-col items-center justify-center gap-1 p-2.5 bg-violet-600/80 hover:bg-violet-600 border border-violet-400/40 rounded-2xl text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-center"
              >
                <Users className="w-4 h-4 text-violet-200" />
                <span className="text-[11px] font-bold leading-tight">Dr. Priya</span>
                <span className="text-[9px] text-violet-200">Faculty</span>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900/90 px-3 text-[11px] font-medium text-slate-400 rounded-full">
                or sign in with password
              </span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">University Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@learnquest.local"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo123!"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md shadow-indigo-600/30"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Box */}
          <div className="mt-6 p-3.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-slate-400">
            <div className="font-semibold text-slate-300 mb-1">Pre-configured Demo Credentials:</div>
            <div className="flex justify-between py-0.5">
              <span>B.Tech CSE:</span>
              <span className="font-mono text-indigo-300">student@learnquest.local / Demo123!</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>MBA Tech:</span>
              <span className="font-mono text-emerald-300">mba@learnquest.local / Demo123!</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Faculty Lead:</span>
              <span className="font-mono text-violet-300">faculty@learnquest.local / Demo123!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
