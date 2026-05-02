"use client";

import { useCallback, useMemo, useState } from "react";
import { PATTERNS } from "@/lib/patterns-data";
import type { DetailSection, MainView, PatternCategory } from "@/lib/types";
import { MainCategoryTabs } from "./main-category-tabs";
import { PatternCardGrid } from "./pattern-card-grid";
import { PatternDetailPanel } from "./pattern-detail-panel";
import { SummaryView } from "./summary-view";
import { FintechView } from "./fintech-view";
import { ScrollToTopButton } from "./scroll-to-top-button";

function isPatternCategory(v: MainView): v is PatternCategory {
  return (
    v === "creational" ||
    v === "structural" ||
    v === "behavioral" ||
    v === "solid"
  );
}

const initialIndices: Record<PatternCategory, number> = {
  creational: 0,
  structural: 0,
  behavioral: 0,
  solid: 0,
};

const initialSections: Record<PatternCategory, DetailSection> = {
  creational: "overview",
  structural: "overview",
  behavioral: "overview",
  solid: "overview",
};

/** Main interactive shell — state colocation strategy (Facade for the catalog UI). */
export function DesignPatternsApp() {
  const [mainView, setMainView] = useState<MainView>("creational");
  const [indices, setIndices] = useState(initialIndices);
  const [sections, setSections] = useState(initialSections);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectPattern = useCallback(
    (category: PatternCategory, index: number) => {
      setIndices((prev) => ({ ...prev, [category]: index }));
      setSections((prev) => ({ ...prev, [category]: "overview" }));
    },
    [],
  );

  const setDetailSection = useCallback(
    (category: PatternCategory, section: DetailSection) => {
      setSections((prev) => ({ ...prev, [category]: section }));
    },
    [],
  );

  const patternDetail = useMemo(() => {
    if (!isPatternCategory(mainView)) return null;
    const list = PATTERNS[mainView];
    const idx = indices[mainView];
    return list[idx] ?? list[0];
  }, [mainView, indices]);

  const collapseBtnClass =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]";

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      <aside
        id="main-sections-sidebar"
        className={`fixed left-0 top-44 z-30 flex flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-sm transition-[width] duration-200 ease-out sm:top-36 ${
          sidebarOpen ? "w-60" : "w-12"
        } h-[calc(100dvh-11rem)] sm:h-[calc(100dvh-9rem)]`}
        aria-label="Main sections navigation"
      >
        {sidebarOpen ? (
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-2">
            <MainCategoryTabs
              embedded
              active={mainView}
              onChange={setMainView}
              headerRight={
                <button
                  type="button"
                  className={collapseBtnClass}
                  onClick={() => setSidebarOpen(false)}
                  aria-expanded={sidebarOpen}
                  aria-controls="main-sections-sidebar"
                  aria-label="Collapse main sections sidebar"
                >
                  <span aria-hidden className="leading-none">
                    ‹
                  </span>
                </button>
              }
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center pt-3">
            <button
              type="button"
              className={collapseBtnClass}
              onClick={() => setSidebarOpen(true)}
              aria-expanded={sidebarOpen}
              aria-controls="main-sections-sidebar"
              aria-label="Expand main sections sidebar"
            >
              <span aria-hidden className="leading-none">
                ›
              </span>
            </button>
          </div>
        )}
      </aside>

      <div
        className={`min-h-0 min-w-0 flex-1 transition-[padding] duration-200 ease-out ${
          sidebarOpen ? "pl-60" : "pl-12"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
          {isPatternCategory(mainView) && patternDetail ? (
            <div className="animate-fade-in grid w-full gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div className="min-w-0 order-2 lg:order-1">
                <PatternDetailPanel
                  pattern={patternDetail}
                  section={sections[mainView]}
                  onSectionChange={(sec) => setDetailSection(mainView, sec)}
                />
              </div>
              <aside className="min-w-0 order-1 lg:order-2 lg:sticky lg:top-[10.25rem]">
                <PatternCardGrid
                  patterns={PATTERNS[mainView]}
                  selectedIndex={indices[mainView]}
                  onSelect={(i) => selectPattern(mainView, i)}
                />
              </aside>
            </div>
          ) : mainView === "summary" ? (
            <SummaryView />
          ) : (
            <FintechView />
          )}
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
}
