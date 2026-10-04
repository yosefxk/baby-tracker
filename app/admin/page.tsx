'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatDate } from '@/lib/dateFormat';
import {
  Shield,
  Users,
  Key,
  Trash2,
  Check,
  AlertCircle,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Baby as BabyIcon,
  X,
} from 'lucide-react';

export default function AdminPage() {
  const { currentUser } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New user modal / form
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setStats({
          totalBabies: data.totalBabies,
          totalLogs: data.totalLogs,
          totalInvitations: data.totalInvitations,
        });
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', userId, ...updates }),
      });
      if (res.ok) {
        setActionMessage('משתמש עודכן בהצלחה');
        setTimeout(() => setActionMessage(null), 3000);
        await loadAdminData();
        setEditingUserId(null);
        setNewPassword('');
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUsername.trim() || !newUserPassword.trim()) return;
    setIsSubmittingNewUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          name: newUserName.trim(),
          username: newUserUsername.trim(),
          password: newUserPassword.trim(),
          is_system_admin: newUserIsAdmin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'שגיאה ביצירת משתמש');
      } else {
        setActionMessage('משתמש חדש נוצר בהצלחה');
        setTimeout(() => setActionMessage(null), 3000);
        setShowAddUser(false);
        setNewUserName('');
        setNewUserUsername('');
        setNewUserPassword('');
        setNewUserIsAdmin(false);
        await loadAdminData();
      }
    } catch (err) {
      console.error('Error creating user:', err);
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', userId }),
      });
      if (res.ok) {
        setActionMessage('משתמש נמחק בהצלחה');
        setTimeout(() => setActionMessage(null), 3000);
        await loadAdminData();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9fa] p-3 sm:p-5 w-full max-w-full overflow-x-hidden">
      <div className="max-w-xl mx-auto space-y-5 overflow-x-hidden w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-2xl bg-white border border-pink-100 text-gray-500 hover:text-pink-600 transition-colors shadow-xs"
              title="חזרה ליומן"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">פאנל ניהול משתמשים ומערכת</h1>
                <p className="text-xs text-gray-500">ניהול משתמשים, סיסמאות והרשאות (ללא צורך באימיילים)</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddUser(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>הוספת משתמש</span>
            </button>
            <button
              onClick={loadAdminData}
              className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="רענן"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-2xl text-xs font-bold text-center animate-in fade-in">
            {actionMessage}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <div className="text-xs text-gray-400 font-medium">סך משתמשים</div>
            <div className="text-2xl font-black text-gray-800 mt-1">{users.length}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <div className="text-xs text-gray-400 font-medium">ילדים במערכת</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{stats.totalBabies || 0}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <div className="text-xs text-gray-400 font-medium">סך כל התיעודים</div>
            <div className="text-2xl font-black text-teal-600 mt-1">{stats.totalLogs || 0}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-xs">
            <div className="text-xs text-gray-400 font-medium">קישורי הזמנה</div>
            <div className="text-2xl font-black text-rose-500 mt-1">{stats.totalInvitations || 0}</div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>רשימת משתמשים ({users.length})</span>
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {users.map((u) => {
              const isCurrentUser = u.id === currentUser?.id;
              const isEditing = editingUserId === u.id;

              return (
                <div key={u.id} className="py-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">{u.name}</span>
                        <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          @{u.username}
                        </span>
                        {u.is_system_admin ? (
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            מנהל מערכת
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                            משתמש
                          </span>
                        )}
                        {isCurrentUser && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            אתה
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span>סיסמה: <span className="font-mono font-bold text-gray-600">{u.password}</span></span>
                        {u.created_at && (
                          <>
                            <span>•</span>
                            <span>הצטרפ/ה: {formatDate(u.created_at)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingUserId(isEditing ? null : u.id);
                          setNewPassword(u.password);
                        }}
                        className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        <span>שינוי סיסמה</span>
                      </button>

                      <button
                        onClick={() => handleUpdateUser(u.id, { is_system_admin: !u.is_system_admin })}
                        className={`px-2.5 py-1.5 border rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          u.is_system_admin
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {u.is_system_admin ? 'בטל מנהל' : 'הפוך למנהל'}
                      </button>

                      {!isCurrentUser && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="מחיקת משתמש"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Password edit form */}
                  {isEditing && (
                    <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200 flex items-center gap-3">
                      <span className="text-xs font-bold text-amber-900">סיסמה חדשה:</span>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-32 px-2 py-1 bg-white border border-amber-300 rounded-lg text-center font-mono text-sm font-bold"
                      />
                      <button
                        onClick={() => handleUpdateUser(u.id, { password: newPassword })}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> שמור סיסמה
                      </button>
                    </div>
                  )}

                  {/* Accessible babies list */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                    <span className="text-gray-400 font-medium">ילדים מקושרים:</span>
                    {u.ownedBabies?.map((b: any) => (
                      <span key={b.id} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">
                        👶 {b.name} (בעלים{b.birth_date ? `, לידה: ${formatDate(b.birth_date)}` : ''})
                      </span>
                    ))}
                    {u.permissions?.map((p: any) => (
                      <span key={p.babyId} className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                        {p.babyName} ({p.role === 'parent' ? 'הורה' : p.role === 'caregiver' ? 'מטפלת' : 'צופה'})
                      </span>
                    ))}
                    {(!u.ownedBabies || u.ownedBabies.length === 0) && (!u.permissions || u.permissions.length === 0) && (
                      <span className="text-gray-400 italic">אין עדיין ילדים מקושרים</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-purple-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-gray-800">הוספת משתמש חדש</h3>
              </div>
              <button
                onClick={() => setShowAddUser(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שם המשתמש (לתצוגה)</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="למשל: סבתא רותי, שירה, דניאל..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">שם משתמש לכניסה (Username)</label>
                <input
                  type="text"
                  required
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  placeholder="username"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">סיסמה</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="סיסמה"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-xs font-medium text-purple-900">להגדיר כמנהל מערכת?</span>
                <input
                  type="checkbox"
                  checked={newUserIsAdmin}
                  onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingNewUser}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmittingNewUser ? 'יוצר...' : 'יצירת משתמש'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
