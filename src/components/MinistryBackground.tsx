'use client';

import { useState } from 'react';

/**
 * Ministry-themed background photos from Unsplash.
 * Each image is a real Kerala/India photo relevant to the ministry.
 * Format: ?w=800&q=40 for small size + low quality (it's blurred anyway)
 */
const MINISTRY_IMAGES: Record<string, string> = {
  // LSGD — Kerala village panchayat, community
  'lsgd': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=40',
  // Health — Hospital/medical
  'health-family-welfare': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=40',
  // General Education — School classroom
  'general-education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=40',
  // IT & Electronics — Technology
  'it-electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=40',
  // Public Works & Tourism — Kerala backwaters
  'public-works-tourism': 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=40',
  // Higher Education — University library
  'higher-education-social-justice': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=40',
  // Planning & Economy — City skyline/development
  'planning-economy': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=40',
  // Revenue & Housing — Buildings/architecture
  'revenue-housing': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=40',
  // Forest & Wildlife — Kerala forest/tea plantation
  'forest-wildlife': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=40',
  // Finance — Business/currency
  'finance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=40',
  // Water Resources — Kerala waterfall/river
  'water-resources': 'https://images.unsplash.com/photo-1432405972618-c6b0cfba5ae7?w=800&q=40',
  // Electricity — Solar/power
  'electricity-power': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=40',
  // Transport — Road/bus
  'transport': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=40',
  // Food & Civil Supplies — Rice/grain
  'food-civil-supplies': 'https://images.unsplash.com/photo-1536304993881-460c66be8956?w=800&q=40',
  // Animal Husbandry — Cows/farm
  'animal-husbandry': 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800&q=40',
  // Agriculture — Kerala paddy/tea plantation
  'agriculture': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=40',
  // SC/ST Welfare — Community gathering
  'sc-st-welfare': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=40',
  // Law & Industries — Factory/industry
  'law-industries': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=40',
  // Cooperation & Ports — Kerala port/harbor
  'cooperation-ports': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=40',
  // Fisheries & Culture — Kerala fishing
  'fisheries-culture': 'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=800&q=40',
  // Sports — Stadium/sports
  'sports-registration': 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=800&q=40',
};

interface MinistryBackgroundProps {
  slug: string;
  color: string;
}

export default function MinistryBackground({ slug, color }: MinistryBackgroundProps) {
  const [loaded, setLoaded] = useState(false);
  const imageUrl = MINISTRY_IMAGES[slug];

  if (!imageUrl) return null;

  return (
    <div className="ministry-bg-container">
      {/* Photo layer */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        loading="eager"
        onLoad={() => setLoaded(true)}
        className="ministry-bg-image"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      {/* Color overlay — tinted with ministry color */}
      <div
        className="ministry-bg-overlay"
        style={{
          background: `linear-gradient(
            180deg,
            ${color}18 0%,
            var(--kl-bg) 100%
          )`,
        }}
      />
      {/* Top gradient for text readability */}
      <div
        className="ministry-bg-overlay"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(0,0,0,0.08) 0%,
            transparent 30%,
            transparent 70%,
            var(--kl-bg) 100%
          )`,
        }}
      />
    </div>
  );
}
