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

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8 pb-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Top controls */}
          <div className="flex justify-end gap-2 mb-5">
            <button
              onClick={toggleTheme}
              className="glass-card p-2 rounded-full transition-all active:scale-90"
            >
              {isDark ? <Sun className="w-4 h-4" style={{ color: 'var(--kl-gold)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--kl-text-dim)' }} />}
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="glass-card px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ color: 'var(--kl-gold)' }}
            >
              {isMl ? 'English' : 'മലയാളം'}
            </button>
          </div>

          {/* Hero section */}
          <div className="text-center mb-7">
            <motion.div
              className="flex justify-center mb-5"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative icon-float">
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                  style={{ background: 'linear-gradient(135deg, var(--kl-green-light), var(--kl-teal))' }}
                />
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center glass-card gradient-border">
                  <MapPin className="w-7 h-7" style={{ color: 'var(--kl-green-light)' }} />
                </div>
              </div>
            </motion.div>

            <h1 className="text-2xl font-black gradient-text">
              {isMl ? 'കേരള ദശക ക്വസ്റ്റ്' : 'Kerala Decade Quest'}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--kl-text-dim)' }}>
              {isMl ? 'ഒരു ദശകത്തിന്റെ ഭരണ നേട്ടങ്ങൾ — 2016–2026' : '10 Years of Governance — 2016–2026'}
            </p>
          </div>

          {/* Stats bar — glass card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card gradient-border flex justify-around py-3.5 rounded-2xl mb-6"
          >
            <div className="text-center">
              <p className="text-xl font-black gradient-text-green">21</p>
              <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? 'മന്ത്രാലയങ്ങൾ' : 'Ministries'}
              </p>
            </div>
            <div className="w-px" style={{ background: 'var(--kl-glass-border)' }} />
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: 'var(--kl-gold)' }}>{totalQ}</p>
              <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? 'ചോദ്യങ്ങൾ' : 'Questions'}
              </p>
            </div>
            <div className="w-px" style={{ background: 'var(--kl-glass-border)' }} />
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: 'var(--kl-text)' }}>10</p>
              <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
                {isMl ? 'വർഷങ്ങൾ' : 'Years'}
              </p>
            </div>
          </motion.div>

          {/* Progress overview — only show if user has started playing */}
          {completedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card gradient-border rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold" style={{ color: 'var(--kl-text-dim)' }}>
                  {isMl ? 'നിങ്ങളുടെ പുരോഗതി' : 'Your Progress'}
                </p>
                <p className="text-xs font-bold gradient-text-green">
                  {completedCount}/21 {isMl ? 'പൂർത്തിയാക്കി' : 'completed'}
                </p>
              </div>
              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <motion.div
                  className="h-full rounded-full progress-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / 21) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px]" style={{ color: 'var(--kl-text-dim)' }}>
                  {isMl ? 'മൊത്തം സ്കോർ' : 'Total best score'}
                </p>
                <p className="text-xs font-bold" style={{ color: 'var(--kl-gold)' }}>
                  {progress.totalScore}/{totalQ}
                </p>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="relative mb-5"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--kl-text-dim)' }} />
          <input
            type="text"
            placeholder={isMl ? 'മന്ത്രാലയങ്ങൾ തിരയുക...' : 'Search ministries...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none glass-card placeholder:text-[var(--kl-text-dim)] focus:ring-1 focus:ring-[var(--kl-green)]"
            style={{ color: 'var(--kl-text)' }}
          />
        </motion.div>

        {/* Ministry list */}
        <div className="space-y-2.5">
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
                transition={{ delay: 0.5 + idx * 0.035, duration: 0.35 }}
              >
                <Link href={`/quiz/${mod.slug}`}>
                  <div className="ministry-card glass-card flex items-center gap-3.5 p-4 rounded-2xl">
                    {/* Icon with glow */}
                    <div className="shrink-0 relative">
                      <div
                        className="absolute inset-0 rounded-xl blur-lg"
                        style={{ backgroundColor: mod.color, opacity: 0.2 }}
                      />
                      <div
                        className="relative p-2.5 rounded-xl"
                        style={{
                          backgroundColor: `${mod.color}12`,
                          border: `1px solid ${mod.color}20`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: mod.color }} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm truncate" style={{ color: 'var(--kl-text)' }}>
                          {isMl ? mod.title_ml : mod.title}
                        </h3>
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: bestPct >= 80 ? 'var(--kl-gold)' : 'var(--kl-green-light)' }} />
                        )}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
                        {isMl ? mod.title : mod.title_ml}
                      </p>
                    </div>

                    {/* Right side — score badge or question count */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isCompleted ? (
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-lg"
                          style={{
                            background: bestPct >= 80
                              ? 'rgba(240,195,94,0.12)'
                              : bestPct >= 60
                              ? 'rgba(0,232,138,0.1)'
                              : `${mod.color}12`,
                            color: bestPct >= 80 ? 'var(--kl-gold)' : bestPct >= 60 ? 'var(--kl-green-light)' : mod.color,
                            border: `1px solid ${bestPct >= 80 ? 'rgba(240,195,94,0.2)' : bestPct >= 60 ? 'rgba(0,232,138,0.15)' : mod.color + '18'}`,
                          }}
                        >
                          {mp.bestScore}/{mp.totalQuestions}
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-lg"
                          style={{
                            background: `${mod.color}12`,
                            color: mod.color,
                            border: `1px solid ${mod.color}18`,
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
          <div className="text-center py-12">
            <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--kl-text-dim)' }} />
            <p className="text-sm" style={{ color: 'var(--kl-text-dim)' }}>
              {isMl ? `"${search}" കണ്ടെത്തിയില്ല` : `No ministries found for "${search}"`}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-14 text-center space-y-3">
          <div
            className="h-px mx-auto w-24 mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, var(--kl-green-light), var(--kl-gold), transparent)' }}
          />
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3" style={{ color: 'var(--kl-gold)' }} />
            <p className="text-[11px] font-medium" style={{ color: 'var(--kl-text-dim)' }}>
              {isMl
                ? 'ഡാറ്റ: നീതി ആയോഗ്, ആർബിഐ, കേരള ആസൂത്രണ ബോർഡ്'
                : 'Data: NITI Aayog, RBI, Kerala Planning Board'}
            </p>
          </div>
          <p className="text-[10px]" style={{ color: 'var(--kl-text-dim)', opacity: 0.6 }}>
            {isMl ? 'വിദ്യാഭ്യാസ ഉപകരണം — ഓരോ ചോദ്യത്തിനും ഉറവിടം' : 'Educational tool — sources cited per question'}
          </p>
        </footer>
      </div>
    </main>
  );
}
