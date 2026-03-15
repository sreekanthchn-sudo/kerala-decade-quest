'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Share2, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CompareOMeter from '@/components/CompareOMeter';
import Particles from '@/components/Particles';
import Confetti from '@/components/Confetti';
import modulesData from '@/data/decade_records.json';
import type { Module } from '@/types';

const modules = modulesData as Module[];

export default function QuizClient({ slug }: { slug: string }) {
  const modIndex = modules.findIndex((m) => m.slug === slug);
  const mod = modules[modIndex];
  const nextMod = modules[modIndex + 1] || modules[0];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lang, setLang] = useState<'en' | 'ml'>('en');

  const question = mod?.questions[currentIndex];
  const isCorrect = selectedOption === question?.answer;
  const isMl = lang === 'ml';

  const q = useMemo(() => {
    if (!question) return { text: '', options: [] as string[], flexFact: '' };
    return {
      text: (isMl && question.question_ml) ? question.question_ml : question.question,
      options: (isMl && question.options_ml?.length) ? question.options_ml : question.options,
      flexFact: (isMl && question.flex_fact_ml) ? question.flex_fact_ml : question.flex_fact,
    };
  }, [question, isMl]);

  const handleSelect = useCallback(
    (idx: number) => {
      if (selectedOption !== null || !question) return;
      setSelectedOption(idx);
      setShowResult(true);
      if (idx === question.answer) setScore((s) => s + 1);
    },
    [selectedOption, question]
  );

  const handleNext = useCallback(() => {
    if (!mod) return;
    if (currentIndex < mod.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  }, [currentIndex, mod]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  }, []);

  const shareText = useMemo(() => {
    if (!mod) return '';
    const pct = Math.round((score / mod.questions.length) * 100);
    if (isMl) {
      return `ഞാൻ ${mod.title_ml} ക്വിസിൽ ${score}/${mod.questions.length} (${pct}%) നേടി! 🌴\n\nകേരള ദശക ക്വസ്റ്റ് — നിങ്ങളും പരീക്ഷിക്കൂ: `;
    }
    return `I scored ${score}/${mod.questions.length} (${pct}%) on ${mod.title} in Kerala Decade Quest! 🌴\n\nTest your knowledge: `;
  }, [mod, score, isMl]);

  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const text = shareText + url;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Kerala Decade Quest', text });
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
    const pct = Math.round((score / mod.questions.length) * 100);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👏' : '📚';
    const showConfetti = pct >= 80;

    return (
      <main className="min-h-screen bg-kerala-quiz relative">
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
                    <span className="text-xs font-medium" style={{ color: 'var(--kl-text-dim)' }}>/ {mod.questions.length}</span>
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
      </main>
    );
  }

  // ─── Quiz Screen ───
  const progress = ((currentIndex + 1) / mod.questions.length) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <main className="min-h-screen bg-kerala-quiz relative">
      <div className="leaf-pattern" />
      <Particles />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm active:opacity-70 transition-opacity"
            style={{ color: 'var(--kl-text-dim)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {isMl ? 'മടങ്ങുക' : 'Back'}
          </Link>
          <button
            onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
            className="glass-card px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{ color: 'var(--kl-gold)' }}
          >
            {isMl ? 'English' : 'മലയാളം'}
          </button>
        </div>

        {/* Ministry header — glass card with animated border */}
        <div className="glass-card animated-border p-4 rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <div
              className="shrink-0 w-1.5 h-10 rounded-full"
              style={{ background: `linear-gradient(180deg, ${mod.color}, ${mod.color}40)` }}
            />
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--kl-text)' }}>
                {isMl ? mod.title_ml : mod.title}
              </h1>
              <p className="text-xs" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? mod.title : mod.title_ml}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                className="h-full rounded-full progress-gradient"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-bold shrink-0" style={{ color: mod.color }}>
              {currentIndex + 1}/{mod.questions.length}
            </span>
          </div>
        </div>

        {/* Score pill */}
        <div className="flex justify-end mb-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card"
            style={{ boxShadow: `0 0 12px rgba(0, 232, 138, 0.08)` }}
          >
            <Trophy className="w-3 h-3" style={{ color: 'var(--kl-green-light)' }} />
            <span className="text-xs font-black gradient-text-green">{score}</span>
          </div>
        </div>

        {/* Question + Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h3
              className="text-base font-semibold leading-relaxed mb-6"
              style={{ color: 'var(--kl-text-bright)' }}
            >
              {q.text}
            </h3>

            <div className="space-y-2.5">
              {q.options.map((option, idx) => {
                let bg = 'var(--kl-card)';
                let borderColor = 'var(--kl-glass-border)';
                let textColor = 'var(--kl-text)';
                let letterColor = 'var(--kl-text-dim)';
                let extraClass = 'option-btn';
                let shadow = 'none';

                if (selectedOption !== null) {
                  if (idx === question!.answer) {
                    bg = 'rgba(0, 232, 138, 0.1)';
                    borderColor = 'rgba(0, 232, 138, 0.3)';
                    textColor = '#00e88a';
                    letterColor = '#00e88a';
                    extraClass = 'pulse-correct';
                    shadow = '0 0 20px rgba(0, 232, 138, 0.1)';
                  } else if (idx === selectedOption) {
                    bg = 'rgba(239, 68, 68, 0.08)';
                    borderColor = 'rgba(239, 68, 68, 0.25)';
                    textColor = '#ef4444';
                    letterColor = '#ef4444';
                  } else {
                    textColor = 'var(--kl-text-dim)';
                    bg = 'rgba(255,255,255,0.01)';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all ${extraClass}`}
                    style={{
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      color: textColor,
                      boxShadow: shadow,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold mr-2"
                      style={{
                        background: `${letterColor}10`,
                        color: letterColor,
                      }}
                    >
                      {optionLetters[idx]}
                    </span>
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Compare-o-Meter + Next */}
            {showResult && (
              <>
                <CompareOMeter
                  keralaLabel={isMl ? 'കേരളം 2026' : 'Kerala 2026'}
                  keralaStat={question!.kerala_stat_2026}
                  nationalLabel={isMl ? 'ദേശീയ ശരാശരി' : 'National / Benchmark'}
                  nationalStat={question!.national_average}
                  flexFact={q.flexFact}
                  source={question!.source}
                  isCorrect={isCorrect}
                  isMl={isMl}
                />

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleNext}
                  className="mt-5 w-full glow-btn flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold text-sm text-white"
                  style={{
                    background: `linear-gradient(135deg, ${mod.color}, ${mod.color}cc)`,
                  }}
                >
                  {currentIndex < mod.questions.length - 1
                    ? <>{isMl ? 'അടുത്ത ചോദ്യം' : 'Next Question'} <ArrowRight className="w-4 h-4" /></>
                    : <>{isMl ? 'ഫലം കാണുക' : 'See Results'} <ArrowRight className="w-4 h-4" /></>
                  }
                </motion.button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
