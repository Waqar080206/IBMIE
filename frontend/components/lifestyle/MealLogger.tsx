"use client";

import { useState } from "react";
import { UtensilsCrossed, Plus, Trash2 } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card } from "../UI";
import { MealEntry, MealType } from "@/lib/lifestyle-types";

const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function MealLogger({
  meals,
  target,
  onAdd,
  onRemove,
}: {
  meals: MealEntry[];
  target: number;
  onAdd: (m: Omit<MealEntry, "id">) => void;
  onRemove: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Breakfast" as MealType, calories: "" });

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const pct = Math.min(100, (totalCalories / target) * 100);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.calories) return;
    onAdd({
      name: form.name,
      type: form.type,
      calories: Number(form.calories),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setForm({ name: "", type: "Breakfast", calories: "" });
    setShowForm(false);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={16} color={T.gold} />
          <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Meals</h3>
        </div>
        <span className="text-[12.5px] font-medium" style={{ color: T.muted, fontFamily: "var(--font-mono)" }}>
          {totalCalories} / {target} kcal
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: T.canvasAlt }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: T.gold }} />
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {meals.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: T.canvasAlt }}>
            <div>
              <div className="text-[13px] font-medium" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{m.name}</div>
              <div className="text-[11px]" style={{ color: T.muted }}>{m.type} · {m.time}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12.5px] font-medium" style={{ color: T.inkSoft, fontFamily: "var(--font-mono)" }}>{m.calories} kcal</span>
              <button onClick={() => onRemove(m.id)}>
                <Trash2 size={14} color={T.muted} />
              </button>
            </div>
          </div>
        ))}
        {meals.length === 0 && <p className="text-[12.5px]" style={{ color: T.muted }}>No meals logged yet today.</p>}
      </div>

      {showForm ? (
        <form onSubmit={submit} className="flex flex-col gap-2 rounded-lg p-3" style={{ background: T.canvasAlt }}>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="What did you eat?"
            className="rounded-md px-2.5 py-2 text-[12.5px] outline-none"
            style={{ background: T.card, color: T.ink, fontFamily: "var(--font-body)" }}
          />
          <div className="flex gap-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as MealType })}
              className="flex-1 rounded-md px-2.5 py-2 text-[12.5px] outline-none"
              style={{ background: T.card, color: T.ink }}
            >
              {MEAL_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              placeholder="kcal"
              className="w-24 rounded-md px-2.5 py-2 text-[12.5px] outline-none"
              style={{ background: T.card, color: T.ink }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={() => setShowForm(false)} className="text-[12px] font-medium px-2" style={{ color: T.muted }}>Cancel</button>
            <button type="submit" className="rounded-md px-3 py-1.5 text-[12px] font-semibold" style={{ background: T.gold, color: "#fff" }}>Log meal</button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg py-2 text-[12.5px] font-semibold flex items-center justify-center gap-1.5"
          style={{ background: T.canvasAlt, color: T.inkSoft, fontFamily: "var(--font-body)" }}
        >
          <Plus size={14} /> Log a meal
        </button>
      )}
    </Card>
  );
}
