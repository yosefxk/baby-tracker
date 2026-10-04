'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/dateFormat';
import {
  X,
  Share2,
  Copy,
  Check,
  Users,
  ShieldCheck,
  Sparkles,
  Link as LinkIcon,
  Trash2,
  Clock,
  Baby,
  UserPlus,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const { babies, currentUser } = useApp();
  const [inviteType, setInviteType] = useState<'co_parent' | 'new_user'>('co_parent');
  const [selectedBabyIds, setSelectedBabyIds] = useState<string[]>(['*']);
  const [targetRole, setTargetRole] = useState<'parent' | 'caregiver' | 'viewer'>('parent');
  const [label, setLabel] = useState('');
  const [appBaseUrl, setAppBaseUrl] = useState<string>('');
  const [invitations, setInvitations] = useState<any[]>([]);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch current invitations
  const loadInvitations = async () => {
    try {
      const res = await fetch('/api/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations || []);
        if (data.baseUrl) {
          setAppBaseUrl(data.baseUrl);
        }
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadInvitations();
      setGeneratedLink(null);
      setCopiedLink(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCopiedLink(false);

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invite_type: inviteType,
          target_role: targetRole,
          target_baby_ids: inviteType === 'new_user' ? [] : selectedBabyIds,
          allow_create_baby: true,
          label: label.trim() || undefined,
          max_uses: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.baseUrl) setAppBaseUrl(data.baseUrl);
        const base = data.baseUrl || appBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
        const fullUrl = data.fullUrl || `${base.replace(/\/$/, '')}${data.inviteUrl}`;
        setGeneratedLink(fullUrl);
        await loadInvitations();
      }
    } catch (err) {
      console.error('Error creating invitation:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const toggleBabySelection = (babyId: string) => {
    if (babyId === '*') {
      setSelectedBabyIds(['*']);
      return;
    }

    let updated = selectedBabyIds.filter((id) => id !== '*');
    if (updated.includes(babyId)) {
      updated = updated.filter((id) => id !== babyId);
      if (updated.length === 0) updated = ['*'];
    } else {
      updated.push(babyId);
    }
    setSelectedBabyIds(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto overflow-x-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-800">שיתוף יומן והזמנת משתמשים</h3>
              <p className="text-[11px] text-gray-400">יצירת קישורי הזמנה ידניים לשליחה בוואטסאפ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form to generate invite */}
        <form onSubmit={handleGenerateLink} className="mt-4 space-y-4">
          {/* Select Mode */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              1. סוג ההזמנה
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInviteType('co_parent')}
                className={`p-2.5 rounded-xl text-right transition-all border ${
                  inviteType === 'co_parent'
                    ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-pink-50/50'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>הורות שותפת לילדיי</span>
                </div>
                <div className={`text-[10px] mt-0.5 ${inviteType === 'co_parent' ? 'text-pink-100' : 'text-gray-400'}`}>
                  שיתוף גישה לילדים קיימים
                </div>
              </button>

              <button
                type="button"
                onClick={() => setInviteType('new_user')}
                className={`p-2.5 rounded-xl text-right transition-all border ${
                  inviteType === 'new_user'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>משתמש חדש (תינוק משלו)</span>
                </div>
                <div className={`text-[10px] mt-0.5 ${inviteType === 'new_user' ? 'text-purple-100' : 'text-gray-400'}`}>
                  יצירת חשבון ותינוק חדש
                </div>
              </button>
            </div>
          </div>

          {/* Children selection (only in co-parent mode) */}
          {inviteType === 'co_parent' && babies.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                2. לאילו ילדים לתת הרשאה?
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleBabySelection('*')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold text-right transition-all flex items-center justify-between ${
                    selectedBabyIds.includes('*')
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">כל הילדים (כולם)</span>
                  {selectedBabyIds.includes('*') && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>

                {babies.map((b) => {
                  const isSelected = selectedBabyIds.includes(b.id) || selectedBabyIds.includes('*');
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBabySelection(b.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-pink-100 text-pink-800 border border-pink-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Role Selection (in co-parent mode) */}
          {inviteType === 'co_parent' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                3. רמת הרשאה
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTargetRole('parent')}
                  className={`p-2 rounded-xl text-right transition-all border ${
                    targetRole === 'parent'
                      ? 'bg-pink-500 text-white border-pink-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  <div className="font-bold text-xs">הורה</div>
                  <div className={`text-[9px] mt-0.5 ${targetRole === 'parent' ? 'text-pink-100' : 'text-gray-400'}`}>
                    שליטה מלאה
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetRole('caregiver')}
                  className={`p-2 rounded-xl text-right transition-all border ${
                    targetRole === 'caregiver'
                      ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  <div className="font-bold text-xs">מטפלת</div>
                  <div className={`text-[9px] mt-0.5 ${targetRole === 'caregiver' ? 'text-teal-100' : 'text-gray-400'}`}>
                    תיעוד וצפייה
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetRole('viewer')}
                  className={`p-2 rounded-xl text-right transition-all border ${
                    targetRole === 'viewer'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  <div className="font-bold text-xs">צופה</div>
                  <div className={`text-[9px] mt-0.5 ${targetRole === 'viewer' ? 'text-indigo-100' : 'text-gray-400'}`}>
                    צפייה בלבד
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Label */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              כינוי / תיאור להזמנה (אופציונלי)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="למשל: אמא, סבתא, חברים..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-2xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <LinkIcon className="w-4 h-4" />
            <span>{isGenerating ? 'יוצר קישור...' : 'יצירת קישור הזמנה ידני'}</span>
          </button>
        </form>

        {/* Newly Generated Link Showcase */}
        {generatedLink && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 animate-in zoom-in-95">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>הקישור מוכן לשליחה!</span>
            </div>
            <p className="text-[11px] text-emerald-700 mb-2 leading-snug">
              שלחו את הקישור בוואטסאפ. המקבל יוכל לבחור סיסמה משלו, ליצור תינוק משלו או להצטרף ליומן שלך:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 bg-white px-2.5 py-1.5 border border-emerald-300 rounded-xl text-xs text-gray-700 font-mono select-all truncate"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(generatedLink)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" /> הועתק!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> העתק
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Active invitations list */}
        {invitations.length > 0 && (
          <div className="mt-5 border-t border-gray-100 pt-3">
            <h4 className="text-xs font-bold text-gray-700 mb-2">
              קישורי הזמנה קודמים ({invitations.length})
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {invitations.map((inv) => {
                const base = appBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
                const url = `${base.replace(/\/$/, '')}/invite/${inv.code}`;

                return (
                  <div
                    key={inv.id}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-gray-800 truncate flex items-center gap-1">
                        <span>{inv.label || 'קישור הזמנה'}</span>
                        <span className="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded-full font-medium shrink-0">
                          {inv.invite_type === 'new_user' ? 'משתמש חדש' : 'הורות שותפת'}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5 truncate flex items-center gap-1.5">
                        <span>נוצל {inv.used_count}/{inv.max_uses} פעמים</span>
                        {inv.created_at && (
                          <>
                            <span>•</span>
                            <span>נוצר: {formatDate(inv.created_at)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(url)}
                      className="p-1 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      title="העתק קישור"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">העתק</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
