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

const fontStack = 'var(--font-manjari), "Noto Sans Malayalam", system-ui, sans-serif';

function SlashMarks({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 16,
            height: 4,
            background: color,
            transform: 'skewX(-22deg)',
            borderRadius: 2,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Off-screen score card for html2canvas — trading-card layout (blue ribbons + bottom stats block).
 */
export default function HomeShareScoreFrame({
  score,
  total,
  tierLabel,
  categoryTitle,
  siteUrl,
  level,
  isMl,
}: Props) {
  const yellow = '#facc15';
  const yellowDark = '#ca8a04';
  const black = '#0a0a0a';
  const softBlack = '#111111';
  const levelLabel =
    level === 'general'
      ? isMl
        ? 'ലെവൽ 0 · പൊതു റൗണ്ട്'
        : 'Level 0 · General round'
      : isMl
        ? 'ലെവൽ 1 · വകുപ്പ് ക്വിസ്'
        : 'Level 1 · Department quiz';

  const shortCategory = categoryTitle.length > 92 ? `${categoryTitle.slice(0, 89)}…` : categoryTitle;

  const nameLine = isMl ? 'KNOW-KERALAM' : 'KNOW-KERALAM';
  const subLine = isMl ? '2016-2026 · നോ-കേരളം' : '2016-2026 · Kerala decade quiz';

  const teamLine = isMl ? 'വിഭാഗം' : 'TOPIC';
  const scoreBig = `${score}/${total}`;

  return (
    <div
      id="home-share-score-frame"
      aria-hidden
      style={{
        position: 'fixed',
        left: -24000,
        top: 0,
        width: 520,
        minHeight: 780,
        zIndex: -1,
        opacity: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
        fontFamily: fontStack,
        boxSizing: 'border-box',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          margin: 18,
          borderRadius: 26,
          background: black,
          padding: 10,
          boxShadow: '0 16px 50px rgba(0,0,0,0.55)',
        }}
      >
        <div
          style={{
            borderRadius: 22,
            background: '#ffffff',
            border: `6px solid ${softBlack}`,
            overflow: 'hidden',
            position: 'relative',
            minHeight: 744,
          }}
        >
          {/* Right vertical strip */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              bottom: 10,
              width: 36,
              borderRadius: 14,
              background: softBlack,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.72)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              textTransform: 'uppercase',
            }}
          >
            knowkeralam.com
          </div>

          {/* Top ribbon */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 120,
              background: `linear-gradient(180deg, ${yellow} 0%, ${yellowDark} 100%)`,
              clipPath: 'polygon(0 0, 100% 0, 100% 78%, 70% 78%, 66% 100%, 0 100%)',
            }}
          />
          <div style={{ position: 'absolute', top: 18, left: 24, right: 62, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <SlashMarks color="rgba(0,0,0,0.65)" />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 1000,
                  letterSpacing: '0.06em',
                  color: '#0a0a0a',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {nameLine}
              </div>
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 800, color: 'rgba(10,10,10,0.78)', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                {subLine}
              </div>
            </div>
          </div>

          {/* Center panel (clean white with soft diagonal stripes) */}
          <div
            style={{
              position: 'absolute',
              left: 18,
              right: 62,
              top: 126,
              bottom: 190,
              borderRadius: 18,
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 30%, rgba(0,0,0,0.04) 60%, transparent 100%), repeating-linear-gradient(100deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 22px, rgba(0,0,0,0.00) 22px, rgba(0,0,0,0.00) 66px)',
              border: '2px solid rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 14,
                  background: softBlack,
                  color: yellow,
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {levelLabel}
              </div>

              {/* Score card pill above category */}
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: yellow,
                    color: black,
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 1000,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    boxShadow: '0 10px 22px rgba(0,0,0,0.12)',
                  }}
                >
                  {isMl ? 'സ്കോർ കാർഡ്' : 'SCORE CARD'}
                </div>
              </div>

              <div style={{ marginTop: 14, fontSize: 12, fontWeight: 900, color: 'rgba(0,0,0,0.6)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                {teamLine}
              </div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 900, color: '#0b0b0c', lineHeight: 1.25 }}>
                {shortCategory}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ lineHeight: 1, paddingLeft: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {isMl ? 'മാർക്ക്' : 'MARK'}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 44, fontWeight: 1000, color: '#0b0b0c', letterSpacing: '0.01em' }}>
                    {scoreBig}
                  </div>
                </div>

                <div style={{ paddingLeft: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(0,0,0,0.55)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {isMl ? 'നില' : 'RANK'}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 16, fontWeight: 1000, color: '#0b0b0c', lineHeight: 1.2 }}>
                    {tierLabel}
                  </div>
                </div>
              </div>

              {/* Keep stripe marks pinned to bottom-right */}
              <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                <SlashMarks color="rgba(0,0,0,0.55)" />
              </div>
            </div>
          </div>

          {/* Bottom stats block */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 210,
              background: `linear-gradient(180deg, ${softBlack} 0%, ${black} 100%)`,
              clipPath: 'polygon(0 14%, 62% 14%, 68% 0, 100% 0, 100% 100%, 0 100%)',
              paddingLeft: 22,
              paddingRight: 62,
              paddingTop: 18,
              boxSizing: 'border-box',
            }}
          >
            {/* Centered content block (reduce right whitespace) */}
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/knowkeralam.png"
                  alt="KNOW-KERALAM"
                  width={220}
                  height={110}
                  style={{
                    width: 120,
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))',
                  }}
                />
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 10,
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.72)',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isMl ? 'വെബ്സൈറ്റ്' : 'WEBSITE'}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    maxWidth: 320,
                    padding: '5px 10px',
                    borderRadius: 10,
                    background: 'rgba(250,204,21,0.12)',
                    border: '1px solid rgba(250,204,21,0.35)',
                    fontSize: 12,
                    fontWeight: 900,
                    color: 'rgba(250,204,21,0.95)',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={siteUrl}
                >
                  {siteUrl}
                </div>
              </div>

              <div style={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
                <SlashMarks color="rgba(250,204,21,0.65)" />
              </div>
            </div>
          </div>

          {/* Rounded bottom corners white mask like template */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 18,
              background: 'transparent',
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          />
        </div>
      </div>
    </div>
  );
}
