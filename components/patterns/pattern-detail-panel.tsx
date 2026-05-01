"use client";

import type { DetailSection, PatternRecord } from "@/lib/types";

const SECTIONS: { id: DetailSection; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "code", label: "Code" },
  { id: "impl", label: "How to Implement" },
];

type Props = {
  pattern: PatternRecord;
  section: DetailSection;
  onSectionChange: (section: DetailSection) => void;
};

export function PatternDetailPanel({
  pattern,
  section,
  onSectionChange,
}: Props) {
  const activeSectionLabel =
    SECTIONS.find((item) => item.id === section)?.label ?? "Overview";

  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-sm">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              {pattern.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {pattern.tagline}
            </p>
          </div>
          <span className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
            Viewing: {activeSectionLabel}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <MetaPill>{pattern.badge}</MetaPill>
          <MetaPill>{pattern.catalogLabel ?? "GoF Pattern"}</MetaPill>
          <MetaPill>Spring Boot</MetaPill>
        </div>
      </header>

      <div className="scrollbar-none flex overflow-x-auto border-b border-[var(--border-subtle)] px-3 py-2">
        {SECTIONS.map(({ id, label }) => {
          const active = section === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSectionChange(id)}
              className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
                active
                  ? "bg-[var(--surface-muted)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="min-w-0 px-5 py-6 sm:px-7">
        {section === "overview" && <OverviewBody pattern={pattern} />}
        {section === "code" && <CodeBody pattern={pattern} />}
        {section === "impl" && <ImplBody pattern={pattern} />}
      </div>
    </article>
  );
}

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
      {children}
    </span>
  );
}

function OverviewBody({ pattern }: { pattern: PatternRecord }) {
  return (
    <>
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <InfoCard title="Intent">{pattern.intent}</InfoCard>
        <InfoCard title="Problem it solves">{pattern.problem}</InfoCard>
      </div>
      <div className="mb-5 rounded-xl border border-l-4 border-[var(--border-subtle)] border-l-[var(--analogy-border)] bg-[var(--analogy-bg)] px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--analogy-label)]">
          Real-world analogy
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
          {pattern.analogy}
        </p>
      </div>
      <InfoCard title="Solution">{pattern.solution}</InfoCard>
    </>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
        {title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-primary)]">
        {children}
      </p>
    </div>
  );
}

function CodeBody({ pattern }: { pattern: PatternRecord }) {
  return (
    <>
      <p className="mb-2 font-mono text-[11px] font-medium text-[var(--text-secondary)]">
        {pattern.codeSectionLabel ?? "Spring Boot implementation"}
      </p>
      <pre
        className="pattern-code scrollbar-thin min-w-0 max-w-full overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-5 font-mono text-[12px] leading-relaxed text-[var(--text-primary)]"
        dangerouslySetInnerHTML={{ __html: pattern.code }}
      />
    </>
  );
}

function ImplBody({ pattern }: { pattern: PatternRecord }) {
  return (
    <div className="impl-steps">
      {pattern.impl.map((step, i) => (
        <div key={i} className="impl-step">
          <div className="impl-step-content">{step}</div>
        </div>
      ))}
    </div>
  );
}
