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
}

function parseNumeric(stat: string): number {
  const cleaned = stat.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

export default function CompareOMeter({
  keralaLabel,
  keralaStat,
  nationalLabel,
  nationalStat,
  flexFact,
  source,
  isCorrect,
}: CompareOMeterProps) {
  const keralaNum = parseNumeric(keralaStat);
  const nationalNum = parseNumeric(nationalStat);
  const max = Math.max(keralaNum, nationalNum, 1);

  const keralaWidth = Math.max((keralaNum / max) * 100, 12);
  const nationalWidth = Math.max((nationalNum / max) * 100, 12);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-5 rounded-2xl p-4 space-y-3.5"
      style={{ background: 'var(--kl-card)', border: '1px solid var(--kl-border)' }}
    >
      {/* Correct/Incorrect badge */}
      <div className="flex items-center gap-2">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-xs font-bold px-3 py-1 rounded-lg"
          style={{
            background: isCorrect ? 'rgba(0,214,143,0.12)' : 'rgba(239,68,68,0.12)',
            color: isCorrect ? '#00d68f' : '#ef4444',
            border: `1px solid ${isCorrect ? 'rgba(0,214,143,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        >
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </motion.span>
      </div>

      {/* Kerala Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-medium" style={{ color: 'var(--kl-green-light)' }}>{keralaLabel}</span>
          <span className="font-bold" style={{ color: 'var(--kl-green-light)' }}>{keralaStat}</span>
        </div>
        <div className="h-7 rounded-lg overflow-hidden" style={{ background: 'rgba(0,214,143,0.06)' }}>
          <motion.div
            className="h-full rounded-lg flex items-center justify-end pr-2"
            style={{ background: 'linear-gradient(90deg, #005a3a, #00d68f)' }}
            initial={{ width: 0 }}
            animate={{ width: `${keralaWidth}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
          />
        </div>
      </div>

      {/* National Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-medium" style={{ color: 'var(--kl-text-dim)' }}>{nationalLabel}</span>
          <span className="font-bold" style={{ color: 'var(--kl-text-dim)' }}>{nationalStat}</span>
        </div>
        <div className="h-7 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <motion.div
            className="h-full rounded-lg"
            style={{ background: 'linear-gradient(90deg, #3a3a3a, #6b6b6b)' }}
            initial={{ width: 0 }}
            animate={{ width: `${nationalWidth}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          />
        </div>
      </div>

      {/* Flex Fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="p-3.5 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0,214,143,0.06), rgba(232,185,74,0.04))',
          border: '1px solid rgba(0,214,143,0.1)',
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'var(--kl-green-light)' }}>{flexFact}</p>
        <p className="text-[10px] mt-2 opacity-60" style={{ color: 'var(--kl-text-dim)' }}>Source: {source}</p>
      </motion.div>
    </motion.div>
  );
}
