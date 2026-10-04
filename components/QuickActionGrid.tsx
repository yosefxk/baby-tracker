'use client';

import React from 'react';
import {
  Milk,
  Moon,
  Sparkles,
  Thermometer,
  Apple,
  Droplets,
} from 'lucide-react';

interface QuickActionGridProps {
  onSelectAction: (type: string) => void;
}

export function QuickActionGrid({ onSelectAction }: QuickActionGridProps) {
  const actions = [
    {
      id: 'feeding',
      title: 'האכלה',
      desc: 'רישום האכלה',
      icon: Milk,
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-200/80 text-teal-800',
      iconBg: 'bg-teal-500 text-white',
    },
    {
      id: 'diaper',
      title: 'חיתול',
      desc: 'פיפי, קקי, שניהם',
      icon: Droplets,
      bg: 'bg-amber-50 hover:bg-amber-100/80 border-amber-200/80 text-amber-900',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      id: 'sleep',
      title: 'שינה',
      desc: 'התחלה וסיום שינה',
      icon: Moon,
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/80 text-indigo-800',
      iconBg: 'bg-indigo-500 text-white',
    },
    {
      id: 'solids',
      title: 'אוכל מוצק',
      desc: 'ארוחות וטעימות',
      icon: Apple,
      bg: 'bg-orange-50 hover:bg-orange-100/80 border-orange-200/80 text-orange-800',
      iconBg: 'bg-orange-500 text-white',
    },
    {
      id: 'medication',
      title: 'חום ותרופות',
      desc: 'מדחום ותרופות',
      icon: Thermometer,
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/80 text-rose-800',
      iconBg: 'bg-rose-500 text-white',
    },
    {
      id: 'growth',
      title: 'גדילה וציוני דרך',
      desc: 'משקל, גובה, אבני דרך',
      icon: Sparkles,
      bg: 'bg-purple-50 hover:bg-purple-100/80 border-purple-200/80 text-purple-800',
      iconBg: 'bg-purple-500 text-white',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold text-gray-700">תיעוד מהיר</h2>
        <span className="text-[11px] text-gray-400 font-medium">לחיצה אחת וזה ביומן</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onSelectAction(act.id)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer text-right shadow-2xs hover:shadow-xs active:scale-[0.98] ${act.bg}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${act.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-sm leading-tight truncate">{act.title}</div>
                <div className="text-[11px] opacity-75 mt-0.5 truncate">{act.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
