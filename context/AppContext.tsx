'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Baby, LogEntry, Role } from '@/lib/types';

interface NursingTimerState {
  isRunning: boolean;
  activeSide: 'left' | 'right' | null;
  leftSeconds: number;
  rightSeconds: number;
}

interface SleepTimerState {
  isRunning: boolean;
  startedAt?: string; // ISO
  elapsedSeconds: number;
}

interface AppContextType {
  currentUser: User | null;
  allUsers: { id: string; name: string; username: string; is_system_admin: boolean }[];
  babies: (Baby & { role: Role; isOwner: boolean })[];
  activeBaby: (Baby & { role: Role; isOwner: boolean }) | null;
  logs: LogEntry[];
  isLoading: boolean;
  isSetupRequired: boolean;
  nursingTimer: NursingTimerState;
  sleepTimer: SleepTimerState;
  setActiveBabyId: (id: string) => void;
  refreshData: () => Promise<void>;
  createAdmin: (name: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  switchUser: (userId: string) => Promise<void>;
  createBaby: (data: Partial<Baby>) => Promise<boolean>;
  deleteBaby: (id: string) => Promise<boolean>;
  addLog: (log: { type: string; start_time?: string; end_time?: string; details: any; notes?: string }) => Promise<boolean>;
  updateLog: (id: string, updates: Partial<LogEntry>) => Promise<boolean>;
  deleteLog: (id: string) => Promise<boolean>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  // Timer controls
  startNursingTimer: (side: 'left' | 'right') => void;
  pauseNursingTimer: () => void;
  resetNursingTimer: () => void;
  finishNursingTimer: (notes?: string) => Promise<void>;
  startSleepTimer: () => void;
  stopSleepTimer: (notes?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [babies, setBabies] = useState<any[]>([]);
  const [activeBabyId, setActiveBabyIdState] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSetupRequired, setIsSetupRequired] = useState<boolean>(false);

  // Nursing Timer
  const [nursingTimer, setNursingTimer] = useState<NursingTimerState>({
    isRunning: false,
    activeSide: null,
    leftSeconds: 0,
    rightSeconds: 0,
  });

  // Sleep Timer
  const [sleepTimer, setSleepTimer] = useState<SleepTimerState>({
    isRunning: false,
    elapsedSeconds: 0,
  });

  // Ticking effect for timers
  useEffect(() => {
    const interval = setInterval(() => {
      setNursingTimer((prev) => {
        if (!prev.isRunning || !prev.activeSide) return prev;
        if (prev.activeSide === 'left') {
          return { ...prev, leftSeconds: prev.leftSeconds + 1 };
        } else {
          return { ...prev, rightSeconds: prev.rightSeconds + 1 };
        }
      });

      setSleepTimer((prev) => {
        if (!prev.isRunning || !prev.startedAt) return prev;
        const now = Date.now();
        const start = new Date(prev.startedAt).getTime();
        const elapsed = Math.max(0, Math.floor((now - start) / 1000));
        return { ...prev, elapsedSeconds: elapsed };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();

      if (meData.isSetupRequired) {
        setIsSetupRequired(true);
        setCurrentUser(null);
        setBabies([]);
        return;
      }

      setIsSetupRequired(false);
      setCurrentUser(meData.user || null);
      const availableBabies = meData.babies || [];
      setBabies(availableBabies);
      setAllUsers(meData.allUsers || []);

      const savedBabyId = typeof window !== 'undefined' ? localStorage.getItem('active_baby_id') : null;
      const found = availableBabies.find((b: any) => b.id === savedBabyId);

      if (found) {
        setActiveBabyIdState(found.id);
      } else if (availableBabies.length > 0) {
        setActiveBabyIdState(availableBabies[0].id);
        localStorage.setItem('active_baby_id', availableBabies[0].id);
      } else {
        setActiveBabyIdState('');
      }
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const activeBaby = babies.find((b) => b.id === activeBabyId) || babies[0] || null;

  // Load logs whenever activeBaby changes
  useEffect(() => {
    if (!activeBaby?.id) {
      setLogs([]);
      return;
    }
    const loadLogs = async () => {
      try {
        const res = await fetch(`/api/logs?babyId=${activeBaby.id}`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        }
      } catch (err) {
        console.error('Error loading logs:', err);
      }
    };
    loadLogs();
  }, [activeBaby?.id]);

  const setActiveBabyId = (id: string) => {
    setActiveBabyIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('active_baby_id', id);
    }
  };

  const createAdmin = async (name: string, username: string, password: string) => {
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'שגיאה ביצירת מנהל' };
      }
      await refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/quick-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        await refreshData();
      }
    } catch (err) {
      console.error('Error switching user:', err);
    }
  };

  const createBaby = async (data: Partial<Baby>) => {
    try {
      const res = await fetch('/api/babies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        await refreshData();
        if (result.baby?.id) {
          setActiveBabyId(result.baby.id);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error creating baby:', err);
      return false;
    }
  };

  const deleteBaby = async (id: string) => {
    try {
      const res = await fetch(`/api/babies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting baby:', err);
      return false;
    }
  };

  const addLog = async (logData: {
    type: string;
    start_time?: string;
    end_time?: string;
    details: any;
    notes?: string;
  }) => {
    if (!activeBaby) return false;
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logData,
          baby_id: activeBaby.id,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setLogs((prev) => [result.log, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding log:', err);
      return false;
    }
  };

  const updateLog = async (id: string, updates: Partial<LogEntry>) => {
    try {
      const res = await fetch(`/api/logs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const result = await res.json();
        setLogs((prev) => prev.map((l) => (l.id === id ? result.log : l)));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating log:', err);
      return false;
    }
  };

  const deleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting log:', err);
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'שגיאה בהתחברות' };
      }
      await refreshData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'שגיאת רשת' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setBabies([]);
      setLogs([]);
      window.location.reload();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const startNursingTimer = (side: 'left' | 'right') => {
    setNursingTimer((prev) => ({
      ...prev,
      isRunning: true,
      activeSide: side,
    }));
  };

  const pauseNursingTimer = () => {
    setNursingTimer((prev) => ({
      ...prev,
      isRunning: false,
    }));
  };

  const resetNursingTimer = () => {
    setNursingTimer({
      isRunning: false,
      activeSide: null,
      leftSeconds: 0,
      rightSeconds: 0,
    });
  };

  const finishNursingTimer = async (notes?: string) => {
    if (!activeBaby || (nursingTimer.leftSeconds === 0 && nursingTimer.rightSeconds === 0)) {
      resetNursingTimer();
      return;
    }
    const totalSec = nursingTimer.leftSeconds + nursingTimer.rightSeconds;
    const side =
      nursingTimer.leftSeconds > 0 && nursingTimer.rightSeconds > 0
        ? 'both'
        : nursingTimer.leftSeconds > 0
        ? 'left'
        : 'right';

    await addLog({
      type: 'nursing',
      start_time: new Date(Date.now() - totalSec * 1000).toISOString(),
      end_time: new Date().toISOString(),
      details: {
        side,
        leftDurationSec: nursingTimer.leftSeconds,
        rightDurationSec: nursingTimer.rightSeconds,
        totalDurationSec: totalSec,
      },
      notes: notes || undefined,
    });
    resetNursingTimer();
  };

  const startSleepTimer = () => {
    setSleepTimer({
      isRunning: true,
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
    });
  };

  const stopSleepTimer = async (notes?: string) => {
    if (!activeBaby || !sleepTimer.startedAt) {
      setSleepTimer({ isRunning: false, elapsedSeconds: 0 });
      return;
    }
    const startTime = sleepTimer.startedAt;
    const endTime = new Date().toISOString();
    const durationMinutes = Math.max(1, Math.round(sleepTimer.elapsedSeconds / 60));

    await addLog({
      type: 'sleep',
      start_time: startTime,
      end_time: endTime,
      details: {
        durationMinutes,
        quality: 'good',
      },
      notes: notes || undefined,
    });

    setSleepTimer({ isRunning: false, elapsedSeconds: 0 });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        babies,
        activeBaby,
        logs,
        isLoading,
        isSetupRequired,
        nursingTimer,
        sleepTimer,
        setActiveBabyId,
        refreshData,
        createAdmin,
        switchUser,
        createBaby,
        deleteBaby,
        addLog,
        updateLog,
        deleteLog,
        login,
        logout,
        startNursingTimer,
        pauseNursingTimer,
        resetNursingTimer,
        finishNursingTimer,
        startSleepTimer,
        stopSleepTimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
