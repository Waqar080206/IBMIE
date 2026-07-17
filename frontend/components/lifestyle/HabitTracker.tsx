"use client";

import { useState } from "react";
import { Flame, Plus, Trash2, Droplets, Footprints, Moon, UtensilsCrossed, Brain, ActivitySquare, Check } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card, TopBar } from "../UI";
import { Habit } from "@/lib/lifestyle-types";
import { HABITS } from "@/lib/lifestyle-data";

const ICONS: Record<Habit["icon"], any> = {
  water: Droplets,
  walk: Footprints,
  sleep: Moon,
  meal: UtensilsCrossed,
  meditation: Brain,
  steps: ActivitySquare,
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function streakCount(history: boolean[], completedToday: boolean) {
  const full = [...history, completedToday];
  let streak = 0;
  for (let i = full.length - 1; i >= 0; i--) {
    if (full[i]) streak += 1;
    else break;
  }
  return streak;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(HABITS);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  const toggleToday = (id: string) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, completedToday: !h.completedToday } : h)));
  };

  const remove = (id: string) => setHabits((prev) => prev.filter((h) => h.id !== id));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setHabits((prev) => [
      { id: crypto.randomUUID(), name, icon: "steps", history: [false, false, false, false, false, false, false], completedToday: false },
      ...prev,
    ]);
    setName("");
    setShowForm(false);
  };

  return (
    <div>
      <TopBar title="Habits" subtitle="Small, repeatable actions — tracked day by day" />

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mb-5 flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold"
        style={{ background: T.primary, color: "#fff", fontFamily: "var(--font-body)" }}
      >
        <Plus size={15} /> Add habit
      </button>

      {showForm && (
        <Card className="p-4 mb-5">
          <form onSubmit={add} className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stretch for 10 minutes"
              className="flex-1 rounded-lg px-3 py-2 text-[13px] outline-none"
              style={{ background: T.canvasAlt, color: T.ink, fontFamily: "var(--font-body)" }}
            />
            <button type="submit" className="rounded-lg px-4 py-2 text-[12.5px] font-semibold" style={{ background: T.primary, color: "#fff" }}>Add</button>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {habits.map((h) => {
          const Icon = ICONS[h.icon] || ActivitySquare;
          const streak = streakCount(h.history, h.completedToday);
          return (
            <Card key={h.id} className="p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: T.primaryTint }}>
                  <Icon size={17} color={T.primary} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{h.name}</div>
                  <div className="flex items-center gap-1 text-[12px]" style={{ color: T.gold }}>
                    <Flame size={12} /> {streak} day streak
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  {h.history.map((done, i) => (
                    <div
                      key={i}
                      title={DAY_LABELS[i]}
                      className="h-6 w-6 rounded-md flex items-center justify-center text-[9px] font-semibold"
                      style={{ background: done ? T.primaryTint : T.canvasAlt, color: done ? T.primary : T.muted }}
                    >
                      {DAY_LABELS[i]}
                    </div>
                  ))}
                  <button
                    onClick={() => toggleToday(h.id)}
                    className="h-6 w-6 rounded-md flex items-center justify-center"
                    style={{ background: h.completedToday ? T.primary : T.card, border: `1.5px solid ${h.completedToday ? T.primary : T.borderStrong}` }}
                  >
                    {h.completedToday && <Check size={13} color="#fff" />}
                  </button>
                </div>
                <button onClick={() => remove(h.id)}>
                  <Trash2 size={15} color={T.muted} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
