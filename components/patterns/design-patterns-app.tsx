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

  return (
    <>
      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="order-first min-w-0 lg:order-none lg:sticky lg:top-[10.25rem] lg:self-start">
          <MainCategoryTabs active={mainView} onChange={setMainView} />
        </aside>
        <div className="min-w-0">
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
    </>
  );
}
