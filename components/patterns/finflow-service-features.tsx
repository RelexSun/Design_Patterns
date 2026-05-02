"use client";

import { useMemo, useState } from "react";
import {
  FINFLOW_SERVICE_CATEGORIES,
  FINFLOW_SERVICES,
  type FinflowService,
  type FinflowServiceCategory,
} from "@/lib/finflow-services-data";

function featureCount(svc: FinflowService): number {
  return svc.groups
    .filter((g) => g.title !== "Tech stack")
    .reduce((s, g) => s + g.features.length, 0);
}

export function FinflowServiceFeatures() {
  const [activeCategory, setActiveCategory] = useState<
    "All" | FinflowServiceCategory
  >("All");
  const [search, setSearch] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const q = search.trim().toLowerCase();

  const visibility = useMemo(() => {
    const map = new Map<string, { showCard: boolean; lineMatch: (text: string) => boolean }>();

    for (const svc of FINFLOW_SERVICES) {
      const catOk =
        activeCategory === "All" || svc.category === activeCategory;
      if (!catOk) {
        map.set(svc.name, {
          showCard: false,
          lineMatch: () => false,
        });
        continue;
      }

      const nameHit = q.length > 0 && svc.name.toLowerCase().includes(q);
      const lineMatch = (text: string) =>
        !q ||
        nameHit ||
        text.toLowerCase().includes(q);

      let showCard = true;
      if (q && !nameHit) {
        const anyFeature = svc.groups.some((g) =>
          g.features.some((f) => f.toLowerCase().includes(q)),
        );
        showCard = anyFeature;
      }

      map.set(svc.name, { showCard, lineMatch });
    }

    return map;
  }, [activeCategory, q]);

  const anyVisible = FINFLOW_SERVICES.some(
    (svc) => visibility.get(svc.name)?.showCard,
  );

  const toggleOpen = (name: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-4 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search features across all services..."
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--border-strong)]"
          aria-label="Search features"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FINFLOW_SERVICE_CATEGORIES.map((c) => {
          const active = activeCategory === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
                active
                  ? "border-transparent bg-[var(--text-primary)] text-[var(--surface-elevated)]"
                  : "border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {FINFLOW_SERVICES.map((svc) => {
          const v = visibility.get(svc.name);
          if (!v?.showCard) return null;

          const isOpen = openIds.has(svc.name);
          const total = featureCount(svc);

          return (
            <article
              key={svc.name}
              className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleOpen(svc.name)}
                className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-left transition hover:bg-[var(--surface-muted)]"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: svc.color }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 text-sm font-medium text-[var(--text-primary)]">
                  {svc.name}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: svc.badge.bg,
                    color: svc.badge.text,
                  }}
                >
                  {svc.category}
                </span>
                <span className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] text-[var(--text-secondary)]">
                  {total} features
                </span>
                <span
                  className={`shrink-0 text-[var(--text-secondary)] transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                  aria-hidden
                >
                  ›
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-[var(--border-subtle)]">
                  {svc.groups.map((g) => {
                    const visible =
                      g.title === "Tech stack"
                        ? g.features.filter((t) => v.lineMatch(t))
                        : g.features.filter((f) => v.lineMatch(f));
                    if (q.length > 0 && visible.length === 0) return null;

                    return (
                      <div
                        key={g.title}
                        className="border-b border-[var(--border-subtle)] px-4 py-2.5 last:border-b-0"
                      >
                        <h4 className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
                          {g.title}
                        </h4>
                        {g.title === "Tech stack" ? (
                          <div className="flex flex-wrap gap-1">
                            {visible.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <ul className="list-none space-y-0.5">
                            {visible.map((f) => (
                              <li
                                key={f}
                                className="relative pl-3.5 text-xs leading-relaxed text-[var(--text-secondary)] before:absolute before:left-0 before:text-[var(--text-secondary)] before:content-['→']"
                              >
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {!anyVisible && (
        <p className="py-8 text-center text-sm text-[var(--text-secondary)]">
          No features match your search.
        </p>
      )}
    </div>
  );
}
