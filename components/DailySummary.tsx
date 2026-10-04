'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/dateFormat';
import { Milk, Moon, Droplets, Heart } from 'lucide-react';

export function DailySummary() {
  const { logs } = useApp();

  // Filter logs for today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayLogs = logs.filter((l) => new Date(l.start_time) >= todayStart);

  // Calculate totals
  let totalBottleMl = 0;
  let totalSleepMinutes = 0;
  let wetDiapers = 0;
  let dirtyDiapers = 0;
  let totalNursingMinutes = 0;

  todayLogs.forEach((l) => {
    if (l.type === 'bottle' && l.details?.amountMl) {
      totalBottleMl += Number(l.details.amountMl);
    }
    if (l.type === 'sleep' && l.details?.durationMinutes) {
      totalSleepMinutes += Number(l.details.durationMinutes);
    }
    if (l.type === 'diaper') {
      if (l.details?.condition === 'wet' || l.details?.condition === 'both') wetDiapers++;
      if (l.details?.condition === 'dirty' || l.details?.condition === 'both') dirtyDiapers++;
    }
    if (l.type === 'nursing') {
      const mins = l.details?.durationMinutes || (l.details?.totalDurationSec ? Math.round(l.details.totalDurationSec / 60) : 0);
      totalNursingMinutes += mins;
    }
  });

  const sleepHours = Math.floor(totalSleepMinutes / 60);
  const sleepRemainderMins = totalSleepMinutes % 60;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-gray-700">סיכום להיום</h2>
          <span className="text-[11px] text-gray-400 font-medium">({formatDate(new Date())})</span>
        </div>
        <span className="text-[11px] text-pink-600 font-semibold">{todayLogs.length} תיעודים</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Milk Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Milk className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">סך חלב</div>
            <div className="text-base font-extrabold text-gray-800">
              {totalBottleMl} <span className="text-xs font-normal text-gray-500">מ״ל</span>
            </div>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">שעות שינה</div>
            <div className="text-base font-extrabold text-gray-800">
              {sleepHours}ש׳ {sleepRemainderMins > 0 ? `${sleepRemainderMins}ד׳` : ''}
            </div>
          </div>
        </div>

        {/* Diapers Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">חיתולים</div>
            <div className="text-base font-extrabold text-gray-800">
              {wetDiapers + dirtyDiapers} <span className="text-xs font-normal text-gray-500">({wetDiapers}פיפי, {dirtyDiapers}קקי)</span>
            </div>
          </div>
        </div>

        {/* Nursing Card */}
        <div className="bg-white rounded-2xl p-3 border border-pink-100/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-gray-400 font-medium">זמן הנקה</div>
            <div className="text-base font-extrabold text-gray-800">
              {totalNursingMinutes} <span className="text-xs font-normal text-gray-500">דקות</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
