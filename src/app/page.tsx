'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Home, HeartPulse, GraduationCap, Wifi, Building2, BookOpen,
  TrendingDown, Landmark, Leaf, Coins, Droplets, Zap, Bus,
  UtensilsCrossed, PawPrint, Wheat, Users, Gavel, Anchor, Fish, Dumbbell,
  Search, ChevronRight, MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  const filtered = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.title_ml.includes(search) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalQ = modules.reduce((a, m) => a + m.questions.length, 0);

  return (
    <main className="min-h-screen bg-kerala-hero relative">
      {/* Leaf pattern overlay */}
      <div className="leaf-pattern" />

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-8 pb-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Language toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)', color: 'var(--kl-gold)' }}
            >
              {lang === 'en' ? 'മലയാളം' : 'English'}
            </button>
          </div>

          {/* Hero section */}
          <div className="text-center mb-6">
            {/* Kerala emblem-inspired decorative element */}
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,137,94,0.2), rgba(232,185,74,0.15))',
                  border: '1px solid rgba(0,214,143,0.15)',
                }}
              >
                <MapPin className="w-7 h-7" style={{ color: 'var(--kl-green-light)' }} />
              </div>
            </div>

            <h1 className="text-2xl font-bold" style={{ color: 'var(--kl-green-light)' }}>
              {lang === 'en' ? 'Kerala Decade Quest' : 'കേരള ദശക ക്വസ്റ്റ്'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--kl-text-dim)' }}>
              {lang === 'en' ? '10 Years of Governance — 2016–2026' : 'ഒരു ദശകത്തിന്റെ ഭരണ നേട്ടങ്ങൾ — 2016–2026'}
            </p>
          </div>

          {/* Stats bar */}
          <div
            className="flex justify-around py-3 rounded-xl mb-6 wave-divider"
            style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)' }}
          >
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: 'var(--kl-green-light)' }}>21</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--kl-text-dim)' }}>
                {lang === 'en' ? 'Ministries' : 'മന്ത്രാലയങ്ങൾ'}
              </p>
            </div>
            <div className="w-px" style={{ background: 'var(--kl-border)' }} />
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: 'var(--kl-gold)' }}>{totalQ}</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--kl-text-dim)' }}>
                {lang === 'en' ? 'Questions' : 'ചോദ്യങ്ങൾ'}
              </p>
            </div>
            <div className="w-px" style={{ background: 'var(--kl-border)' }} />
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: 'var(--kl-text)' }}>10</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--kl-text-dim)' }}>
                {lang === 'en' ? 'Years' : 'വർഷങ്ങൾ'}
              </p>
            </div>
          </div>
        </motion.header>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--kl-text-dim)' }} />
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search ministries...' : 'മന്ത്രാലയങ്ങൾ തിരയുക...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none placeholder:text-[var(--kl-text-dim)] focus:ring-1"
            style={{
              background: 'var(--kl-card)',
              border: '1px solid var(--kl-border)',
              color: 'var(--kl-text)',
            }}
          />
        </div>

        {/* Ministry list */}
        <div className="space-y-2">
          {filtered.map((mod, idx) => {
            const Icon = ICON_MAP[mod.icon] || Home;
            return (
              <motion.div
                key={mod.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
              >
                <Link href={`/quiz/${mod.slug}`}>
                  <div
                    className="ministry-card flex items-center gap-3.5 p-4 rounded-2xl active:scale-[0.98] transition-transform"
                    style={{
                      background: 'var(--kl-card)',
                      border: '1px solid var(--kl-border)',
                    }}
                  >
                    {/* Icon with glow */}
                    <div className="shrink-0 relative">
                      <div
                        className="absolute inset-0 rounded-xl blur-md opacity-30"
                        style={{ backgroundColor: mod.color }}
                      />
                      <div
                        className="relative p-2.5 rounded-xl"
                        style={{ backgroundColor: `${mod.color}18` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: mod.color }} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate" style={{ color: 'var(--kl-text)' }}>
                        {lang === 'en' ? mod.title : mod.title_ml}
                      </h3>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--kl-text-dim)' }}>
                        {lang === 'en' ? mod.title_ml : mod.title}
                      </p>
                    </div>

                    {/* Right side */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-lg"
                        style={{ background: `${mod.color}15`, color: mod.color }}
                      >
                        {mod.questions.length}
                      </span>
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
              {lang === 'en' ? `No ministries found for "${search}"` : `"${search}" കണ്ടെത്തിയില്ല`}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-14 text-center space-y-2">
          <div
            className="h-px mx-auto w-20 mb-4"
            style={{ background: 'linear-gradient(90deg, transparent, var(--kl-green), transparent)' }}
          />
          <p className="text-[11px]" style={{ color: 'var(--kl-text-dim)' }}>
            {lang === 'en'
              ? 'Data: NITI Aayog, RBI, Kerala Planning Board, Official Reports'
              : 'ഡാറ്റ: നീതി ആയോഗ്, ആർബിഐ, കേരള ആസൂത്രണ ബോർഡ്, ഔദ്യോഗിക റിപ്പോർട്ടുകൾ'}
          </p>
          <p className="text-[10px]" style={{ color: 'var(--kl-text-dim)' }}>
            {lang === 'en' ? 'Educational tool — sources cited per question' : 'വിദ്യാഭ്യാസ ഉപകരണം — ഓരോ ചോദ്യത്തിനും ഉറവിടം'}
          </p>
        </footer>
      </div>
    </main>
  );
}
