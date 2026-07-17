"use client";

import { useState } from "react";
import { Droplets, Flame as CaloriesIcon, Footprints, Moon, Activity, Target, Pencil, Check } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card, TopBar } from "../UI";
import { Goal } from "@/lib/lifestyle-types";
import { GOALS } from "@/lib/lifestyle-data";

const ICONS: Record<Goal["icon"], any> = {
  water: Droplets,
  calories: CaloriesIcon,
  steps: Footprints,
  sleep: Moon,
  activity: Activity,
};

export default function GoalsPanel() {
  const [goals, setGoals] = useState<Goal[]>(GOALS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (g: Goal) => {
    setEditingId(g.id);
    setDraft(String(g.target));
  };

  const saveEdit = (id: string) => {
    const n = Number(draft);
    if (n > 0) {
      setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, target: n } : g)));
    }
    setEditingId(null);
  };

  return (
    <div>
      <TopBar title="Goals" subtitle="Daily targets that power your progress rings" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const Icon = ICONS[g.icon];
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          const met = g.current >= g.target;
          return (
            <Card key={g.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: T.primaryTint }}>
                    <Icon size={16} color={T.primary} />
                  </div>
                  <div className="text-[13.5px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{g.label}</div>
                </div>
                {met && (
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: T.primaryTint, color: T.primary }}>
                    GOAL MET
                  </span>
                )}
              </div>

              <div className="h-2 rounded-full overflow-hidden mb-2.5" style={{ background: T.canvasAlt }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: met ? T.primary : T.gold }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[12.5px]" style={{ color: T.muted, fontFamily: "var(--font-mono)" }}>
                  {g.current} / {g.target} {g.unit}
                </span>

                {editingId === g.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      type="number"
                      className="w-16 rounded-md px-2 py-1 text-[12px] outline-none"
                      style={{ background: T.canvasAlt, color: T.ink }}
                    />
                    <button onClick={() => saveEdit(g.id)}><Check size={15} color={T.primary} /></button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(g)} className="flex items-center gap-1 text-[11.5px] font-medium" style={{ color: T.primary }}>
                    <Pencil size={11} /> Edit target
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl p-4" style={{ background: T.canvasAlt }}>
        <Target size={16} color={T.muted} className="mt-0.5 shrink-0" />
        <p className="text-[12px] leading-relaxed" style={{ color: T.muted, fontFamily: "var(--font-body)" }}>
"Current" values are illustrative here. Wire this panel up to your Today's Log state (or a backend) to reflect real daily progress and persist targets across sessions.
        </p>
      </div>
    </div>
  );
}
