'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/dateFormat';
import {
  Baby,
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  PlusCircle,
} from 'lucide-react';

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // User form state
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Baby creation state
  const [wantAddOwnBaby, setWantAddOwnBaby] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [babyGender, setBabyGender] = useState<'girl' | 'boy'>('girl');
  const [babyBirthDate, setBabyBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [babyNotes, setBabyNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await fetch(`/api/invitations/${code}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || 'קישור ההזמנה אינו תקף');
        } else {
          const data = await res.json();
          setInvitation(data.invitation);
          // If invite has no shared babies, default wantAddOwnBaby to true!
          if (!data.invitation.targetBabies || data.invitation.targetBabies.length === 0) {
            setWantAddOwnBaby(true);
          }
        }
      } catch (err: any) {
        setError(err.message || 'שגיאה בטעינת ההזמנה');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvite();
  }, [code]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      alert('נא למלא שם, שם משתמש וסיסמה');
      return;
    }
    if (wantAddOwnBaby && !babyName.trim()) {
      alert('נא להזין את שם התינוק/ת');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/invitations/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name: name.trim(),
          username: username.trim().toLowerCase(),
          password: password.trim(),
          babyName: wantAddOwnBaby ? babyName.trim() : undefined,
          babyGender: wantAddOwnBaby ? babyGender : undefined,
          babyBirthDate: wantAddOwnBaby ? babyBirthDate : undefined,
          babyNotes: wantAddOwnBaby ? babyNotes.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'שגיאה בקבלת ההזמנה');
      } else {
        setSuccessMessage('החשבון נוצר וההזמנה התקבלה בהצלחה! מעביר אותך ליומן...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בחיבור');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff9fa] flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-[#fff9fa] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border border-pink-100 shadow-xl">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">קישור הזמנה לא תקף</h2>
          <p className="text-xs text-gray-500 mb-5">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white font-bold px-5 py-2 rounded-full text-xs transition-all"
          >
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  const hasSharedBabies = invitation.targetBabies && invitation.targetBabies.length > 0;
  const childrenNames = invitation.targetBabies?.map((b: any) => b.name).join(', ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-[#fff9fa] flex items-center justify-center p-3 sm:p-4 overflow-x-hidden w-full">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-pink-100 overflow-x-hidden my-auto">
        {/* Top Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-pink-200">
          <Baby className="w-7 h-7" />
        </div>

        {/* Invitation Context */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">
            <Sparkles className="w-3 h-3" /> הזמנה ל-Baby Tracker
          </span>
          <h1 className="text-xl font-black text-gray-800">
            {invitation.created_by_name} הזמינ/ה אותך!
          </h1>
          {invitation.created_at && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              נשלח ב-{formatDate(invitation.created_at)}
            </p>
          )}
          {hasSharedBabies ? (
            <p className="text-xs text-gray-500 mt-1">
              הוזמנת להצטרף ליומן של: <span className="font-bold text-gray-700">{childrenNames}</span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              הוזמנת להצטרף וליצור יומן מעקב לתינוק/ת שלך
            </p>
          )}
        </div>

        {/* Claim Form */}
        {successMessage ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center text-green-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <form onSubmit={handleClaim} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl text-xs text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Section 1: Account credentials */}
            <div className="bg-pink-50/40 p-3.5 rounded-2xl border border-pink-100 space-y-3">
              <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-pink-600" />
                <span>1. הגדרת החשבון שלך</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">השם המלא שלך</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="למשל: שירה, דניאל..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">שם משתמש (באנגלית / אותיות)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono text-left bg-white"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">סיסמה לבחירתך</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="בחרו סיסמה"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                />
              </div>
            </div>

            {/* Section 2: Baby details */}
            <div className="bg-purple-50/40 p-3.5 rounded-2xl border border-purple-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Baby className="w-4 h-4 text-purple-600" />
                  <span>2. הוספת תינוק/ת שלך</span>
                </div>
                {hasSharedBabies && (
                  <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantAddOwnBaby}
                      onChange={(e) => setWantAddOwnBaby(e.target.checked)}
                      className="rounded text-purple-600 w-3.5 h-3.5"
                    />
                    <span>הוסף תינוק משלי</span>
                  </label>
                )}
              </div>

              {wantAddOwnBaby && (
                <div className="space-y-2.5 pt-1 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">שם התינוק/ת</label>
                    <input
                      type="text"
                      required={wantAddOwnBaby}
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      placeholder="שם התינוק/ת..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">מין</label>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setBabyGender('girl')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            babyGender === 'girl'
                              ? 'bg-pink-500 text-white border-pink-600'
                              : 'bg-white text-pink-700 border-pink-200'
                          }`}
                        >
                          👧 בת
                        </button>
                        <button
                          type="button"
                          onClick={() => setBabyGender('boy')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            babyGender === 'boy'
                              ? 'bg-sky-500 text-white border-sky-600'
                              : 'bg-white text-sky-700 border-sky-200'
                          }`}
                        >
                          👦 בן
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">תאריך לידה (DD/MM/YYYY)</label>
                      <input
                        type="date"
                        required={wantAddOwnBaby}
                        value={babyBirthDate}
                        onChange={(e) => setBabyBirthDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {hasSharedBabies && !wantAddOwnBaby && (
                <p className="text-[11px] text-gray-500 italic">
                  תצורף/י כ-
                  <strong className="text-pink-600">
                    {invitation.target_role === 'parent' ? 'הורה' : invitation.target_role === 'caregiver' ? 'מטפלת' : 'צופה'}
                  </strong>{' '}
                  ליומן של {childrenNames}. תוכל/י להוסיף ילדים משלך בכל שלב.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'מבצע הרשמה...' : 'יצירת החשבון והתחלת מעקב'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
