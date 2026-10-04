'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Baby, Shield, CheckCircle2, ArrowLeft, Sparkles, UserCheck } from 'lucide-react';

export function SetupWizard() {
  const { createAdmin, createBaby, isSetupRequired, currentUser, babies } = useApp();
  const [step, setStep] = useState<'admin' | 'baby'>('admin');

  // Admin form
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Baby form
  const [babyName, setBabyName] = useState('');
  const [gender, setGender] = useState<'girl' | 'boy'>('girl');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmittingBaby, setIsSubmittingBaby] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      setAdminError('נא למלא את כל השדות');
      return;
    }
    setIsSubmittingAdmin(true);
    setAdminError(null);

    const res = await createAdmin(name.trim(), username.trim(), password.trim());
    setIsSubmittingAdmin(false);

    if (res.success) {
      setStep('baby');
    } else {
      setAdminError(res.error || 'שגיאה ביצירת מנהל מערכת');
    }
  };

  const handleBabySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyName.trim()) return;

    setIsSubmittingBaby(true);
    await createBaby({
      name: babyName.trim(),
      gender,
      birth_date: birthDate,
      notes: notes.trim() || undefined,
    });
    setIsSubmittingBaby(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-[#fff9fa] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95">
        {step === 'admin' ? (
          <div>
            {/* Top Icon */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
              <Shield className="w-8 h-8" />
            </div>

            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" /> הפעלה ראשונית
              </span>
              <h1 className="text-2xl font-black text-gray-800">הגדרת מנהל מערכת</h1>
              <p className="text-xs text-gray-500 mt-1">
                ברוכים הבאים ל-Baby Tracker. צרו את חשבון המנהל שלכם (ללא צורך באימייל).
              </p>
            </div>

            {adminError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-xs text-center border border-red-100 mb-4">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">השם המלא שלך</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="למשל: יוסף"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שם משתמש (באנגלית / אותיות)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="למשל: yosef"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">סיסמה / קוד כניסה</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="למשל: 1234"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAdmin}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-2xl shadow-md shadow-purple-200 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmittingAdmin ? 'מגדיר...' : 'יצירת מנהל והמשך להוספת ילד'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Step 2: Create First Baby */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
              <Baby className="w-8 h-8" />
            </div>

            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> מנהל הוגדר בהצלחה!
              </span>
              <h2 className="text-2xl font-black text-gray-800">הוספת הילד/ה הראשון/ה</h2>
              <p className="text-xs text-gray-500 mt-1">
                הזינו את פרטי הבייבי כדי להתחיל לתעד ביומן
              </p>
            </div>

            <form onSubmit={handleBabySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שם התינוק/ת</label>
                <input
                  type="text"
                  required
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="שם התינוק/ת..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">מין</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('girl')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      gender === 'girl'
                        ? 'bg-pink-500 text-white border-pink-600'
                        : 'bg-pink-50/50 text-pink-700 border-pink-200 hover:bg-pink-100'
                    }`}
                  >
                    👧 בת
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('boy')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      gender === 'boy'
                        ? 'bg-sky-500 text-white border-sky-600'
                        : 'bg-sky-50/50 text-sky-700 border-sky-200 hover:bg-sky-100'
                    }`}
                  >
                    👦 בן
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">תאריך לידה (DD/MM/YYYY)</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">הערות / הרגלים מיוחדים (אופציונלי)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="למשל: אוהב/ת מוזיקה קלאסית, שיר ערש..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingBaby}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmittingBaby ? 'פותח יומן...' : 'הוספה וכניסה ליומן'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
