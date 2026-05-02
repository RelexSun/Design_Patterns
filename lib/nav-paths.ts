import type { FintechTab } from "@/lib/fintech-sections";
import { isFintechTab } from "@/lib/fintech-sections";
import type { MainView, PatternCategory } from "@/lib/types";

export const HOME_PATH = "/";

const PATTERN_SEGMENTS: PatternCategory[] = [
  "creational",
  "structural",
  "behavioral",
  "solid",
];

/** Map URL pathname to main sidebar view + FinFlow section (for active states). */
export function pathnameToCatalogState(pathname: string): {
  mainView: MainView;
  fintechSection: FintechTab;
} {
  if (pathname === "/summary") {
    return { mainView: "summary", fintechSection: "arch" };
  }

  for (const seg of PATTERN_SEGMENTS) {
    if (pathname === `/${seg}`) {
      return { mainView: seg, fintechSection: "arch" };
    }
  }

  if (pathname === "/fintech") {
    return { mainView: "fintech", fintechSection: "arch" };
  }

  const m = /^\/fintech\/([^/]+)/.exec(pathname);
  if (m) {
    const section = m[1];
    if (isFintechTab(section)) {
      return { mainView: "fintech", fintechSection: section };
    }
  }

  return { mainView: "creational", fintechSection: "arch" };
}

export function fintechPath(section: FintechTab): string {
  return `/fintech/${section}`;
}
