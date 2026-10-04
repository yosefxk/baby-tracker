'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/dateFormat';
import {
  Baby as BabyIcon,
  ChevronDown,
  UserCheck,
  Share2,
  BarChart2,
  Shield,
  HeartHandshake,
  AlertCircle,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenShareModal?: () => void;
  onOpenAddChildModal?: () => void;
}

export function Header({ onOpenShareModal, onOpenAddChildModal }: HeaderProps) {
  const pathname = usePathname();
  const { currentUser, allUsers, babies, activeBaby, setActiveBabyId, switchUser } = useApp();
  const [showBabyDropdown, setShowBabyDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Helper to calculate age in Hebrew
  const getBabyAgeString = (birthDateStr?: string) => {
    if (!birthDateStr) return '';
    const birth = new Date(birthDateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `בן/בת ${diffDays} ימים`;
    if (diffDays < 30) return `בן/בת ${Math.floor(diffDays / 7)} שבועות`;
    const months = Math.floor(diffDays / 30.4375);
    const remainingDays = Math.floor(diffDays % 30.4375);
    if (remainingDays === 0) return `בן/בת ${months} חודשים`;
    return `בן/בת ${months} חודשים ו-${remainingDays} ימים`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs w-full max-w-full overflow-hidden">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Right side: Logo & Baby Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <BabyIcon className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-800 leading-tight">Baby Tracker</h1>
            </div>
          </Link>

          {/* Baby Selector Dropdown */}
          {babies.length > 0 && (
            <div className="relative min-w-0">
              <button
                onClick={() => {
                  setShowBabyDropdown(!showBabyDropdown);
                  setShowMobileMenu(false);
                  setShowUserDropdown(false);
                }}
                className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100/80 border border-pink-200/80 px-2.5 py-1.5 rounded-full transition-colors text-right max-w-[150px] sm:max-w-[200px]"
              >
                <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                <span className="text-xs font-bold text-gray-800 truncate">
                  {activeBaby ? activeBaby.name : 'בחר ילד'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>

              {showBabyDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-pink-100 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    הילדים שלי ({babies.length})
                  </div>
                  {babies.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveBabyId(b.id);
                        setShowBabyDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right text-xs transition-colors ${
                        b.id === activeBaby?.id
                          ? 'bg-pink-500 text-white font-bold'
                          : 'hover:bg-pink-50 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col text-right">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${b.id === activeBaby?.id ? 'bg-white' : b.gender === 'boy' ? 'bg-sky-400' : 'bg-pink-400'}`} />
                          <span className="font-semibold">{b.name}</span>
                        </div>
                        {b.birth_date && (
                          <span className={`text-[10px] pr-4 ${b.id === activeBaby?.id ? 'text-pink-100' : 'text-gray-400'}`}>
                            תאריך לידה: {formatDate(b.birth_date)}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] shrink-0 ${b.id === activeBaby?.id ? 'text-pink-100' : 'text-gray-400'}`}>
                        {b.role === 'parent' ? 'הורה' : b.role === 'caregiver' ? 'מטפלת' : 'צופה'}
                      </span>
                    </button>
                  ))}

                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => {
                      setShowBabyDropdown(false);
                      onOpenAddChildModal?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>הוספת ילד/ה נוספ/ת...</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Left side: Action Buttons & Navigation */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Share & Invite button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full shadow-xs transition-all cursor-pointer shrink-0"
            title="שיתוף והזמנת משתמשים"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">שיתוף והזמנות</span>
          </button>

          {/* Desktop Links (hidden on small mobile) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/stats"
              className={`p-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                pathname === '/stats' ? 'bg-pink-100 text-pink-700' : 'text-gray-600 hover:bg-pink-50'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-pink-500" />
              <span>סטטיסטיקות</span>
            </Link>

            <Link
              href="/babysitter"
              className={`p-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                pathname === '/babysitter' ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
              <span>למטפלת</span>
            </Link>

            <Link
              href="/emergency"
              className={`p-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                pathname === '/emergency' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-red-50'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span>חירום</span>
            </Link>

            {currentUser?.is_system_admin && (
              <Link
                href="/admin"
                className={`p-1.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                  pathname === '/admin' ? 'bg-purple-100 text-purple-700' : 'text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>ניהול</span>
              </Link>
            )}
          </div>

          {/* User profile dropdown button (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2 py-1.5 rounded-full text-xs text-gray-700 font-medium"
            >
              <UserCheck className="w-3.5 h-3.5 text-pink-500" />
              <span className="truncate max-w-[80px]">{currentUser?.name || currentUser?.username || 'משתמש'}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400">
                  החלף משתמש:
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-right text-xs transition-colors ${
                      u.id === currentUser?.id
                        ? 'bg-gray-100 font-bold text-gray-900'
                        : 'hover:bg-pink-50 text-gray-700'
                    }`}
                  >
                    <span>{u.name}</span>
                    <span className="text-[10px] text-gray-400">@{u.username}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger (Visible on small screens) */}
          <div className="relative md:hidden">
            <button
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowBabyDropdown(false);
              }}
              className="p-1.5 rounded-xl bg-gray-50 hover:bg-pink-50 text-gray-700 border border-gray-200"
              title="תפריט"
            >
              {showMobileMenu ? <X className="w-5 h-5 text-pink-600" /> : <Menu className="w-5 h-5" />}
            </button>

            {showMobileMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-pink-100 p-2.5 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-1 mb-1">
                  שלום, {currentUser?.name || currentUser?.username}
                </div>

                <Link
                  href="/stats"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-pink-50"
                >
                  <BarChart2 className="w-4 h-4 text-pink-500" />
                  <span>סטטיסטיקות ומגמות</span>
                </Link>

                <Link
                  href="/babysitter"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-amber-50"
                >
                  <HeartHandshake className="w-4 h-4 text-amber-500" />
                  <span>מדריך למטפלת</span>
                </Link>

                <Link
                  href="/emergency"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-red-50"
                >
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>מדריך חירום מד״א</span>
                </Link>

                {currentUser?.is_system_admin && (
                  <Link
                    href="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50"
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>ניהול משתמשים ומערכת</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onOpenAddChildModal?.();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-pink-600 hover:bg-pink-50 rounded-xl text-xs font-semibold text-right"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>הוספת ילד נוסף</span>
                </button>

                {allUsers.length > 1 && (
                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <div className="px-3 py-1 text-[10px] text-gray-400">החלף משתמש:</div>
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-right text-xs ${
                          u.id === currentUser?.id ? 'bg-pink-50 font-bold text-pink-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{u.name}</span>
                        <span className="text-[10px] text-gray-400">@{u.username}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
