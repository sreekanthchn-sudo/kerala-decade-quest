'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, RotateCcw, Share2, ChevronRight, Trophy,
  Sparkles, Timer, Volume2, VolumeX, Sun, Moon, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@/components/Particles';
import Confetti from '@/components/Confetti';
import MinistryBackground from '@/components/MinistryBackground';
import ScoreCard from '@/components/ScoreCard';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/hooks/useSound';
import { useTheme } from '@/hooks/useTheme';
import modulesData from '@/data/decade_records.json';
import type { Module, Question } from '@/types';

const modules = modulesData as Module[];
const TIMER_SECONDS = 30;

/** Fisher-Yates shuffle — returns a new array */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizClient({ slug }: { slug: string }) {
  const modIndex = modules.findIndex((m) => m.slug === slug);
  const mod = modules[modIndex];
  const nextMod = modules[modIndex + 1] || modules[0];

  // Shuffle questions once on mount
  const [shuffledQuestions] = useState<Question[]>(() =>
    mod ? shuffleArray(mod.questions) : []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lang, setLang] = useState<'en' | 'ml'>('ml');
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { saveModuleScore } = useProgress();
  const { playCorrect, playIncorrect, playClick, playStreak: playStreakSound, playComplete, muted, setMuted } = useSound();
  const { theme, toggleTheme, isDark } = useTheme();

  const question = shuffledQuestions[currentIndex];
  const isCorrect = selectedOption === question?.answer;
  const isMl = lang === 'ml';

  // Get text in current language with fallback
  const q = useMemo(() => {
    if (!question) return { text: '', options: [] as string[], flexFact: '' };
    return {
      text: (isMl && question.question_ml) ? question.question_ml : question.question,
      options: (isMl && question.options_ml?.length) ? question.options_ml : question.options,
      flexFact: (isMl && question.flex_fact_ml) ? question.flex_fact_ml : question.flex_fact,
    };
  }, [question, isMl]);

  // Timer logic
  useEffect(() => {
    if (!timerEnabled || selectedOption !== null || finished) return;
    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time's up — auto-select wrong
          clearInterval(timerRef.current!);
          setSelectedOption(-1); // -1 means timed out
          setShowResult(true);
          setStreak(0);
          playIncorrect();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, timerEnabled, selectedOption, finished, playIncorrect]);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleSelect = useCallback(
    (idx: number) => {
      if (selectedOption !== null || !question) return;
      if (timerRef.current) clearInterval(timerRef.current);
      setSelectedOption(idx);
      setShowResult(true);
      playClick();

      if (idx === question.answer) {
        setScore((s) => s + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          if (newStreak >= 3) {
            setShowStreak(true);
            playStreakSound();
            triggerHaptic([50, 30, 50, 30, 100]);
            setTimeout(() => setShowStreak(false), 2500);
          } else {
            triggerHaptic(30);
          }
          return newStreak;
        });
        playCorrect();
      } else {
        setStreak(0);
        playIncorrect();
        triggerHaptic([100, 50, 100]);
      }
    },
    [selectedOption, question, playClick, playCorrect, playIncorrect, playStreakSound, triggerHaptic]
  );

  const handleNext = useCallback(() => {
    if (!mod) return;
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setFinished(true);
      saveModuleScore(slug, score + (isCorrect ? 0 : 0), shuffledQuestions.length);
      playComplete();
    }
  }, [currentIndex, mod, shuffledQuestions.length, slug, score, isCorrect, saveModuleScore, playComplete]);

  // Save score when finished
  useEffect(() => {
    if (finished && mod) {
      saveModuleScore(slug, score, shuffledQuestions.length);
    }
  }, [finished, slug, score, shuffledQuestions.length, mod, saveModuleScore]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    setStreak(0);
    setTimeLeft(TIMER_SECONDS);
  }, []);

  const shareText = useMemo(() => {
    if (!mod) return '';
    const pct = Math.round((score / shuffledQuestions.length) * 100);
    if (isMl) {
      return `ഞാൻ ${mod.title_ml} ക്വിസിൽ ${score}/${shuffledQuestions.length} (${pct}%) നേടി! 🌴\n\nനവകേരള ക്വിസ് — നിങ്ങളും പരീക്ഷിക്കൂ: `;
    }
    return `I scored ${score}/${shuffledQuestions.length} (${pct}%) on ${mod.title} in Navakerala Quiz! 🌴\n\nTest your knowledge: `;
  }, [mod, score, shuffledQuestions.length, isMl]);

  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const text = shareText + url;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'നവകേരള ക്വിസ്', text });
      } catch { /* user cancelled */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  }, [shareText]);

  if (!mod) {
    return (
      <main className="min-h-screen bg-kerala-quiz flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--kl-text)' }}>Module Not Found</h1>
          <Link href="/" className="underline" style={{ color: 'var(--kl-green-light)' }}>Back to Home</Link>
        </div>
      </main>
    );
  }

  // ─── Results Screen ───
  if (finished) {
    const pct = Math.round((score / shuffledQuestions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '📚';
    const showConfetti = pct >= 80;

    return (
      <main className="min-h-screen relative overflow-hidden">
        <MinistryBackground slug={slug} color={mod.color} />
        <div className="leaf-pattern" />
        <Particles />
        {showConfetti && <Confetti count={50} />}

        <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            {/* Score circle with glow */}
            <div className="flex justify-center">
              <div className="score-ring relative">
                <div
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center"
                  style={{
                    background: `conic-gradient(${mod.color} ${pct}%, rgba(255,255,255,0.03) 0%)`,
                    boxShadow: `0 0 50px ${mod.color}25`,
                  }}
                >
                  <div
                    className="w-[7rem] h-[7rem] rounded-full flex flex-col items-center justify-center glass-card"
                    style={{ border: 'none' }}
                  >
                    <span className="text-3xl font-black gradient-text">{score}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--kl-text-dim)' }}>/ {shuffledQuestions.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-4xl">{emoji}</div>

            <h2 className="text-lg font-bold" style={{ color: 'var(--kl-text)' }}>
              {isMl ? mod.title_ml : mod.title}
            </h2>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--kl-text-dim)' }}>
              {pct >= 80
                ? (isMl ? 'മികച്ചത്! കേരളത്തിന്റെ വികസന കഥ നിങ്ങൾക്ക് നന്നായി അറിയാം.' : "Outstanding! You know Kerala's story well.")
                : pct >= 60
                ? (isMl ? 'നല്ല ശ്രമം! കേരളത്തിന് കൂടുതൽ കഥകൾ പറയാനുണ്ട്.' : "Good effort! Kerala has more stories to tell.")
                : (isMl ? 'പര്യവേക്ഷണം തുടരൂ — കണ്ടെത്താൻ ഏറെയുണ്ട്!' : "Keep exploring — there's so much to discover!")}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleShare}
                className="glow-btn flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, var(--kl-green), var(--kl-teal))' }}
              >
                <Share2 className="w-4 h-4" />
                {isMl ? 'സ്കോർ ഷെയർ ചെയ്യുക' : 'Share Score'}
              </button>

              <button
                onClick={() => setShowScoreCard(true)}
                className="glow-btn flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-white"
                style={{ background: `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)` }}
              >
                <Trophy className="w-4 h-4" />
                {isMl ? 'സര്‍ട്ടിഫിക്കറ്റ് ഡൗണ്‍ലോഡ്' : 'Download Certificate'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm glass-card transition-all active:scale-[0.97]"
                  style={{ color: 'var(--kl-text)' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  {isMl ? 'വീണ്ടും' : 'Retry'}
                </button>
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm glass-card transition-all active:scale-[0.97]"
                  style={{ color: 'var(--kl-text)' }}
                >
                  {isMl ? 'എല്ലാ മന്ത്രാലയങ്ങളും' : 'All Ministries'}
                </Link>
              </div>
            </div>

            {/* Next ministry suggestion */}
            <div className="pt-5">
              <p className="text-xs mb-2 flex items-center justify-center gap-1" style={{ color: 'var(--kl-text-dim)' }}>
                <Sparkles className="w-3 h-3" style={{ color: 'var(--kl-gold)' }} />
                {isMl ? 'അടുത്തത്' : 'Up next'}
              </p>
              <Link href={`/quiz/${nextMod.slug}`}>
                <div className="ministry-card glass-card gradient-border flex items-center gap-3 p-4 rounded-2xl active:scale-[0.98] transition-transform">
                  <div className="shrink-0 w-1.5 h-10 rounded-full" style={{ background: `linear-gradient(180deg, ${nextMod.color}, transparent)` }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--kl-text)' }}>
                      {isMl ? nextMod.title_ml : nextMod.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--kl-text-dim)' }}>
                      {isMl ? nextMod.title : nextMod.title_ml}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" style={{ color: 'var(--kl-text-dim)' }} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        {showScoreCard && (
          <ScoreCard
            mod={mod}
            score={score}
            total={shuffledQuestions.length}
            questions={shuffledQuestions}
            lang={lang}
            onClose={() => setShowScoreCard(false)}
          />
        )}
      </main>
    );
  }

  // ─── Quiz Screen ───
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const timedOut = selectedOption === -1;

  return (
    <main className="h-[100dvh] relative overflow-hidden flex flex-col">
      <MinistryBackground slug={slug} color={mod.color} />
      <div className="leaf-pattern" />

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pt-3 pb-0">
        {/* Compact top bar — back + score + controls */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1 active:opacity-70 transition-opacity"
            style={{ color: 'var(--kl-text-dim)' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Center: ministry name + progress */}
          <div className="flex-1 mx-3 min-w-0">
            <p className="text-xs font-semibold truncate text-center" style={{ color: 'var(--kl-text)' }}>
              {isMl ? mod.title_ml : mod.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full progress-gradient"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-bold shrink-0" style={{ color: mod.color }}>
                {currentIndex + 1}/{shuffledQuestions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Score pill */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full glass-card">
              <Trophy className="w-3 h-3" style={{ color: 'var(--kl-green-light)' }} />
              <span className="text-xs font-black gradient-text-green">{score}</span>
            </div>
            {/* Timer */}
            {timerEnabled && selectedOption === null && (
              <div className="relative w-8 h-8 shrink-0">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="var(--kl-glass-border)" strokeWidth="2" />
                  <circle
                    cx="20" cy="20" r="18" fill="none"
                    stroke={timeLeft <= 10 ? '#ef4444' : timeLeft <= 20 ? 'var(--kl-gold)' : 'var(--kl-green-light)'}
                    strokeWidth="2" strokeDasharray="113"
                    strokeDashoffset={113 - (timeLeft / TIMER_SECONDS) * 113}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ color: timeLeft <= 10 ? '#ef4444' : 'var(--kl-text)' }}>{timeLeft}</span>
              </div>
            )}
            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="glass-card px-2 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95"
              style={{ color: 'var(--kl-gold)' }}
            >
              {isMl ? 'EN' : 'ML'}
            </button>
          </div>
        </div>

        {/* Streak indicator — floating */}
        <AnimatePresence>
          {showStreak && streak >= 3 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,150,0,0.2), rgba(255,80,0,0.15))',
                border: '1px solid rgba(255,150,0,0.3)',
              }}
            >
              <Flame className="w-3.5 h-3.5" style={{ color: '#ff9600' }} />
              <span className="text-xs font-bold" style={{ color: '#ff9600' }}>
                {streak} {isMl ? 'തുടർച്ച!' : 'streak!'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question + Options — fills remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              {/* Question text — large, accessible font */}
              <h3
                className="text-lg font-semibold leading-relaxed mb-4 shrink-0"
                style={{ color: 'var(--kl-text-bright)' }}
              >
                {q.text}
              </h3>

              {/* Options */}
              <div className="space-y-2 flex-1">
                {q.options.map((option, idx) => {
                  const isAnswer = idx === question!.answer;
                  const isSelected = idx === selectedOption;
                  const answered = selectedOption !== null;
                  // After answering: hide options that are neither selected nor correct
                  const shouldCollapse = answered && !isAnswer && !isSelected;

                  let bg = 'var(--kl-card)';
                  let borderColor = 'var(--kl-glass-border)';
                  let textColor = 'var(--kl-text)';
                  let letterBg = 'var(--kl-text-dim)';
                  let shadow = 'none';
                  let icon = '';

                  if (answered) {
                    if (isAnswer) {
                      bg = 'rgba(0, 232, 138, 0.12)';
                      borderColor = 'rgba(0, 232, 138, 0.35)';
                      textColor = isDark ? '#00e88a' : '#007a52';
                      letterBg = textColor;
                      shadow = '0 0 20px rgba(0, 232, 138, 0.1)';
                      icon = '✓';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.1)';
                      borderColor = 'rgba(239, 68, 68, 0.3)';
                      textColor = '#ef4444';
                      letterBg = '#ef4444';
                      icon = '✗';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      layout
                      animate={shouldCollapse
                        ? { opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }
                        : { opacity: 1, height: 'auto' }
                      }
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className="w-full text-left px-4 py-3.5 rounded-xl text-base transition-all"
                      style={{
                        background: bg,
                        border: `1px solid ${borderColor}`,
                        color: textColor,
                        boxShadow: shadow,
                        backdropFilter: 'blur(8px)',
                        fontSize: '1rem',
                      }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold mr-2.5 align-middle"
                        style={{ background: `${letterBg}15`, color: letterBg }}
                      >
                        {icon || optionLetters[idx]}
                      </span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Timed out message */}
              {timedOut && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm mt-2 font-medium"
                  style={{ color: '#ef4444' }}
                >
                  {isMl ? 'സമയം കഴിഞ്ഞു!' : 'Time\'s up!'}
                </motion.p>
              )}

              {/* Inline compact feedback — replaces CompareOMeter */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-3 p-3 rounded-xl shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--kl-green-light)' }}>
                    {q.flexFact}
                  </p>
                  <p className="text-[10px] mt-1.5" style={{ color: 'var(--kl-text-dim)', opacity: 0.5 }}>
                    {question!.source}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed bottom "Next" button — always visible after answering */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="relative z-20 shrink-0 px-4 pb-4 pt-2 max-w-lg mx-auto w-full"
            style={{ background: 'linear-gradient(to top, var(--kl-bg) 60%, transparent)' }}
          >
            <button
              onClick={handleNext}
              className="w-full glow-btn flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-base text-white active:scale-[0.98] transition-transform"
              style={{
                background: `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)`,
                minHeight: '56px',
              }}
            >
              {currentIndex < shuffledQuestions.length - 1
                ? <>{isMl ? 'അടുത്ത ചോദ്യം' : 'Next Question'} <ArrowRight className="w-5 h-5" /></>
                : <>{isMl ? 'ഫലം കാണുക' : 'See Results'} <ArrowRight className="w-5 h-5" /></>
              }
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
