'use client';

export default function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 15}s`,
    delay: `${Math.random() * 10}s`,
    opacity: 0.12 + Math.random() * 0.2,
    size: 2 + Math.random() * 3,
    color: i % 3 === 0 ? '#f0c35e' : i % 2 === 0 ? '#00c9a7' : '#00e88a',
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
