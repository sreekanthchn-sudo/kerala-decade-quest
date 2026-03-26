'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Share2, Trophy } from 'lucide-react';
import modulesData from '@/data/decade_records.json';
import { useSound } from '@/hooks/useSound';
import type { Module, Question } from '@/types';
import ScoreGauge from '@/components/ScoreGauge';
import CategoryTabBar from '@/components/CategoryTabBar';
import { getCategoryBilingualLabel } from '@/utils/categoryLabels';
import { publicAsset } from '@/lib/publicAsset';
import AchievementMarquee from '@/components/AchievementMarquee';
import HomeShareScoreFrame from '@/components/HomeShareScoreFrame';
import { buildHomeShareText, buildHomeShareTitle, type HomeShareLevel } from '@/utils/homeShare';
import { captureHomeSharePng, downloadBlob, shareHomeScoreImageAndText } from '@/lib/shareHomeScore';
import { QUIZ_QUESTIONS_PER_ROUND } from '@/constants/quiz';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Stable order for SSR + first client paint — avoids hydration mismatch from Math.random(). */
function sortQuestionsById(questions: Question[]): Question[] {
  return [...questions].sort((a, b) => a.id - b.id);
}

const GENERAL_HOME_SLUG = 'general-quiz';

function getCategoryOrder(modules: Module[]): Module[] {
  const gen = modules.find((m) => m.slug === GENERAL_HOME_SLUG);
  const rest = modules.filter((m) => m.slug !== GENERAL_HOME_SLUG);
  return gen ? [gen, ...rest] : [...modules];
}

/**
 * Category 0 (general quiz): only uses the `general-quiz` bank (from the sheet),
 * not a mixed pull from other departments.
 */
function buildGeneralQuestionsFromBank(modules: Module[]): Question[] {
  const cap = QUIZ_QUESTIONS_PER_ROUND;
  const bank = modules.find((m) => m.slug === GENERAL_HOME_SLUG)?.questions ?? [];
  return shuffleArray(bank).slice(0, cap);
}

/** Same as buildGeneralQuestionsFromBank but deterministic — no Math.random(). */
function buildGeneralQuestionsFromBankDeterministic(modules: Module[]): Question[] {
  const cap = QUIZ_QUESTIONS_PER_ROUND;
  const bank = modules.find((m) => m.slug === GENERAL_HOME_SLUG)?.questions ?? [];
  return sortQuestionsById(bank).slice(0, cap);
}

function buildQuestionsForCategory(categoryIndex: number, categoryOrder: Module[]): Question[] {
  if (categoryIndex === 0 && categoryOrder[0]?.slug === GENERAL_HOME_SLUG) {
    return buildGeneralQuestionsFromBank(categoryOrder);
  }
  const mod = categoryOrder[categoryIndex];
  if (!mod) return [];
  return shuffleArray(mod.questions).slice(0, QUIZ_QUESTIONS_PER_ROUND);
}

function buildQuestionsForCategoryDeterministic(categoryIndex: number, categoryOrder: Module[]): Question[] {
  if (categoryIndex === 0 && categoryOrder[0]?.slug === GENERAL_HOME_SLUG) {
    return buildGeneralQuestionsFromBankDeterministic(categoryOrder);
  }
  const mod = categoryOrder[categoryIndex];
  if (!mod) return [];
  return sortQuestionsById(mod.questions).slice(0, QUIZ_QUESTIONS_PER_ROUND);
}

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

