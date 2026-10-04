'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Milk,
  Baby as BabyIcon,
  Moon,
  Sparkles,
  Thermometer,
  Apple,
  Ruler,
  Droplets,
  Timer,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogModalProps {
  type: string | null;
  onClose: () => void;
}

export function LogModal({ type, onClose }: LogModalProps) {
  const { activeBaby, addLog, startNursingTimer, startSleepTimer } = useApp();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bottle state
  const [bottleAmount, setBottleAmount] = useState(120);
  const [milkType, setMilkType] = useState<'formula' | 'breast_milk' | 'water'>('formula');

  // Diaper state
  const [diaperCondition, setDiaperCondition] = useState<'wet' | 'dirty' | 'both'>('wet');
  const [hasRash, setHasRash] = useState(false);
  const [stoolColor, setStoolColor] = useState('צהוב');

  // Nursing manual state
  const [nursingSide, setNursingSide] = useState<'left' | 'right' | 'both'>('right');
  const [nursingMinutes, setNursingMinutes] = useState(15);

  // Sleep manual state
  const [sleepMinutes, setSleepMinutes] = useState(60);

  // Pumping state
  const [pumpLeft, setPumpLeft] = useState(60);
  const [pumpRight, setPumpRight] = useState(60);

  // Solids state
  const [solidFood, setSolidFood] = useState('מחית גזר');
  const [solidAmount, setSolidAmount] = useState('כמה כפיות');

  // Meds state
  const [medType, setMedType] = useState<'med' | 'temp'>('med');
  const [medName, setMedName] = useState('נובימול');
  const [medDosage, setMedDosage] = useState('2.5 מ״ל');
  const [tempC, setTempC] = useState('37.2');

  // Growth state
  const [weightKg, setWeightKg] = useState('5.8');
  const [heightCm, setHeightCm] = useState('60');

  // Milestone state
  const [milestoneTitle, setMilestoneTitle] = useState('חיוך ראשון');

  if (!type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBaby) return;
    setIsSubmitting(true);

    let details: Record<string, any> = {};
    const now = new Date();

    if (type === 'bottle') {
      details = { amountMl: Number(bottleAmount), milkType };
    } else if (type === 'diaper') {
      details = { condition: diaperCondition, rash: hasRash, stoolColor: diaperCondition !== 'wet' ? stoolColor : undefined };
    } else if (type === 'nursing') {
      details = {
        side: nursingSide,
        durationMinutes: Number(nursingMinutes),
        totalDurationSec: Number(nursingMinutes) * 60,
      };
    } else if (type === 'sleep') {
      details = { durationMinutes: Number(sleepMinutes), quality: 'good' };
    } else if (type === 'pumping') {
      details = { amountLeftMl: Number(pumpLeft), amountRightMl: Number(pumpRight), totalMl: Number(pumpLeft) + Number(pumpRight) };
    } else if (type === 'solids') {
      details = { food: solidFood, amount: solidAmount };
    } else if (type === 'medication') {
      if (medType === 'temp') {
        details = { tempC: Number(tempC) };
      } else {
        details = { medicineName: medName, dosage: medDosage };
      }
    } else if (type === 'growth') {
      details = { weightKg: Number(weightKg), heightCm: Number(heightCm) };
    } else if (type === 'milestone') {
      details = { title: milestoneTitle };
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }

    await addLog({
      type: type === 'medication' && medType === 'temp' ? 'temperature' : type,
      details,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {type === 'nursing' && '🤱'}
              {type === 'bottle' && '🍼'}
              {type === 'sleep' && '💤'}
              {type === 'diaper' && '🧷'}
              {type === 'pumping' && '🥛'}
              {type === 'solids' && '🥣'}
              {type === 'medication' && '🌡️'}
              {type === 'growth' && '📏'}
              {type === 'milestone' && '🌟'}
            </span>
            <h3 className="font-bold text-lg text-gray-800">
              {type === 'nursing' && 'תיעוד הנקה'}
              {type === 'bottle' && 'תיעוד בקבוק'}
              {type === 'sleep' && 'תיעוד שינה'}
              {type === 'diaper' && 'החלפת חיתול'}
              {type === 'pumping' && 'שאיבת חלב'}
              {type === 'solids' && 'אוכל מוצק וטעימות'}
              {type === 'medication' && 'חום ותרופות'}
              {type === 'growth' && 'מדדי גדילה'}
              {type === 'milestone' && 'אבן דרך חדשה'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* BOTTLE FORM */}
          {type === 'bottle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">כמות במ״ל ({bottleAmount} מ״ל)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[60, 90, 120, 150, 180, 210, 240, 270].map((ml) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => setBottleAmount(ml)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        bottleAmount === ml
                          ? 'bg-teal-600 text-white shadow-sm scale-102'
                          : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                      }`}
                    >
                      {ml} מ״ל
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">סוג חלב</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'formula', label: 'תמ״ל' },
                    { id: 'breast_milk', label: 'חלב אם' },
                    { id: 'water', label: 'מים' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMilkType(m.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        milkType === m.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DIAPER FORM */}
          {type === 'diaper' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">מצב חיתול</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'wet', label: '💧 רטוב (פיפי)' },
                    { id: 'dirty', label: '💩 מלוכלך (קקי)' },
                    { id: 'both', label: '✨ שניהם' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDiaperCondition(d.id as any)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        diaperCondition === d.id
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {diaperCondition !== 'wet' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">צבע / מרקם</label>
                  <div className="flex gap-2">
                    {['צהוב חרדלי', 'ירקרק', 'חום', 'משחתי', 'גרגרי'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setStoolColor(c)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          stoolColor === c ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-xs font-medium text-amber-900">יש תפרחת חיתולים / אדמומיות?</span>
                <input
                  type="checkbox"
                  checked={hasRash}
                  onChange={(e) => setHasRash(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* NURSING FORM */}
          {type === 'nursing' && (
            <div className="space-y-4">
              <div className="bg-pink-50 p-3 rounded-2xl border border-pink-100 text-center">
                <p className="text-xs text-pink-700 mb-2 font-medium">רוצה לתזמן עכשיו בזמן אמת?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      startNursingTimer('right');
                      onClose();
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Timer className="w-3.5 h-3.5" /> התחל טיימר (ימין)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      startNursingTimer('left');
                      onClose();
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Timer className="w-3.5 h-3.5" /> התחל טיימר (שמאל)
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <label className="block text-xs font-semibold text-gray-600 mb-2">או הזנה ידנית:</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { id: 'right', label: 'צד ימין' },
                    { id: 'left', label: 'צד שמאל' },
                    { id: 'both', label: 'שני הצדדים' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setNursingSide(s.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        nursingSide === s.id ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600">משך זמן בדקות:</span>
                  <input
                    type="number"
                    value={nursingMinutes}
                    onChange={(e) => setNursingMinutes(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-20 px-3 py-1.5 text-center border border-gray-200 rounded-xl text-sm font-bold"
                  />
                  <span className="text-xs text-gray-500">דקות</span>
                </div>
              </div>
            </div>
          )}

          {/* SLEEP FORM */}
          {type === 'sleep' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 p-3.5 rounded-2xl border border-indigo-100 text-center">
                <p className="text-xs text-indigo-800 mb-2 font-medium">נרדמ/ה עכשיו? הפעל טיימר חי:</p>
                <button
                  type="button"
                  onClick={() => {
                    startSleepTimer();
                    onClose();
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Moon className="w-4 h-4" /> התחל מעקב שינה עכשיו
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <label className="block text-xs font-semibold text-gray-600 mb-2">או תיעוד ידני בדיעבד:</label>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600">משך שינה בדקות:</span>
                  <input
                    type="number"
                    value={sleepMinutes}
                    onChange={(e) => setSleepMinutes(Number(e.target.value))}
                    min={5}
                    max={720}
                    step={5}
                    className="w-24 px-3 py-1.5 text-center border border-gray-200 rounded-xl text-sm font-bold"
                  />
                  <span className="text-xs text-gray-500">({Math.floor(sleepMinutes / 60)} שעות ו-{sleepMinutes % 60} דק׳)</span>
                </div>
              </div>
            </div>
          )}

          {/* PUMPING FORM */}
          {type === 'pumping' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">שד שמאל (מ״ל)</label>
                  <input
                    type="number"
                    value={pumpLeft}
                    onChange={(e) => setPumpLeft(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">שד ימין (מ״ל)</label>
                  <input
                    type="number"
                    value={pumpRight}
                    onChange={(e) => setPumpRight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center font-bold"
                  />
                </div>
              </div>
              <p className="text-xs text-center text-teal-700 font-bold bg-teal-50 py-1.5 rounded-xl">
                סה״כ נשאב: {Number(pumpLeft) + Number(pumpRight)} מ״ל
              </p>
            </div>
          )}

          {/* SOLIDS FORM */}
          {type === 'solids' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">מה אכל/ה?</label>
                <input
                  type="text"
                  value={solidFood}
                  onChange={(e) => setSolidFood(e.target.value)}
                  placeholder="בטטה, אבוקדו, בננה, מרק..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">כמות</label>
                <div className="flex gap-2">
                  {['טעימות בודדות', 'חצי קערית', 'קערית מלאה'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSolidAmount(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        solidAmount === amt ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MEDS / HEALTH FORM */}
          {type === 'medication' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMedType('med')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    medType === 'med' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  💊 מתן תרופה
                </button>
                <button
                  type="button"
                  onClick={() => setMedType('temp')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    medType === 'temp' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  🌡️ מדידת חום
                </button>
              </div>

              {medType === 'med' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">שם התרופה</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['נובימול', 'אקמול', 'נורופן', 'ויטמין D', 'ברזל', 'טיפות בטן'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMedName(m)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            medName === m ? 'bg-rose-600 text-white font-bold' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">מינון</label>
                    <input
                      type="text"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      placeholder="למשל 2.5 מ״ל, 2 טיפות..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">מעלות חום (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempC}
                    onChange={(e) => setTempC(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-xl font-bold"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    {Number(tempC) >= 38.0 ? '⚠️ חום מעל 38.0°C דורש מעקב ותשומת לב' : 'חום תקין'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* GROWTH FORM */}
          {type === 'growth' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">משקל (ק״ג)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">גובה (ס״מ)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center text-lg font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MILESTONE FORM */}
          {type === 'milestone' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">אבן הדרך שהושגה:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'חיוך ראשון',
                  'התהפכות מהבטן לגב',
                  'התהפכות מהגב לבטן',
                  'שן ראשונה',
                  'צחוק בקול',
                  'ישיבה עצמאית',
                  'מחיאת כף',
                  'עמידה',
                  'צעד ראשון',
                ].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMilestoneTitle(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      milestoneTitle === m ? 'bg-purple-600 text-white font-bold' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                placeholder="או כתבו אבן דרך מותאמת אישית..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          )}

          {/* Notes field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">הערות נוספות (אופציונלי)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="איך הרגיש/ה, מצב רוח..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-300 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'שומר ביומן...' : 'שמירה ביומן'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
