'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home, HeartPulse, GraduationCap, Wifi, Building2, BookOpen,
  TrendingDown, Landmark, Leaf, Coins, Droplets, Zap, Bus,
  UtensilsCrossed, PawPrint, Wheat, Users, Gavel, Anchor, Fish, Dumbbell,
  Search, ChevronRight, MapPin, Sparkles, CheckCircle2, Sun, Moon,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<'en' | 'ml'>('en');
  const { progress, getModuleProgress, completedCount } = useProgress();
  const { isDark, toggleTheme } = useTheme();

  const filtered = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.title_ml.includes(search) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalQ = modules.reduce((a, m) => a + m.questions.length, 0);
  const isMl = lang === 'ml';

  return (
    <main className="min-h-screen bg-kerala-hero relative">
      <div className="leaf-pattern" />
      <Particles />

      {/* ═══ HERO SECTION — Bold Emerald Gradient ═══ */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hero-gradient relative"
      >
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-14 md:pt-10 md:pb-20 relative z-10">
          {/* Top controls */}
          <div className="flex justify-end gap-2 mb-8 md:mb-10">
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
            <motion.div
              className="flex justify-center mb-5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="icon-float w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <MapPin className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl md:text-5xl font-black text-white tracking-tight"
            >
              {isMl ? 'കേരള ദശക ക്വസ്റ്റ്' : 'Kerala Decade Quest'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-base md:text-lg text-white/70 mt-2 md:mt-3"
            >
              {isMl ? 'ഒരു ദശകത്തിന്റെ ഭരണ നേട്ടങ്ങൾ — 2016–2026' : '10 Years of Governance — 2016–2026'}
            </motion.p>

            {/* Stats pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex justify-center gap-3 md:gap-5 mt-7 md:mt-10"
            >
              {[
                { value: '21', label: isMl ? 'മന്ത്രാലയങ്ങൾ' : 'Ministries', color: 'text-emerald-200' },
                { value: String(totalQ), label: isMl ? 'ചോദ്യങ്ങൾ' : 'Questions', color: 'text-amber-300' },
                { value: '10', label: isMl ? 'വർഷങ്ങൾ' : 'Years', color: 'text-white' },
              ].map((stat) => (
                <div key={stat.label} className="stat-pill px-5 py-3 md:px-7 md:py-4 rounded-2xl text-center min-w-[90px]">
                  <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-6 md:h-8" style={{ background: 'var(--kl-bg)', borderRadius: '24px 24px 0 0' }} />
      </motion.section>

      {/* ═══ BODY — White section ═══ */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 -mt-2 pb-20">
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

        {/* Ministry grid — 1 col mobile, 2 col desktop */}
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
                transition={{ delay: 0.6 + idx * 0.03, duration: 0.3 }}
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
