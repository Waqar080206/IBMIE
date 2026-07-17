"use client";

import { CalendarRange, Sparkles, TrendingUp, Leaf } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card, TopBar } from "./UI";
import { WEEKLY_SUMMARY } from "@/lib/mock-data";

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 220;
  const h = 56;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((p - min) / range) * (h - 10) - 5}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={i * step} cy={h - ((p - min) / range) * (h - 10) - 5} r={i === points.length - 1 ? 4 : 2.5} fill={color} />
      ))}
    </svg>
  );
}

export default function WeeklySummaryView() {
  const s = WEEKLY_SUMMARY;
  return (
    <div>
      <TopBar title="Weekly health summary" subtitle={s.weekRange} />

      <Card className="p-5 mb-5" style={{ background: T.primaryTint, border: "none" }}>
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold mb-2" style={{ color: T.primary }}>
          <CalendarRange size={13} /> THIS WEEK
        </div>
        <p className="text-[14px] leading-relaxed" style={{ color: T.primaryDeep, fontFamily: "var(--font-body)" }}>{s.headline}</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} color={T.gold} />
            <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Highlights</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {s.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed" style={{ color: T.inkSoft, fontFamily: "var(--font-body)" }}>
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: T.primary }} />
                {h}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} color={T.primary} />
            <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Trends</h3>
          </div>
          <div className="flex flex-col gap-5">
            {s.trend.map((t, i) => {
              const rising = t.points[t.points.length - 1] > t.points[0];
              return (
                <div key={t.label} className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-medium" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{t.label}</div>
                    <div className="text-[16px] font-semibold" style={{ color: rising ? T.high : T.primary, fontFamily: "var(--font-mono)" }}>
                      {t.points[t.points.length - 1]} <span className="text-[11px] font-normal" style={{ color: T.muted }}>{t.unit}</span>
                    </div>
                  </div>
                  <Sparkline points={t.points} color={rising ? T.high : T.primary} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Leaf size={15} color={T.primary} />
          <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Lifestyle suggestions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {s.lifestyleTips.map((tip, i) => (
            <div key={i} className="rounded-lg p-3.5 text-[13px] leading-relaxed" style={{ background: T.canvasAlt, color: T.inkSoft, fontFamily: "var(--font-body)" }}>
              {tip}
            </div>
          ))}
        </div>
        <p className="text-[11.5px] mt-4" style={{ color: T.muted }}>
          General suggestions based on your recent values — not a personalized medical or dietary plan.
        </p>
      </Card>
    </div>
  );
}
