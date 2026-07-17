import { TrendingUp } from "lucide-react";
import { T } from "@/lib/tokens";
import { TopBar, Card } from "@/components/UI";
import { WeekBars } from "@/components/Charts";
import WeightTracker from "@/components/lifestyle/WeightTracker";
import { WEEK_SLEEP, TODAY_ACTIVITIES } from "@/lib/lifestyle-data";

export default function ProgressPage() {
  const sleepData = WEEK_SLEEP.map((s) => ({ date: s.date, value: s.hours }));
  const activeMinutesToday = TODAY_ACTIVITIES.reduce((s, a) => s + a.duration_minutes, 0);

  return (
    <div>
      <TopBar title="Progress" subtitle="How your lifestyle metrics are trending" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <WeightTracker />

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} color={T.inkSoft} />
            <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Sleep this week</h3>
          </div>
          <WeekBars data={sleepData} color={T.inkSoft} unit="hrs" />
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} color={T.primary} />
          <h3 className="text-[14px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>Consistency</h3>
        </div>
        <p className="text-[12.5px] mb-4" style={{ color: T.muted, fontFamily: "var(--font-body)" }}>
          A quick read on how the week's logging has gone.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Avg sleep", value: `${(sleepData.reduce((s, d) => s + d.value, 0) / sleepData.length).toFixed(1)} hrs` },
            { label: "Active today", value: `${activeMinutesToday} min` },
            { label: "Habits on track", value: "3 / 4" },
            { label: "Reports reviewed", value: "3" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-3.5" style={{ background: T.canvasAlt }}>
              <div className="text-[17px] font-semibold" style={{ color: T.ink, fontFamily: "var(--font-display)" }}>{s.value}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: T.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
