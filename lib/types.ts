/** Domain types for the design patterns catalog — mirrors the original HTML document model. */

export type PatternCategory = "creational" | "structural" | "behavioral" | "solid";

export type MainView = PatternCategory | "summary" | "fintech";

export type DetailSection = "overview" | "code" | "impl";

export interface PatternRecord {
  name: string;
  badge: string;
  badgeClass: string;
  tagline: string;
  intent: string;
  problem: string;
  analogy: string;
  solution: string;
  /** Pre-rendered HTML with syntax span classes (same as the source document). */
  code: string;
  impl: string[];
  /** Second pill in detail header (default: "GoF Pattern"). */
  catalogLabel?: string;
  /** Heading above code block (default: "Spring Boot implementation"). */
  codeSectionLabel?: string;
}

export interface PatternsCollection {
  creational: PatternRecord[];
  structural: PatternRecord[];
  behavioral: PatternRecord[];
  solid: PatternRecord[];
}

export interface FintechPatternRef {
  name: string;
  reason: string;
}

export type ProjectFileKey = "structure" | "compose" | "dockerfile" | "appConfig";
