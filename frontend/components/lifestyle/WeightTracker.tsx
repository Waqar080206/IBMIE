"use client";

import { useState } from "react";
import { Scale, Plus } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card } from "../UI";
import { Sparkline } from "../Charts";
import { WeightEntry } from "@/lib/lifestyle-types";
import { WEIGHT_HISTORY } from "@/lib/lifestyle-data";

export default function WeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>(WEIGHT_HISTORY);
  const [input, setInput] = useState("");

  const latest = entries[entries.length - 1];
  const first = entries[0];
  const delta = latest.value - first.value;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(input);
    if (!n) return;
    setEntries((prev) => [...prev, { date: "Today", value: n, unit: "kg" }]);
    setInput("");
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale size={16} color={T.primary} />
          <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Weight</h3>
        </div>
        <span className="text-[12px] font-medium" style={{ color: delta <= 0 ? T.primary : T.high, fontFamily: "var(--font-mono)" }}>
          {delta <= 0 ? "▼" : "▲"} {Math.abs(delta).toFixed(1)} kg since {first.date}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[24px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>
            {latest.value} <span className="text-[13px] font-normal" style={{ color: T.muted }}>kg</span>
          </div>
          <div className="text-[11.5px]" style={{ color: T.muted }}>Latest entry</div>
        </div>
        <Sparkline points={entries.map((e) => e.value)} color={T.primary} width={160} height={48} />
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="number"
          step="0.1"
          placeholder="Log today's weight (kg)"
          className="flex-1 rounded-lg px-3 py-2 text-[13px] outline-none"
          style={{ background: T.canvasAlt, color: T.ink, fontFamily: "var(--font-body)" }}
        />
        <button type="submit" className="rounded-lg px-3.5 flex items-center justify-center" style={{ background: T.primary }}>
          <Plus size={16} color="#fff" />
        </button>
      </form>
    </Card>
  );
}
