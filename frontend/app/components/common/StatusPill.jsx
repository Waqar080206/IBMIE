import React from "react";
import { ArrowDownCircle, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { T, FONTS } from "../../styles/theme";

const STATUS_MAP = {
  LOW: { bg: T.lowTint, fg: T.low, icon: ArrowDownCircle, label: "Low" },
  NORMAL: { bg: T.primaryTint, fg: T.primary, icon: CheckCircle2, label: "Normal" },
  HIGH: { bg: T.highTint, fg: T.high, icon: AlertTriangle, label: "High" },
  CRITICAL: { bg: T.criticalTint, fg: T.critical, icon: AlertOctagon, label: "Critical" },
};

/** Small colored badge showing a lab result's status (Low / Normal / High / Critical). */
export default function StatusPill({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.NORMAL;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.fg, fontFamily: FONTS.body }}
    >
      <Icon size={13} strokeWidth={2.4} />
      {s.label}
    </span>
  );
}
