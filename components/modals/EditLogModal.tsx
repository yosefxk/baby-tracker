'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { LogEntry } from '@/lib/types';
import {
  X,
  Milk,
  Moon,
  Sparkles,
  Thermometer,
  Apple,
  Droplets,
  Trash2,
  Check,
} from 'lucide-react';

interface EditLogModalProps {
  log: LogEntry | null;
  onClose: () => void;
}

export function EditLogModal({ log, onClose }: EditLogModalProps) {
  const { updateLog, deleteLog, activeBaby } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatIsoToLocal = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [diaperCondition, setDiaperCondition] = useState<'wet' | 'dirty' | 'both'>('wet');
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    if (log) {
      setStartTime(formatIsoToLocal(log.start_time));
      setEndTime(formatIsoToLocal(log.end_time));
      setNotes(log.notes || '');

      if (log.type === 'diaper') {
        setDiaperCondition(log.details?.condition || 'wet');
      } else if (log.type === 'solids') {
        setCustomText(log.details?.food || log.notes || '');
      } else if (log.type === 'medication') {
        setCustomText(log.details?.info || log.details?.medicineName || log.notes || '');
      } else if (log.type === 'growth') {
        setCustomText(log.details?.milestone || log.notes || '');
      }
    }
  }, [log]);

  if (!log) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const details: Record<string, any> = { ...log.details };

    if (log.type === 'diaper') {
      details.condition = diaperCondition;
    } else if (log.type === 'sleep') {
      if (endTime && startTime) {
        const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
        details.durationMinutes = diffMs > 0 ? Math.round(diffMs / (1000 * 60)) : undefined;
        details.isOngoing = false;
      } else {
        details.isOngoing = true;
      }
    } else if (log.type === 'solids') {
      details.food = customText.trim();
    } else if (log.type === 'medication') {
      details.info = customText.trim();
    } else if (log.type === 'growth') {
      details.milestone = customText.trim();
    }

    const payloadNotes = notes.trim() || customText.trim() || undefined;

    await updateLog(log.id, {
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : undefined,
      details,
      notes: payloadNotes,
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('האם למחוק תיעוד זה לצמיתות?')) return;
    setIsSubmitting(true);
    await deleteLog(log.id);
    setIsSubmitting(false);
    onClose();
  };

  const getLogMeta = () => {
    switch (log.type) {
      case 'feeding':
      case 'bottle':
      case 'nursing':
        return { label: 'האכלה', icon: Milk, bg: 'bg-teal-100 text-teal-700' };
      case 'diaper':
        return { label: 'חיתול', icon: Droplets, bg: 'bg-amber-100 text-amber-700' };
      case 'sleep':
        return { label: 'שינה', icon: Moon, bg: 'bg-indigo-100 text-indigo-700' };
      case 'solids':
        return { label: 'אוכל מוצק', icon: Apple, bg: 'bg-orange-100 text-orange-700' };
      case 'medication':
      case 'temperature':
        return { label: 'חום ותרופות', icon: Thermometer, bg: 'bg-rose-100 text-rose-700' };
      case 'growth':
      case 'milestone':
        return { label: 'גדילה וציוני דרך', icon: Sparkles, bg: 'bg-purple-100 text-purple-700' };
      default:
        return { label: 'תיעוד', icon: Sparkles, bg: 'bg-gray-100 text-gray-700' };
    }
  };

  const meta = getLogMeta();
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
              <h3 className="font-extrabold text-base text-gray-800">עריכת {meta.label}</h3>
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Diaper specific */}
          {log.type === 'diaper' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">מצב החיתול</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDiaperCondition('wet')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    diaperCondition === 'wet'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50/40 text-amber-900 border-amber-200'
                  }`}
                >
                  💧 פיפי
                </button>
                <button
                  type="button"
                  onClick={() => setDiaperCondition('dirty')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    diaperCondition === 'dirty'
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-50/40 text-amber-900 border-amber-200'
                  }`}
                >
                  💩 קקי
                </button>
                <button
                  type="button"
                  onClick={() => setDiaperCondition('both')}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                    diaperCondition === 'both'
                      ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                      : 'bg-amber-50/40 text-amber-900 border-amber-200'
                  }`}
                >
                  💧💩 שניהם
                </button>
              </div>
            </div>
          )}

          {/* Start Time */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {log.type === 'sleep' ? 'שעת תחילת שינה (נרדם/ה)' : 'שעה ותאריך'}
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
            />
          </div>

          {/* Sleep End Time */}
          {log.type === 'sleep' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">שעת סיום שינה (התעורר/ה)</label>
                <span className="text-[10px] text-gray-400">אופציונלי</span>
              </div>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50/50"
              />
            </div>
          )}

          {/* Details / Text box */}
          {(log.type === 'solids' || log.type === 'medication' || log.type === 'growth') && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">פרטי התיעוד</label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">הערה</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="הערה על התיעוד..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-2xl shadow-sm text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'שומר...' : 'שמירת שינויים'}</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="p-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-2xl transition-colors cursor-pointer"
              title="מחיקת תיעוד"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
