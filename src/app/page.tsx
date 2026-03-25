'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Moon, RotateCcw, Share2, Sun, Trophy } from 'lucide-react';
import modulesData from '@/data/decade_records.json';
import { useSound } from '@/hooks/useSound';
import { useTheme } from '@/hooks/useTheme';
import type { Module, Question } from '@/types';
import ScoreGauge from '@/components/ScoreGauge';
import CategoryDropdown from '@/components/CategoryDropdown';
import { getCategoryBilingualLabel } from '@/utils/categoryLabels';
import { publicAsset } from '@/lib/publicAsset';
import AchievementMarquee from '@/components/AchievementMarquee';

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

type Pool = { slug: string; questions: Question[] };

function sortPoolsBySlug(pools: Pool[]): Pool[] {
  return [...pools].sort((a, b) => a.slug.localeCompare(b.slug));
}

const TOTAL_QUESTIONS = 15;

function getCategoryOrder(modules: Module[]): Module[] {
  const gen = modules.find((m) => m.slug.includes('general'));
  const rest = modules.filter((m) => !m.slug.includes('general'));
  return gen ? [gen, ...rest] : [...modules];
}

/**
 * Category 0 (general quiz): 15 questions round-robin across every module pool
 * (education, health, transport, …) — not “first N from one category”.
 */
function buildGeneralMixedQuestions(modules: Module[]): Question[] {
  const pools: Pool[] = modules.map((m) => ({
    slug: m.slug,
    questions: shuffleArray(m.questions),
  }));
  const order = shuffleArray([...pools]);

  const mixed: Question[] = [];
  let round = 0;
  while (mixed.length < TOTAL_QUESTIONS) {
    let pickedInRound = false;
    for (const pool of order) {
      if (pool.questions[round]) {
        mixed.push(pool.questions[round]);
        pickedInRound = true;
        if (mixed.length >= TOTAL_QUESTIONS) break;
      }
    }
    if (!pickedInRound) break;
    round += 1;
  }
  return mixed.slice(0, TOTAL_QUESTIONS);
}

/** Same as buildGeneralMixedQuestions but deterministic — no Math.random(). */
function buildGeneralMixedQuestionsDeterministic(modules: Module[]): Question[] {
  const pools: Pool[] = modules.map((m) => ({
    slug: m.slug,
    questions: sortQuestionsById(m.questions),
  }));
  const order = sortPoolsBySlug(pools);

  const mixed: Question[] = [];
  let round = 0;
  while (mixed.length < TOTAL_QUESTIONS) {
    let pickedInRound = false;
    for (const pool of order) {
      if (pool.questions[round]) {
        mixed.push(pool.questions[round]);
        pickedInRound = true;
        if (mixed.length >= TOTAL_QUESTIONS) break;
      }
    }
    if (!pickedInRound) break;
    round += 1;
  }
  return mixed.slice(0, TOTAL_QUESTIONS);
}

function buildQuestionsForCategory(categoryIndex: number, categoryOrder: Module[]): Question[] {
  if (categoryIndex === 0 && categoryOrder[0]?.slug.includes('general')) {
    return buildGeneralMixedQuestions(categoryOrder);
  }
  const mod = categoryOrder[categoryIndex];
  if (!mod) return [];
  return shuffleArray(mod.questions).slice(0, TOTAL_QUESTIONS);
}

function buildQuestionsForCategoryDeterministic(categoryIndex: number, categoryOrder: Module[]): Question[] {
  if (categoryIndex === 0 && categoryOrder[0]?.slug.includes('general')) {
    return buildGeneralMixedQuestionsDeterministic(categoryOrder);
  }
  const mod = categoryOrder[categoryIndex];
  if (!mod) return [];
  return sortQuestionsById(mod.questions).slice(0, TOTAL_QUESTIONS);
}

function scoreTierLine(score: number, isMl: boolean): string {
  if (score >= 13) return isMl ? 'കേരള വികസന ദർശകൻ' : 'Kerala Development Visionary';
  if (score >= 10) return isMl ? 'നോ-കേരളം നയ വിദഗ്ദ്ധൻ' : 'KNOW-KERALAM Policy Expert';
  if (score >= 7) return isMl ? 'വികസന താൽപര്യക്കാരൻ' : 'Development Enthusiast';
  return isMl ? 'ജിജ്ഞാസു പര്യവേക്ഷകൻ' : 'Curious Explorer';
}

