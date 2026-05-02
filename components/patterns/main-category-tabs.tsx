"use client";

import type { ReactNode } from "react";
import {
  FINTECH_SECTION_OPTIONS,
  type FintechTab,
} from "@/lib/fintech-sections";
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
  /** Optional control (e.g. collapse) shown beside the title row */
  headerRight?: ReactNode;
  /** Omit outer card chrome when nested inside a shell (e.g. fixed sidebar) */
  embedded?: boolean;
  /** Active FinFlow sub-page (sidebar) when Fintech Project is selected */
  fintechSection?: FintechTab;
  onFintechSectionChange?: (section: FintechTab) => void;
};

export function MainCategoryTabs({
  active,
  onChange,
  headerRight,
  embedded,
  fintechSection,
  onFintechSectionChange,
}: Props) {
  return (
    <nav
      className={
        embedded
          ? "flex flex-col gap-2"
          : "rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-2 shadow-sm"
      }
      aria-label="Main sections"
    >
      <div className="flex items-center justify-between gap-2 px-2">
        <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Main Sections
        </p>
        {headerRight}
      </div>
      <div className="h-px bg-[var(--border-subtle)]" />
      <div className="space-y-1">
        {TAB_ORDER.map((id) => {
          if (id === "fintech") {
            const isFintechActive = active === "fintech";
            const showSubNav = onFintechSectionChange != null && fintechSection != null;
            const subNavOpen = isFintechActive && showSubNav;
            return (
              <div key={id} className="space-y-0.5">
                <button
                  type="button"
                  role="tab"
                  aria-expanded={showSubNav ? isFintechActive : undefined}
                  aria-selected={isFintechActive}
                  data-state={isFintechActive ? "active" : "inactive"}
                  onClick={() => onChange("fintech")}
                  className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
                    isFintechActive
                      ? "bg-[var(--surface-muted)] font-medium text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="min-w-0 truncate text-left">
                    {LABELS.fintech}
                  </span>
                  <span
                    className={`inline-flex shrink-0 text-[var(--text-secondary)] transition-[transform,opacity,color] duration-300 ease-out motion-reduce:transition-none ${
                      isFintechActive
                        ? "rotate-90 text-[var(--text-primary)]"
                        : "rotate-0 opacity-70"
                    }`}
                    aria-hidden
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </button>
                {subNavOpen && (
                  <ul
                    className="animate-fade-in ml-1.5 origin-top space-y-0.5 border-l border-[var(--border-subtle)] pl-2.5 motion-safe:[animation-duration:280ms]"
                    role="group"
                    aria-label="Fintech project pages"
                  >
                    {FINTECH_SECTION_OPTIONS.map((opt) => {
                      const subActive = fintechSection === opt.id;
                      return (
                        <li key={opt.id}>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={subActive}
                            data-state={subActive ? "active" : "inactive"}
                            onClick={() => {
                              onChange("fintech");
                              onFintechSectionChange?.(opt.id);
                            }}
                            className={`flex w-full rounded-md py-1.5 pl-1.5 pr-2 text-left text-xs leading-snug transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
                              subActive
                                ? "bg-[var(--surface-muted)] font-medium text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]/80 hover:text-[var(--text-primary)]"
                            }`}
                          >
                            <span className="truncate">{opt.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          }

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
              className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
                isActive
                  ? "bg-[var(--surface-muted)] font-medium text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="truncate text-left">{LABELS[id]}</span>
              {count != null && (
                <span
                  className={`inline-flex min-w-[1.5rem] shrink-0 justify-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${BADGE_TAILWIND[id] ?? ""}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
