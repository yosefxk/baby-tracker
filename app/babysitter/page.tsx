'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  HeartHandshake,
  ArrowRight,
  Phone,
  Moon,
  Milk,
  AlertTriangle,
  Smile,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

export default function BabysitterPage() {
  const { activeBaby, currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const copyGuide = () => {
    const text = `👶 מדריך למטפלת עבור ${activeBaby?.name || 'הבייבי'}:
- שגרת שינה: שנת בוקר בסביבות 10:00, שנת צהריים ב-13:30. להרדים בחדר חשוך עם רעש לבן.
- האכלה: בקבוק 120 מ״ל כל 3 שעות (חלב שאוב / תמ״ל).
- הרגעה: מוצץ עגול, שיר ערש, נדנוד קל.
- אנשי קשר לחירום:
  יוסף (אבא): 050-0000000
  אמא: 052-0000000
  מד״א: 101`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fff9fa] p-3 sm:p-5 w-full max-w-full overflow-x-hidden">
      <div className="max-w-xl mx-auto space-y-5 overflow-x-hidden w-full">
        {/* Top bar */}
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
                מדריך למטפלת ולבייביסיטר • {activeBaby?.name || 'הבייבי'}
              </h1>
              <p className="text-xs text-gray-500">כל מה שצריך לדעת כשאנחנו לא בבית במקום אחד</p>
            </div>
          </div>

          <button
            onClick={copyGuide}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> הועתק לוואטסאפ!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> העתק סיכום לוואטסאפ
              </>
            )}
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-red-50/70 border border-red-200 rounded-3xl p-5">
          <h2 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-3">
            <Phone className="w-4 h-4 text-red-600" />
            <span>אנשי קשר דחופים</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-2xl border border-red-100">
              <div className="text-[11px] text-gray-400 font-medium">יוסף (אבא)</div>
              <a href="tel:0500000000" className="text-sm font-bold text-red-600 hover:underline">
                050-0000000
              </a>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-red-100">
              <div className="text-[11px] text-gray-400 font-medium">אמא</div>
              <a href="tel:0520000000" className="text-sm font-bold text-red-600 hover:underline">
                052-0000000
              </a>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-red-100">
              <div className="text-[11px] text-gray-400 font-medium">חירום מד״א</div>
              <a href="tel:101" className="text-sm font-bold text-red-600 hover:underline">
                חיוג מהיר: 101
              </a>
            </div>
          </div>
        </div>

        {/* Feeding routine */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Milk className="w-4 h-4" />
            <span>שגרת האכלה</span>
          </div>
          <div className="text-xs text-gray-700 space-y-1.5 leading-relaxed">
            <p>• <strong>כמות מנה:</strong> 120 מ״ל כל 3 עד 3.5 שעות.</p>
            <p>• <strong>חימום:</strong> בקערת מים פושרים (לא במיקרוגל!). לבדוק טמפרטורה על גב כף היד.</p>
            <p>• <strong>גרעפס:</strong> להחזיק זקוף כ-10 דקות בסיום כל בקבוק.</p>
          </div>
        </div>

        {/* Sleep routine */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <Moon className="w-4 h-4" />
            <span>שגרת שינה והרדמה</span>
          </div>
          <div className="text-xs text-gray-700 space-y-1.5 leading-relaxed">
            <p>• <strong>סימני עייפות:</strong> שפשוף עיניים, פיהוקים, מבט בוהה.</p>
            <p>• <strong>איך מרדימים:</strong> להחשיך מעט את החדר, להפעיל רעש לבן (או מוזיקה רגועה), לתת מוצץ וטפיחות קלות על הטוסיק.</p>
            <p>• <strong>בטיחות בשינה:</strong> תמיד להשכיב על הגב בלבד, ללא בובות או שמיכות רופפות סביב הפנים.</p>
          </div>
        </div>

        {/* Calming tricks */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <Smile className="w-4 h-4" />
            <span>טריקים להרגעה</span>
          </div>
          <div className="text-xs text-gray-700 space-y-1.5 leading-relaxed">
            <p>• {activeBaby?.notes || 'אוהבת להירדם עם שיר ערש ורעש לבן'}</p>
            <p>• סיבוב בעגלה בחוץ כמעט תמיד עובד כשקשה להירדם.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
