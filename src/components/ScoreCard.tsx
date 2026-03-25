'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { Module, Question } from '@/types';

// Kerala map SVG path (simplified outline)
const KERALA_MAP_PATH = `M 45,5 C 42,8 40,15 38,22 C 36,28 35,35 33,42 C 31,48 28,55 26,62
C 24,68 22,75 20,82 C 18,88 16,95 15,102 C 14,108 13,115 12,122
C 11,128 10,135 10,142 C 10,148 11,155 12,162 C 13,168 15,175 17,180
C 19,185 22,190 25,194 C 28,198 32,200 36,198 C 38,196 39,192 40,188
C 41,184 42,180 42,175 C 42,170 43,165 44,160 C 45,155 46,150 48,145
C 50,140 52,135 54,130 C 56,125 57,120 58,115 C 59,110 60,105 60,100
C 60,95 59,90 58,85 C 57,80 56,75 55,70 C 54,65 53,60 52,55
C 51,50 50,45 49,40 C 48,35 47,28 46,20 C 45,14 45,9 45,5 Z`;

interface ScoreCardProps {
  mod: Module;
  score: number;
  total: number;
  questions: Question[];
  lang: 'en' | 'ml';
  onClose: () => void;
}

export default function ScoreCard({ mod, score, total, questions, lang, onClose }: ScoreCardProps) {
  const [playerName, setPlayerName] = useState('');
  const [stage, setStage] = useState<'name' | 'generating' | 'ready'>('name');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMl = lang === 'ml';

  const pct = Math.round((score / total) * 100);

  const getTitle = () => {
    if (pct >= 85) return 'Kerala Development Visionary';
    if (pct >= 65) return 'KNOW-KERALAM Policy Expert';
    if (pct >= 45) return 'Development Enthusiast';
    return 'Curious Explorer';
  };

  const getTitleMl = () => {
    if (pct >= 85) return 'കേരള വികസന ദർശകൻ';
    if (pct >= 65) return 'നോ-കേരളം നയ വിദഗ്ദ്ധൻ';
    if (pct >= 45) return 'വികസന താൽപര്യക്കാരൻ';
    return 'ജിജ്ഞാസു പര്യവേക്ഷകൻ';
  };

  // Pick a random flex fact from the questions
  const flexFact = (() => {
    const correctQuestions = questions.filter((_, i) => i < total);
    const q = correctQuestions[Math.floor(Math.random() * correctQuestions.length)];
    if (!q) return '';
    return (isMl && q.flex_fact_ml) ? q.flex_fact_ml : q.flex_fact;
  })();

  // Generate QR code on mount
  useEffect(() => {
    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const quizUrl = typeof window !== 'undefined'
          ? `${window.location.origin}${window.location.pathname}`
          : 'https://example.com';
        const dataUrl = await QRCode.toDataURL(quizUrl, {
          width: 120,
          margin: 1,
          color: { dark: '#1a472a', light: '#ffffff' },
        });
        setQrDataUrl(dataUrl);
      } catch (e) {
        console.error('QR generation failed:', e);
      }
    };
    generateQR();
  }, []);

  const generateCard = useCallback(async () => {
    if (!playerName.trim()) return;
    setStage('generating');

    // Wait a tick for the hidden card to render
    await new Promise(r => setTimeout(r, 200));

    try {
      const html2canvas = (await import('html2canvas')).default;
      const cardEl = cardRef.current;
      if (!cardEl) return;

      const canvas = await html2canvas(cardEl, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const url = canvas.toDataURL('image/png');
      setImageUrl(url);
      setStage('ready');
    } catch (e) {
      console.error('Card generation failed:', e);
      setStage('name');
    }
  }, [playerName]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = `knowkeralam-quiz-${mod.slug}-certificate.png`;
    link.href = imageUrl;
    link.click();
  }, [imageUrl, mod.slug]);

  const handleShare = useCallback(async () => {
    if (!imageUrl) return;

    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'knowkeralam-certificate.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'KNOW-KERALAM Certificate',
          files: [file],
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  }, [imageUrl, handleDownload]);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Truncate flex fact for card
  const truncatedFact = flexFact.length > 180 ? flexFact.slice(0, 177) + '...' : flexFact;

  // Derive gradient colors from module color
  const baseColor = mod.color;

  const brandYellow = '#facc15';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 quiz-game-shell"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
    >
      {/* Name Input Stage */}
      {stage === 'name' && (
        <div className="w-full max-w-md space-y-5 rounded-2xl border-[3px] border-black bg-zinc-950/95 p-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.75)]">
          <div className="space-y-2 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#facc15]">
              KNOW-KERALAM
            </p>
            <h3 className="text-lg font-black text-white">
              {isMl ? 'സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യുക' : 'Download certificate'}
            </h3>
            <p className="text-sm leading-snug text-white/65">
              {isMl ? 'നിങ്ങളുടെ പേര് നൽകുക' : 'Enter your name for the certificate'}
            </p>
          </div>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={isMl ? 'നിങ്ങളുടെ പേര്' : 'Your name'}
            maxLength={40}
            autoFocus
            className="w-full rounded-xl border-2 border-black bg-black/55 px-4 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-[#facc15] focus:ring-offset-2 focus:ring-offset-zinc-950"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && playerName.trim()) generateCard();
            }}
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-white/28 bg-black/40 py-3.5 text-sm font-bold text-white/85 transition active:translate-x-px active:translate-y-px"
            >
              {isMl ? 'റദ്ദാക്കുക' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={generateCard}
              disabled={!playerName.trim()}
              className="quiz-game-next-btn flex-1 rounded-2xl py-3.5 text-sm font-black transition disabled:pointer-events-none disabled:opacity-40"
            >
              {isMl ? 'സൃഷ്ടിക്കുക' : 'Generate'}
            </button>
          </div>
          <p className="text-center text-[11px] text-white/35">knowkeralam.com</p>
        </div>
      )}

      {/* Generating Stage */}
      {stage === 'generating' && (
        <div className="w-full max-w-sm space-y-5 rounded-2xl border-[3px] border-black bg-zinc-950/95 px-8 py-10 text-center shadow-[6px_6px_0_0_rgba(0,0,0,0.75)]">
          <div
            className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-black border-t-[#facc15]"
            style={{ borderRightColor: '#facc15', borderBottomColor: 'rgba(250,204,21,0.35)' }}
          />
          <p className="text-sm font-semibold text-white/75">
            {isMl ? 'സർട്ടിഫിക്കറ്റ് സൃഷ്ടിക്കുന്നു...' : 'Generating certificate...'}
          </p>
        </div>
      )}

      {/* Ready Stage — show preview */}
      {stage === 'ready' && imageUrl && (
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="overflow-hidden rounded-2xl border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.75)]">
            <img
              src={imageUrl}
              alt={isMl ? 'സ്കോർ കാർഡ്' : 'Score card'}
              className="w-full"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-white/28 bg-black/40 py-3.5 text-sm font-bold text-white/85"
            >
              {isMl ? 'അടയ്ക്കുക' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="quiz-game-next-btn flex-1 py-3.5 text-sm font-black"
            >
              {isMl ? 'ഷെയർ / ഡൗൺലോഡ്' : 'Share / Download'}
            </button>
          </div>
        </div>
      )}

      {/* Hidden card div for html2canvas — rendered off-screen */}
      {(stage === 'generating' || stage === 'ready') && (
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '1080px',
            height: '1920px',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div
            ref={cardRef}
            style={{
              width: '1080px',
              height: '1920px',
              position: 'relative',
              fontFamily: "'Segoe UI', 'Noto Sans Malayalam', system-ui, sans-serif",
              overflow: 'hidden',
            }}
          >
            {/* Background gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(165deg, #0a0a0a 0%, #111 30%, ${baseColor}14 48%, #0a0a0a 72%, #050505 100%)`,
              }}
            />

            {/* Subtle pattern overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at 20% 30%, ${baseColor}12 0%, transparent 50%),
                                  radial-gradient(circle at 80% 70%, ${baseColor}08 0%, transparent 50%)`,
              }}
            />

            {/* Kerala map watermark */}
            <svg
              style={{
                position: 'absolute',
                right: '60px',
                top: '300px',
                width: '300px',
                height: '700px',
                opacity: 0.04,
              }}
              viewBox="0 0 70 210"
            >
              <path d={KERALA_MAP_PATH} fill="white" />
            </svg>

            {/* Certificate border — double line */}
            <div
              style={{
                position: 'absolute',
                inset: '30px',
                border: `2px solid ${baseColor}40`,
                borderRadius: '16px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '40px',
                border: `1px solid ${baseColor}20`,
                borderRadius: '12px',
              }}
            />

            {/* Corner decorations */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
              const isTop = corner.includes('top');
              const isLeft = corner.includes('left');
              return (
                <div
                  key={corner}
                  style={{
                    position: 'absolute',
                    [isTop ? 'top' : 'bottom']: '22px',
                    [isLeft ? 'left' : 'right']: '22px',
                    width: '60px',
                    height: '60px',
                    borderTop: isTop ? `3px solid ${baseColor}60` : 'none',
                    borderBottom: !isTop ? `3px solid ${baseColor}60` : 'none',
                    borderLeft: isLeft ? `3px solid ${baseColor}60` : 'none',
                    borderRight: !isLeft ? `3px solid ${baseColor}60` : 'none',
                    borderRadius: '4px',
                  }}
                />
              );
            })}

            {/* Content container */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '80px 80px 60px',
              }}
            >
              {/* Top heading */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1
                  style={{
                    fontSize: '56px',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '2px',
                    lineHeight: 1.3,
                    marginBottom: '8px',
                  }}
                >
                  {'നോ-കേരളം'}
                </h1>
                <p
                  style={{
                    fontSize: '26px',
                    fontWeight: 600,
                    color: brandYellow,
                    letterSpacing: '4px',
                  }}
                >
                  2016 &mdash; 2026
                </p>
              </div>

              {/* Decorative line */}
              <div
                style={{
                  width: '200px',
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${baseColor}80, transparent)`,
                  margin: '16px 0 24px',
                }}
              />

              {/* Subheading */}
              <p
                style={{
                  fontSize: '22px',
                  color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center',
                  lineHeight: 1.6,
                  marginBottom: '40px',
                  fontWeight: 500,
                }}
              >
                {'അറിയാം കേരളത്തെ.... അറിയാം കഴിഞ്ഞ പത്ത് വർഷം'}
              </p>

              {/* Player name */}
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                  }}
                >
                  Certificate awarded to
                </p>
                <p
                  style={{
                    fontSize: '44px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.3,
                  }}
                >
                  {playerName}
                </p>
                <div
                  style={{
                    width: '300px',
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${baseColor}50, transparent)`,
                    margin: '14px auto 0',
                  }}
                />
              </div>

              {/* Score ring */}
              <div
                style={{
                  position: 'relative',
                  width: '220px',
                  height: '220px',
                  margin: '0 auto 30px',
                }}
              >
                <svg width="220" height="220" viewBox="0 0 220 220">
                  {/* Background circle */}
                  <circle
                    cx="110" cy="110" r="95"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="10"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="110" cy="110" r="95"
                    fill="none"
                    stroke={brandYellow}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 95}`}
                    strokeDashoffset={`${2 * Math.PI * 95 * (1 - pct / 100)}`}
                    transform="rotate(-90 110 110)"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.45))' }}
                  />
                  {/* Inner circle */}
                  <circle
                    cx="110" cy="110" r="78"
                    fill="rgba(0,0,0,0.3)"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '52px',
                      fontWeight: 900,
                      color: '#ffffff',
                      lineHeight: 1,
                    }}
                  >
                    {score}/{total}
                  </span>
                  <span
                    style={{
                      fontSize: '22px',
                      fontWeight: 600,
                      color: brandYellow,
                      marginTop: '4px',
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Title */}
              <p
                style={{
                  fontSize: '30px',
                  fontWeight: 700,
                  color: brandYellow,
                  textAlign: 'center',
                  marginBottom: '12px',
                  letterSpacing: '1px',
                }}
              >
                {isMl ? getTitleMl() : getTitle()}
              </p>

              {/* Ministry name */}
              <p
                style={{
                  fontSize: '20px',
                  color: 'rgba(255,255,255,0.55)',
                  textAlign: 'center',
                  marginBottom: '40px',
                  fontWeight: 500,
                }}
              >
                {isMl ? mod.title_ml : mod.title}
              </p>

              {/* Flex fact */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${baseColor}25`,
                  borderRadius: '12px',
                  padding: '24px 28px',
                  marginBottom: '40px',
                  width: '100%',
                  maxWidth: '860px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: brandYellow,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '10px',
                    fontWeight: 600,
                  }}
                >
                  {isMl ? 'അറിയാമോ?' : 'Did you know?'}
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.7,
                  }}
                >
                  {truncatedFact}
                </p>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Bottom section: QR + date */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '860px',
                  paddingTop: '20px',
                  borderTop: `1px solid rgba(255,255,255,0.06)`,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.35)',
                      marginBottom: '4px',
                    }}
                  >
                    Scan to take the quiz
                  </p>
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                      }}
                    />
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'rgba(255,255,255,0.45)',
                      marginBottom: '4px',
                    }}
                  >
                    {dateStr}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.25)',
                    }}
                  >
                    knowkeralam.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
