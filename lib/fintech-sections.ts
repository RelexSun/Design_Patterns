/** FinFlow project sub-sections (shown in main sidebar when Fintech Project is active). */

export type FintechTab =
  | "arch"
  | "schedule"
  | "patterns"
  | "most-used"
  | "services";

export const FINTECH_SECTION_OPTIONS: { id: FintechTab; label: string }[] = [
  { id: "arch", label: "Architecture" },
  { id: "schedule", label: "Schedule" },
  { id: "patterns", label: "Patterns & Tech" },
  { id: "most-used", label: "Most Used Patterns" },
  { id: "services", label: "Service features" },
];

const FINTECH_IDS = new Set<string>(
  FINTECH_SECTION_OPTIONS.map((o) => o.id),
);

export function isFintechTab(value: string): value is FintechTab {
  return FINTECH_IDS.has(value);
}
