'use client';

import React from 'react';
import {
  Baby,
  Milk,
  Moon,
  Sparkles,
  Thermometer,
  Apple,
  Ruler,
  Droplets,
  Heart,
} from 'lucide-react';

interface QuickActionGridProps {
  onSelectAction: (type: string) => void;
}

export function QuickActionGrid({ onSelectAction }: QuickActionGridProps) {
  const actions = [
    {
      id: 'nursing',
      title: 'הנקה',
      desc: 'ימין / שמאל, טיימר',
      icon: Heart,
      bg: 'bg-pink-50 hover:bg-pink-100/80 border-pink-200/80 text-pink-700',
      iconBg: 'bg-pink-500 text-white',
    },
    {
      id: 'bottle',
      title: 'בקבוק',
      desc: 'תמ״ל, חלב שאוב',
      icon: Milk,
      bg: 'bg-teal-50 hover:bg-teal-100/80 border-teal-200/80 text-teal-800',
      iconBg: 'bg-teal-500 text-white',
    },
    {
      id: 'sleep',
      title: 'שינה',
      desc: 'שנת יום / לילה',
      icon: Moon,
      bg: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-200/80 text-indigo-800',
      iconBg: 'bg-indigo-500 text-white',
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
      id: 'pumping',
      title: 'שאיבה',
      desc: 'כמות מ״ל משדדים',
      icon: Milk,
      bg: 'bg-cyan-50 hover:bg-cyan-100/80 border-cyan-200/80 text-cyan-800',
      iconBg: 'bg-cyan-500 text-white',
    },
    {
      id: 'solids',
      title: 'מוצקים',
      desc: 'טעימות ומחיות',
      icon: Apple,
      bg: 'bg-orange-50 hover:bg-orange-100/80 border-orange-200/80 text-orange-800',
      iconBg: 'bg-orange-500 text-white',
    },
    {
      id: 'medication',
      title: 'חום ותרופות',
      desc: 'מעלות, נובימול, ויטמין D',
      icon: Thermometer,
      bg: 'bg-rose-50 hover:bg-rose-100/80 border-rose-200/80 text-rose-800',
      iconBg: 'bg-rose-500 text-white',
    },
    {
      id: 'growth',
      title: 'גדילה וציוני דרך',
      desc: 'משקל, גובה, חיוך',
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onSelectAction(act.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all transform active:scale-95 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between h-24 ${act.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{act.title}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-xs ${act.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] opacity-80 leading-tight mt-1 line-clamp-1">{act.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
