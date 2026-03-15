'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#00e88a', '#00c9a7', '#f0c35e', '#00895e', '#ffffff'];
const SHAPES = ['circle', 'square', 'triangle'];

export default function Confetti({ count = 40 }: { count?: number }) {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    left: string;
    color: string;
    shape: string;
    duration: string;
    delay: string;
    size: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        duration: `${2 + Math.random() * 2}s`,
        delay: `${Math.random() * 1.5}s`,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
      }))
    );
  }, [count]);

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'triangle' ? '0' : '2px',
            clipPath: p.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
            '--fall-duration': p.duration,
            '--fall-delay': p.delay,
            transform: `rotate(${p.rotation}deg)`,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
}
