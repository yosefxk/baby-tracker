'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Play, Pause, Square, Check, RefreshCw } from 'lucide-react';

export function ActiveTimers() {
  const {
    activeBaby,
    nursingTimer,
    sleepTimer,
    startNursingTimer,
    pauseNursingTimer,
    finishNursingTimer,
    resetNursingTimer,
    stopSleepTimer,
  } = useApp();

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isNursingActive = nursingTimer.isRunning || nursingTimer.leftSeconds > 0 || nursingTimer.rightSeconds > 0;
  const isSleepActive = sleepTimer.isRunning;

  if (!isNursingActive && !isSleepActive) return null;

  return (
    <div className="space-y-3 mb-6">
      {/* Active Nursing Timer Card */}
      {isNursingActive && (
        <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white rounded-3xl p-4 shadow-lg shadow-pink-500/20 animate-soft-pulse border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
              <h3 className="font-bold text-base">
                הנקה בפעולה • {activeBaby?.name || 'הבייבי'}
              </h3>
            </div>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
              סה״כ: {formatSeconds(nursingTimer.leftSeconds + nursingTimer.rightSeconds)}
            </span>
          </div>

          {/* Left vs Right counters */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Left breast */}
            <div
              className={`rounded-2xl p-3 text-center transition-all ${
                nursingTimer.activeSide === 'left' && nursingTimer.isRunning
                  ? 'bg-white text-pink-600 shadow-md scale-102 font-bold ring-2 ring-white/50'
                  : 'bg-white/15 text-white'
              }`}
            >
              <div className="text-xs font-medium opacity-90 mb-1">צד שמאל</div>
              <div className="text-2xl font-black font-mono tracking-wider">
                {formatSeconds(nursingTimer.leftSeconds)}
              </div>
              <button
                onClick={() => {
                  if (nursingTimer.activeSide === 'left' && nursingTimer.isRunning) {
                    pauseNursingTimer();
                  } else {
                    startNursingTimer('left');
                  }
                }}
                className={`mt-2 w-full py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  nursingTimer.activeSide === 'left' && nursingTimer.isRunning
                    ? 'bg-pink-600 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {nursingTimer.activeSide === 'left' && nursingTimer.isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> השהה
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> התחל שמאל
                  </>
                )}
              </button>
            </div>

            {/* Right breast */}
            <div
              className={`rounded-2xl p-3 text-center transition-all ${
                nursingTimer.activeSide === 'right' && nursingTimer.isRunning
                  ? 'bg-white text-pink-600 shadow-md scale-102 font-bold ring-2 ring-white/50'
                  : 'bg-white/15 text-white'
              }`}
            >
              <div className="text-xs font-medium opacity-90 mb-1">צד ימין</div>
              <div className="text-2xl font-black font-mono tracking-wider">
                {formatSeconds(nursingTimer.rightSeconds)}
              </div>
              <button
                onClick={() => {
                  if (nursingTimer.activeSide === 'right' && nursingTimer.isRunning) {
                    pauseNursingTimer();
                  } else {
                    startNursingTimer('right');
                  }
                }}
                className={`mt-2 w-full py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  nursingTimer.activeSide === 'right' && nursingTimer.isRunning
                    ? 'bg-pink-600 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {nursingTimer.activeSide === 'right' && nursingTimer.isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> השהה
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> התחל ימין
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Finish & Reset buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => finishNursingTimer()}
              className="flex-1 bg-white hover:bg-pink-50 text-pink-600 font-bold py-2.5 rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" /> סיום ושמירה ביומן
            </button>
            <button
              onClick={resetNursingTimer}
              className="bg-white/20 hover:bg-white/30 text-white font-medium p-2.5 rounded-2xl transition-all cursor-pointer"
              title="איפוס טיימר"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Sleep Timer Card */}
      {isSleepActive && (
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white rounded-3xl p-4 shadow-lg shadow-indigo-500/20 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <Moon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm">
                  {activeBaby?.name || 'הבייבי'} ישנ/ה עכשיו...
                </h4>
                <div className="text-2xl font-black font-mono tracking-wider mt-0.5">
                  {formatSeconds(sleepTimer.elapsedSeconds)}
                </div>
              </div>
            </div>

            <button
              onClick={() => stopSleepTimer()}
              className="bg-white hover:bg-indigo-50 text-indigo-700 font-bold px-4 py-2.5 rounded-2xl shadow-sm text-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>התעורר/ה</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
