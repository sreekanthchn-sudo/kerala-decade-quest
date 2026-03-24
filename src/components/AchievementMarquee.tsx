'use client';

/** Headlines for the home-page ticker — Kerala decade themes (2016–2026). */
const ACHIEVEMENTS_EN = [
  'KNOW-KERALAM.',
  'KIIFB momentum.',
  'NH 66 corridor development.',
  'Vizhinjam port.',
  'Waste-free Nava Kerala mission.',
  'Kochi Water Metro.',
  'Ten years without power cuts.',
];

const ACHIEVEMENTS_ML = [
  'KNOW-KERALAM — നോ-കേരളം.',
  'കിഫ്ബി കുതിപ്പ്.',
  'ദേശീയപാത 66 വികസനം.',
  'വിഴിഞ്ഞം പോർട്ട്.',
  'മാലിന്യ വിമുക്ത നവകേരളം പദ്ധതി.',
  'കൊച്ചി വാട്ടർ മെട്രോ.',
  'പവർകട്ട് ഇല്ലാത്ത പത്തു വർഷങ്ങൾ.',
];

function MarqueeTrack({ phrases }: { phrases: string[] }) {
  const loop = [...phrases, ...phrases];
  return (
    <div className="home-achievement-marquee__track" aria-hidden>
      {loop.map((text, i) => (
        <span key={`marquee-${i}`} className="home-achievement-marquee__item whitespace-nowrap">
          {text}
        </span>
      ))}
    </div>
  );
}

export default function AchievementMarquee({ isMl }: { isMl: boolean }) {
  const phrases = isMl ? ACHIEVEMENTS_ML : ACHIEVEMENTS_EN;
  const label = isMl ? 'പ്രധാന നേട്ടങ്ങൾ' : 'Key decade achievements';

  return (
    <div className="home-achievement-marquee relative w-full min-w-0 max-w-none" role="region" aria-label={label}>
      <div className="home-achievement-marquee__viewport">
        <MarqueeTrack phrases={phrases} />
      </div>
    </div>
  );
}
