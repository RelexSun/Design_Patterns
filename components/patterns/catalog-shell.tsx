"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MainCategoryTabs } from "./main-category-tabs";
import { ScrollToTopButton } from "./scroll-to-top-button";

const collapseBtnClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]";

export function CatalogShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            <div className="mb-2 px-1">
              <Link
                href="/"
                className="block rounded-md px-2 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              >
                Home
              </Link>
            </div>
            <MainCategoryTabs
              embedded
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
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">{children}</div>
      </div>

      <ScrollToTopButton />
    </div>
  );
}
