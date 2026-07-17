"use client";

import { T } from "@/lib/tokens";

export function Sparkline({ points, color, width = 220, height = 56 }: { points: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1 || 1);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${height - ((p - min) / range) * (height - 10) - 5}`).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={i * step} cy={height - ((p - min) / range) * (height - 10) - 5} r={i === points.length - 1 ? 4 : 2.5} fill={color} />
      ))}
    </svg>
  );
}

export function WeekBars({ data, color, unit }: { data: { date: string; value: number }[]; color: string; unit: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2 h-28">
      {data.map((d) => (
        <div key={d.date} className="flex flex-col items-center gap-1.5 flex-1">
          <div className="text-[10px]" style={{ color: T.muted, fontFamily: "var(--font-mono)" }}>{d.value}</div>
          <div className="w-full rounded-t-md" style={{ height: `${(d.value / max) * 80}px`, background: color, minHeight: 4 }} />
          <div className="text-[10.5px]" style={{ color: T.muted }}>{d.date}</div>
        </div>
      ))}
    </div>
  );
}

export function ProgressRing({
  value,
  target,
  color,
  size = 92,
  strokeWidth = 9,
  label,
  sublabel,
}: {
  value: number;
  target: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
}) {
  const pct = Math.min(1, target > 0 ? value / target : 0);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.canvasAlt} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        <text x="50%" y="47%" textAnchor="middle" fontSize="15" fontWeight={600} fill={T.ink} fontFamily="var(--font-display)">
          {Math.round(pct * 100)}%
        </text>
      </svg>
      <div className="text-center">
        <div className="text-[12.5px] font-medium" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{label}</div>
        {sublabel && <div className="text-[11px]" style={{ color: T.muted }}>{sublabel}</div>}
      </div>
    </div>
  );
}
