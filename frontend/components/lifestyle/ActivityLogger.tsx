"use client";

import { useState } from "react";
import { Activity, Plus, Trash2 } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card } from "../UI";
import { ActivityEntry, ActivityType } from "@/lib/lifestyle-types";

const TYPES: ActivityType[] = ["Walking", "Running", "Cycling", "Yoga", "Strength", "Swimming", "Other"];

export default function ActivityLogger({
  activities,
  onAdd,
  onRemove,
}: {
  activities: ActivityEntry[];
  onAdd: (a: Omit<ActivityEntry, "id">) => void;
  onRemove: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "Walking" as ActivityType, duration: "" });

  const totalMinutes = activities.reduce((s, a) => s + a.duration_minutes, 0);
  const totalCalories = activities.reduce((s, a) => s + a.calories_burned, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Number(form.duration);
    if (!mins) return;
    onAdd({
      type: form.type,
      duration_minutes: mins,
      calories_burned: Math.round(mins * 4.2),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setForm({ type: "Walking", duration: "" });
    setShowForm(false);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={16} color={T.primary} />
          <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Activity</h3>
        </div>
        <span className="text-[12.5px] font-medium" style={{ color: T.muted, fontFamily: "var(--font-mono)" }}>
          {totalMinutes} min · {totalCalories} kcal
        </span>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: T.canvasAlt }}>
            <div>
              <div className="text-[13px] font-medium" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{a.type}</div>
              <div className="text-[11px]" style={{ color: T.muted }}>{a.duration_minutes} min · {a.time}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12.5px] font-medium" style={{ color: T.inkSoft, fontFamily: "var(--font-mono)" }}>{a.calories_burned} kcal</span>
              <button onClick={() => onRemove(a.id)}>
                <Trash2 size={14} color={T.muted} />
              </button>
            </div>
          </div>
        ))}
        {activities.length === 0 && <p className="text-[12.5px]" style={{ color: T.muted }}>No activity logged yet today.</p>}
      </div>

      {showForm ? (
        <form onSubmit={submit} className="flex flex-col gap-2 rounded-lg p-3" style={{ background: T.canvasAlt }}>
          <div className="flex gap-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ActivityType })}
              className="flex-1 rounded-md px-2.5 py-2 text-[12.5px] outline-none"
              style={{ background: T.card, color: T.ink }}
            >
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="minutes"
              className="w-28 rounded-md px-2.5 py-2 text-[12.5px] outline-none"
              style={{ background: T.card, color: T.ink }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-1">
            <button type="button" onClick={() => setShowForm(false)} className="text-[12px] font-medium px-2" style={{ color: T.muted }}>Cancel</button>
            <button type="submit" className="rounded-md px-3 py-1.5 text-[12px] font-semibold" style={{ background: T.primary, color: "#fff" }}>Log activity</button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg py-2 text-[12.5px] font-semibold flex items-center justify-center gap-1.5"
          style={{ background: T.canvasAlt, color: T.inkSoft, fontFamily: "var(--font-body)" }}
        >
          <Plus size={14} /> Log activity
        </button>
      )}
    </Card>
  );
}
