'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Milk, Moon, Droplets } from 'lucide-react';

export function DailySummary() {
  const { logs } = useApp();

  // Filter logs for the past 24 hours
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter((l) => new Date(l.start_time) >= cutoff);

  // 1. Sleep total in past 24h (including ongoing sleep)
  const sleepLogs = recentLogs.filter((l) => l.type === 'sleep');
  let totalSleepMinutes = 0;
  sleepLogs.forEach((l) => {
    if (l.details?.durationMinutes) {
      totalSleepMinutes += Number(l.details.durationMinutes);
    } else if (l.start_time && l.end_time) {
      const diffMs = new Date(l.end_time).getTime() - new Date(l.start_time).getTime();
      if (diffMs > 0) {
        totalSleepMinutes += Math.round(diffMs / (1000 * 60));
      }
    } else if (l.start_time && !l.end_time) {
      // Ongoing sleep right now
      const diffMs = Date.now() - new Date(l.start_time).getTime();
      if (diffMs > 0) {
        totalSleepMinutes += Math.round(diffMs / (1000 * 60));
      }
    }
  });

  const sleepHours = Math.floor(totalSleepMinutes / 60);
  const sleepRemainderMins = totalSleepMinutes % 60;

  // 2. Nursing / Feeds count in past 24h
  const feedLogs = recentLogs.filter(
    (l) => l.type === 'nursing' || l.type === 'feeding' || l.type === 'bottle'
  );

  // 3. Diapers count in past 24h
  const diaperLogs = recentLogs.filter((l) => l.type === 'diaper');
  let wetCount = 0;
  let dirtyCount = 0;
  diaperLogs.forEach((l) => {
    const c = l.details?.condition;
    if (c === 'wet' || c === 'both') wetCount++;
    if (c === 'dirty' || c === 'both') dirtyCount++;
  });

  return (
    <div className="mb-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Cell 1: Total Sleep Hours in 24h */}
        <div className="bg-white rounded-2xl p-3 border border-indigo-100 shadow-xs flex flex-col justify-between text-right">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-gray-500">סה״כ שעות שינה ב-24 שעות</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Moon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-gray-800 leading-tight">
              {totalSleepMinutes > 0 ? (
                <>
                  {sleepHours > 0 ? `${sleepHours}ש׳ ` : ''}
                  {sleepRemainderMins > 0 ? `${sleepRemainderMins}ד׳` : sleepHours === 0 ? '0ד׳' : ''}
                </>
              ) : (
                '0 שעות'
              )}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {sleepLogs.length} תנומות
            </div>
          </div>
        </div>

        {/* Cell 2: Total Nursing in 24h */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100 shadow-xs flex flex-col justify-between text-right">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-gray-500">סה״כ מס׳ הנקות</span>
            <div className="w-7 h-7 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Milk className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-gray-800 leading-tight">
              {feedLogs.length}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              הנקות ב-24 שעות
            </div>
          </div>
        </div>

        {/* Cell 3: Total Diapers in 24h */}
        <div className="bg-white rounded-2xl p-3 border border-amber-100 shadow-xs flex flex-col justify-between text-right">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-gray-500">סה״כ מס׳ חיתולים</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Droplets className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-gray-800 leading-tight">
              {diaperLogs.length}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 truncate">
              {wetCount > 0 || dirtyCount > 0
                ? `${wetCount} פיפי, ${dirtyCount} קקי`
                : 'החלפות ב-24 שעות'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
