'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Baby, Heart, PlusCircle } from 'lucide-react';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddChildModal({ isOpen, onClose }: AddChildModalProps) {
  const { createBaby } = useApp();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'girl' | 'boy'>('girl');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const success = await createBaby({
      name: name.trim(),
      gender,
      birth_date: birthDate,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);
    if (success) {
      setName('');
      setNotes('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in cursor-pointer"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-pink-100 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800">הוספת ילד/ה ליומן</h3>
              <p className="text-[11px] text-gray-400">ניהול קל ומעבר מהיר בין אחים ותאומים</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">שם התינוק/ת</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="למשל: איתי, נועה, דניאל..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
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
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">הערות / הרגלים מיוחדים</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="למשל: נרדם עם רעש לבן, אלרגיה..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-2.5 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'שומר...' : 'הוספת ילד/ה'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
