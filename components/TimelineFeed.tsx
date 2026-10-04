'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/dateFormat';
import { EditLogModal } from '@/components/modals/EditLogModal';
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
  Edit2,
} from 'lucide-react';

export function TimelineFeed() {
  const { logs, deleteLog, activeBaby } = useApp();
  const [editingLog, setEditingLog] = useState<any>(null);

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
      case 'feeding':
      case 'bottle':
      case 'nursing':
        return { label: 'האכלה', icon: Milk, bg: 'bg-teal-100 text-teal-700 border-teal-200' };
      case 'sleep':
        return { label: 'שינה', icon: Moon, bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
      case 'diaper':
        return { label: 'חיתול', icon: Droplets, bg: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'solids':
        return { label: 'אוכל מוצק', icon: Apple, bg: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'temperature':
      case 'medication':
        return { label: 'חום ותרופות', icon: Thermometer, bg: 'bg-rose-100 text-rose-700 border-rose-200' };
      case 'growth':
      case 'milestone':
        return { label: 'גדילה', icon: Sparkles, bg: 'bg-purple-100 text-purple-700 border-purple-200' };
      default:
        return { label: 'אירוע', icon: Clock, bg: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const renderLogDetails = (log: any) => {
    const { type, details } = log;
    if (type === 'feeding') {
      return (
        <span className="font-bold text-gray-800">
          האכלה
        </span>
      );
    }
    if (type === 'bottle') {
      const milkLabel =
        details.milkType === 'formula' ? 'תמ״ל' : details.milkType === 'breast_milk' ? 'חלב אם שאוב' : 'מים';
      return (
        <span className="font-bold text-gray-800">
          בקבוק {details.amountMl ? `${details.amountMl} מ״ל` : ''} <span className="text-xs font-normal text-gray-500">({milkLabel})</span>
        </span>
      );
    }
    if (type === 'nursing') {
      const sideLabel =
        details.side === 'left' ? 'שמאל' : details.side === 'right' ? 'ימין' : 'שני הצדדים';
      const duration = details.durationMinutes || Math.round((details.totalDurationSec || 0) / 60);
      return (
        <span className="font-bold text-gray-800">
          הנקה {duration ? `${duration} דקות` : ''} <span className="text-xs font-normal text-gray-500">(צד {sideLabel})</span>
        </span>
      );
    }
    if (type === 'sleep') {
      if (details.durationMinutes) {
        const hrs = Math.floor(details.durationMinutes / 60);
        const mins = details.durationMinutes % 60;
        return (
          <span className="font-bold text-gray-800">
            שינה: {hrs > 0 ? `${hrs} שעות ו-` : ''}{mins} דקות
          </span>
        );
      }
      if (log.end_time) {
        const diffMs = new Date(log.end_time).getTime() - new Date(log.start_time).getTime();
        const mins = Math.max(1, Math.round(diffMs / 60000));
        const hrs = Math.floor(mins / 60);
        const remMins = mins % 60;
        return (
          <span className="font-bold text-gray-800">
            שינה: {hrs > 0 ? `${hrs} שעות ו-` : ''}{remMins} דקות
          </span>
        );
      }
      return (
        <span className="font-bold text-indigo-700">
          ישן/ה כעת (משעה {formatLogTime(log.start_time)})
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
        </span>
      );
    }
    if (type === 'solids') {
      return (
        <span className="font-bold text-gray-800">
          אוכל מוצק: {details.food || log.notes || 'ארוחה'}
        </span>
      );
    }
    if (type === 'medication' || type === 'temperature') {
      return (
        <span className="font-bold text-gray-800">
          חום / תרופות: {details.info || details.tempC ? `${details.tempC}°C` : log.notes || 'טיפול'}
        </span>
      );
    }
    if (type === 'growth' || type === 'milestone') {
      return (
        <span className="font-bold text-gray-800">
          גדילה: {details.milestone || details.weightKg ? `${details.weightKg} ק״ג` : log.notes || 'ציון דרך'}
        </span>
      );
    }
    return (
      <span className="font-bold text-gray-800">
        {log.notes || 'אירוע'}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-gray-700">ציר הזמן והתיעודים</h2>
        <span className="text-[11px] text-gray-400">
          {logs.length > 0 ? `${logs.length} תיעודים (לחץ לעריכה)` : 'אין תיעודים עדיין'}
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-pink-100 shadow-xs">
          <Clock className="w-10 h-10 text-pink-300 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-semibold text-gray-600">אין עדיין פעילויות היום</p>
          <p className="text-[11px] text-gray-400 mt-1">
            לחצו על אחד מכפתורי התיעוד המהיר למעלה כדי לרשום פעילות חדשה
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
                onClick={() => setEditingLog(log)}
                className="py-3 px-2 flex items-start justify-between gap-3 hover:bg-pink-50/50 rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-pink-200/60"
                title="לחץ לעריכת תיעוד זה"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Icon badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${meta.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Log description */}
                  <div className="min-w-0">
                    <div className="text-sm leading-snug">{renderLogDetails(log)}</div>

                    {log.notes && (
                      <p className="text-xs text-gray-500 mt-0.5 italic truncate">״{log.notes}״</p>
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

                {/* Edit / Delete actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <div className="p-1.5 text-pink-500 hover:bg-pink-100 rounded-xl transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      <EditLogModal log={editingLog} onClose={() => setEditingLog(null)} />
    </div>
  );
}
