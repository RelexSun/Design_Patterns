"use client";

import type { PatternRecord } from "@/lib/types";
import { PATTERNS } from "@/lib/patterns-data";
import { summaryBadgeClass } from "@/lib/badge-styles";

function allPatterns(): PatternRecord[] {
  return [...PATTERNS.creational, ...PATTERNS.structural, ...PATTERNS.behavioral, ...PATTERNS.solid];
}

export function SummaryView() {
  const items = allPatterns();
  return (
    <div className="animate-fade-in space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">What you&apos;ve learnt</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Design patterns are proven, reusable solutions to recurring software design problems. They are not code
          templates — they are conceptual blueprints. Mastering them makes you a better architect, a more effective code
          reviewer, and lets you communicate intent clearly with your team. The <strong className="font-semibold text-[var(--text-primary)]">SOLID</strong> tab covers the same depth (intent through implementation steps) for each design principle.
        </p>
      </section>

      <section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div
              key={`${p.badge}-${p.name}`}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4 transition hover:border-[var(--border-strong)]"
            >
              <span
                className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${summaryBadgeClass(p.badge)}`}
              >
                {p.badge}
              </span>
              <h4 className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{p.name}</h4>
              <p className="mt-1 text-xs leading-snug text-[var(--text-secondary)]">{p.tagline}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Key principles behind all patterns</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Program to interfaces
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
              Depend on abstractions, not concrete implementations. This is the basis of Strategy, Factory, Command, and
              more.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Favour composition over inheritance
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
              Patterns like Decorator, Bridge, and Strategy prefer object composition to build flexible behaviours at
              runtime.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Open/closed principle
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
              Code should be open for extension but closed for modification. Strategy, Template Method, and Observer
              embody this.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Single responsibility
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
              Each class does one thing. Command, Facade, and Proxy separate concerns cleanly into discrete objects.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
