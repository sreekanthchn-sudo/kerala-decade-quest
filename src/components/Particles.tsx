'use client';

export default function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 15}s`,
    delay: `${Math.random() * 10}s`,
    opacity: 0.08 + Math.random() * 0.12,
    size: 2 + Math.random() * 4,
    color: i % 3 === 0 ? 'var(--kl-gold)' : i % 2 === 0 ? 'var(--kl-teal)' : 'var(--kl-green)',
  }));

  return (
    <div className="particles">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            '--duration': p.duration,
            '--delay': p.delay,
            '--max-opacity': p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
