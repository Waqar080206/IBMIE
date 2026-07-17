// Meridian design tokens — shared color, spacing and status palette.
// Import this anywhere a component needs consistent styling.

export const T = {
  canvas: "#F4F6F2",
  canvasAlt: "#ECEFE8",
  card: "#FFFFFF",
  ink: "#132A2A",
  inkSoft: "#41564F",
  muted: "#7C8B85",
  border: "#DCE2D8",
  borderStrong: "#C6D0C1",

  primary: "#1F5A52",
  primaryDeep: "#123D38",
  primaryTint: "#E4EEEA",

  low: "#4A6FA5",
  lowTint: "#E9EFF7",
  high: "#B9791F",
  highTint: "#FBF0DE",
  critical: "#B1402C",
  criticalTint: "#FBE7E2",

  gold: "#C7A24A",
  coral: "#C1614A",
  coralTint: "#F8E9E4",
} as const;

export type StatusKey = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export const STATUS_STYLE: Record<StatusKey, { bg: string; fg: string; label: string }> = {
  LOW: { bg: T.lowTint, fg: T.low, label: "Low" },
  NORMAL: { bg: T.primaryTint, fg: T.primary, label: "Normal" },
  HIGH: { bg: T.highTint, fg: T.high, label: "High" },
  CRITICAL: { bg: T.criticalTint, fg: T.critical, label: "Critical" },
};
