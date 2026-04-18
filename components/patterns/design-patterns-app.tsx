"use client";

import { useCallback, useMemo, useState } from "react";
import { PATTERNS } from "@/lib/patterns-data";
import type { DetailSection, MainView, PatternCategory } from "@/lib/types";
import { MainCategoryTabs } from "./main-category-tabs";
import { PatternCardGrid } from "./pattern-card-grid";
import { PatternDetailPanel } from "./pattern-detail-panel";
import { SummaryView } from "./summary-view";
import { FintechView } from "./fintech-view";

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
      <MainCategoryTabs active={mainView} onChange={setMainView} />
      <div className="flex-1 px-4 py-8 sm:px-8 lg:px-20">
        {isPatternCategory(mainView) && patternDetail ? (
          <div className="animate-fade-in space-y-6 flex-col lg:gap-8 lg:space-y-0 xl:gap-10">
            <div className="min-w-0 lg:sticky lg:top-[4rem] lg:self-center bg-background z-10 py-0.5">
              <PatternCardGrid
                patterns={PATTERNS[mainView]}
                selectedIndex={indices[mainView]}
                onSelect={(i) => selectPattern(mainView, i)}
              />
            </div>
            <div className="min-w-0">
              <PatternDetailPanel
                pattern={patternDetail}
                section={sections[mainView]}
                onSectionChange={(sec) => setDetailSection(mainView, sec)}
              />
            </div>
          </div>
        ) : mainView === "summary" ? (
          <SummaryView />
        ) : (
          <FintechView />
        )}
      </div>
    </>
  );
}
