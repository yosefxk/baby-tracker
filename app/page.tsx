'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { QuickActionGrid } from '@/components/QuickActionGrid';
import { DailySummary } from '@/components/DailySummary';
import { TimelineFeed } from '@/components/TimelineFeed';
import { ShareModal } from '@/components/modals/ShareModal';
import { AddChildModal } from '@/components/modals/AddChildModal';
import { SetupWizard } from '@/components/SetupWizard';
import { LoginForm } from '@/components/LoginForm';
import { Baby, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const { isSetupRequired, isLoading, currentUser, activeBaby, babies } = useApp();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

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

  // If not logged in, render the login form
  if (!currentUser) {
    return <LoginForm />;
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
            {/* 1. 3-Cell Dashboard: Sleep 24h, Total Nursing, Total Diapers */}
            <DailySummary />

            {/* 2. Exactly 5 Fast Action Buttons */}
            <QuickActionGrid />

            {/* 3. Activity Timeline */}
            <TimelineFeed />
          </>
        )}
      </main>

      {/* Modals */}
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
