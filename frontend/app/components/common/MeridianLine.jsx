import React from "react";
import { T, FONTS } from "../../styles/theme";

/**
 * Signature element: the "Meridian Line" — a reference-range ruler with a
 * positioned marker showing exactly where a lab value falls relative to
 * its low/high reference bounds.
 */
export default function MeridianLine({ value, low, high, status }) {
  const color = { LOW: T.low, NORMAL: T.primary, HIGH: T.high, CRITICAL: T.critical }[status] || T.primary;

  const hasLow = typeof low === "number";
  const hasHigh = typeof high === "number";
  const span = hasLow && hasHigh ? high - low : Math.max(Math.abs(value), 1);
  const pad = span * 0.55 || Math.max(value * 0.4, 1);

  const domainMin = (hasLow ? low : value) - pad;
  const domainMax = (hasHigh ? high : value) + pad;
  const width = domainMax - domainMin || 1;

  const pct = (n) => Math.min(100, Math.max(0, ((n - domainMin) / width) * 100));
  const lowPct = hasLow ? pct(low) : 0;
  const highPct = hasHigh ? pct(high) : 100;
  const valuePct = pct(value);

  return (
    <div className="w-full select-none" style={{ fontFamily: FONTS.mono }}>
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: T.canvasAlt }}>
        <div
          className="absolute inset-y-0"
          style={{ left: `${lowPct}%`, width: `${Math.max(highPct - lowPct, 1.5)}%`, background: T.primaryTint }}
        />
        <div className="absolute inset-y-0" style={{ left: `${lowPct}%`, width: 2, background: T.borderStrong }} />
        <div className="absolute inset-y-0" style={{ left: `${highPct}%`, width: 2, background: T.borderStrong }} />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 rounded-full border-2"
          style={{
            left: `calc(${valuePct}% - 7px)`,
            transform: "translateY(-50%)",
            background: color,
            borderColor: T.card,
            boxShadow: "0 0 0 1px " + color,
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[11px]" style={{ color: T.muted }}>
        <span>{hasLow ? low : "—"}</span>
        <span className="opacity-70">reference</span>
        <span>{hasHigh ? high : "—"}</span>
      </div>
    </div>
  );
}
