'use client';

const CX = 100;
const CY = 100;
const ARC_R = 78;
const STROKE = 13;

const SEG_COLORS = ['#dc2626', '#ea580c', '#eab308', '#22c55e'] as const;

function polar(r: number, theta: number): [number, number] {
  return [CX + r * Math.cos(theta), CY - r * Math.sin(theta)];
}

function arcPath(t1: number, t2: number, r: number): string {
  const [x1, y1] = polar(r, t1);
  const [x2, y2] = polar(r, t2);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`;
}

export interface ScoreGaugeProps {
  score: number;
  total: number;
  percentage: number;
  tierLabel: string;
  isMl: boolean;
  /** Center shows score (default) or percentage as the big figure */
  emphasize?: 'score' | 'percent';
  /** Tighter layout for fitting results in one viewport */
  compact?: boolean;
  className?: string;
}

/**
 * Credit-score–style semicircular gauge (red → green) with needle + center summary.
 */
export default function ScoreGauge({
  score,
  total,
  percentage,
  tierLabel,
  isMl,
  emphasize = 'score',
  compact = false,
  className = '',
}: ScoreGaugeProps) {
  const pct = Math.min(100, Math.max(0, percentage));
  const n = SEG_COLORS.length;
  const d = Math.PI / n;

  const needleAngle = Math.PI * (1 - pct / 100);
  const [nx, ny] = polar(ARC_R - 4, needleAngle);
  const innerR = 26;
  const [ix, iy] = [CX + innerR * Math.cos(needleAngle), CY - innerR * Math.sin(needleAngle)];

  const bigFigure = emphasize === 'score' ? score : pct;
  const subline =
    emphasize === 'score'
      ? `/ ${total} · ${pct}%`
      : isMl
        ? `${score} / ${total} ശരി`
        : `${score} / ${total} correct`;

  return (
    <div
      className={`relative mx-auto w-full ${compact ? 'max-w-[236px]' : 'max-w-[290px]'} ${className}`}
    >
      <svg
        viewBox="0 12 200 108"
        className={`mx-auto overflow-visible drop-shadow-[0_6px_18px_rgba(0,0,0,0.3)] ${
          compact ? 'h-[100px] w-auto max-w-[236px]' : 'max-h-none w-full max-w-[290px]'
        }`}
        aria-hidden
      >
        <defs>
          <filter id="gauge-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity="0.25" />
          </filter>
        </defs>
        {/* Track (dim) full arc */}
        <path
          d={arcPath(Math.PI, 0, ARC_R)}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={STROKE + 2}
          strokeLinecap="round"
        />
        {SEG_COLORS.map((c, i) => (
          <path
            key={c}
            d={arcPath(Math.PI - i * d, Math.PI - (i + 1) * d, ARC_R)}
            fill="none"
            stroke={c}
            strokeWidth={STROKE}
            strokeLinecap="round"
            filter="url(#gauge-shadow)"
          />
        ))}
        {/* Needle */}
        <line
          x1={ix}
          y1={iy}
          x2={nx}
          y2={ny}
          stroke="rgba(248,250,252,0.92)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle
          cx={nx}
          cy={ny}
          r={6.5}
          fill="#38bdf8"
          stroke="#0f172a"
          strokeWidth={2}
        />
        <circle cx={CX} cy={CY} r={5} fill="#0f172a" stroke="#475569" strokeWidth={1.5} />
      </svg>

      <div
        className={`pointer-events-none absolute left-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 text-center ${
          compact ? 'top-[56%]' : 'top-[58%]'
        }`}
      >
        <p
          className={`font-black tabular-nums leading-none tracking-tight text-white ${
            compact ? 'text-[1.7rem] sm:text-[1.9rem]' : 'text-[2.4rem] sm:text-[2.65rem]'
          }`}
        >
          {bigFigure}
          {emphasize === 'percent' ? (
            <span className="align-super text-[0.45em] font-black text-white/50">%</span>
          ) : null}
        </p>
        <p
          className={`mt-0.5 font-bold tabular-nums text-white/45 ${compact ? 'text-[10px]' : 'text-[11px] sm:text-xs'}`}
        >
          {subline}
        </p>
      </div>

      <div
        className={`relative flex justify-between px-0.5 font-semibold tabular-nums text-white/38 ${
          compact ? '-mt-0.5 text-[10px]' : '-mt-1 text-[11px]'
        }`}
      >
        <span aria-hidden>0</span>
        <span className="sr-only">
          {isMl ? 'സ്കോർ പരിധി  മുതൽ' : 'Score scale from'} 0 {isMl ? 'വരെ' : 'to'} {total}
        </span>
        <span aria-hidden>{total}</span>
      </div>

      <p
        className={`mx-auto max-w-[16rem] text-balance text-center font-black leading-snug text-[#ffcc00] ${
          compact
            ? 'mt-10 text-[11px] sm:mt-12 sm:text-xs'
            : 'mt-12 text-[13px] sm:mt-14 sm:text-sm'
        }`}
      >
        {tierLabel}
      </p>
    </div>
  );
}
