'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Home, HeartPulse, GraduationCap, Wifi, Building2, BookOpen,
  TrendingDown, Landmark, Leaf, Coins, Droplets, Zap, Bus,
  UtensilsCrossed, PawPrint, Wheat, Users, Gavel, Anchor, Fish, Dumbbell,
  Search, ChevronRight, ChevronDown, Sparkles, CheckCircle2, Sun, Moon, Trophy, ArrowDown,
} from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Particles from '@/components/Particles';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import modulesData from '@/data/decade_records.json';
import type { Module } from '@/types';

const modules = modulesData as Module[];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Home, HeartPulse, GraduationCap, Wifi, Building2, BookOpen,
  TrendingDown, Landmark, Leaf, Coins, Droplets, Zap, Bus,
  UtensilsCrossed, PawPrint, Wheat, Users, Gavel, Anchor, Fish, Dumbbell,
};

/* ─── Category filter definitions ─── */
interface Category {
  key: string;
  label: string;
  label_ml: string;
  emoji: string;
  slugs: string[];
}

const CATEGORIES: Category[] = [
  { key: 'all', label: 'All', label_ml: 'എല്ലാം', emoji: '', slugs: [] },
  { key: 'infra', label: 'Infrastructure', label_ml: 'അടിസ്ഥാന സൗകര്യം', emoji: '\u{1F3D7}\uFE0F', slugs: ['public-works', 'transport', 'ports', 'power'] },
  { key: 'social', label: 'Social Welfare', label_ml: 'സാമൂഹിക ക്ഷേമം', emoji: '\u{1F3E5}', slugs: ['health', 'education', 'sc-st-development', 'higher-education'] },
  { key: 'economy', label: 'Economy', label_ml: 'സമ്പദ്\u200Cവ്യവസ്ഥ', emoji: '\u{1F4B0}', slugs: ['finance', 'planning', 'it-electronics', 'industries'] },
  { key: 'environment', label: 'Environment', label_ml: 'പരിസ്ഥിതി', emoji: '\u{1F33F}', slugs: ['forest-wildlife', 'water-resources', 'agriculture'] },
  { key: 'governance', label: 'Governance', label_ml: 'ഭരണം', emoji: '\u{1F3AF}', slugs: ['lsgd', 'revenue', 'food-civil-supplies', 'cooperation'] },
  { key: 'culture', label: 'Culture & Sports', label_ml: 'സംസ്കാരം & കായികം', emoji: '\u{1F3C5}', slugs: ['sports-youth', 'fisheries', 'animal-husbandry'] },
];

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

