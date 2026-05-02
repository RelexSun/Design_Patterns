import Link from "next/link";

const PILL =
  "inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] shadow-sm";

export function LandingPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
        Spring Boot learning reference
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
        Design patterns for real services
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
        A structured walkthrough of the classic GoF catalog, SOLID principles, and
        how they show up in Spring Boot. Includes a capstone{" "}
        <strong className="font-medium text-[var(--text-primary)]">FinFlow</strong>{" "}
        fintech-style project: microservices, sagas, event-driven flows, and
        production concerns (observability, resilience, compliance).
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <span className={PILL}>23 GoF patterns</span>
        <span className={PILL}>SOLID</span>
        <span className={PILL}>Summary &amp; matrix</span>
        <span className={PILL}>FinFlow project</span>
      </div>

      <div className="mt-10 space-y-3 border-t border-[var(--border-subtle)] pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Start here
        </h2>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li>
            <Link
              href="/creational"
              className="font-medium text-[var(--accent)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--accent)]"
            >
              Creational patterns
            </Link>
            <span className="text-[var(--text-secondary)]"> — </span>
            Factory, Builder, Singleton, and more with Spring examples.
          </li>
          <li>
            <Link
              href="/summary"
              className="font-medium text-[var(--accent)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--accent)]"
            >
              Summary
            </Link>
            <span className="text-[var(--text-secondary)]"> — </span>
            One-page overview of the full catalog.
          </li>
          <li>
            <Link
              href="/fintech/arch"
              className="font-medium text-[var(--accent)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:decoration-[var(--accent)]"
            >
              Fintech project
            </Link>
            <span className="text-[var(--text-secondary)]"> — </span>
            Architecture, schedule, patterns in use, and service feature map.
          </li>
        </ul>
      </div>

      <p className="mt-8 text-sm text-[var(--text-secondary)]">
        Use the sidebar on any reference page to switch between pattern families,
        summary, and FinFlow—each main area is its own route.
      </p>
    </div>
  );
}
