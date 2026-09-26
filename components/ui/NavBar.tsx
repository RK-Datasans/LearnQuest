'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  User,
  Compass,
  Swords,
  TrendingUp,
  LogOut,
  BookOpen,
  Menu,
  X,
  GraduationCap,
  Users,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavBarProps {
  userRole?: 'student' | 'faculty' | 'admin';
  userName?: string;
  studentId?: string;
}

export default function NavBar({
  userRole = 'student',
  userName = 'Rahul Sharma',
  studentId = 'STU-2026-1042',
}: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const studentLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/mfc', icon: BookOpen, label: 'MFC' },
    { href: '/navigator', icon: Compass, label: 'AI Navigator' },
    { href: '/quest', icon: Swords, label: 'Quests' },
    { href: '/progress', icon: TrendingUp, label: 'Progress' },
  ];

  const facultyLinks = [
    { href: '/faculty', icon: Users, label: 'Faculty Intelligence' },
  ];

  const links = userRole === 'faculty' ? facultyLinks : studentLinks;

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  async function handleSwitchPersona(target: 'student' | 'mba' | 'faculty') {
    setSwitcherOpen(false);
    setMobileOpen(false);
    await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: target }),
    });
    window.location.href = target === 'faculty' ? '/faculty' : '/dashboard';
  }

  const isMbaStudent = userName?.toLowerCase().includes('ananya') || studentId?.includes('MBA');

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => router.push(userRole === 'faculty' ? '/faculty' : '/dashboard')}
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-none">
                LearnQuest <span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Academic Decision Support</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 lg:px-3.5 lg:py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <link.icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right User Bar */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Persona Switcher Dropdown */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-200"
              >
                {userRole === 'faculty' ? (
                  <Users className="w-3.5 h-3.5 text-violet-600" />
                ) : isMbaStudent ? (
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                )}
                <span>Switch Persona</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  <button
                    onClick={() => handleSwitchPersona('student')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                      R
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Rahul Sharma</div>
                      <div className="text-[10px] text-slate-500">B.Tech CSE · Creative Builder</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('mba')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50 transition-colors mt-1"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Ananya Rao</div>
                      <div className="text-[10px] text-slate-500">MBA Tech Mgmt · Team Driver</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSwitchPersona('faculty')}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-violet-50 transition-colors mt-1"
                  >
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs">
                      P
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Dr. Priya Mehta</div>
                      <div className="text-[10px] text-slate-500">Faculty Lead · Professor</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Profile Tag */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                userRole === 'faculty'
                  ? 'bg-gradient-to-tr from-violet-600 to-violet-500'
                  : isMbaStudent
                  ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500'
                  : 'bg-gradient-to-tr from-indigo-500 to-indigo-400'
              }`}>
                {userName?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                  {userName}
                  {userRole === 'faculty' ? (
                    <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-md font-semibold">
                      Faculty
                    </span>
                  ) : isMbaStudent ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold">
                      MBA
                    </span>
                  ) : (
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-semibold">
                      B.Tech
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{userRole === 'faculty' ? 'School of Computing' : studentId}</div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-lg">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <button
                key={link.href}
                onClick={() => {
                  router.push(link.href);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Switch Persona
            </div>
            <button
              onClick={() => handleSwitchPersona('student')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Rahul Sharma (B.Tech CSE)
            </button>
            <button
              onClick={() => handleSwitchPersona('mba')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Ananya Rao (MBA Tech)
            </button>
            <button
              onClick={() => handleSwitchPersona('faculty')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <Users className="w-4 h-4 text-violet-600" />
              Dr. Priya Mehta (Faculty)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

