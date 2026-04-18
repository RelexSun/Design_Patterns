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
    <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
      {patterns.map((p, i) => {
        const active = i === selectedIndex;
        return (
          <button
            key={p.name}
            type="button"
            onClick={() => onSelect(i)}
            className={`group flex flex-col rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
              active
                ? "border-[var(--border-strong)] bg-[var(--surface-muted)] shadow-sm ring-1 ring-[var(--accent-soft)]"
                : "border-[var(--border-subtle)] bg-[var(--surface-elevated)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-muted)]"
            }`}
          >
            <span
              className={`mb-2 inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${categoryBadgeClass(p.badgeClass)}`}
            >
              {p.badge}
            </span>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
              {p.name}
            </h3>
            <p className="mt-1 text-xs leading-snug text-[var(--text-secondary)]">{p.tagline}</p>
          </button>
        );
      })}
    </div>
  );
}
