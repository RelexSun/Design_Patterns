"use client";

import type { PatternRecord } from "@/lib/types";
import { categoryBadgeClass } from "@/lib/badge-styles";

type Props = {
  patterns: PatternRecord[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function PatternCardGrid({ patterns, selectedIndex, onSelect }: Props) {
  return (
    <aside className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-4 shadow-sm">
      <div className="mb-3 flex items-end justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Pattern picker</h3>
        <span className="text-xs text-[var(--text-secondary)]">
          {selectedIndex + 1}/{patterns.length}
        </span>
      </div>
      <div className="mb-3 h-px w-full bg-[var(--border-subtle)]" />
      <nav aria-label="Pattern list" className="max-h-[min(62vh,36rem)] space-y-0.5 overflow-auto pr-1">
        {patterns.map((p, i) => {
          const active = i === selectedIndex;
          return (
            <button
              key={p.name}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(i)}
              className={`group relative w-full rounded-md px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
                active
                  ? "bg-[var(--surface-muted)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-[var(--text-primary)]"
                />
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[15px] font-medium">{p.name}</span>
                <span
                  className={`inline-flex shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryBadgeClass(p.badgeClass)}`}
                >
                  {p.badge.slice(0, 3)}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs leading-snug text-[var(--text-secondary)]">{p.tagline}</p>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
