'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/dateFormat';
import {
  Milk,
  Moon,
  Droplets,
  Heart,
  Thermometer,
  Apple,
  Ruler,
  Sparkles,
  Trash2,
  Clock,
  User,
} from 'lucide-react';

export function TimelineFeed() {
  const { logs, deleteLog, activeBaby } = useApp();

  const formatLogTime = (iso: string) => {
    const d = new Date(iso);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  };

  const formatRelativeTime = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'הרגע';
    if (diffMins < 60) return `לפני ${diffMins} דק׳`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    const diffDays = Math.floor(diffHours / 24);
    return `לפני ${diffDays} ימים`;
  };

  const getLogMeta = (type: string) => {
    switch (type) {
      case 'nursing':
        return { label: 'הנקה', icon: Heart, bg: 'bg-pink-100 text-pink-600 border-pink-200' };
      case 'bottle':
        return { label: 'בקבוק', icon: Milk, bg: 'bg-teal-100 text-teal-700 border-teal-200' };
      case 'sleep':
        return { label: 'שינה', icon: Moon, bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
      case 'diaper':
        return { label: 'חיתול', icon: Droplets, bg: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'pumping':
        return { label: 'שאיבה', icon: Milk, bg: 'bg-cyan-100 text-cyan-700 border-cyan-200' };
      case 'solids':
        return { label: 'מוצקים', icon: Apple, bg: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'temperature':
      case 'medication':
        return { label: 'בריאות', icon: Thermometer, bg: 'bg-rose-100 text-rose-700 border-rose-200' };
      case 'growth':
        return { label: 'גדילה', icon: Ruler, bg: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'milestone':
        return { label: 'אבן דרך', icon: Sparkles, bg: 'bg-purple-100 text-purple-700 border-purple-200' };
      default:
        return { label: 'אירוע', icon: Clock, bg: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const renderLogDetails = (log: any) => {
    const { type, details } = log;
    if (type === 'bottle') {
      const milkLabel =
        details.milkType === 'formula' ? 'תמ״ל' : details.milkType === 'breast_milk' ? 'חלב אם שאוב' : 'מים';
      return (
        <span className="font-bold text-gray-800">
          בקבוק {details.amountMl} מ״ל <span className="text-xs font-normal text-gray-500">({milkLabel})</span>
        </span>
      );
    }
    if (type === 'nursing') {
      const sideLabel =
        details.side === 'left' ? 'שמאל' : details.side === 'right' ? 'ימין' : 'שני הצדדים';
      const duration = details.durationMinutes || Math.round((details.totalDurationSec || 0) / 60);
      return (
        <span className="font-bold text-gray-800">
          הנקה {duration} דקות <span className="text-xs font-normal text-gray-500">(צד {sideLabel})</span>
        </span>
      );
    }
    if (type === 'sleep') {
      const hrs = Math.floor((details.durationMinutes || 0) / 60);
      const mins = (details.durationMinutes || 0) % 60;
      return (
        <span className="font-bold text-gray-800">
          שינה: {hrs > 0 ? `${hrs} שעות ו-` : ''}{mins} דקות
        </span>
      );
    }
    if (type === 'diaper') {
      const cond =
        details.condition === 'wet'
          ? 'פיפי (רטוב)'
          : details.condition === 'dirty'
          ? 'קקי (מלוכלך)'
          : 'פיפי וקקי יחד';
      return (
        <span className="font-bold text-gray-800">
          חיתול: {cond}
          {details.rash && <span className="text-xs text-rose-500 font-semibold mr-1.5">• יש תפרחת</span>}
        </span>
      );
    }
    if (type === 'pumping') {
      return (
        <span className="font-bold text-gray-800">
          שאיבה: {details.totalMl} מ״ל סה״כ (שמאל: {details.amountLeftMl}, ימין: {details.amountRightMl})
        </span>
      );
    }
    if (type === 'solids') {
      return (
        <span className="font-bold text-gray-800">
          מוצקים: {details.food} ({details.amount})
        </span>
      );
    }
    if (type === 'temperature') {
      return (
        <span className="font-bold text-gray-800">
          חום: {details.tempC}°C
        </span>
      );
    }
    if (type === 'medication') {
      return (
        <span className="font-bold text-gray-800">
          תרופה: {details.medicineName} ({details.dosage})
        </span>
      );
    }
    if (type === 'growth') {
      return (
        <span className="font-bold text-gray-800">
          משקל: {details.weightKg} ק״ג, גובה: {details.heightCm} ס״מ
        </span>
      );
    }
    if (type === 'milestone') {
      return (
        <span className="font-bold text-purple-700">
          🌟 אבן דרך: {details.title}
        </span>
      );
    }
    return <span>{JSON.stringify(details)}</span>;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-gray-700">ציר הזמן של {activeBaby?.name || 'הבייבי'}</h2>
        <span className="text-[11px] text-gray-400">הכל מסודר ומעודכן בזמן אמת</span>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-pink-100 shadow-xs">
          <Sparkles className="w-10 h-10 text-pink-300 mx-auto mb-2" />
          <p className="font-bold text-gray-700 text-sm">אין עדיין תיעודים להיום</p>
          <p className="text-xs text-gray-400 mt-1">
            לחצו על אחד מכפתורי התיעוד למעלה כדי להתחיל
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-3 border border-pink-100 shadow-xs divide-y divide-gray-100">
          {logs.map((log) => {
            const meta = getLogMeta(log.type);
            const Icon = meta.icon;
            return (
              <div
                key={log.id}
                className="py-3 px-2 flex items-start justify-between gap-3 hover:bg-pink-50/30 rounded-2xl transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Icon badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${meta.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Log description */}
                  <div>
                    <div className="text-sm leading-snug">{renderLogDetails(log)}</div>

                    {log.notes && (
                      <p className="text-xs text-gray-500 mt-0.5 italic">״{log.notes}״</p>
                    )}

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                      <span className="font-semibold text-gray-500">{formatDate(log.start_time)}</span>
                      <span>•</span>
                      <span>{formatLogTime(log.start_time)}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(log.start_time)}</span>
                      {log.user_name && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-gray-500 font-medium">
                            <User className="w-3 h-3" />
                            {log.user_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteLog(log.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                  title="מחיקת תיעוד"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
