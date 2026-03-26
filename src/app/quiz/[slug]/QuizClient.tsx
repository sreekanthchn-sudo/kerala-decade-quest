'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, RotateCcw, Share2, ChevronRight, Trophy,
  Sparkles, Timer, Volume2, VolumeX, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from '@/components/Particles';
import Confetti from '@/components/Confetti';
import MinistryBackground from '@/components/MinistryBackground';
import ScoreCard from '@/components/ScoreCard';
import ScoreGauge from '@/components/ScoreGauge';
import { useProgress } from '@/hooks/useProgress';
import { useSound } from '@/hooks/useSound';
import modulesData from '@/data/decade_records.json';
import { sanitizeDeepMalayalam } from '@/utils/malayalamText';
import type { Module, Question } from '@/types';
import { QUIZ_QUESTIONS_PER_ROUND } from '@/constants/quiz';

const modules = sanitizeDeepMalayalam(modulesData as Module[]);
const TIMER_SECONDS = 30;

function localizedText(en: string | undefined, ml: string | undefined, isMl: boolean): string {
  const e = (en || '').trim();
  const m = (ml || '').trim();
  if (isMl) return m || e;
  return e || m;
}

function scoreTierLine(score: number, total: number, isMl: boolean): string {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct >= 85) return isMl ? 'കേരള വികസന ദർശകൻ' : 'Kerala Development Visionary';
  if (pct >= 65) return isMl ? 'KNOW-KERALAM നയ വിദഗ്ദ്ധൻ' : 'KNOW-KERALAM Policy Expert';
  if (pct >= 45) return isMl ? 'വികസന താൽപര്യക്കാരൻ' : 'Development Enthusiast';
  return isMl ? 'ജിജ്ഞാസു പര്യവേക്ഷകൻ' : 'Curious Explorer';
}

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
  const SITE_URL = 'https://www.knowkeralam.com';
  const modIndex = modules.findIndex((m) => m.slug === slug);
  const mod = modules[modIndex];
  const nextMod = modules[modIndex + 1] || modules[0];

  // Shuffle questions once on mount
  const [shuffledQuestions] = useState<Question[]>(() =>
    mod ? shuffleArray(mod.questions).slice(0, QUIZ_QUESTIONS_PER_ROUND) : []
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
  const question = shuffledQuestions[currentIndex];
  const isCorrect = selectedOption === question?.answer;
  const isMl = lang === 'ml';

  // Get text in current language with fallback
  const q = useMemo(() => {
    if (!question) return { text: '', options: [] as string[], flexFact: '' };
    return {
      text: localizedText(question.question, question.question_ml, isMl),
      options: question.options.map((enOpt, idx) =>
        localizedText(enOpt, question.options_ml?.[idx], isMl)
      ),
      flexFact: localizedText(question.flex_fact, question.flex_fact_ml, isMl),
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
      return `ഞാൻ ${mod.title_ml} ക്വിസിൽ ${score}/${shuffledQuestions.length} (${pct}%) നേടി! 🌴\n\nKNOW-KERALAM - നിങ്ങളും പരീക്ഷിക്കൂ: `;
    }
    return `I scored ${score}/${shuffledQuestions.length} (${pct}%) on ${mod.title} on KNOW-KERALAM! 🌴\n\nTest your knowledge: `;
  }, [mod, score, shuffledQuestions.length, isMl]);

  const handleShare = useCallback(async () => {
    const url = new URL(`/quiz/${slug}`, SITE_URL).toString();
    const text = shareText + url;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'KNOW-KERALAM · knowkeralam.com', text });
      } catch { /* user cancelled */ }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  }, [shareText, slug]);

  if (!mod) {
    return (
      <main className="min-h-screen quiz-game-shell bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-xl font-black text-[#facc15]">Module Not Found</h1>
          <Link href="/" className="inline-block font-bold text-white underline decoration-[#facc15] underline-offset-4">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // ─── Results Screen ───
  if (finished) {
    const pct = Math.round((score / shuffledQuestions.length) * 100);
    const showConfetti = pct >= 80;

    return (
      <main className="min-h-screen relative overflow-hidden quiz-game-shell">
        <MinistryBackground slug={slug} color={mod.color} />
        <div className="leaf-pattern" />
        <div className="quiz-game-scrim fixed inset-0 z-[1] pointer-events-none" aria-hidden />
        <Particles />
        {showConfetti && <Confetti count={50} />}

        <div className="relative z-10 mx-auto max-w-lg px-4 py-4 sm:py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3 text-center sm:space-y-4"
          >
            <p
              className={
                isMl
                  ? 'text-[11px] font-black text-[#ffcc00] sm:text-[12px]'
                  : 'text-[9px] font-black uppercase tracking-[0.38em] text-[#ffcc00] sm:text-[10px]'
              }
            >
              {isMl ? 'ക്വിസ് പൂർത്തിയായി' : 'Quiz complete'}
            </p>

            <ScoreGauge
              score={score}
              total={shuffledQuestions.length}
              percentage={pct}
              tierLabel={scoreTierLine(score, shuffledQuestions.length, isMl)}
              isMl={isMl}
              compact
            />

            <div className="border-y border-[#facc15]/20 py-2 sm:py-3">
              <h2 className="text-balance text-lg font-black leading-tight text-white sm:text-xl md:text-[1.35rem]">
                {localizedText(mod.title, mod.title_ml, isMl)}
              </h2>
              <p className="mx-auto mt-1 max-w-md text-pretty text-[0.8125rem] leading-snug text-white/80 sm:text-[0.9rem]">
                {pct >= 80
                  ? (isMl
                      ? 'മികച്ചത്! കേരളത്തിന്റെ വികസന കഥ നിങ്ങൾക്ക് നന്നായി അറിയാം.'
                      : "Outstanding! You know Kerala's story well.")
                  : pct >= 60
                    ? (isMl
                        ? 'നല്ല ശ്രമം! കേരളത്തിന് കൂടുതൽ കഥകൾ പറയാനുണ്ട്.'
                        : 'Good effort! Kerala has more stories to tell.')
                    : (isMl
                        ? 'പര്യവേക്ഷണം തുടരൂ - കണ്ടെത്താൻ ഏറെയുണ്ട്!'
                        : "Keep exploring - there's so much to discover!")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-1 sm:gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="quiz-game-next-btn flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-xs sm:min-h-12 sm:py-3 sm:text-sm"
              >
                <Share2 className="w-4 h-4" />
                {isMl ? 'സ്കോർ ഷെയർ ചെയ്യുക' : 'Share Score'}
              </button>

              <button
                type="button"
                onClick={() => setShowScoreCard(true)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border-[3px] border-black bg-white px-4 py-2.5 text-xs font-bold text-[#0a0a0a] shadow-[4px_4px_0_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] sm:min-h-12 sm:py-3 sm:text-sm"
              >
                <Trophy className="w-4 h-4" />
                {isMl ? 'സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ്' : 'Download Certificate'}
              </button>

              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-[#facc15] bg-black/40 px-2 py-2 text-[11px] font-black text-[#facc15] transition-transform active:scale-[0.98] sm:min-h-11 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-xs"
                >
                  <RotateCcw className="h-4 w-4 shrink-0" />
                  {isMl ? 'വീണ്ടും' : 'Retry'}
                </button>
                <Link
                  href="/"
                  className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-white/25 bg-white/5 px-2 py-2 text-[11px] font-bold text-white transition-transform active:scale-[0.98] sm:min-h-11 sm:px-3 sm:py-2.5 sm:text-xs"
                >
                  {isMl ? 'എല്ലാ മന്ത്രാലയങ്ങളും' : 'All Ministries'}
                </Link>
              </div>
              <p className="pt-0.5 text-center text-[10px] font-semibold tracking-wide text-white/40 sm:text-[11px]">
                knowkeralam.com
              </p>
            </div>

            {/* Next ministry suggestion */}
            <div className="pt-3 sm:pt-4">
              <p className="mb-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-[#facc15]/90 sm:mb-2 sm:text-xs">
                <Sparkles className="w-3 h-3" />
                {isMl ? 'അടുത്തത്' : 'Up next'}
              </p>
              <Link href={`/quiz/${nextMod.slug}`}>
                <div className="flex items-center gap-2 rounded-2xl border-[3px] border-black bg-[#facc15] p-3 text-[#0a0a0a] shadow-[4px_4px_0_0_#000] transition-transform active:scale-[0.99] sm:gap-3 sm:p-3.5">
                  <div className="h-9 w-1.5 shrink-0 rounded-full bg-black/30 sm:h-10" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate">
                      {isMl ? nextMod.title_ml : nextMod.title}
                    </p>
                    <p className="text-xs truncate opacity-80">
                      {isMl ? nextMod.title : nextMod.title_ml}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" />
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
    <main className="h-[100dvh] relative overflow-hidden flex flex-col quiz-game-shell">
      <MinistryBackground slug={slug} color={mod.color} />
      <div className="leaf-pattern" />
      <div className="quiz-game-scrim fixed inset-0 z-[1] pointer-events-none" aria-hidden />

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 pt-3 pb-0">
        {/* Compact top bar — back + score + controls */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1 p-1.5 rounded-lg text-white/80 hover:text-[#facc15] active:opacity-80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          {/* Center: ministry name + progress */}
          <div className="flex-1 mx-3 min-w-0">
            <p className="text-[11px] font-black truncate text-center text-white tracking-wide">
              {isMl ? mod.title_ml : mod.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-2 rounded-full overflow-hidden border border-black/20 bg-black/50">
                <motion.div
                  className="h-full rounded-full quiz-game-progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[10px] font-black shrink-0 tabular-nums text-[#facc15]">
                {currentIndex + 1}/{shuffledQuestions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Score pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#facc15] border-2 border-black shadow-[2px_2px_0_0_#000]">
              <Trophy className="w-3.5 h-3.5 text-black" />
              <span className="text-xs font-black text-black tabular-nums">{score}</span>
            </div>
            {/* Timer */}
            {timerEnabled && selectedOption === null && (
              <div className="relative w-8 h-8 shrink-0">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  <circle
                    cx="20" cy="20" r="18" fill="none"
                    stroke={timeLeft <= 10 ? '#ef4444' : '#facc15'}
                    strokeWidth="2" strokeDasharray="113"
                    strokeDashoffset={113 - (timeLeft / TIMER_SECONDS) * 113}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}</span>
              </div>
            )}
            {/* Lang toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="px-2.5 py-1 rounded-full text-[10px] font-black border-2 border-[#facc15] text-[#facc15] bg-black/40 active:scale-95 transition-transform"
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
              className="absolute top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-black bg-[#facc15] text-black shadow-[3px_3px_0_0_rgba(0,0,0,0.9)]"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-black">
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
              {/* Question text — high-contrast on dark scrim */}
              <h3 className="text-lg font-bold leading-relaxed mb-4 shrink-0 text-white drop-shadow-sm">
                {q.text}
              </h3>

              {/* Options — 2×2 grid on wider screens, game-style pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 content-start">
                {q.options.map((option, idx) => {
                  const isAnswer = idx === question!.answer;
                  const isSelected = idx === selectedOption;
                  const answered = selectedOption !== null;
                  const shouldCollapse = answered && !isAnswer && !isSelected;

                  let stateClass = 'quiz-game-option--idle';
                  if (answered) {
                    if (isAnswer) stateClass = 'quiz-game-option--correct';
                    else if (isSelected) stateClass = 'quiz-game-option--wrong';
                  }

                  const icon = answered && isAnswer ? '✓' : answered && isSelected && !isAnswer ? '✗' : '';

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
                      className={`quiz-game-option w-full text-left px-4 py-3.5 text-[0.95rem] leading-snug ${stateClass}`}
                    >
                      <span
                        className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1 rounded-md text-xs font-black mr-2 align-middle ${
                          answered && isAnswer
                            ? 'bg-[#14532d] text-[#4ade80]'
                            : answered && isSelected && !isAnswer
                              ? 'bg-red-950 text-red-200'
                              : 'bg-black/20 text-black'
                        }`}
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
                  className="text-center text-sm mt-2 font-black text-red-400"
                >
                  {isMl ? 'സമയം കഴിഞ്ഞു!' : 'Time\'s up!'}
                </motion.p>
              )}

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="mt-3 p-3 shrink-0 quiz-game-fact-card"
                >
                  <p className="text-sm font-medium leading-relaxed text-[#86efac]">
                    {q.flexFact}
                  </p>
                  <p className="text-[10px] mt-1.5 text-white/40">
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
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 55%, transparent)' }}
          >
            <button
              type="button"
              onClick={handleNext}
              className="quiz-game-next-btn w-full flex items-center justify-center gap-2 px-5 py-4 text-base min-h-14"
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
