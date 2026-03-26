'use client';

import { motion } from 'framer-motion';

interface CompareOMeterProps {
  keralaLabel: string;
  keralaStat: string;
  nationalLabel: string;
  nationalStat: string;
  flexFact: string;
  source: string;
  isCorrect: boolean;
  isMl?: boolean;
}

function parseNumeric(stat: string): number {
  const cleaned = stat.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

/** Check if the national benchmark data is meaningful and should be displayed */
function hasValidBenchmark(nationalStat: string): boolean {
  if (!nationalStat) return false;
  const trimmed = nationalStat.trim().toLowerCase();
  if (
    trimmed === '' ||
    trimmed === 'n/a' ||
    trimmed === 'na' ||
    trimmed === '-' ||
    trimmed === 'not available' ||
    trimmed === 'not applicable' ||
    trimmed === 'no national data' ||
    trimmed === 'no data'
  ) {
    return false;
  }
  return /\d/.test(trimmed);
}

export default function CompareOMeter({
  keralaLabel,
  keralaStat,
  nationalLabel,
  nationalStat,
  flexFact,
  source,
  isCorrect,
  isMl = false,
}: CompareOMeterProps) {
  const keralaNum = parseNumeric(keralaStat);
  const showNational = hasValidBenchmark(nationalStat);
  const nationalNum = showNational ? parseNumeric(nationalStat) : 0;
  const max = Math.max(keralaNum, showNational ? nationalNum : 0, 1);

  const keralaWidth = Math.max((keralaNum / max) * 100, 12);
  const nationalWidth = showNational ? Math.max((nationalNum / max) * 100, 12) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-5 glass-card gradient-border rounded-2xl p-5 space-y-4"
    >
      {/* Correct/Incorrect badge */}
      <div className="flex items-center gap-2">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold px-4 py-2 rounded-xl"
          style={{
            background: isCorrect ? 'rgba(0,137,94,0.1)' : 'rgba(220,38,38,0.08)',
            color: isCorrect ? 'var(--kl-correct)' : 'var(--kl-incorrect)',
            border: `1px solid ${isCorrect ? 'rgba(0,137,94,0.18)' : 'rgba(220,38,38,0.15)'}`,
            boxShadow: isCorrect ? '0 0 16px rgba(0,137,94,0.08)' : '0 0 16px rgba(220,38,38,0.06)',
          }}
        >
          {isCorrect ? (isMl ? '✓ ശരി' : '✓ Correct') : (isMl ? '✗ തെറ്റ്' : '✗ Incorrect')}
        </motion.span>
      </div>

      {/* Kerala Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold gradient-text-green">{keralaLabel}</span>
          <span className="text-sm font-bold" style={{ color: 'var(--kl-green-light)' }}>{keralaStat}</span>
        </div>
        <div className="h-8 rounded-xl overflow-hidden" style={{ background: 'var(--kl-bar-track)' }}>
          <motion.div
            className="h-full rounded-xl"
            style={{
              background: 'linear-gradient(90deg, #005a3a, #00a67a, #00c9a7)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${keralaWidth}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
          />
        </div>
      </div>

      {/* National Bar — only shown when valid benchmark data exists */}
      {showNational && (
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium" style={{ color: 'var(--kl-text-dim)' }}>{nationalLabel}</span>
            <span className="text-sm font-bold" style={{ color: 'var(--kl-text-dim)' }}>{nationalStat}</span>
          </div>
          <div className="h-8 rounded-xl overflow-hidden" style={{ background: 'var(--kl-national-track)' }}>
            <motion.div
              className="h-full rounded-xl"
              style={{
                background: `linear-gradient(90deg, var(--kl-national-bar-start), var(--kl-national-bar-end))`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${nationalWidth}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
          <p className="text-xs italic" style={{ color: 'var(--kl-text-dim)', opacity: 0.6 }}>
            {isMl
              ? 'ദേശീയ ശരാശരി / മാനദണ്ഡം - പൊതു റിപ്പോർട്ടുകളിൽ നിന്നുള്ള ഏകദേശ കണക്ക്'
              : 'National avg / benchmark - approximate figures from public reports'}
          </p>
        </div>
      )}

      {/* Flex Fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="p-4 rounded-xl glass-card-light"
      >
        <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--kl-green-light)' }}>{flexFact}</p>
        <p className="text-xs mt-2.5" style={{ color: 'var(--kl-text-dim)', opacity: 0.6 }}>
          {isMl ? 'ഉറവിടം' : 'Source'}: {source}
        </p>
      </motion.div>
    </motion.div>
  );
}
