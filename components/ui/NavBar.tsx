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
} from 'lucide-react';
import { useState } from 'react';

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

  const studentLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/mfc', icon: BookOpen, label: 'MFC Assessment' },
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

  async function handleSwitchRole() {
    const targetRole = userRole === 'faculty' ? 'student' : 'faculty';
    await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: targetRole }),
    });
    router.push(targetRole === 'faculty' ? '/faculty' : '/dashboard');
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
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
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
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
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Button for Judges & Demo */}
            <button
              onClick={handleSwitchRole}
              title={`Switch to ${userRole === 'faculty' ? 'Student View' : 'Faculty View'}`}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors border border-slate-200"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Switch to {userRole === 'faculty' ? 'Student' : 'Faculty'}</span>
            </button>

            {/* Profile Tag */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {userName?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                  {userName}
                  {userRole === 'faculty' ? (
                    <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-md font-semibold">
                      Faculty
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-semibold">
                      STU
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">{userRole === 'faculty' ? 'Dept of CS' : studentId}</div>
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
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSwitchRole}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Switch to {userRole === 'faculty' ? 'Student View' : 'Faculty View'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
