'use client';

import { useCallback, useRef, useState } from 'react';

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) => {
    if (muted) return;
    try {
      const ctx = getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch { /* audio not supported */ }
  }, [muted, getContext]);

  const playCorrect = useCallback(() => {
    playTone(523.25, 0.15, 'sine', 0.12); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.12), 100); // E5
    setTimeout(() => playTone(783.99, 0.25, 'sine', 0.1), 200); // G5
  }, [playTone]);

  const playIncorrect = useCallback(() => {
    playTone(311.13, 0.2, 'triangle', 0.1); // Eb4
    setTimeout(() => playTone(277.18, 0.3, 'triangle', 0.08), 150); // Db4
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.06);
  }, [playTone]);

  const playStreak = useCallback(() => {
    playTone(587.33, 0.1, 'sine', 0.1); // D5
    setTimeout(() => playTone(698.46, 0.1, 'sine', 0.1), 80); // F5
    setTimeout(() => playTone(880, 0.15, 'sine', 0.12), 160); // A5
    setTimeout(() => playTone(1046.5, 0.25, 'sine', 0.1), 250); // C6
  }, [playTone]);

  const playComplete = useCallback(() => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.1), i * 120);
    });
  }, [playTone]);

  return { playCorrect, playIncorrect, playClick, playStreak, playComplete, muted, setMuted };
}
