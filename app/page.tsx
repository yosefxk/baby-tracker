'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { ActiveTimers } from '@/components/ActiveTimers';
import { QuickActionGrid } from '@/components/QuickActionGrid';
import { DailySummary } from '@/components/DailySummary';
import { TimelineFeed } from '@/components/TimelineFeed';
import { LogModal } from '@/components/modals/LogModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { AddChildModal } from '@/components/modals/AddChildModal';
import { SetupWizard } from '@/components/SetupWizard';
import { Sparkles, Bell, Check, Baby, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const { isSetupRequired, isLoading, activeBaby, babies } = useApp();
  const [selectedLogType, setSelectedLogType] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [givenVitaminD, setGivenVitaminD] = useState(false);

  // If initial setup is required (no admin user exists yet)
  if (isSetupRequired) {
    return <SetupWizard />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff9fa] flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9fa] flex flex-col w-full max-w-full overflow-x-hidden">
      <Header
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAddChildModal={() => setIsAddChildModalOpen(true)}
      />

      <main className="flex-1 max-w-xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-5 overflow-x-hidden">
        {babies.length === 0 ? (
          /* Empty State when admin exists but no babies created yet */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-pink-100 shadow-md max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
              <Baby className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">אין עדיין ילדים ביומן</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              כדי להתחיל לתעד הנקות, בקבוקים, שינה וחיתולים, הוסיפו את הילד/ה הראשון/ה שלכם.
            </p>
            <button
              onClick={() => setIsAddChildModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold px-6 py-3 rounded-2xl shadow-md shadow-pink-200 text-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>הוספת הילד/ה הראשון/ה</span>
            </button>
          </div>
        ) : (
          <>
            {/* Welcome / Baby Status Banner */}
            <div className="bg-gradient-to-l from-pink-500 via-rose-400 to-pink-500 rounded-3xl p-5 text-white shadow-md shadow-pink-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🌸</span>
                  <h2 className="text-xl font-extrabold tracking-tight">
                    היומן של {activeBaby?.name || 'הבייבי'}
                  </h2>
                </div>
                <p className="text-xs text-pink-100 font-medium">
                  {activeBaby?.notes || 'תיעוד הנקה, האכלה, שינה, חיתולים וכל הרגעים החשובים'}
                </p>
              </div>

              {/* Quick reminder badge */}
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-2.5 px-3 flex items-center justify-between gap-3 text-xs border border-white/20">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-pink-100" />
                  <span>תזכורת: ויטמין D (בוקר)</span>
                </div>
                <button
                  onClick={() => setGivenVitaminD(!givenVitaminD)}
                  className={`px-3 py-1 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                    givenVitaminD
                      ? 'bg-white text-pink-600'
                      : 'bg-pink-600 hover:bg-pink-700 text-white'
                  }`}
                >
                  {givenVitaminD ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> ניתן ✅
                    </>
                  ) : (
                    'סמן כניתן'
                  )}
                </button>
              </div>
            </div>

            {/* Live Active Timers (Nursing / Sleep) */}
            <ActiveTimers />

            {/* Quick 8 Action Grid */}
            <QuickActionGrid onSelectAction={(type) => setSelectedLogType(type)} />

            {/* Daily Summary */}
            <DailySummary />

            {/* Activity Timeline */}
            <TimelineFeed />
          </>
        )}
      </main>

      {/* Modals */}
      <LogModal
        type={selectedLogType}
        onClose={() => setSelectedLogType(null)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddChildModal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
      />
    </div>
  );
}
