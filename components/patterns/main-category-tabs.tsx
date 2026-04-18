"use client";

import { PATTERNS } from "@/lib/patterns-data";
import type { MainView } from "@/lib/types";

const TAB_ORDER: MainView[] = [
  "creational",
  "structural",
  "behavioral",
  "solid",
  "summary",
  "fintech",
];

const LABELS: Record<MainView, string> = {
  creational: "Creational",
  structural: "Structural",
  behavioral: "Behavioral",
  solid: "SOLID",
  summary: "Summary",
  fintech: "Fintech Project",
};

const COUNTS: Partial<Record<MainView, number>> = {
  creational: PATTERNS.creational.length,
  structural: PATTERNS.structural.length,
  behavioral: PATTERNS.behavioral.length,
  solid: PATTERNS.solid.length,
};

const BADGE_TAILWIND: Record<string, string> = {
  creational: "bg-[var(--badge-create-bg)] text-[var(--badge-create-fg)] border-[var(--badge-create-border)]",
  structural: "bg-[var(--badge-struct-bg)] text-[var(--badge-struct-fg)] border-[var(--badge-struct-border)]",
  behavioral: "bg-[var(--badge-behave-bg)] text-[var(--badge-behave-fg)] border-[var(--badge-behave-border)]",
  solid: "bg-[var(--badge-solid-bg)] text-[var(--badge-solid-fg)] border-[var(--badge-solid-border)]",
};

type Props = {
  active: MainView;
  onChange: (view: MainView) => void;
};

export function MainCategoryTabs({ active, onChange }: Props) {
  return (
    <nav
      className="scrollbar-none sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-[var(--border-subtle)] bg-[var(--surface)]/85 px-4 py-3 backdrop-blur-md sm:px-8"
      aria-label="Main sections"
    >
      {TAB_ORDER.map((id) => {
        const count = COUNTS[id];
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-state={isActive ? "active" : "inactive"}
            onClick={() => onChange(id)}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
              isActive
                ? "border border-b-0 border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm"
                : "border border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {LABELS[id]}
            {count != null && (
              <span
                className={`inline-flex min-w-[1.5rem] justify-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${BADGE_TAILWIND[id] ?? ""}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
