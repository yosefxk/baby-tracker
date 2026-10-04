'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Sun, Droplets, Baby as BabyIcon, Milk, Check, Edit2, Clock } from 'lucide-react';
import { LogEntry } from '@/lib/types';
import { EditLogModal } from './modals/EditLogModal';

interface QuickActionGridProps {
  onOpenCustomLog?: (type: string) => void;
}

export function QuickActionGrid({ onOpenCustomLog }: QuickActionGridProps) {
  const { logs, activeBaby, addLog, updateLog } = useApp();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recentLoggedItem, setRecentLoggedItem] = useState<LogEntry | null>(null);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [showNoActiveSleepModal, setShowNoActiveSleepModal] = useState(false);

  // Check if baby is currently sleeping
  const activeSleep = logs.find((l) => l.type === 'sleep' && !l.end_time);

  // Calculate ongoing sleep duration in minutes
  const elapsedSleepMins = activeSleep
    ? Math.max(0, Math.floor((Date.now() - new Date(activeSleep.start_time).getTime()) / 60000))
    : 0;
  const elapsedSleepHrs = Math.floor(elapsedSleepMins / 60);
  const elapsedSleepRemMins = elapsedSleepMins % 60;

  const triggerToast = (msg: string, log?: LogEntry) => {
    setToastMessage(msg);
    if (log) setRecentLoggedItem(log);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(30);
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  React.useEffect(() => {
    if (!showNoActiveSleepModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNoActiveSleepModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNoActiveSleepModal]);

  // 1. נרדמה (Fell asleep)
  const handleSleepStart = async () => {
    if (activeSleep) {
      triggerToast('הבייבי כבר במצב שינה 💤 (ניתן לערוך בציר הזמן)');
      return;
    }
    setLoadingAction('sleep_start');
    try {
      const now = new Date().toISOString();
      const success = await addLog({
        type: 'sleep',
        start_time: now,
        details: {},
        notes: '',
      });
      if (success) {
        triggerToast('נרשמה כנרדמת 🌙');
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. התעוררה (Woke up)
  const handleSleepEnd = async () => {
    if (!activeSleep) {
      // If no active sleep is found, open custom sleep modal or prompt
      setShowNoActiveSleepModal(true);
      return;
    }
    setLoadingAction('sleep_end');
    try {
      const now = new Date();
      const start = new Date(activeSleep.start_time);
      const diffMins = Math.max(1, Math.round((now.getTime() - start.getTime()) / 60000));
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;

      const success = await updateLog(activeSleep.id, {
        end_time: now.toISOString(),
        details: {
          ...activeSleep.details,
          durationMinutes: diffMins,
        },
      });

      if (success) {
        triggerToast(
          `בוקר טוב! נרשמו ${hrs > 0 ? `${hrs} שעות ו-` : ''}${mins} דק׳ שינה ☀️`
        );
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. חיתול פיפי (Pee diaper)
  const handlePeeDiaper = async () => {
    setLoadingAction('diaper_pee');
    try {
      const success = await addLog({
        type: 'diaper',
        start_time: new Date().toISOString(),
        details: { condition: 'wet' },
        notes: '',
      });
      if (success) {
        triggerToast('נרשם חיתול פיפי 💧');
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // 4. חיתול קקי (Poo diaper)
  const handlePooDiaper = async () => {
    setLoadingAction('diaper_poo');
    try {
      const success = await addLog({
        type: 'diaper',
        start_time: new Date().toISOString(),
        details: { condition: 'dirty' },
        notes: '',
      });
      if (success) {
        triggerToast('נרשם חיתול קקי 💩');
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // 5. הנקה (Nursing)
  const handleNursing = async () => {
    setLoadingAction('nursing');
    try {
      const success = await addLog({
        type: 'nursing',
        start_time: new Date().toISOString(),
        details: { method: 'nursing' },
        notes: '',
      });
      if (success) {
        triggerToast('נרשמה הנקה 🍼');
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="mb-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-3 max-w-sm w-[90%]">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 text-right">{toastMessage}</span>
          {recentLoggedItem && (
            <button
              onClick={() => {
                setEditingLog(recentLoggedItem);
                setToastMessage(null);
              }}
              className="text-pink-300 hover:text-white underline text-xs shrink-0 cursor-pointer"
            >
              עריכה
            </button>
          )}
        </div>
      )}

      {/* Sleeping status badge if baby is currently asleep */}
      {activeSleep && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-3 px-4 mb-3 shadow-md flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
            <span className="font-bold">
              {activeBaby?.name || 'הבייבי'} ישנ/ה כעת
            </span>
            <span className="text-indigo-200">
              (כבר {elapsedSleepHrs > 0 ? `${elapsedSleepHrs} שעות ו-` : ''}{elapsedSleepRemMins} דק׳)
            </span>
          </div>
          <button
            onClick={handleSleepEnd}
            disabled={loadingAction === 'sleep_end'}
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-extrabold px-3 py-1 rounded-xl shadow-xs transition-all cursor-pointer text-xs shrink-0"
          >
            {loadingAction === 'sleep_end' ? 'שומר...' : 'התעוררה ☀️'}
          </button>
        </div>
      )}

      {/* Exactly 5 Big Action Buttons */}
      <div className="space-y-2.5">
        {/* Row 1: Sleep Actions (נרדמה / התעוררה) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Button 1: נרדמה */}
          <button
            type="button"
            onClick={handleSleepStart}
            disabled={loadingAction !== null}
            className={`flex items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border transition-all cursor-pointer font-extrabold text-sm active:scale-[0.98] shadow-xs text-right ${
              activeSleep
                ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                : 'bg-indigo-50 hover:bg-indigo-100/90 border-indigo-200 text-indigo-900 hover:shadow-sm'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activeSleep ? 'bg-gray-200 text-gray-500' : 'bg-indigo-500 text-white shadow-xs'}`}>
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="leading-tight">נרדמה</span>
              <span className="text-[10px] font-normal text-indigo-600/80">תחילת שינה</span>
            </div>
          </button>

          {/* Button 2: התעוררה */}
          <button
            type="button"
            onClick={handleSleepEnd}
            disabled={loadingAction !== null}
            className={`flex items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border transition-all cursor-pointer font-extrabold text-sm active:scale-[0.98] shadow-xs text-right ${
              activeSleep
                ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-white ring-2 ring-amber-300 ring-offset-1 animate-pulse'
                : 'bg-amber-50 hover:bg-amber-100/90 border-amber-200 text-amber-900 hover:shadow-sm'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activeSleep ? 'bg-white text-amber-600 shadow-xs' : 'bg-amber-500 text-white shadow-xs'}`}>
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="leading-tight">התעוררה</span>
              <span className={`text-[10px] font-normal ${activeSleep ? 'text-amber-100' : 'text-amber-700/80'}`}>סיום שינה</span>
            </div>
          </button>
        </div>

        {/* Row 2: Diaper Actions (חיתול פיפי / חיתול קקי) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Button 3: חיתול פיפי */}
          <button
            type="button"
            onClick={handlePeeDiaper}
            disabled={loadingAction !== null}
            className="flex items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border bg-sky-50 hover:bg-sky-100/90 border-sky-200 text-sky-900 transition-all cursor-pointer font-extrabold text-sm active:scale-[0.98] shadow-xs hover:shadow-sm text-right"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="leading-tight">חיתול פיפי</span>
              <span className="text-[10px] font-normal text-sky-600/80">רטוב בלבד</span>
            </div>
          </button>

          {/* Button 4: חיתול קקי */}
          <button
            type="button"
            onClick={handlePooDiaper}
            disabled={loadingAction !== null}
            className="flex items-center justify-center gap-2.5 py-4 px-3 rounded-2xl border bg-amber-50/80 hover:bg-amber-100 border-amber-200/90 text-amber-950 transition-all cursor-pointer font-extrabold text-sm active:scale-[0.98] shadow-xs hover:shadow-sm text-right"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BabyIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="leading-tight">חיתול קקי</span>
              <span className="text-[10px] font-normal text-amber-800/80">מלוכלך / שניהם</span>
            </div>
          </button>
        </div>

        {/* Row 3: Button 5: הנקה (Full Width) */}
        <button
          type="button"
          onClick={handleNursing}
          disabled={loadingAction !== null}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-md shadow-pink-200/60 transition-all cursor-pointer font-extrabold text-base active:scale-[0.99] text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
            <Milk className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-center">
            <span className="leading-tight text-lg">הנקה</span>
            <span className="text-[11px] font-medium text-pink-100">רישום האכלה מהיר</span>
          </div>
        </button>
      </div>

      {/* Mini Modal if "התעוררה" was pressed when no sleep was active */}
      {showNoActiveSleepModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNoActiveSleepModal(false);
            }
          }}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-sm w-full text-right shadow-2xl border border-pink-100 space-y-4 animate-in fade-in zoom-in-95 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="w-5 h-5" />
              <h3 className="font-extrabold text-base text-gray-800">לא נרשמה התחלת שינה</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              לא נמצאה שינה פעילה כרגע. האם תרצו לרשום תנומה שהסתיימה כעת (למשל של שעה אחת)?
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNoActiveSleepModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowNoActiveSleepModal(false);
                  const now = new Date();
                  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                  await addLog({
                    type: 'sleep',
                    start_time: oneHourAgo.toISOString(),
                    end_time: now.toISOString(),
                    details: { durationMinutes: 60 },
                  });
                  triggerToast('נרשמה שעת שינה שהסתיימה כעת ☀️');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
              >
                רישום שעת שינה עכשיו
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Log Modal */}
      {editingLog && (
        <EditLogModal log={editingLog} onClose={() => setEditingLog(null)} />
      )}
    </div>
  );
}