export default function HomePage() {
  const modules = modulesData as Module[];
  const categoryOrder = useMemo(() => getCategoryOrder(modules), [modules]);
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestionsForCategoryDeterministic(0, getCategoryOrder(modulesData as Module[]))
  );

  useEffect(() => {
    setQuestions(buildQuestionsForCategory(0, categoryOrder));
    // Shuffle only after hydration; deterministic initial state matches SSR (see buildQuestionsForCategoryDeterministic).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lang, setLang] = useState<'ml' | 'en'>('ml');
  const { playCorrect, playIncorrect, playClick } = useSound();
  const { toggleTheme, isDark } = useTheme();
  const question = questions[currentIndex];
  const isMl = lang === 'ml';

  const questionText = (isMl && question?.question_ml) ? question.question_ml : (question?.question || '');
  const options = (isMl && question?.options_ml?.length) ? question.options_ml : (question?.options || []);
  const explanationText = (isMl && question?.flex_fact_ml) ? question.flex_fact_ml : (question?.flex_fact || '');
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

  const homeCardFrame =
    'quiz-game-shell relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border-[3px] border-black shadow-[8px_8px_0_0_rgba(250,204,21,0.85)] ring-1 ring-[#facc15]/[0.12]';

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
          className={`flex w-full shrink-0 items-center justify-between gap-3 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-5 ${finished ? 'pb-1.5 sm:pb-2' : 'pb-3 sm:pb-4'}`}
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
                    : 'max-h-[56px] max-w-[200px] sm:max-h-[68px] sm:max-w-[220px]'
                }`}
                loading="eager"
                decoding="async"
              />
            </Link>
          </div>
          <div
            className="flex shrink-0 items-center gap-0 rounded-2xl border border-white/12 bg-zinc-950/65 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
            role="toolbar"
            aria-label={isMl ? 'തീം, ഭാഷ' : 'Theme and language'}
          >
            <button
              type="button"
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-zinc-900 text-[#facc15] shadow-[2px_2px_0_0_#000] transition hover:bg-zinc-800 active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0_0_#000]"
              aria-label={isDark ? 'Light mode' : 'Dark mode'}
              aria-pressed={isDark}
            >
              {isDark ? <Sun className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} /> : <Moon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />}
            </button>
            <div className="mx-0.5 h-7 w-px shrink-0 self-center bg-white/20" aria-hidden />
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
          className={`mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col px-4 ${finished ? 'pb-3 sm:pb-4' : 'pb-2 sm:pb-3'}`}
        >
        <div
          className={`mx-auto max-w-2xl px-1 text-center ${finished ? 'mb-1.5 sm:mb-2' : 'mb-6 sm:mb-8'}`}
        >
          <h1
            lang="en"
            className={`font-black leading-[1.05] tracking-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)] ${
              finished
                ? 'text-[clamp(1.15rem,3.8vw,1.55rem)]'
                : 'text-[clamp(1.65rem,5.5vw,2.85rem)]'
            }`}
          >
            <span className="text-white">KNOW-</span>
            <span className="text-[#ffcc00]">KERALAM</span>
          </h1>
          <p
            className={
              finished
                ? 'sr-only'
                : 'mx-auto mt-3 max-w-[28rem] text-sm font-medium leading-relaxed tracking-wide text-white/88 sm:mt-3.5 sm:text-base md:text-[1.0625rem]'
            }
            >
              {isMl
              ? 'അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ!'
              : 'Discover the achievements of the past decade!'}
          </p>
        </div>

        <section className={`w-full ${finished ? '-mt-0.5' : 'mt-1 sm:mt-2'}`}>
        {!finished && !question && (
          <div className={`${homeCardFrame} text-left`}>
            <div className="absolute inset-0 z-0 quiz-game-scrim-contained pointer-events-none rounded-[21px]" aria-hidden />
            <div className="relative z-10 p-6 sm:p-8">
              <p className="text-center text-[10px] font-black tracking-[0.35em] text-[#facc15] uppercase">
                {isMl ? 'സ്വാഗതം' : 'Welcome'}
              </p>
            </div>
            </div>
        )}

        {!finished && question && (
          <div className={`${homeCardFrame} text-left`}>
            <div className="absolute inset-0 z-0 quiz-game-scrim-contained pointer-events-none rounded-[21px]" aria-hidden />
            <div className="relative z-10 p-4 sm:p-5">
              <p className="mb-2 border-y border-[#facc15]/25 py-2.5 text-center text-base font-black leading-snug tracking-tight text-[#facc15] sm:text-lg sm:py-3">
                {categoryTitle}
              </p>

              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    if (currentIndex > 0) {
                      setCurrentIndex((i) => i - 1);
                      setSelectedOption(null);
                    } else if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/90 border-2 border-white/20 bg-black/30 hover:text-[#facc15] active:scale-95 transition-all"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#facc15] border-2 border-black shadow-[2px_2px_0_0_#000]">
                  <Trophy className="w-4 h-4 text-black" />
                  <span className="text-sm font-black text-black tabular-nums">{score}</span>
          </div>
        </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 rounded-full overflow-hidden border border-black/30 bg-black/50">
                  <div
                    className="h-full rounded-full quiz-game-progress-fill transition-[width] duration-300 ease-out"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-black tabular-nums text-[#facc15] shrink-0">
                  {currentIndex + 1}/{questions.length}
                </span>
              </div>

              <p className="text-sm sm:text-[15px] md:text-base font-bold leading-snug text-white mb-3">
                {questionText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className={`quiz-game-option w-full text-left px-3 py-2.5 text-xs sm:text-sm leading-snug ${stateClass}`}
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
            className={`${homeCardFrame} relative bg-black/45 p-3 text-center shadow-[0_0_48px_rgba(250,204,21,0.28)] backdrop-blur-md sm:p-4`}
          >
            <div
              className="absolute inset-0 z-0 quiz-game-scrim-contained pointer-events-none rounded-[21px]"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-3 px-0.5 sm:gap-3.5 sm:px-1">
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
                    tierLabel={scoreTierLine(score, isMl)}
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

              <CategoryDropdown
                categoryOrder={categoryOrder}
                value={categoryIdx}
                isMl={isMl}
                label={isMl ? 'വിഭാഗം തിരഞ്ഞെടുക്കുക' : 'Select category'}
                playClick={playClick}
                onSelect={(idx) => {
                  setCategoryIdx(idx);
                  setQuestions(buildQuestionsForCategory(idx, categoryOrder));
                  setFinished(false);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setScore(0);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Share | Download — one row */}
              <div className="grid w-full grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    const share = isMl
                      ? `ഞാൻ ക്വിസിൽ ${score}/${questions.length} (${percentage}%) നേടി!`
                      : `I scored ${score}/${questions.length} (${percentage}%) on the quiz!`;
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({ title: isMl ? 'ക്വിസ് സ്കോർ' : 'Quiz score', text: share }).catch(() => {});
                    } else if (typeof window !== 'undefined') {
                      window.open(`https://wa.me/?text=${encodeURIComponent(share)}`, '_blank');
                    }
                  }}
                  className="quiz-game-next-btn inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 px-2 py-2.5 text-[10px] font-black leading-tight sm:min-h-12 sm:gap-2 sm:px-3 sm:text-xs"
                >
                  <Share2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span className="text-center whitespace-nowrap">
                    {isMl ? 'സ്കോർ ഷെയർ ചെയ്യുക' : 'Share score'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-2xl border-[3px] border-black bg-white px-2 py-2.5 text-[10px] font-black leading-tight text-[#0a0a0a] shadow-[4px_4px_0_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000] sm:min-h-12 sm:gap-2 sm:px-3 sm:text-xs"
                >
                  <Trophy className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
                  <span className="text-center whitespace-nowrap">
                    {isMl ? 'സ്കോർബോർഡ് ഡൗൺലോഡ്' : 'Download scoreboard'}
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
        <div className="relative z-10 mt-2 w-full min-w-0 shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:mt-3">
          <AchievementMarquee isMl={isMl} />
        </div>
      </div>
    </main>
  );
}
