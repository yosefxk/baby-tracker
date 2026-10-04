'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  PhoneCall,
  Heart,
  Wind,
  Activity,
  ShieldAlert,
} from 'lucide-react';

export default function EmergencyPage() {
  const [activeTab, setActiveTab] = useState<'cpr' | 'choking' | 'seizures'>('cpr');

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
                מדריך עזרה ראשונה וחירום (מד״א)
              </h1>
              <p className="text-xs text-gray-500">הנחיות מצילות חיים לתינוקות - צעד אחר צעד</p>
            </div>
          </div>
        </div>

        {/* Speed Dial 101 Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-3xl p-5 text-white shadow-xl shadow-red-500/20 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-red-100">בכל מקרה של מצב חירום רפואי</div>
            <div className="text-xl font-black mt-0.5">הזעיקו עזרה מיידית במוקד 101</div>
          </div>
          <a
            href="tel:101"
            className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 font-black px-5 py-3 rounded-2xl shadow-lg text-base transition-transform active:scale-95"
          >
            <PhoneCall className="w-5 h-5 animate-bounce" />
            <span>חייג 101</span>
          </a>
        </div>

        {/* Protocol tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('cpr')}
            className={`py-3 px-2 rounded-2xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer border ${
              activeTab === 'cpr'
                ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-red-50/50'
            }`}
          >
            🫀 החייאה (CPR)
          </button>
          <button
            onClick={() => setActiveTab('choking')}
            className={`py-3 px-2 rounded-2xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer border ${
              activeTab === 'choking'
                ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50/50'
            }`}
          >
            💨 חנק מגוף זר
          </button>
          <button
            onClick={() => setActiveTab('seizures')}
            className={`py-3 px-2 rounded-2xl font-bold text-xs sm:text-sm text-center transition-all cursor-pointer border ${
              activeTab === 'seizures'
                ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50/50'
            }`}
          >
            ⚡ פרכוסי חום
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs space-y-6">
          {/* CPR GUIDELINES */}
          {activeTab === 'cpr' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-gray-800 border-b border-gray-100 pb-2">
                החייאה בתינוק (עד גיל שנה) - הנחיות מד״א
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-gray-700">
                <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">בטיחות ובדיקת הכרה</strong>
                    ודאו שאין סכנה בסביבה. טפחו בעדינות על כפות רגלי התינוק וקראו בשמו. אם אינו מגיב — הזעיקו מייד עזרה וחייגו 101.
                  </div>
                </div>

                <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">בדיקת נשימה</strong>
                    הביטו על בית החזה עד 10 שניות. אם התינוק אינו נושם או נושם בחרחור — החלו מייד בעיסויים.
                  </div>
                </div>

                <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">עיסויי חזה (2 אצבעות / 2 אגודלים)</strong>
                    השכיבו על משטח קשיח. הניחו 2 אצבעות במרכז בית החזה (קו הפטמות). לחצו לעומק של כ-1/3 מעומק בית החזה בקצב של 100 עד 120 לחיצות בדקה, ברצף ללא הפסקה עד הגעת הצוות הרפואי.
                  </div>
                </div>

                <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">נתיב אוויר</strong>
                    הטו בעדינות את הראש לאחור למצב ניטרלי והרימו את הסנטר. אם מגיע דפיברילטור (AED) — חברו לפי ההנחיות הקוליות.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHOKING GUIDELINES */}
          {activeTab === 'choking' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-gray-800 border-b border-gray-100 pb-2">
                חנק מגוף זר בתינוק - הנחיות מד״א
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-gray-700">
                <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">זיהוי סימני חנק</strong>
                    התינוק משתנק, אינו מסוגל לבכות או להשמיע קול, מתקשה לנשום, או מראה סימני כיחלון סביב השפתיים. חייגו מייד 101.
                  </div>
                </div>

                <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">5 טפיחות בין השכמות</strong>
                    השכיבו את התינוק כשפניו כלפי מטה לאורך האמה שלכם, כשהראש נמוך מהגוף ותומכים בלסת (לא בצוואר). תנו 5 טפיחות נמרצות במרכז הגב בין השכמות באמצעות שורש כף היד.
                  </div>
                </div>

                <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">5 לחיצות במרכז החזה</strong>
                    הפכו את התינוק על גבו לאורך האמה השנייה (ראש עדיין נמוך מהגוף). בצעו 5 לחיצות חזה עם 2 אצבעות במרכז החזה.
                  </div>
                </div>

                <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">בדיקה זהירה</strong>
                    הביטו לפיו של התינוק. רק אם הגוף הזר נראה לעין בבירור בחלל הפה — שלפו אותו בזהירות באצבע. לעולם אל תחדירו אצבע בעיוורון לחלל הפה!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEIZURES GUIDELINES */}
          {activeTab === 'seizures' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-gray-800 border-b border-gray-100 pb-2">
                פרכוסי חום בתינוקות - הנחיות מד״א
              </h3>

              <div className="space-y-3 text-xs leading-relaxed text-gray-700">
                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">הזעקת עזרה מיידית</strong>
                    חייגו 101 למוקד מד״א. פרכוסי חום עלולים להיראות מפחידים, אך רובם חולפים תוך מספר דקות.
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">ריפוד הראש והרחקת סכנות</strong>
                    הניחו ריפוד רך תחת ראשו של התינוק. הרחיקו מייד חפצים חדים או קשים מהסביבה.
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">מה אסור לעשות!</strong>
                    אין לנסות לעצור את התנועות בכוח! אין להכניס שום חפץ או אצבעות לתוך פיו של התינוק! אין להכניס את התינוק למים או אמבטיה בזמן פרכוס!
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <div>
                    <strong className="block text-gray-900 mb-0.5">לאחר סיום הפרכוס</strong>
                    השכיבו את התינוק על צידו (תנוחת החלמה) כדי לשמור על נתיב אוויר פתוח ולמנוע שאיפת הפרשות. המתינו להגעת הצוות הרפואי.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
