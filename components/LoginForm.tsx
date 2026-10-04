'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Baby, LogIn, Lock, User, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setIsSubmitting(true);
    setError(null);

    const res = await login(username.trim(), password.trim());
    if (!res.success) {
      setError(res.error || 'שם משתמש או סיסמה שגויים');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9fa] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-xl border border-pink-100 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
          <Baby className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800">Baby Tracker</h1>
          <p className="text-xs text-gray-500 mt-1">התחברות לחשבון המעקב שלך</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-xs flex items-center gap-2 mb-4 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          action="/api/auth/login"
          method="post"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="username" className="block text-xs font-bold text-gray-700 mb-1">
              שם משתמש
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-3.5 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm font-mono text-left bg-gray-50/50 focus:bg-white focus:border-pink-500 focus:outline-hidden transition-all"
                dir="ltr"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1">
              סיסמה
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pl-10 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:bg-white focus:border-pink-500 focus:outline-hidden transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-md shadow-pink-200 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'מתחבר...' : 'התחברות'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
