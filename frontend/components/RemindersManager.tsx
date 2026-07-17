"use client";

import { useState } from "react";
import { BellRing, Plus, Trash2, Clock, Pill } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card, TopBar } from "./UI";
import { Reminder } from "@/lib/types";
import { REMINDERS } from "@/lib/mock-data";

export default function RemindersManager() {
  const [reminders, setReminders] = useState<Reminder[]>(REMINDERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ medicine_name: "", dose: "1 tablet", time: "08:00 AM", frequency: "Once daily" });

  const toggle = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const remove = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.medicine_name.trim()) return;
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      medicine_name: form.medicine_name,
      dose: form.dose,
      time: form.time,
      frequency: form.frequency,
      active: true,
      nextDose: `Today, ${form.time}`,
    };
    setReminders((prev) => [newReminder, ...prev]);
    setForm({ medicine_name: "", dose: "1 tablet", time: "08:00 AM", frequency: "Once daily" });
    setShowForm(false);
  };

  return (
    <div>
      <TopBar title="Medicine reminders" subtitle="Generated from your prescriptions — adjust anytime" />

      <button
        onClick={() => setShowForm((s) => !s)}
        className="mb-5 flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold"
        style={{ background: T.primary, color: "#fff", fontFamily: "var(--font-body)" }}
      >
        <Plus size={15} /> Add reminder
      </button>

      {showForm && (
        <Card className="p-5 mb-5">
          <form onSubmit={addReminder} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="text-[11px] font-medium" style={{ color: T.muted }}>MEDICINE NAME</label>
              <input
                required
                value={form.medicine_name}
                onChange={(e) => setForm({ ...form, medicine_name: e.target.value })}
                placeholder="e.g. Vitamin D3 1000 IU"
                className="mt-1 w-full rounded-lg px-3 py-2 text-[13px] outline-none"
                style={{ background: T.canvasAlt, color: T.ink, fontFamily: "var(--font-body)" }}
              />
            </div>
            <div>
              <label className="text-[11px] font-medium" style={{ color: T.muted }}>TIME</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-[13px] outline-none"
                style={{ background: T.canvasAlt, color: T.ink, fontFamily: "var(--font-body)" }}
              />
            </div>
            <div>
              <label className="text-[11px] font-medium" style={{ color: T.muted }}>FREQUENCY</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-[13px] outline-none"
                style={{ background: T.canvasAlt, color: T.ink, fontFamily: "var(--font-body)" }}
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Thrice daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end gap-2 mt-1">
              <button type="button" onClick={() => setShowForm(false)} className="text-[12.5px] font-medium px-3 py-2" style={{ color: T.muted }}>
                Cancel
              </button>
              <button type="submit" className="rounded-lg px-4 py-2 text-[12.5px] font-semibold" style={{ background: T.primary, color: "#fff" }}>
                Save reminder
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {reminders.map((r) => (
          <Card key={r.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: r.active ? T.primaryTint : T.canvasAlt }}>
                <Pill size={17} color={r.active ? T.primary : T.muted} />
              </div>
              <div>
                <div className="text-[13.5px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-body)" }}>{r.medicine_name}</div>
                <div className="text-[12px] flex items-center gap-1" style={{ color: T.muted }}>
                  <Clock size={11} /> {r.dose} · {r.frequency} · {r.time}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px]" style={{ color: T.muted }}>NEXT DOSE</div>
                <div className="text-[12.5px] font-medium" style={{ color: r.active ? T.primary : T.muted, fontFamily: "var(--font-mono)" }}>
                  {r.active ? r.nextDose : "Paused"}
                </div>
              </div>
              <button
                onClick={() => toggle(r.id)}
                className="w-11 h-6 rounded-full relative transition-colors"
                style={{ background: r.active ? T.primary : T.borderStrong }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                  style={{ left: r.active ? 22 : 2 }}
                />
              </button>
              <button onClick={() => remove(r.id)} className="p-1.5">
                <Trash2 size={15} color={T.muted} />
              </button>
            </div>
          </Card>
        ))}
        {reminders.length === 0 && (
          <div className="text-center py-10 text-[13px]" style={{ color: T.muted }}>
            <BellRing size={22} className="mx-auto mb-2" />
            No reminders yet — add one above.
          </div>
        )}
      </div>
    </div>
  );
}
