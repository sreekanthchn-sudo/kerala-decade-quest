'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type { Module } from '@/types';
import { QUIZ_QUESTIONS_PER_ROUND } from '@/constants/quiz';
import { getCategoryBilingualLabel } from '@/utils/categoryLabels';

type CategoryDropdownProps = {
  categoryOrder: Module[];
  value: number;
  isMl: boolean;
  label: string;
  /** Short helper under the label (questions per round) */
  hint?: string;
  playClick: () => void;
  onSelect: (index: number) => void;
  /** Trigger id for label association */
  id?: string;
};

/** Custom category picker — dark sheet, blue active row, checkmark. */
export default function CategoryDropdown({
  categoryOrder,
  value,
  isMl,
  label,
  hint,
  playClick,
  onSelect,
  id = 'category-dropdown-trigger',
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const currentMod = categoryOrder[value];
  const currentLabel = currentMod ? getCategoryBilingualLabel(currentMod, value, isMl) : '';
  const hasGeneralMixed =
    categoryOrder.length > 1 && categoryOrder[0]?.slug.includes('general');

  return (
    <div ref={wrapRef} className="relative z-[200] w-full">
      <label htmlFor={id} className="mb-1.5 block text-center text-[11px] font-bold leading-snug text-[#ffcc00] sm:mb-2 sm:text-xs">
        {label}
      </label>
      {hint ? (
        <p className="mb-2 text-center text-[10px] leading-snug text-white/65 sm:text-[11px]">{hint}</p>
      ) : null}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          playClick();
          setOpen((o) => !o);
        }}
        className="flex min-h-11 w-full items-center gap-2 rounded-xl border-2 border-black bg-[#ffcc00] px-3 py-2.5 text-left text-sm font-black leading-snug text-black shadow-[3px_3px_0_0_#000] outline-none transition hover:bg-[#fde047] focus-visible:ring-2 focus-visible:ring-[#ffcc00] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 sm:min-h-12 sm:px-4 sm:py-3 sm:text-base"
      >
        <span className="min-w-0 flex-1 truncate">{currentLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 sm:h-5 sm:w-5 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-[300] mt-1.5 overflow-hidden rounded-2xl border border-white/20 bg-zinc-950/96 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <ul
            className="max-h-[min(28rem,calc(70dvh-6rem))] overflow-y-auto overscroll-contain py-1"
            role="listbox"
            aria-label={label}
          >
            {categoryOrder.map((mod, idx) => {
              const selected = idx === value;
              return (
                <Fragment key={mod.slug}>
                  <li role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        playClick();
                        onSelect(idx);
                        setOpen(false);
                      }}
                      className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-[13px] font-semibold leading-snug transition sm:px-3.5 sm:py-3 sm:text-sm ${
                        selected
                          ? 'bg-[#2563eb] text-white'
                          : 'text-white/95 hover:bg-white/[0.08] active:bg-white/[0.12]'
                      }`}
                    >
                      <span className="mt-0.5 flex min-w-[1.25rem] shrink-0 justify-center" aria-hidden="true">
                        {selected ? <Check className="h-4 w-4" strokeWidth={2.5} /> : null}
                      </span>
                      <span className="min-w-0 flex-1">{getCategoryBilingualLabel(mod, idx, isMl)}</span>
                    </button>
                  </li>
                  {hasGeneralMixed && idx === 0 ? (
                    <li
                      role="presentation"
                      aria-hidden
                      className="pointer-events-none border-t border-[#facc15]/25 bg-black/40 px-3 py-2 text-left text-[10px] font-black uppercase tracking-wide text-[#facc15]/90 sm:text-[11px]"
                    >
                      {isMl
                        ? `വകുപ്പ് ക്വിസുകൾ · ഓരോന്നിനും ${QUIZ_QUESTIONS_PER_ROUND} ചോദ്യങ്ങൾ`
                        : `Department quizzes · ${QUIZ_QUESTIONS_PER_ROUND} questions each`}
                    </li>
                  ) : null}
                </Fragment>
              );
            })}
          </ul>
          <div
            className="pointer-events-none flex justify-center border-t border-white/10 bg-zinc-950/80 py-0.5 text-white/35"
            aria-hidden
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </div>
  );
}