export default function HomePage() {
  const SITE_URL = 'https://www.knowkeralam.com';
  const modules = modulesData as Module[];
  const categoryOrder = useMemo(() => getCategoryOrder(modules), [modules]);
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestionsForCategoryDeterministic(0, getCategoryOrder(modulesData as Module[]))
  );

  useEffect(() => {
    const first = buildQuestionsForCategory(0, categoryOrder);
    // If the general-quiz bank is empty (e.g. sheet not imported yet),
    // fall back to the first department so the UI isn't blank.
    if (!first.length && categoryOrder.length > 1) {
      setCategoryIdx(1);
      setQuestions(buildQuestionsForCategory(1, categoryOrder));
    } else {
      setQuestions(first);
    }
    // Shuffle only after hydration; deterministic initial state matches SSR (see buildQuestionsForCategoryDeterministic).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lang, setLang] = useState<'ml' | 'en'>('ml');
  const [siteOrigin] = useState(SITE_URL);
  const [exportFrameMounted, setExportFrameMounted] = useState(false);
  const { playCorrect, playIncorrect, playClick } = useSound();

  useEffect(() => {
    setExportFrameMounted(true);
  }, []);
  const question = questions[currentIndex];
  const isMl = lang === 'ml';

  const selectCategory = (idx: number) => {
    setCategoryIdx(idx);
    setQuestions(buildQuestionsForCategory(idx, categoryOrder));
    setFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const questionText = localizedText(question?.question, question?.question_ml, isMl);
  const options = (question?.options || []).map((enOpt, idx) =>
    localizedText(enOpt, question?.options_ml?.[idx], isMl)
  );
  const explanationText = localizedText(question?.flex_fact, question?.flex_fact_ml, isMl);
  const correctAnswer = question?.answer ?? -1;
  const showResult = selectedOption !== null;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const activeModule = categoryOrder[categoryIdx];
  const categoryTitle = activeModule
    ? getCategoryBilingualLabel(activeModule, categoryIdx, isMl)
    : isMl
      ? 'പൊതു ക്വിസ് | General Quiz'
      : 'General Quiz | പൊതു ക്വിസ്';

  const departmentCount = useMemo(
    () => categoryOrder.filter((m) => !m.slug.includes('general')).length,
    [categoryOrder]
  );

  const shareLevel: HomeShareLevel = useMemo(() => {
    const first = categoryOrder[0];
    if (first?.slug.includes('general') && categoryIdx === 0) return 'general';
    return 'department';
  }, [categoryOrder, categoryIdx]);

  const tierLabelResult = scoreTierLine(score, questions.length, isMl);

  const handleShareScore = useCallback(async () => {
    playClick();
    const text = buildHomeShareText({
      isMl,
      score,
      total: questions.length,
      percentage,
      tierLabel: tierLabelResult,
      categoryTitle,
      siteUrl: siteOrigin,
      level: shareLevel,
      departmentCount,
    });
    const title = buildHomeShareTitle(isMl);
    const result = await shareHomeScoreImageAndText({ title, text, url: siteOrigin });
    if (result === 'need-fallback' && typeof window !== 'undefined') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  }, [
    playClick,
    isMl,
    score,
    questions.length,
    percentage,
    tierLabelResult,
    categoryTitle,
    siteOrigin,
    shareLevel,
    departmentCount,
  ]);

  const handleDownloadScoreImage = useCallback(async () => {
    playClick();
    const blob = await captureHomeSharePng();
    if (blob) {
      downloadBlob(blob, 'knowkeralam-quiz-score.png');
    } else if (typeof window !== 'undefined') {
      window.alert(
        isMl
          ? 'സ്കോർ കാർഡ് ചിത്രം ഉണ്ടാക്കാൻ കഴിഞ്ഞില്ല. ഒരു നിമിഷം കാത്ത ശേഷം വീണ്ടും ശ്രമിക്കുക.'
          : 'Could not create the score card image. Wait a moment and try again.'
      );
    }
  }, [playClick, isMl]);

  /** ~576 / 672 / 768px — fills laptop widths without tiny centered column */
  const layoutMaxWidth = 'w-full max-w-xl lg:max-w-2xl xl:max-w-3xl';

  const homeCardFrame = `quiz-game-shell relative mx-auto ${layoutMaxWidth} overflow-hidden rounded-3xl border-[3px] border-black shadow-[8px_8px_0_0_rgba(250,204,21,0.85)] ring-1 ring-[#facc15]/[0.12] lg:rounded-[1.65rem] xl:rounded-[1.85rem] xl:shadow-[10px_10px_0_0_rgba(250,204,21,0.85)]`;
  /** Same frame but overflow visible so category dropdown is not clipped */
  const homeCardFrameResults = `quiz-game-shell relative z-20 mx-auto ${layoutMaxWidth} overflow-visible rounded-3xl border-[3px] border-black shadow-[8px_8px_0_0_rgba(250,204,21,0.85)] ring-1 ring-[#facc15]/[0.12] lg:rounded-[1.65rem] xl:rounded-[1.85rem] xl:shadow-[10px_10px_0_0_rgba(250,204,21,0.85)]`;

  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#0a0a0a] quiz-game-shell text-center">
      {/* Background — hero image (public/unwatermarked_Gemini_…pbfyyl.webp) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 min-h-dvh w-full">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={publicAsset('/unwatermarked_Gemini_Generated_Image_rkus9trkus9trkus_1_pbfyyl.webp')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.32] saturate-[0.85]"
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-[#0a0a0a]/72 to-black/95"
        />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col">
        {/* Full-width top bar: logo top-left, controls top-right */}
        <header
          className={`flex w-full shrink-0 items-center justify-between gap-3 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-5 lg:px-8 xl:px-10 ${finished ? 'pb-1.5 sm:pb-2' : 'pb-3 sm:pb-4 lg:pb-5'}`}
        >
          <div className="min-w-0 shrink">
            <Link
              href="/"
              className="inline-block outline-none ring-offset-2 ring-offset-[#0a0a0a] focus-visible:ring-2 focus-visible:ring-[#facc15]"
              aria-label={isMl ? 'ഹോം' : 'Home'}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicAsset('/knowkeralam.png')}
                alt="KNOW-KERALAM"
                width={640}
                height={320}
                className={`h-auto w-auto object-contain object-left select-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] ${
                  finished
                    ? 'max-h-[42px] max-w-[160px] sm:max-h-[50px] sm:max-w-[180px]'
                    : 'max-h-[56px] max-w-[200px] sm:max-h-[68px] sm:max-w-[220px] lg:max-h-[80px] lg:max-w-[260px] xl:max-h-[88px] xl:max-w-[280px]'
                }`}
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>
          <div
            className="flex shrink-0 items-center gap-0 rounded-2xl border border-white/12 bg-zinc-950/65 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
            role="toolbar"
            aria-label={isMl ? 'ഭാഷ' : 'Language'}
          >
            <button
              type="button"
              onClick={() => {
                playClick();
                setLang((p) => (p === 'ml' ? 'en' : 'ml'));
              }}
              className="inline-flex h-10 min-w-[5.25rem] items-center justify-center rounded-xl border-2 border-black bg-[#facc15] px-3 text-xs font-black leading-none text-black shadow-[2px_2px_0_0_#000] transition hover:bg-[#fde047] active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0_0_#000] sm:min-w-[5.75rem] sm:px-4 sm:text-[13px]"
            >
              {isMl ? 'English' : 'മലയാളം'}
            </button>
          </div>
        </header>

        <div
          className={`mx-auto flex min-h-0 w-full flex-1 flex-col px-4 pb-3 sm:pb-4 lg:px-8 lg:pb-5 xl:px-10 ${layoutMaxWidth}`}
        >
        <div
          className={`mx-auto w-full max-w-4xl px-1 text-center ${
            finished
              ? 'mb-1.5 sm:mb-2'
              : question
                ? 'mb-4 sm:mb-5 lg:mb-6'
                : 'mb-6 sm:mb-8 lg:mb-10'
          }`}
        >
          <h1
            lang="en"
            className={`font-black leading-[1.05] tracking-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)] ${
              finished
                ? 'text-[clamp(1.15rem,3.8vw,1.55rem)]'
                : 'text-[clamp(1.65rem,2.8vw+0.75rem,3.85rem)] lg:tracking-tight'
            }`}
          >
            <span className="text-white">KNOW-</span>
            <span className="text-[#ffcc00]">KERALAM</span>
          </h1>
          <p
            className={
              finished
                ? 'sr-only'
                : 'mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed tracking-wide text-white/88 sm:mt-4 sm:text-base md:mt-5 md:text-[1.0625rem] lg:max-w-3xl lg:text-lg lg:leading-relaxed xl:text-xl'
            }
            >
              {isMl
              ? 'അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ!'
              : 'Discover the achievements of the past decade!'}
          </p>
        </div>

        {/* Category tabs — above cards, not inside quiz/results shell */}
        {finished ? (
          <div className={`mx-auto mb-3 w-full sm:mb-4 lg:mb-5 ${layoutMaxWidth}`}>
            <p className="mb-1.5 text-center text-[11px] font-bold leading-snug text-[#ffcc00] sm:mb-2 sm:text-xs">
              {isMl ? 'അടുത്ത ക്വിസ് - വിഭാഗം തിരഞ്ഞെടുക്കുക' : 'Next quiz - choose a topic'}
            </p>
            <p className="mb-2 text-center text-[10px] leading-snug text-white/65 sm:text-[11px]">
              {isMl
                ? `പൊതു = ${QUIZ_QUESTIONS_PER_ROUND} ചോദ്യങ്ങൾ (എല്ലാ വിഭാഗങ്ങളിൽ നിന്നും). വകുപ്പ് = ഓരോന്നും ${QUIZ_QUESTIONS_PER_ROUND} ചോദ്യങ്ങൾ.`
                : `General = ${QUIZ_QUESTIONS_PER_ROUND} mixed questions. Each department = ${QUIZ_QUESTIONS_PER_ROUND} questions.`}
            </p>
            <CategoryTabBar
              categoryOrder={categoryOrder}
              value={categoryIdx}
              isMl={isMl}
              playClick={playClick}
              onSelect={selectCategory}
              ariaLabel={isMl ? 'അടുത്ത ക്വിസ് വിഭാഗം' : 'Next quiz topic'}
            />
          </div>
        ) : categoryOrder.length ? (
          <div className={`mx-auto mb-4 w-full sm:mb-5 lg:mb-6 ${layoutMaxWidth}`}>
            <CategoryTabBar
              categoryOrder={categoryOrder}
              value={categoryIdx}
              isMl={isMl}
              playClick={playClick}
              onSelect={selectCategory}
              ariaLabel={isMl ? 'ക്വിസ് വിഭാഗം' : 'Quiz topic'}
            />
          </div>
        ) : null}

        <section className={`w-full flex-1 ${finished ? '-mt-0.5' : 'mt-0 sm:mt-1 lg:mt-2'}`}>
        {!finished && !question && categoryOrder.length ? (
          <div className={`${homeCardFrame} text-left`}>
            <div className="absolute inset-0 z-0 quiz-game-scrim-contained pointer-events-none rounded-[21px]" aria-hidden />
            <div className="relative z-10 p-4 sm:p-5 lg:p-7 xl:p-8">
              <p className="text-sm font-black text-white sm:text-base">
                {isMl ? 'ക്വിസ് ചോദ്യങ്ങൾ ലോഡ് ചെയ്തിട്ടില്ല.' : 'Quiz questions are not loaded.'}
              </p>
              <p className="mt-2 text-[12px] font-semibold leading-relaxed text-white/75 sm:text-[13px]">
                {isMl
                  ? 'പൊതു ക്വിസ് (general-quiz) ചോദ്യങ്ങൾ ഷീറ്റിൽ നിന്ന് ഇനിയും ചേർത്തിട്ടില്ലെന്ന് തോന്നുന്നു. മുകളിലെ ടാബിൽ നിന്ന് മറ്റൊരു വകുപ്പ് തിരഞ്ഞെടുക്കാം.'
                  : 'It looks like the General Quiz (general-quiz) bank is empty. Pick any department from the tabs above.'}
              </p>
            </div>
          </div>
        ) : null}
        {!finished && question && (
          <div className={`${homeCardFrame} text-left`}>
            <div className="absolute inset-0 z-0 quiz-game-scrim-contained pointer-events-none rounded-[21px]" aria-hidden />
            <div className="relative z-10 p-4 sm:p-5 lg:p-7 xl:p-8">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                {currentIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setCurrentIndex((i) => i - 1);
                      setSelectedOption(null);
                    }}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-white/20 bg-black/30 text-white/90 transition-all hover:text-[#facc15] active:scale-95"
                    aria-label={isMl ? 'മുമ്പത്തെ ചോദ്യം' : 'Previous question'}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                ) : (
                  <span className="inline-block h-9 w-9 shrink-0" aria-hidden />
                )}

                <div className="flex items-center gap-1.5 rounded-full border-2 border-black bg-[#facc15] px-3 py-1 shadow-[2px_2px_0_0_#000]">
                  <Trophy className="h-4 w-4 text-black" />
                  <span className="text-sm font-black text-black tabular-nums">{score}</span>
          </div>
        </div>

              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <div className="flex-1 h-2 lg:h-2.5 rounded-full overflow-hidden border border-black/30 bg-black/50">
                  <div
                    className="h-full rounded-full quiz-game-progress-fill transition-[width] duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black tabular-nums text-[#facc15] shrink-0">
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>

              <p className="mb-4 text-sm font-bold leading-snug text-white sm:text-[15px] sm:leading-snug md:text-base lg:mb-5 lg:text-lg lg:leading-relaxed xl:text-xl xl:leading-snug">
                {questionText}
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:gap-4">
                {options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === correctAnswer;
                  const shouldHide = showResult && !isSelected && !isCorrect;
                  if (shouldHide) return null;

                  let stateClass = 'quiz-game-option--idle';
                  if (showResult) {
                    if (isCorrect) stateClass = 'quiz-game-option--correct';
                    else if (isSelected) stateClass = 'quiz-game-option--wrong';
                  }

                  const icon = showResult && isCorrect ? '✓' : showResult && isSelected && !isCorrect ? '✗' : '';

            return (
                    <button
                      key={index}
                      type="button"
                      className={`quiz-game-option w-full text-left px-3 py-2.5 text-xs leading-snug sm:py-3 sm:text-sm lg:min-h-[3.5rem] lg:px-4 lg:text-[15px] lg:leading-snug xl:text-base ${stateClass}`}
                      onClick={() => {
                        if (showResult) return;
                        playClick();
                        setSelectedOption(index);
                        if (index === correctAnswer) {
                          setScore((s) => s + 1);
                          playCorrect();
                        } else {
                          playIncorrect();
                        }
                      }}
                      disabled={showResult}
                    >
                      <span
                        className={`inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-md text-xs font-black mr-2 align-middle ${
                          showResult && isCorrect
                            ? 'bg-[#14532d] text-[#4ade80]'
                            : showResult && isSelected && !isCorrect
                              ? 'bg-red-950 text-red-200'
                              : 'bg-black/20 text-black'
                        }`}
                      >
                        {icon || optionLetters[index]}
                        </span>
                      {option}
                    </button>
            );
          })}
        </div>

              {selectedOption !== null && (
                <div className="mt-3 p-3 quiz-game-fact-card">
                  {explanationText && (
                    <p className="text-xs sm:text-sm leading-snug font-medium text-[#86efac]">{explanationText}</p>
                  )}
                  {question?.source && (
                    <p className="mt-2 text-[10px] text-white/40">{question.source}</p>
                  )}
                </div>
              )}

              {showResult && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex((i) => i + 1);
                      } else {
                        setFinished(true);
                      }
                      setSelectedOption(null);
                    }}
                    className="quiz-game-next-btn w-full flex items-center justify-center gap-2 px-4 py-3 text-sm min-h-12"
                  >
                    {isMl ? 'അടുത്ത ചോദ്യം' : 'Next question'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {finished && (
          <div
            className={`${homeCardFrameResults} bg-black/45 p-3 text-center shadow-[0_0_48px_rgba(250,204,21,0.28)] backdrop-blur-md sm:p-4 lg:p-6 xl:p-7`}
          >
            <div
              className="absolute inset-0 z-0 quiz-game-scrim-contained pointer-events-none rounded-[21px]"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-3 px-0.5 sm:gap-3.5 sm:px-1">
              {/* Level 0 / 1 — first: why this round + what unlocks next */}
              <div className="rounded-2xl border border-[#facc15]/40 bg-black/50 px-3 py-3 text-left sm:px-4">
                {shareLevel === 'general' ? (
                  <>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#facc15] sm:text-[11px]">
                      {isMl ? 'ലെവൽ 0 · പൊതു റൗണ്ട് പൂർത്തിയായി' : 'Level 0 · General round complete'}
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-white/90 sm:text-[13px]">
                      {isMl ? (
                        <>
                          ഇത്{' '}
                          <strong className="font-black text-[#fde047]">പൊതു റൗണ്ട്</strong> ആണ് - എല്ലാ വിഭാഗങ്ങളിൽ നിന്നും{' '}
                          {QUIZ_QUESTIONS_PER_ROUND} ചോദ്യങ്ങൾ. ഇനി{' '}
                          <strong className="font-black text-[#fde047]">ലെവൽ 1</strong> ക്വിസുകൾ തുറന്നിരിക്കുന്നു:{' '}
                          {departmentCount} വകുപ്പ് വിഭാഗങ്ങളിൽ ഓരോന്നിൽ {QUIZ_QUESTIONS_PER_ROUND} ചോദ്യങ്ങൾ. എന്തിനാണ് ഈ റൗണ്ട് പൂർത്തിയാക്കുന്നതെന്ന്
                          ഇതിനകത്ത് തന്നെ: മുഴുവൻ സൈറ്റിലേക്കുള്ള വാതിൽ തുറക്കുന്ന ആദ്യ ചുവട്. മുകളിലെ വിഭാഗ ടാബിൽ നിന്ന്
                          തുടർന്നുള്ള മേഖല തിരഞ്ഞെടുക്കുക.
                        </>
                      ) : (
                        <>
                          You completed the{' '}
                          <strong className="font-black text-[#fde047]">general round</strong> ({QUIZ_QUESTIONS_PER_ROUND}{' '}
                          mixed questions). <strong className="font-black text-[#fde047]">Level 1</strong> unlocks{' '}
                          <strong className="text-white">{departmentCount}</strong> department topics ({QUIZ_QUESTIONS_PER_ROUND}{' '}
                          questions each). This
                          round opens the full journey - pick your next domain from the category tabs above.
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#facc15] sm:text-[11px]">
                      {isMl ? 'ലെവൽ 1 · വകുപ്പ് ക്വിസ് പൂർത്തിയായി' : 'Level 1 · Department quiz complete'}
                    </p>
                    <p className="mt-2 text-[12px] leading-relaxed text-white/90 sm:text-[13px]">
                      {isMl ? (
                        <>
                          ഈ വകുപ്പ് വിഭാഗം പൂർത്തിയായി. മറ്റു{' '}
                          <strong className="font-black text-[#fde047]">ലെവൽ 1</strong> ക്വിസുകൾ മറ്റു മേഖലകളിൽ തുറന്നിരിക്കുന്നു -
                          മുകളിലെ ടാബിൽ നിന്ന് അടുത്ത വിഭാഗം തിരഞ്ഞെടുക്കുക.
                        </>
                      ) : (
                        <>
                          You finished this <strong className="font-black text-[#fde047]">Level 1</strong> department quiz.
                          Other topics are still open - choose another category tab above.
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>

              {/* Score hero — wind / dusk hero aesthetic */}
              <div>
                <p
                  className={
                    isMl
                      ? 'text-[11px] font-black text-[#ffcc00] sm:text-[12px]'
                      : 'text-[9px] font-black uppercase tracking-[0.38em] text-[#ffcc00] sm:text-[10px]'
                  }
                >
                  {isMl ? 'ക്വിസ് പൂർത്തിയായി' : 'Quiz complete'}
                </p>
                <div className="mt-1.5 sm:mt-2">
                  <ScoreGauge
                    score={score}
                    total={questions.length}
                    percentage={percentage}
                    tierLabel={tierLabelResult}
                    isMl={isMl}
                    compact
                  />
                </div>
              </div>

              {/* Category title & tagline */}
              <div className="border-y border-[#ffcc00]/18 py-2 sm:py-2.5">
                <h2 className="text-balance text-lg font-black leading-tight text-white sm:text-xl md:text-[1.35rem]">
                  {categoryTitle}
                </h2>
                <p className="mx-auto mt-1 max-w-md text-pretty text-[0.8125rem] leading-snug text-white/82 sm:text-[0.9rem]">
              {isMl
                    ? 'പര്യവേക്ഷണം തുടരൂ - കണ്ടെത്താൻ ഏറെയുണ്ട്!'
                    : 'Keep exploring - there is much more to discover!'}
                </p>
              </div>

              {/* Share | Download — one row */}
              <div className="grid w-full grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void handleShareScore()}
                  className="quiz-game-next-btn inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 px-2 py-2.5 text-[10px] font-black leading-tight sm:min-h-12 sm:gap-2 sm:px-3 sm:text-xs"
                >
                  <Share2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span className="text-center whitespace-nowrap" title={isMl ? 'സമ്പൂർണ്ണ ടെക്സ്റ്റ് + ലഭ്യമെങ്കിൽ ചിത്രം' : 'Full text + image when supported'}>
                    {isMl ? 'സ്കോർ ഷെയർ' : 'Share score'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleDownloadScoreImage()}
                  className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl border-[3px] border-black bg-white px-2 py-2.5 text-[10px] font-black leading-tight text-[#0a0a0a] shadow-[4px_4px_0_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] sm:min-h-12 sm:gap-2 sm:px-3 sm:text-xs"
                >
                  <Trophy className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span className="text-center whitespace-nowrap">
                    {isMl ? 'സ്കോർ ചിത്രം ഡൗൺലോഡ്' : 'Download score image'}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setQuestions(buildQuestionsForCategory(categoryIdx, categoryOrder));
                  setFinished(false);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setScore(0);
                }}
                className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-[#ffcc00] bg-black/50 px-3 py-2 text-[11px] font-black text-[#ffcc00] sm:min-h-11 sm:text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                {isMl ? 'വീണ്ടും' : 'Retry'}
              </button>

              <p className="pt-0.5 text-center text-[10px] font-semibold tracking-wide text-white/40 sm:text-[11px]">
                knowkeralam.com
              </p>
            </div>
          </div>
        )}
        </section>
        </div>

        {/* Full viewport width — sibling of max-w-xl, not inside px-4 */}
        <div className="relative z-10 mt-2 w-full min-w-0 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] sm:mt-3 md:mt-4 lg:mt-5">
          <AchievementMarquee isMl={isMl} />
          <footer className="mx-auto mt-2 w-full max-w-5xl px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[11px] font-medium text-white/60 sm:mt-3 sm:text-xs">
            Developed by A community-driven initiative by Sameeksha UK &amp; the DYFI Professional Sub-committee.
          </footer>
        </div>

        {exportFrameMounted && finished
          ? createPortal(
              <HomeShareScoreFrame
                score={score}
                total={questions.length}
                percentage={percentage}
                tierLabel={tierLabelResult}
                categoryTitle={categoryTitle}
                siteUrl={siteOrigin}
                level={shareLevel}
                isMl={isMl}
              />,
              document.body
            )
          : null}
      </div>
    </main>
  );
}
