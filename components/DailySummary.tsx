'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Milk, Moon, Droplets } from 'lucide-react';

export function DailySummary() {
  const { logs } = useApp();

  // Filter logs for the past 24 hours
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentLogs = logs.filter((l) => new Date(l.start_time) >= cutoff);

  // 1. Feeds count
  const feedLogs = recentLogs.filter(
    (l) => l.type === 'feeding' || l.type === 'bottle' || l.type === 'nursing'
  );

  // 2. Diapers count
  const diaperLogs = recentLogs.filter((l) => l.type === 'diaper');
  let wetCount = 0;
  let dirtyCount = 0;
  diaperLogs.forEach((l) => {
    const c = l.details?.condition;
    if (c === 'wet' || c === 'both') wetCount++;
    if (c === 'dirty' || c === 'both') dirtyCount++;
  });

  // 3. Sleep total
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
    }
  });

  const sleepHours = Math.floor(totalSleepMinutes / 60);
  const sleepRemainderMins = totalSleepMinutes % 60;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-gray-700">סיכום 24 שעות אחרונות</h2>
        </div>
        <span className="text-[11px] text-pink-600 font-semibold">{recentLogs.length} תיעודים</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {/* Feeds Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-500 font-semibold">האכלות</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Milk className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-800">
              {feedLogs.length} <span className="text-xs font-normal text-gray-500">ארוחות</span>
            </div>
          </div>
        </div>

        {/* Diapers Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-500 font-semibold">חיתולים</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-800 leading-tight">
              {diaperLogs.length} <span className="text-xs font-normal text-gray-500">החלפות</span>
            </div>
            {(wetCount > 0 || dirtyCount > 0) && (
              <div className="text-[10px] text-gray-400 mt-0.5 truncate">
                {wetCount} פיפי, {dirtyCount} קקי
              </div>
            )}
          </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-gray-500 font-semibold">שינה</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-800 leading-tight">
              {totalSleepMinutes > 0 ? (
                <>
                  {sleepHours > 0 && `${sleepHours}ש׳ `}
                  {sleepRemainderMins > 0 ? `${sleepRemainderMins}ד׳` : sleepHours === 0 ? '0ד׳' : ''}
                </>
              ) : (
                <span className="text-base font-bold text-gray-600">{sleepLogs.length} תנומות</span>
              )}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {sleepLogs.length} זמני שינה
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
