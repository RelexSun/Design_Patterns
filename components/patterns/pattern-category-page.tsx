"use client";

import { useCallback, useMemo, useState } from "react";
import { PATTERNS } from "@/lib/patterns-data";
import type { DetailSection, PatternCategory } from "@/lib/types";
import { PatternCardGrid } from "./pattern-card-grid";
import { PatternDetailPanel } from "./pattern-detail-panel";

export function PatternCategoryPage({
  category,
}: {
  category: PatternCategory;
}) {
  const [index, setIndex] = useState(0);
  const [section, setSection] = useState<DetailSection>("overview");

  const patternDetail = useMemo(() => {
    const list = PATTERNS[category];
    return list[index] ?? list[0];
  }, [category, index]);

  const selectPattern = useCallback((i: number) => {
    setIndex(i);
    setSection("overview");
  }, []);

  return (
    <div className="animate-fade-in grid w-full gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="min-w-0 order-2 lg:order-1">
        <PatternDetailPanel
          pattern={patternDetail}
          section={section}
          onSectionChange={setSection}
        />
      </div>
      <aside className="min-w-0 order-1 lg:order-2 lg:sticky lg:top-[10.25rem]">
        <PatternCardGrid
          patterns={PATTERNS[category]}
          selectedIndex={index}
          onSelect={selectPattern}
        />
      </aside>
    </div>
  );
}
