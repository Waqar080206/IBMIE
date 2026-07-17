"use client";

import { Droplets, Plus, Minus } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card } from "../UI";

export default function WaterTracker({
  glasses,
  target,
  onChange,
}: {
  glasses: number;
  target: number;
  onChange: (n: number) => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets size={16} color={T.low} />
          <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Water intake</h3>
        </div>
        <span className="text-[12.5px] font-medium" style={{ color: T.muted, fontFamily: "var(--font-mono)" }}>
          {glasses} / {target} glasses
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: target }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i < glasses ? i : i + 1)}
            className="h-9 w-7 rounded-b-lg rounded-t-sm border-2 transition-colors"
            style={{
              borderColor: i < glasses ? T.low : T.borderStrong,
              background: i < glasses ? T.lowTint : "transparent",
            }}
            aria-label={`Glass ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, glasses - 1))}
          className="h-9 w-9 rounded-full flex items-center justify-center"
          style={{ background: T.canvasAlt }}
        >
          <Minus size={15} color={T.inkSoft} />
        </button>
        <button
          onClick={() => onChange(glasses + 1)}
          className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold flex items-center justify-center gap-1.5"
          style={{ background: T.low, color: "#fff", fontFamily: "var(--font-body)" }}
        >
          <Plus size={15} /> Add a glass
        </button>
      </div>
    </Card>
  );
}
