'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatDate, formatDateShort } from '@/lib/dateFormat';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  ArrowRight,
  BarChart2,
  Moon,
  Milk,
  Droplets,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function StatsPage() {
  const { activeBaby, logs } = useApp();

  // Aggregate logs by the last 7 days
  const chartData = useMemo(() => {
    const days: Record<string, { date: string; fullDate: string; dayName: string; sleepHours: number; milkMl: number; diapers: number }> = {};
    const hebrewDays = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = hebrewDays[d.getDay()];
      days[key] = {
        date: formatDateShort(d), // DD/MM
        fullDate: formatDate(d),   // DD/MM/YYYY
        dayName: `${dayName} (${formatDateShort(d)})`,
        sleepHours: 0,
        milkMl: 0,
        diapers: 0,
      };
    }

    logs.forEach((log) => {
      const dayKey = log.start_time.split('T')[0];
      if (days[dayKey]) {
        if (log.type === 'sleep' && log.details?.durationMinutes) {
          days[dayKey].sleepHours += Math.round((Number(log.details.durationMinutes) / 60) * 10) / 10;
        }
        if (log.type === 'bottle' && log.details?.amountMl) {
          days[dayKey].milkMl += Number(log.details.amountMl);
        }
        if (log.type === 'diaper') {
          days[dayKey].diapers += 1;
        }
      }
    });

    return Object.values(days);
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#fff9fa] p-3 sm:p-5 w-full max-w-full overflow-x-hidden">
      <div className="max-w-xl mx-auto space-y-5 overflow-x-hidden w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-2xl bg-white border border-pink-100 text-gray-500 hover:text-pink-600 transition-colors shadow-xs"
              title="חזרה ליומן"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                סטטיסטיקות ומגמות • {activeBaby?.name || 'הבייבי'}
              </h1>
              <p className="text-xs text-gray-500">תובנות על דפוסי שינה, האכלה וחיתולים ב-7 הימים האחרונים</p>
            </div>
          </div>
        </div>

        {/* 1. Sleep Chart */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">שעות שינה לפי יום (שעות)</h2>
            </div>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="ש׳" />
                <Tooltip
                  formatter={(val: any) => [`${val} שעות`, 'שינה']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ? `${payload[0].payload.fullDate}` : label}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', direction: 'rtl' }}
                />
                <Bar dataKey="sleepHours" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Milk Intake Chart */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Milk className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">כמות חלב מבקבוקים (מ״ל)</h2>
            </div>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="מ״ל" />
                <Tooltip
                  formatter={(val: any) => [`${val} מ״ל`, 'חלב']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ? `${payload[0].payload.fullDate}` : label}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', direction: 'rtl' }}
                />
                <Bar dataKey="milkMl" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Diapers Chart */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-gray-800">מספר החלפות חיתול</h2>
            </div>
          </div>

          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dayName" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} החלפות`, 'חיתולים']}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ? `${payload[0].payload.fullDate}` : label}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', direction: 'rtl' }}
                />
                <Bar dataKey="diapers" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
