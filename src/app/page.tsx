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
import { sanitizeDeepMalayalam } from '@/utils/malayalamText';
import type { Module } from '@/types';

const modules = sanitizeDeepMalayalam(modulesData as Module[]);

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
  { key: 'economy', label: 'Economy', label_ml: 'സമ്പദ്വ്യവസ്ഥ', emoji: '\u{1F4B0}', slugs: ['finance', 'planning', 'it-electronics', 'industries'] },
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

/* ─── Kerala Map as Quiz Bulb Logo ─── */
const KERALA_PATH = "M13.3,0.0 L14.5,2.8 L12.2,5.8 L14.9,6.5 L14.4,7.9 L18.7,7.3 L18.5,12.8 L22.0,12.1 L22.3,9.0 L25.0,11.2 L28.8,11.1 L29.9,12.4 L28.1,15.4 L29.7,17.1 L33.9,16.3 L34.1,20.7 L36.1,22.5 L41.5,17.6 L46.6,20.2 L40.9,23.4 L42.0,26.9 L44.3,27.0 L44.4,29.1 L47.4,29.7 L47.6,33.0 L51.1,31.9 L52.2,29.5 L55.4,29.1 L56.2,32.7 L53.1,34.2 L50.6,33.6 L50.5,38.0 L56.1,42.1 L54.9,44.6 L57.0,48.8 L55.9,50.1 L62.3,50.1 L71.7,63.6 L77.6,64.4 L79.9,69.3 L84.3,68.6 L85.8,72.5 L93.7,71.2 L93.5,73.9 L96.8,78.1 L96.9,80.9 L101.9,84.6 L114.1,86.3 L125.1,81.5 L126.0,94.3 L132.8,92.2 L134.5,93.2 L136.2,98.6 L141.6,98.2 L147.9,105.5 L155.2,103.2 L156.4,106.8 L154.1,108.4 L157.9,115.2 L152.5,116.3 L151.6,119.2 L148.0,120.7 L147.3,119.7 L144.3,122.1 L141.5,119.3 L137.0,122.1 L138.7,125.7 L138.5,132.6 L142.3,131.1 L146.6,134.1 L147.9,132.7 L153.6,135.7 L155.6,135.2 L155.4,137.0 L159.4,140.4 L165.6,142.4 L165.5,143.8 L168.4,143.3 L167.5,148.1 L168.6,149.3 L166.0,152.3 L159.2,155.5 L158.4,159.1 L159.9,160.5 L163.4,158.2 L177.0,159.9 L184.4,155.3 L187.2,157.6 L186.8,160.0 L183.6,161.9 L183.8,164.0 L188.6,166.3 L188.1,169.1 L189.5,170.9 L188.4,173.7 L191.5,175.2 L194.0,174.2 L190.4,176.0 L185.4,175.3 L179.6,186.0 L188.0,190.3 L196.6,192.2 L199.3,195.8 L198.9,197.7 L203.7,198.4 L204.6,201.3 L203.2,207.7 L200.4,210.9 L202.1,215.5 L195.4,215.8 L195.7,219.0 L197.8,219.9 L195.6,236.9 L198.9,242.4 L196.9,248.9 L198.8,250.7 L201.4,249.4 L201.2,251.7 L205.5,255.9 L207.8,255.4 L212.1,257.5 L218.9,253.6 L218.4,251.2 L220.2,249.8 L231.3,243.7 L237.3,244.3 L236.5,247.7 L240.1,252.9 L239.8,256.3 L242.1,255.9 L243.2,257.6 L241.1,266.4 L237.6,266.5 L233.9,269.1 L240.0,276.3 L239.2,278.3 L241.3,281.9 L235.6,288.9 L235.1,291.7 L237.6,293.4 L236.1,296.9 L238.6,299.5 L236.2,300.3 L236.0,306.2 L234.2,306.8 L234.4,309.7 L230.4,317.8 L234.8,317.9 L237.5,321.1 L240.8,321.8 L245.7,319.0 L247.8,322.0 L249.4,318.8 L250.4,319.5 L248.9,322.6 L250.4,325.7 L252.4,327.4 L254.0,326.6 L255.0,328.6 L253.2,333.2 L250.5,333.3 L248.8,335.2 L246.5,345.5 L243.8,345.6 L243.7,348.2 L242.0,349.2 L242.1,357.5 L239.0,360.4 L240.6,364.0 L235.0,369.5 L233.6,374.7 L230.8,374.7 L228.6,377.2 L233.5,383.7 L233.5,386.8 L235.9,386.6 L236.1,389.1 L239.6,391.9 L240.2,395.2 L237.0,400.8 L233.8,402.3 L233.2,404.9 L231.0,404.6 L234.6,412.9 L242.1,424.1 L240.4,428.3 L234.2,429.1 L236.6,434.6 L234.5,434.9 L231.0,440.7 L229.1,440.6 L229.2,443.9 L231.1,443.3 L231.6,447.2 L227.8,446.2 L223.7,450.1 L212.0,441.2 L210.8,437.9 L180.9,400.2 L174.0,392.4 L168.6,389.4 L164.4,375.2 L148.0,339.0 L138.0,282.3 L133.9,274.3 L123.5,240.8 L118.0,229.8 L119.5,231.3 L117.7,227.0 L119.2,226.6 L120.6,228.3 L120.3,225.7 L117.8,222.7 L118.5,225.9 L117.0,228.6 L103.9,199.0 L98.9,173.9 L94.7,163.8 L96.0,162.4 L93.8,162.0 L87.7,143.5 L83.7,136.9 L75.8,131.5 L67.9,108.5 L66.6,108.7 L61.1,102.4 L59.5,102.6 L52.5,93.4 L49.5,93.8 L45.8,89.3 L44.6,85.1 L48.8,86.3 L45.6,81.9 L42.5,80.3 L43.3,84.0 L37.3,76.9 L34.1,78.8 L22.7,50.3 L12.8,30.0 L11.7,30.2 L0.0,3.4 L2.2,3.9 L13.3,0.0 Z";

