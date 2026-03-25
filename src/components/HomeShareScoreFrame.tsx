'use client';

import type { HomeShareLevel } from '@/utils/homeShare';

type Props = {
  score: number;
  total: number;
  percentage: number;
  tierLabel: string;
  categoryTitle: string;
  siteUrl: string;
  level: HomeShareLevel;
  isMl: boolean;
};

/** Ring arc for score % — pure SVG for reliable html2canvas output */
function ScoreRing({ pct, score, total }: { pct: number; score: number; total: number }) {
  const size = 200;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, pct)) / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#facc15"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: 'drop-shadow(0 0 12px rgba(250,204,21,0.35))' }}
      />
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        fill="#ffffff"
        style={{ fontSize: 38, fontWeight: 900, fontFamily: 'system-ui, "Noto Sans Malayalam", sans-serif' }}
      >
        {score}/{total}
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        fill="#facc15"
        style={{ fontSize: 26, fontWeight: 800, fontFamily: 'system-ui, sans-serif' }}
      >
        {pct}%
      </text>
    </svg>
  );
}

/**
 * Off-screen score card for html2canvas — bold game-show frame (yellow/black).
 * Uses inline layout + SVG so export matches the design reliably.
 */
export default function HomeShareScoreFrame({
  score,
  total,
  percentage,
  tierLabel,
  categoryTitle,
  siteUrl,
  level,
  isMl,
}: Props) {
  const levelLabel =
    level === 'general'
      ? isMl
        ? 'ലെവൽ 0 · പൊതു റൗണ്ട്'
        : 'Level 0 · General round'
      : isMl
        ? 'ലെവൽ 1 · വകുപ്പ് ക്വിസ്'
        : 'Level 1 · Department quiz';

  const shortCategory =
    categoryTitle.length > 120 ? `${categoryTitle.slice(0, 117)}…` : categoryTitle;

  return (
    <div
      id="home-share-score-frame"
      aria-hidden
      style={{
        position: 'fixed',
        left: -24000,
        top: 0,
        width: 420,
        minHeight: 640,
        zIndex: -1,
        opacity: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
        fontFamily: 'system-ui, "Noto Sans Malayalam", "Segoe UI", sans-serif',
        color: '#fff',
        background: 'linear-gradient(165deg, #0a0a0a 0%, #141418 45%, #0a0a0a 100%)',
        boxSizing: 'border-box',
      }}
    >
      {/* Inner frame — double border game card */}
      <div
        style={{
          margin: 16,
          border: '4px solid #000',
          borderRadius: 20,
          boxShadow: '8px 8px 0 0 #facc15, inset 0 0 0 2px rgba(250,204,21,0.2)',
          background: 'linear-gradient(180deg, rgba(250,204,21,0.07) 0%, transparent 32%)',
          padding: 0,
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'hidden',
        }}
      >
        {/* Header strip */}
        <div
          style={{
            background: 'linear-gradient(90deg, #ca8a04 0%, #facc15 48%, #eab308 100%)',
            padding: '14px 16px 12px',
            borderBottom: '3px solid #000',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            KNOW-KERALAM
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, fontWeight: 700, color: 'rgba(10,10,10,0.78)', textAlign: 'center' }}>
            2016 — 2026 · നോ-കേരളം
          </p>
        </div>

        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ padding: '4px 4px 0', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: 999,
              background: '#171717',
              border: '2px solid #facc15',
              color: '#fde047',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {levelLabel}
          </span>
        </div>

        <p
          style={{
            margin: '12px 8px 0',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.45,
            color: 'rgba(255,255,255,0.92)',
            textAlign: 'center',
            minHeight: 52,
          }}
        >
          {shortCategory}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 4 }}>
          <ScoreRing pct={percentage} score={score} total={total} />
        </div>

        <div
          style={{
            margin: '8px 12px 0',
            padding: '10px 12px',
            borderRadius: 12,
            background: 'rgba(22,101,52,0.35)',
            border: '1px solid rgba(74,222,128,0.35)',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#86efac', lineHeight: 1.4 }}>
            {tierLabel}
          </p>
        </div>

        <div style={{ flex: 1, minHeight: 8 }} />

        <div
          style={{
            marginTop: 10,
            paddingTop: 12,
            borderTop: '2px dashed rgba(250,204,21,0.35)',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
            {isMl ? 'പൂർണ്ണ ക്വിസ് · Full quiz' : 'Full quiz · knowkeralam.com'}
          </p>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13,
              fontWeight: 800,
              color: '#facc15',
              wordBreak: 'break-all',
            }}
          >
            {siteUrl}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
