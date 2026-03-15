'use client';

import { useState, useCallback, useEffect } from 'react';

export interface ModuleProgress {
  slug: string;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  lastPlayedAt: string;
}

interface ProgressData {
  modules: Record<string, ModuleProgress>;
  totalScore: number;
  totalAttempts: number;
}

const STORAGE_KEY = 'kerala-decade-quest-progress';

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return { modules: {}, totalScore: 0, totalAttempts: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { modules: {}, totalScore: 0, totalAttempts: 0 };
    return JSON.parse(raw);
  } catch {
    return { modules: {}, totalScore: 0, totalAttempts: 0 };
  }
}

function saveProgress(data: ProgressData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* storage full or unavailable */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>({ modules: {}, totalScore: 0, totalAttempts: 0 });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const saveModuleScore = useCallback((slug: string, score: number, totalQuestions: number) => {
    setProgress((prev) => {
      const existing = prev.modules[slug];
      const isNewBest = !existing || score > existing.bestScore;
      const updated: ProgressData = {
        ...prev,
        modules: {
          ...prev.modules,
          [slug]: {
            slug,
            bestScore: isNewBest ? score : existing.bestScore,
            totalQuestions,
            attempts: (existing?.attempts || 0) + 1,
            lastPlayedAt: new Date().toISOString(),
          },
        },
        totalAttempts: prev.totalAttempts + 1,
      };
      // Recalculate total best score
      updated.totalScore = Object.values(updated.modules).reduce((sum, m) => sum + m.bestScore, 0);
      saveProgress(updated);
      return updated;
    });
  }, []);

  const getModuleProgress = useCallback((slug: string): ModuleProgress | undefined => {
    return progress.modules[slug];
  }, [progress]);

  const resetProgress = useCallback(() => {
    const empty: ProgressData = { modules: {}, totalScore: 0, totalAttempts: 0 };
    saveProgress(empty);
    setProgress(empty);
  }, []);

  return {
    progress,
    saveModuleScore,
    getModuleProgress,
    resetProgress,
    completedCount: Object.keys(progress.modules).length,
  };
}