function KeralaMapBulbLogo() {
  return (
    <svg
      viewBox="0 0 200 280"
      className="w-24 h-36 md:w-32 md:h-44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="innerGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft glow behind bulb */}
      <motion.ellipse
        cx="100" cy="110" rx="70" ry="85"
        fill="url(#innerGlow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bulb glass outline */}
      <motion.path
        d="M100 12 C62 12, 32 50, 32 95 C32 130, 50 155, 68 175 C72 180, 74 190, 74 198 L126 198 C126 190, 128 180, 132 175 C150 155, 168 130, 168 95 C168 50, 138 12, 100 12Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}
      />

      {/* Real Kerala map (GeoJSON) — filled silhouette as filament */}
      {/* Original viewBox: 0 0 255 450 → scaled to fit bulb interior */}
      <g transform="translate(55, 25) scale(0.355)">
        <motion.path
          d={KERALA_PATH}
          fill="#fbbf24"
          fillOpacity="0.6"
          stroke="#fbbf24"
          strokeWidth="3"
          strokeLinejoin="round"
          filter="url(#glowFilter)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }}
        />
        {/* Glow pulse on map */}
        <motion.path
          d={KERALA_PATH}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="8"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 3, ease: 'easeInOut' }}
          style={{ filter: 'blur(6px)' }}
        />
      </g>

      {/* Bulb screw base */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <rect x="74" y="198" width="52" height="6" rx="1" fill="white" fillOpacity="0.7" />
        <rect x="76" y="206" width="48" height="5" rx="1" fill="white" fillOpacity="0.5" />
        <rect x="78" y="213" width="44" height="5" rx="1" fill="white" fillOpacity="0.35" />
        <rect x="80" y="220" width="40" height="5" rx="1" fill="white" fillOpacity="0.25" />
        <path d="M84 225 L100 236 L116 225" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round" />
      </motion.g>

      {/* Light rays */}
      {[
        { x1: 28, y1: 50, x2: 16, y2: 42 },
        { x1: 20, y1: 95, x2: 6, y2: 95 },
        { x1: 28, y1: 140, x2: 16, y2: 148 },
        { x1: 172, y1: 50, x2: 184, y2: 42 },
        { x1: 180, y1: 95, x2: 194, y2: 95 },
        { x1: 172, y1: 140, x2: 184, y2: 148 },
      ].map((ray, i) => (
        <motion.line
          key={i}
          x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ delay: 3 + i * 0.15, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
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
    <div
      className="overflow-hidden whitespace-nowrap"
      style={{ background: 'color-mix(in srgb, var(--kl-green) 14%, transparent)' }}
    >
      <motion.div
        className="inline-flex gap-8 py-2 px-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {repeatedItems.map((item, i) => (
          <span
            key={i}
            className="text-xs md:text-sm font-semibold inline-flex items-center gap-2"
            style={{ color: 'var(--kl-text)' }}
          >
            <span style={{ color: 'var(--kl-gold)' }}>&#9670;</span> {item}
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
          <p
            className={`text-xs font-bold ${isMl ? 'normal-case tracking-normal' : 'uppercase tracking-wider'}`}
            style={{ color: 'var(--kl-green)' }}
          >
            {isMl ? 'ഇന്നത്തെ ചോദ്യം' : 'Question of the Day'}
          </p>
          <p
            className={`text-sm md:text-base font-semibold mt-0.5 ${isMl ? 'whitespace-normal wrap-break-word leading-relaxed' : 'truncate'}`}
            style={{ color: 'var(--kl-text)' }}
          >
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
              <p
                className={`text-sm font-medium mb-3 ${isMl ? 'leading-relaxed wrap-break-word' : ''}`}
                style={{ color: 'var(--kl-text)' }}
              >
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
              {isMl ? 'English' : 'മലയാളം'}
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
                <KeralaMapBulbLogo />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight"
            >
              {isMl ? 'നവകേരള ക്വിസ്' : 'Navakerala Quiz'}
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
              {isMl ? 'അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ!' : 'Discover a Decade of Achievements!'}
            </motion.p>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex justify-center gap-3 md:gap-5 mt-7 md:mt-9"
            >
              {[
                { value: '21', label: isMl ? 'മന്ത്രാലയങ്ങൾ' : 'Ministries', color: 'text-emerald-200' },
                { value: String(totalQ), label: isMl ? 'ചോദ്യങ്ങൾ' : 'Questions', color: 'text-amber-300' },
                { value: '10', label: isMl ? 'വർഷങ്ങൾ' : 'Years', color: 'text-white' },
              ].map((stat) => (
                <div key={stat.label} className="stat-pill px-5 py-3 md:px-7 md:py-4 rounded-2xl text-center min-w-[90px]">
                  <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className={`text-[10px] md:text-xs text-white/50 mt-0.5 ${isMl ? 'tracking-normal normal-case' : 'uppercase tracking-widest'}`}>
                    {stat.label}
                  </p>
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
                {isMl ? 'നിങ്ങൾക്ക് കേരളത്തെ എത്ര അറിയാം?' : 'How well do you know Kerala?'}
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
                ? '10,000+ കേരളീയർ ഇതിനകം പങ്കെടുത്തു!'
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
                {isMl ? 'നിങ്ങളുടെ പുരോഗതി' : 'Your Progress'}
              </p>
              <p className="text-sm font-bold gradient-text-green">
                {completedCount}/21 {isMl ? 'പൂർത്തിയാക്കി' : 'completed'}
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
                {isMl ? 'മൊത്തം സ്കോർ' : 'Total best score'}
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
            placeholder={isMl ? 'മന്ത്രാലയങ്ങൾ തിരയുക...' : 'Search ministries...'}
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
                        <h3
                          className={`font-bold text-[15px] md:text-base ${isMl ? 'leading-relaxed whitespace-normal wrap-break-word' : 'truncate'}`}
                          style={{ color: 'var(--kl-text)' }}
                        >
                          {isMl ? mod.title_ml : mod.title}
                        </h3>
                        {isCompleted && (
                          <CheckCircle2
                            className="w-4 h-4 shrink-0"
                            style={{ color: bestPct >= 80 ? '#d97706' : '#059669' }}
                          />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-0.5 ${isMl ? 'leading-relaxed whitespace-normal wrap-break-word' : 'truncate'}`}
                        style={{ color: 'var(--kl-text-dim)' }}
                      >
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
              {isMl ? `"${search}" കണ്ടെത്തിയില്ല` : `No ministries found for "${search}"`}
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
                ? 'ഡാറ്റ: നീതി ആയോഗ്, ആർബിഐ, കേരള ആസൂത്രണ ബോർഡ്'
                : 'Data: NITI Aayog, RBI, Kerala Planning Board'}
            </p>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--kl-text-dim)', opacity: 0.5 }}>
            {isMl ? 'വിദ്യാഭ്യാസ ഉപകരണം — ഓരോ ചോദ്യത്തിനും ഉറവിടം' : 'Educational tool — sources cited per question'}
          </p>
        </footer>
      </div>
    </main>
  );
}