/* ─── Kerala Map SVG with stroke-dasharray draw animation ─── */
function KeralaMapSVG() {
  return (
    <svg
      viewBox="0 0 120 300"
      className="w-16 h-28 md:w-20 md:h-36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M75 8 C72 12, 78 18, 74 24 C70 30, 76 36, 72 42 C68 48, 74 54, 70 60 C66 66, 72 72, 68 78 C64 84, 70 90, 66 96 C62 102, 68 108, 64 114 C60 120, 66 126, 62 132 C58 138, 64 144, 60 150 C56 156, 62 162, 58 168 C54 174, 60 180, 56 186 C52 192, 58 198, 54 204 C50 210, 56 216, 52 222 C48 228, 54 234, 50 240 C46 246, 52 252, 48 258 C44 264, 40 268, 36 272 C32 276, 28 278, 30 282 C32 286, 38 284, 42 280 C46 276, 52 272, 56 268 C60 264, 64 258, 68 252 C72 246, 76 240, 78 234 C80 228, 82 222, 84 216 C86 210, 88 204, 86 198 C84 192, 86 186, 84 180 C82 174, 84 168, 82 162 C80 156, 82 150, 80 144 C78 138, 80 132, 78 126 C76 120, 78 114, 80 108 C82 102, 80 96, 82 90 C84 84, 82 78, 84 72 C86 66, 84 60, 82 54 C80 48, 82 42, 80 36 C78 30, 80 24, 78 18 C76 12, 77 8, 75 8Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
      />
      {/* Highlight dots for major cities */}
      {[
        { cx: 76, cy: 30, label: 'Kannur' },
        { cx: 74, cy: 50, label: 'Kozhikode' },
        { cx: 72, cy: 72, label: 'Kochi' },
        { cx: 56, cy: 200, label: 'Trivandrum' },
      ].map((city, i) => (
        <motion.circle
          key={city.label}
          cx={city.cx}
          cy={city.cy}
          r="3"
          fill="#fbbf24"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2 + i * 0.2, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}

/* ─── Marquee Ticker ─── */
function MarqueeTicker({ isMl }: { isMl: boolean }) {
  const items = isMl
    ? [
        'SDG സൂചികയിൽ കേരളം ഒന്നാമത്',
        '100% സാക്ഷരതാ മിഷൻ',
        'ഇന്ത്യയിലെ ആദ്യ വാട്ടർ മെട്രോ',
        '5 ലക്ഷം+ LIFE ഭവനങ്ങൾ',
        'K-FON: ഇന്റർനെറ്റ് ഒരു അവകാശം',
      ]
    : [
        'Kerala #1 in SDG Index',
        '100% Literacy Mission',
        'First Water Metro in India',
        '5 Lakh+ LIFE Houses',
        'K-FON Internet as Right',
      ];

  const repeatedItems = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <motion.div
        className="inline-flex gap-8 py-2 px-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {repeatedItems.map((item, i) => (
          <span key={i} className="text-xs md:text-sm font-medium text-white/80 inline-flex items-center gap-2">
            <span className="text-amber-300">&#9670;</span> {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Achievement Counter Section ─── */
function AchievementCounters({ isMl }: { isMl: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const houses = useCountUp(500000, 2000, isInView);
  const budget = useCountUp(233, 2000, isInView);
  const literacy = useCountUp(962, 2000, isInView);

  const formatHouses = (n: number) => {
    if (n >= 500000) return '5,00,000+';
    const lakh = Math.floor(n / 100000);
    const rest = n % 100000;
    if (lakh > 0) return `${lakh},${String(rest).padStart(5, '0')}`;
    return n.toLocaleString('en-IN');
  };

  const stats = [
    {
      displayValue: formatHouses(houses),
      label: isMl ? 'LIFE വീടുകൾ' : 'Houses Built',
      sublabel: isMl ? 'LIFE മിഷൻ' : 'LIFE Mission',
      icon: '\u{1F3E0}',
    },
    {
      displayValue: `\u20B9${budget >= 233 ? '2.33' : (budget / 100).toFixed(2)}L Cr`,
      label: isMl ? 'സംസ്ഥാന ബജറ്റ്' : 'State Budget',
      sublabel: '2025-26',
      icon: '\u{1F4B0}',
    },
    {
      displayValue: '#1',
      label: isMl ? 'SDG ഇന്ത്യ സൂചിക' : 'SDG India Index',
      sublabel: isMl ? 'റാങ്ക്' : 'Rank',
      icon: '\u{1F3C6}',
    },
    {
      displayValue: `${literacy >= 962 ? '96.2' : (literacy / 10).toFixed(1)}%`,
      label: isMl ? 'സാക്ഷരതാ നിരക്ക്' : 'Literacy Rate',
      sublabel: isMl ? 'ദേശീയ ഒന്നാമത്' : 'Highest in India',
      icon: '\u{1F4DA}',
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass-card p-4 md:p-5 rounded-2xl text-center relative overflow-hidden"
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <p className="text-xl md:text-2xl font-black gradient-text tracking-tight">
            {stat.displayValue}
          </p>
          <p className="text-xs font-bold mt-1" style={{ color: 'var(--kl-text)' }}>
            {stat.label}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
            {stat.sublabel}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Question of the Day ─── */
function QuestionOfTheDay({ isMl }: { isMl: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Date-based seed for daily question
  const dailyQuestion = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const allQuestions = modules.flatMap((m) =>
      m.questions.map((q) => ({ ...q, moduleTitle: isMl ? m.title_ml : m.title, moduleColor: m.color }))
    );
    const index = seed % allQuestions.length;
    return allQuestions[index];
  }, [isMl]);

  const questionText = isMl && dailyQuestion.question_ml ? dailyQuestion.question_ml : dailyQuestion.question;
  const options = isMl && dailyQuestion.options_ml ? dailyQuestion.options_ml : dailyQuestion.options;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl mb-8 overflow-hidden"
      style={{ border: '1px solid var(--kl-border)' }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 md:p-5 text-left"
      >
        <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #059669, #0d9488)' }}>
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--kl-green)' }}>
            {isMl ? 'ഇന്നത്തെ ചോദ്യം' : 'Question of the Day'}
          </p>
          <p className="text-sm md:text-base font-semibold truncate mt-0.5" style={{ color: 'var(--kl-text)' }}>
            {questionText}
          </p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'var(--kl-text-dim)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-2">
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--kl-text)' }}>
                {questionText}
              </p>
              {options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === dailyQuestion.answer;
                const showResult = selectedOption !== null;

                let bgStyle: React.CSSProperties = {};
                let textColor = 'var(--kl-text)';

                if (showResult && isCorrect) {
                  bgStyle = { background: '#d1fae5', border: '1px solid #059669' };
                  textColor = '#065f46';
                } else if (showResult && isSelected && !isCorrect) {
                  bgStyle = { background: '#fee2e2', border: '1px solid #dc2626' };
                  textColor = '#991b1b';
                } else {
                  bgStyle = { background: 'var(--kl-bg-alt)', border: '1px solid var(--kl-border)' };
                }

                return (
                  <button
                    key={i}
                    onClick={() => selectedOption === null && setSelectedOption(i)}
                    disabled={selectedOption !== null}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ ...bgStyle, color: textColor }}
                  >
                    <span className="mr-2 font-bold" style={{ opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt}
                    {showResult && isCorrect && ' \u2713'}
                  </button>
                );
              })}
              {selectedOption !== null && dailyQuestion.flex_fact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 p-3 rounded-xl text-xs"
                  style={{ background: 'var(--kl-flex-fact-bg)', color: 'var(--kl-text-dim)' }}
                >
                  <span className="font-bold" style={{ color: 'var(--kl-green)' }}>
                    {isMl ? 'രസകരമായ വസ്തുത: ' : 'Fun Fact: '}
                  </span>
                  {isMl && dailyQuestion.flex_fact_ml ? dailyQuestion.flex_fact_ml : dailyQuestion.flex_fact}
                </motion.div>
              )}
              <p className="text-[10px] pt-1" style={{ color: 'var(--kl-text-dim)', opacity: 0.6 }}>
                {dailyQuestion.moduleTitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function HomePage() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<'en' | 'ml'>('ml');
  const [activeCategory, setActiveCategory] = useState('all');
  const { progress, getModuleProgress, completedCount } = useProgress();
  const { isDark, toggleTheme } = useTheme();
  const quizGridRef = useRef<HTMLDivElement>(null);

  const isMl = lang === 'ml';

  // Filter by category then search
  const filtered = modules.filter((m) => {
    const cat = CATEGORIES.find((c) => c.key === activeCategory);
    if (cat && cat.key !== 'all' && !cat.slugs.includes(m.slug)) return false;
    if (!search) return true;
    return (
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.title_ml.includes(search) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalQ = modules.reduce((a, m) => a + m.questions.length, 0);

  const scrollToQuiz = () => {
    quizGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Count modules per category
  const getCategoryCount = (cat: Category) => {
    if (cat.key === 'all') return modules.length;
    return modules.filter((m) => cat.slugs.includes(m.slug)).length;
  };

  return (
    <main className="min-h-screen bg-kerala-hero relative">
      <div className="leaf-pattern" />
      <Particles />

      {/* ═══ MARQUEE TICKER ═══ */}
      <div className="relative z-20">
        <MarqueeTicker isMl={isMl} />
      </div>

      {/* ═══ HERO SECTION — Bold Emerald Gradient with Kerala Map ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hero-gradient relative"
      >
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-14 md:pt-10 md:pb-20 relative z-10">
          {/* Top controls */}
          <div className="flex justify-end gap-2 mb-6 md:mb-8">
            <button
              onClick={toggleTheme}
              className="stat-pill p-2.5 rounded-full transition-all active:scale-90"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-yellow-300" />
                : <Moon className="w-4 h-4 text-white/80" />
              }
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="stat-pill px-4 py-2 rounded-full text-xs font-bold text-white transition-all active:scale-95"
            >
              {isMl ? 'English' : '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02'}
            </button>
          </div>

          {/* Hero content */}
          <div className="text-center">
            {/* Kerala Map SVG instead of MapPin */}
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="icon-float">
                <KeralaMapSVG />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight"
            >
              {isMl ? '\u0D15\u0D47\u0D30\u0D33 \u0D26\u0D36\u0D15 \u0D15\u0D4D\u0D35\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D4D' : 'Kerala Decade Quest'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-white/80 mt-1 font-medium"
            >
              2016 — 2026
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-sm md:text-base text-white/60 mt-2"
            >
              {isMl ? '\u0D12\u0D30\u0D41 \u0D26\u0D36\u0D15\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D4D\u0D31\u0D46 \u0D2D\u0D30\u0D23 \u0D28\u0D47\u0D1F\u0D4D\u0D1F\u0D19\u0D4D\u0D19\u0D33\u0D4D' : '10 Years of Governance Achievements'}
            </motion.p>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex justify-center gap-3 md:gap-5 mt-7 md:mt-9"
            >
              {[
                { value: '21', label: isMl ? '\u0D2E\u0D28\u0D4D\u0D24\u0D4D\u0D30\u0D3E\u0D32\u0D2F\u0D19\u0D4D\u0D19\u0D33\u0D4D' : 'Ministries', color: 'text-emerald-200' },
                { value: String(totalQ), label: isMl ? '\u0D1A\u0D4B\u0D26\u0D4D\u0D2F\u0D19\u0D4D\u0D19\u0D33\u0D4D' : 'Questions', color: 'text-amber-300' },
                { value: '10', label: isMl ? '\u0D35\u0D7C\u0D37\u0D19\u0D4D\u0D19\u0D33\u0D4D' : 'Years', color: 'text-white' },
              ].map((stat) => (
                <div key={stat.label} className="stat-pill px-5 py-3 md:px-7 md:py-4 rounded-2xl text-center min-w-[90px]">
                  <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-8 md:mt-10"
            >
              <button
                onClick={scrollToQuiz}
                className="glow-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm md:text-base font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}
              >
                {isMl ? '\u0D28\u0D3F\u0D19\u0D4D\u0D19\u0D33\u0D4D\u0D15\u0D4D\u0D15\u0D4D \u0D15\u0D47\u0D30\u0D33\u0D24\u0D4D\u0D24\u0D46 \u0D0E\u0D24\u0D4D\u0D30 \u0D05\u0D31\u0D3F\u0D2F\u0D3E\u0D02?' : 'How well do you know Kerala?'}
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-xs text-white/40 mt-4"
            >
              {isMl
                ? '10,000+ \u0D15\u0D47\u0D30\u0D33\u0D40\u0D2F\u0D7C \u0D07\u0D24\u0D3F\u0D28\u0D15\u0D02 \u0D2A\u0D19\u0D4D\u0D15\u0D46\u0D1F\u0D41\u0D24\u0D4D\u0D24\u0D41!'
                : 'Join 10,000+ Keralites testing their knowledge!'}
            </motion.p>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-6 md:h-8" style={{ background: 'var(--kl-bg)', borderRadius: '24px 24px 0 0' }} />
      </motion.section>

      {/* ═══ BODY — White section ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 -mt-2 pb-20">

        {/* ═══ ACHIEVEMENT COUNTERS ═══ */}
        <AchievementCounters isMl={isMl} />

        {/* ═══ QUESTION OF THE DAY ═══ */}
        <QuestionOfTheDay isMl={isMl} />

        {/* Progress overview */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-5 rounded-2xl mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? '\u0D28\u0D3F\u0D19\u0D4D\u0D19\u0D33\u0D41\u0D1F\u0D46 \u0D2A\u0D41\u0D30\u0D4B\u0D17\u0D24\u0D3F' : 'Your Progress'}
              </p>
              <p className="text-sm font-bold gradient-text-green">
                {completedCount}/21 {isMl ? '\u0D2A\u0D42\u0D7C\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3E\u0D15\u0D4D\u0D15\u0D3F' : 'completed'}
              </p>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--kl-bar-track)' }}>
              <motion.div
                className="h-full rounded-full progress-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / 21) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <p className="text-xs" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? '\u0D2E\u0D4A\u0D24\u0D4D\u0D24\u0D02 \u0D38\u0D4D\u0D15\u0D4B\u0D7C' : 'Total best score'}
              </p>
              <p className="text-sm font-bold" style={{ color: 'var(--kl-gold)' }}>
                {progress.totalScore}/{totalQ}
              </p>
            </div>
          </motion.div>
        )}

        {/* ═══ CATEGORY TABS ═══ */}
        <div ref={quizGridRef} className="mb-4 scroll-mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat.key}
                  onClick={() => { setActiveCategory(cat.key); setSearch(''); }}
                  className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #059669, #0d9488)' : 'var(--kl-bg-alt)',
                    color: isActive ? 'white' : 'var(--kl-text-dim)',
                    border: `1px solid ${isActive ? 'transparent' : 'var(--kl-border)'}`,
                  }}
                >
                  {cat.emoji ? `${cat.emoji} ` : ''}{isMl ? cat.label_ml : cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--kl-text-dim)' }} />
          <input
            type="text"
            placeholder={isMl ? '\u0D2E\u0D28\u0D4D\u0D24\u0D4D\u0D30\u0D3E\u0D32\u0D2F\u0D19\u0D4D\u0D19\u0D33\u0D4D \u0D24\u0D3F\u0D30\u0D2F\u0D41\u0D15...' : 'Search ministries...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm outline-none glass-card focus:ring-2 focus:ring-emerald-500/30"
            style={{ color: 'var(--kl-text)', border: '1px solid var(--kl-border)' }}
          />
        </motion.div>

        {/* Ministry grid -- 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filtered.map((mod, idx) => {
            const Icon = ICON_MAP[mod.icon] || Home;
            const mp = getModuleProgress(mod.slug);
            const isCompleted = !!mp;
            const bestPct = mp ? Math.round((mp.bestScore / mp.totalQuestions) * 100) : 0;

            return (
              <motion.div
                key={mod.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.03, duration: 0.3 }}
              >
                <Link href={`/quiz/${mod.slug}`}>
                  <div className="ministry-card flex items-center gap-4 p-4 md:p-5 rounded-2xl">
                    {/* Colored icon */}
                    <div className="shrink-0">
                      <div
                        className="p-3 md:p-3.5 rounded-xl"
                        style={{
                          backgroundColor: `${mod.color}12`,
                          border: `1px solid ${mod.color}20`,
                        }}
                      >
                        <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: mod.color }} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-[15px] md:text-base truncate" style={{ color: 'var(--kl-text)' }}>
                          {isMl ? mod.title_ml : mod.title}
                        </h3>
                        {isCompleted && (
                          <CheckCircle2
                            className="w-4 h-4 shrink-0"
                            style={{ color: bestPct >= 80 ? '#d97706' : '#059669' }}
                          />
                        )}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
                        {isMl ? mod.title : mod.title_ml}
                      </p>
                    </div>

                    {/* Score or count badge */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isCompleted ? (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{
                            background: bestPct >= 80 ? '#fef3c7' : bestPct >= 60 ? '#d1fae5' : `${mod.color}10`,
                            color: bestPct >= 80 ? '#92400e' : bestPct >= 60 ? '#065f46' : mod.color,
                          }}
                        >
                          {mp.bestScore}/{mp.totalQuestions}
                        </span>
                      ) : (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{
                            background: `${mod.color}10`,
                            color: mod.color,
                          }}
                        >
                          {mod.questions.length}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--kl-text-dim)' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--kl-text-dim)' }} />
            <p className="text-sm" style={{ color: 'var(--kl-text-dim)' }}>
              {isMl ? `"${search}" \u0D15\u0D23\u0D4D\u0D1F\u0D46\u0D24\u0D4D\u0D24\u0D3F\u0D2F\u0D3F\u0D32\u0D4D\u0D32` : `No ministries found for "${search}"`}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center space-y-3">
          <div
            className="h-px mx-auto w-28 mb-5"
            style={{ background: 'linear-gradient(90deg, transparent, #059669, #d97706, transparent)' }}
          />
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#d97706' }} />
            <p className="text-xs font-medium" style={{ color: 'var(--kl-text-dim)' }}>
              {isMl
                ? '\u0D21\u0D3E\u0D31\u0D4D\u0D31: \u0D28\u0D40\u0D24\u0D3F \u0D06\u0D2F\u0D4B\u0D17\u0D4D, \u0D06\u0D7C\u0D2C\u0D3F\u0D10, \u0D15\u0D47\u0D30\u0D33 \u0D06\u0D38\u0D42\u0D24\u0D4D\u0D30\u0D23 \u0D2C\u0D4B\u0D7C\u0D21\u0D4D'
                : 'Data: NITI Aayog, RBI, Kerala Planning Board'}
            </p>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--kl-text-dim)', opacity: 0.5 }}>
            {isMl ? '\u0D35\u0D3F\u0D26\u0D4D\u0D2F\u0D3E\u0D2D\u0D4D\u0D2F\u0D3E\u0D38 \u0D09\u0D2A\u0D15\u0D30\u0D23\u0D02 \u2014 \u0D13\u0D30\u0D4B \u0D1A\u0D4B\u0D26\u0D4D\u0D2F\u0D24\u0D4D\u0D24\u0D3F\u0D28\u0D41\u0D02 \u0D09\u0D31\u0D35\u0D3F\u0D1F\u0D02' : 'Educational tool \u2014 sources cited per question'}
          </p>
        </footer>
      </div>
    </main>
  );
}
