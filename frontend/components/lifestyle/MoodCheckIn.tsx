"use client";

import { Smile } from "lucide-react";
import { T } from "@/lib/tokens";
import { Card } from "../UI";
import { Mood } from "@/lib/lifestyle-types";

const MOODS: { key: Mood; emoji: string; label: string }[] = [
  { key: "great", emoji: "😄", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😕", label: "Low" },
  { key: "bad", emoji: "😞", label: "Bad" },
];

export default function MoodCheckIn({ mood, onChange }: { mood: Mood | null; onChange: (m: Mood) => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Smile size={16} color={T.coral} />
        <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>How are you feeling?</h3>
      </div>
      <div className="flex justify-between gap-1.5">
        {MOODS.map((m) => (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className="flex-1 flex flex-col items-center gap-1.5 rounded-lg py-2.5 transition-transform"
            style={{
              background: mood === m.key ? T.coralTint : T.canvasAlt,
              transform: mood === m.key ? "scale(1.06)" : "scale(1)",
            }}
          >
            <span className="text-[20px]">{m.emoji}</span>
            <span className="text-[10.5px] font-medium" style={{ color: mood === m.key ? T.coral : T.muted, fontFamily: "var(--font-body)" }}>{m.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
