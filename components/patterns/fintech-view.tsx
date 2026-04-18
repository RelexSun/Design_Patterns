"use client";

import { FINTECH_PATTERNS, PROJECT_FILES } from "@/lib/patterns-data";

export function FintechView() {
  return (
    <div className="animate-fade-in space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Fintech/Banking — Most Used Patterns</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          These patterns appear in virtually every enterprise banking system
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FINTECH_PATTERNS.map((fp) => (
            <div
              key={fp.name}
              title={fp.reason}
              className="flex max-w-full cursor-default items-baseline gap-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-elevated)]"
            >
              <span>{fp.name}</span>
              <span className="truncate text-[11px] font-normal text-[var(--text-secondary)]">
                — {fp.reason.split(",")[0]}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Project: Multi-Tenant Digital Banking Platform
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Microservices architecture — Gateway, Account, Payment, Notification, Fraud services
          </p>
        </div>

        <ProjectBlock title="Project Structure" fileLabel="tree" code={PROJECT_FILES.structure} />
        <ProjectBlock title="docker-compose.yml" fileLabel="yml" code={PROJECT_FILES.compose} />
        <ProjectBlock title="Dockerfile (multi-stage)" fileLabel="Dockerfile" code={PROJECT_FILES.dockerfile} />
        <ProjectBlock title="application.yml (account-service)" fileLabel="yml" code={PROJECT_FILES.appConfig} />
      </section>
    </div>
  );
}

function ProjectBlock({ title, fileLabel, code }: { title: string; fileLabel: string; code: string }) {
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-sm last:mb-0">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
        <span className="rounded-md border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
          {fileLabel}
        </span>
      </div>
      <pre className="max-h-[min(420px,70vh)] overflow-auto whitespace-pre border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] p-5 font-mono text-[11px] leading-relaxed text-[var(--text-primary)] sm:text-xs">
        {code}
      </pre>
    </div>
  );
}
