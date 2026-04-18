import type { PatternRecord } from "./types";

/** Maps legacy badge class names from source data to Tailwind utility groups. */
const BADGE_BY_CLASS: Record<string, string> = {
  "c-create":
    "bg-[var(--badge-create-bg)] text-[var(--badge-create-fg)] border-[var(--badge-create-border)]",
  "c-struct":
    "bg-[var(--badge-struct-bg)] text-[var(--badge-struct-fg)] border-[var(--badge-struct-border)]",
  "c-behave":
    "bg-[var(--badge-behave-bg)] text-[var(--badge-behave-fg)] border-[var(--badge-behave-border)]",
  "c-solid":
    "bg-[var(--badge-solid-bg)] text-[var(--badge-solid-fg)] border-[var(--badge-solid-border)]",
};

export function categoryBadgeClass(badgeClass: PatternRecord["badgeClass"]): string {
  return BADGE_BY_CLASS[badgeClass] ?? BADGE_BY_CLASS["c-create"];
}

export function summaryBadgeClass(badgeLabel: string): string {
  const map: Record<string, string> = {
    Creational: BADGE_BY_CLASS["c-create"] ?? "",
    Structural: BADGE_BY_CLASS["c-struct"] ?? "",
    Behavioral: BADGE_BY_CLASS["c-behave"] ?? "",
    SOLID: BADGE_BY_CLASS["c-solid"] ?? "",
  };
  return map[badgeLabel] ?? BADGE_BY_CLASS["c-create"] ?? "";
}
