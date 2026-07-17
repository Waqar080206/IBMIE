"use client";

import { useState } from "react";
import { Moon } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card } from "../UI";
import { WeekBars } from "../Charts";
import { SleepEntry, SleepQuality } from "@/lib/lifestyle-types";
import { WEEK_SLEEP } from "@/lib/lifestyle-data";

const QUALITIES: SleepQuality[] = ["Poor", "Fair", "Good", "Excellent"];

export default function SleepTracker({
  hours,
  quality,
  onChange,
}: {
  hours: number;
  quality: SleepQuality;
  onChange: (hours: number, quality: SleepQuality) => void;
}) {
  const chartData = [...WEEK_SLEEP.slice(0, 6), { date: "Today", hours, quality }].map((d: SleepEntry) => ({ date: d.date, value: d.hours }));

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Moon size={16} color={T.inkSoft} />
        <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Sleep</h3>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1">
          <div className="flex justify-between text-[11.5px] mb-1" style={{ color: T.muted }}>
            <span>Last night</span>
            <span style={{ fontFamily: "var(--font-mono)" }}>{hours.toFixed(1)} hrs</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={hours}
            onChange={(e) => onChange(Number(e.target.value), quality)}
            className="w-full"
            style={{ accentColor: T.inkSoft }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {QUALITIES.map((q) => (
          <button
            key={q}
            onClick={() => onChange(hours, q)}
            className="flex-1 rounded-lg py-2 text-[11.5px] font-semibold"
            style={{
              background: quality === q ? T.primaryTint : T.canvasAlt,
              color: quality === q ? T.primary : T.muted,
              fontFamily: "var(--font-body)",
            }}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="text-[11px] font-medium mb-2" style={{ color: T.muted }}>THIS WEEK</div>
      <WeekBars data={chartData} color={T.inkSoft} unit="hrs" />
    </Card>
  );
}
