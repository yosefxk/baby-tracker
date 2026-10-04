'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Milk,
  Moon,
  Sparkles,
  Thermometer,
  Apple,
  Droplets,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogModalProps {
  type: string | null;
  onClose: () => void;
}

export function LogModal({ type, onClose }: LogModalProps) {
  const { activeBaby, addLog } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common state
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState(getCurrentDateTimeLocal());
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  // Diaper state
  const [diaperCondition, setDiaperCondition] = useState<'wet' | 'dirty' | 'both'>('wet');

  // Solid food state
  const [foodText, setFoodText] = useState('');

  // Meds / temp state
  const [healthText, setHealthText] = useState('');

  // Growth / milestone state
  const [growthText, setGrowthText] = useState('');

  if (!type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBaby) return;
    setIsSubmitting(true);

    let details: Record<string, any> = {};

    if (type === 'feeding') {
      details = { method: 'feeding' };
    } else if (type === 'diaper') {
      details = { condition: diaperCondition };
    } else if (type === 'sleep') {
      let durationMinutes: number | undefined;
      if (endTime && startTime) {
        const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        if (diffMs > 0) {
          durationMinutes = Math.round(diffMs / (1000 * 60));
        }
      }
      details = {
        durationMinutes: durationMinutes || undefined,
        isOngoing: !endTime,
      };
    } else if (type === 'solids') {
      details = { food: foodText.trim() };
    } else if (type === 'medication') {
      details = { info: healthText.trim() };
    } else if (type === 'growth') {
      details = { milestone: growthText.trim() };
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    const payloadNotes = notes.trim() || foodText.trim() || healthText.trim() || growthText.trim() || undefined;

    await addLog({
      type,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : undefined,
      details,
      notes: payloadNotes,
    });

    setIsSubmitting(false);
    onClose();
  };

  const getHeaderMeta = () => {
    switch (type) {
      case 'feeding':
        return {
          title: 'רישום האכלה',
          icon: Milk,
          bg: 'bg-teal-100 text-teal-700',
        };
      case 'diaper':
        return {
          title: 'החלפת חיתול',
          icon: Droplets,
          bg: 'bg-amber-100 text-amber-700',
        };
      case 'sleep':
        return {
          title: 'מעקב שינה',
          icon: Moon,
          bg: 'bg-indigo-100 text-indigo-700',
        };
      case 'solids':
        return {
          title: 'אוכל מוצק',
          icon: Apple,
          bg: 'bg-orange-100 text-orange-700',
        };
      case 'medication':
        return {
          title: 'חום ותרופות',
          icon: Thermometer,
          bg: 'bg-rose-100 text-rose-700',
        };
      case 'growth':
        return {
          title: 'גדילה וציוני דרך',
          icon: Sparkles,
          bg: 'bg-purple-100 text-purple-700',
        };
      default:
        return {
          title: 'תיעוד',
          icon: Sparkles,
          bg: 'bg-pink-100 text-pink-700',
        };
    }
  };

  const meta = getHeaderMeta();
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-pink-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${meta.bg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-800">{meta.title}</h3>
              <p className="text-[11px] text-gray-400">עבור {activeBaby?.name || 'הבייבי'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Feeding (Just record the event) */}
          {type === 'feeding' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שעת האכלה</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">הערה (אופציונלי)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="למשל: בקבוק 120 מ״ל, צד ימין, מטרנה..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* 2. Diaper (Pee / Poo / Both + comment box) */}
          {type === 'diaper' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">מצב החיתול</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiaperCondition('wet')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      diaperCondition === 'wet'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50/40 text-amber-900 border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="text-base">💧</span>
                    <span>פיפי</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiaperCondition('dirty')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      diaperCondition === 'dirty'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        : 'bg-amber-50/40 text-amber-900 border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="text-base">💩</span>
                    <span>קקי</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiaperCondition('both')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                      diaperCondition === 'both'
                        ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                        : 'bg-amber-50/40 text-amber-900 border-amber-200 hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="text-base">💧💩</span>
                    <span>שניהם</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שעה</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">הערה (אופציונלי)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הערה על מרקם, צבע, תפרחת..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* 3. Sleep (Start / End - End optional/blank) */}
          {type === 'sleep' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  שעת תחילת שינה (נרדם/ה)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    שעת סיום שינה (התעורר/ה)
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">אופציונלי - אפשר להשאיר ריק</span>
                </div>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">הערה (אופציונלי)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="למשל: שנת בוקר, נרדמה בעגלה..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* 4. Solid Food (אוכל מוצק) */}
          {type === 'solids' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שעה</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">מה אכל/ה?</label>
                <input
                  type="text"
                  required
                  value={foodText}
                  onChange={(e) => setFoodText(e.target.value)}
                  placeholder="למשל: בננה מעוכה, אבוקדו, מרק עוף..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* 5. Medication / Fever */}
          {type === 'medication' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שעה</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">פרטי חום / תרופה</label>
                <input
                  type="text"
                  required
                  value={healthText}
                  onChange={(e) => setHealthText(e.target.value)}
                  placeholder="למשל: 38.4 חום, נובימול 3 מ״ל..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* 6. Growth & Milestones */}
          {type === 'growth' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שעה</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ציון דרך / מדד גדילה</label>
                <input
                  type="text"
                  required
                  value={growthText}
                  onChange={(e) => setGrowthText(e.target.value)}
                  placeholder="למשל: משקל 6.2 ק״ג, התהפכ/ה לראשונה..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'שומר...' : 'שמירה ביומן'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
