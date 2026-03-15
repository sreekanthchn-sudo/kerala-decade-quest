'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Share2, ChevronRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CompareOMeter from '@/components/CompareOMeter';
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

  // Get text in current language with fallback
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
    return (
      <main className="min-h-screen bg-kerala-quiz relative">
        <div className="leaf-pattern" />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5"
          >
            {/* Score circle */}
            <div className="flex justify-center">
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: `conic-gradient(${mod.color} ${pct}%, rgba(255,255,255,0.05) 0%)`,
                  boxShadow: `0 0 40px ${mod.color}20`,
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex flex-col items-center justify-center"
                  style={{ background: 'var(--kl-bg)' }}
                >
                  <span className="text-2xl font-black" style={{ color: mod.color }}>{score}</span>
                  <span className="text-xs" style={{ color: 'var(--kl-text-dim)' }}>/ {mod.questions.length}</span>
                </div>
              </div>
            </div>

            <div className="text-3xl">{emoji}</div>

            <h2 className="text-lg font-bold" style={{ color: 'var(--kl-text)' }}>
              {isMl ? mod.title_ml : mod.title}
            </h2>

            <p className="text-sm" style={{ color: 'var(--kl-text-dim)' }}>
              {pct >= 80
                ? (isMl ? 'മികച്ചത്! കേരളത്തിന്റെ വികസന കഥ നിങ്ങൾക്ക് നന്നായി അറിയാം.' : "Outstanding! You know Kerala's story well.")
                : pct >= 60
                ? (isMl ? 'നല്ല ശ്രമം! കേരളത്തിന് കൂടുതൽ കഥകൾ പറയാനുണ്ട്.' : "Good effort! Kerala has more stories to tell.")
                : (isMl ? 'പര്യവേക്ഷണം തുടരൂ — കണ്ടെത്താൻ ഏറെയുണ്ട്!' : "Keep exploring — there's so much to discover!")}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
                style={{ background: 'var(--kl-green)', color: '#fff' }}
              >
                <Share2 className="w-4 h-4" />
                {isMl ? 'സ്കോർ ഷെയർ ചെയ്യുക' : 'Share Score'}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all active:scale-[0.97]"
                  style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)', color: 'var(--kl-text)' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  {isMl ? 'വീണ്ടും' : 'Retry'}
                </button>
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all active:scale-[0.97]"
                  style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)', color: 'var(--kl-text)' }}
                >
                  {isMl ? 'എല്ലാ മന്ത്രാലയങ്ങളും' : 'All Ministries'}
                </Link>
              </div>
            </div>

            {/* Next ministry */}
            <div className="pt-5">
              <p className="text-xs mb-2" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? 'അടുത്തത്' : 'Up next'}
              </p>
              <Link href={`/quiz/${nextMod.slug}`}>
                <div
                  className="ministry-card flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-[0.98]"
                  style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)' }}
                >
                  <div className="shrink-0 w-1.5 h-10 rounded-full" style={{ background: nextMod.color }} />
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

  return (
    <main className="min-h-screen bg-kerala-quiz relative">
      <div className="leaf-pattern" />

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
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
            style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)', color: 'var(--kl-gold)' }}
          >
            {isMl ? 'English' : 'മലയാളം'}
          </button>
        </div>

        {/* Ministry header card */}
        <div
          className="p-4 rounded-2xl mb-6 wave-divider"
          style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="shrink-0 w-1.5 h-10 rounded-full"
              style={{ background: mod.color }}
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

          {/* Progress */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: mod.color }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-semibold shrink-0" style={{ color: mod.color }}>
              {currentIndex + 1}/{mod.questions.length}
            </span>
          </div>
        </div>

        {/* Score pill */}
        <div className="flex justify-end mb-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{ background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.15)' }}
          >
            <Trophy className="w-3 h-3" style={{ color: 'var(--kl-green-light)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--kl-green-light)' }}>{score}</span>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3
              className="text-base font-semibold leading-relaxed mb-6"
              style={{ color: 'var(--kl-text)' }}
            >
              {q.text}
            </h3>

            <div className="space-y-2.5">
              {q.options.map((option, idx) => {
                let bg = 'var(--kl-card)';
                let border = 'var(--kl-border)';
                let textColor = 'var(--kl-text)';
                let extraClass = '';

                if (selectedOption !== null) {
                  if (idx === question!.answer) {
                    bg = 'rgba(0, 214, 143, 0.12)';
                    border = 'rgba(0, 214, 143, 0.35)';
                    textColor = '#00d68f';
                    extraClass = 'pulse-correct';
                  } else if (idx === selectedOption) {
                    bg = 'rgba(239, 68, 68, 0.12)';
                    border = 'rgba(239, 68, 68, 0.35)';
                    textColor = '#ef4444';
                  } else {
                    textColor = 'var(--kl-text-dim)';
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all ${extraClass}`}
                    style={{ background: bg, border: `1px solid ${border}`, color: textColor }}
                  >
                    <span className="font-bold opacity-50 mr-1">{String.fromCharCode(65 + idx)}</span>{' '}
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Compare-o-Meter */}
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
                />

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={handleNext}
                  className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.97]"
                  style={{ backgroundColor: mod.color, boxShadow: `0 4px 20px ${mod.color}30` }}
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
