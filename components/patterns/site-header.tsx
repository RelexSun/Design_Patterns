import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--header-gradient)] px-5 py-6 sm:px-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            Reference
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-[1.65rem]">
            Design Patterns — Spring Boot Reference
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            All 23 GoF patterns + SOLID principles + enterprise patterns with theory, examples &amp; fintech project
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
