'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Module } from '@/types';
import { getCategoryTabLabel } from '@/utils/categoryLabels';

const VISIBLE_COUNT = 3;

type CategoryTabBarProps = {
  categoryOrder: Module[];
  value: number;
  isMl: boolean;
  playClick: () => void;
  onSelect: (index: number) => void;
  /** Optional id for aria-controls / labelling */
  id?: string;
  /** Visually hidden label for the tablist */
  ariaLabel: string;
};

export default function CategoryTabBar({
  categoryOrder,
  value,
  isMl,
  playClick,
  onSelect,
  id = 'home-category-tabs',
  ariaLabel,
}: CategoryTabBarProps) {
  const n = categoryOrder.length;
  const maxStart = Math.max(0, n - VISIBLE_COUNT);

  const snapToSelection = (v: number, total: number) => {
    const ms = Math.max(0, total - VISIBLE_COUNT);
    return Math.min(Math.max(0, v - 1), ms);
  };

  const [windowStart, setWindowStart] = useState(() =>
    snapToSelection(value, n)
  );

  useEffect(() => {
    setWindowStart(snapToSelection(value, categoryOrder.length));
  }, [value, categoryOrder.length]);

  const shiftWindow = (delta: -1 | 1) => {
    setWindowStart((w) => Math.max(0, Math.min(maxStart, w + delta)));
  };

  const canGoLeft = windowStart > 0;
  const canGoRight = windowStart < maxStart;

  const slice = categoryOrder.slice(windowStart, windowStart + VISIBLE_COUNT);

  return (
    <div className="flex w-full min-w-0 items-center gap-1.5 rounded-full border-2 border-black bg-black px-1 py-1 shadow-[0_0_24px_rgba(250,204,21,0.12)] sm:gap-2 sm:px-1.5 lg:gap-2.5 lg:py-1.5 lg:shadow-[0_0_32px_rgba(250,204,21,0.15)]">
      <button
        type="button"
        disabled={!canGoLeft}
        onClick={() => {
          playClick();
          shiftWindow(-1);
        }}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#facc15] bg-black/50 text-[#facc15] transition hover:bg-black/70 active:scale-95 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 sm:size-9 lg:size-10"
        aria-label={isMl ? 'മുമ്പത്തെ വിഭാഗങ്ങൾ' : 'Previous categories'}
      >
        <ChevronLeft className="size-4 sm:size-[1.125rem] lg:size-5" strokeWidth={2.5} aria-hidden />
      </button>

      <div
        id={id}
        role="tablist"
        aria-label={ariaLabel}
        className="grid min-w-0 flex-1 grid-cols-3 items-center gap-1.5 py-0.5 sm:gap-2 lg:gap-2.5"
      >
        {slice.map((mod, i) => {
          const idx = windowStart + i;
          const selected = idx === value;
          const label = getCategoryTabLabel(mod, idx, isMl);
          return (
            <button
              key={mod.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`${id}-tab-${idx}`}
              onClick={() => {
                if (idx === value) return;
                playClick();
                onSelect(idx);
              }}
              className={`min-w-0 truncate rounded-full px-2 py-1.5 text-center text-[10px] font-black leading-tight transition sm:px-2.5 sm:py-2 sm:text-[11px] lg:px-3 lg:py-2.5 lg:text-xs xl:text-[13px] ${
                selected
                  ? 'bg-[#facc15] text-black shadow-[2px_2px_0_0_#000]'
                  : 'bg-zinc-800/95 text-white hover:bg-zinc-700/95 active:scale-[0.98]'
              }`}
              title={label}
            >
              {label}
            </button>
          );
        })}
        {slice.length < VISIBLE_COUNT
          ? Array.from({ length: VISIBLE_COUNT - slice.length }).map((_, j) => (
              <span key={`pad-${j}`} className="min-w-0" aria-hidden />
            ))
          : null}
      </div>

      <button
        type="button"
        disabled={!canGoRight}
        onClick={() => {
          playClick();
          shiftWindow(1);
        }}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[#facc15] bg-black/50 text-[#facc15] transition hover:bg-black/70 active:scale-95 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 sm:size-9 lg:size-10"
        aria-label={isMl ? 'അടുത്ത വിഭാഗങ്ങൾ' : 'Next categories'}
      >
        <ChevronRight className="size-4 sm:size-[1.125rem] lg:size-5" strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  );
}
