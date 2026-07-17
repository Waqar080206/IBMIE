"use client";

import { useState } from "react";
import { TopBar } from "@/components/UI";
import { ProgressRing } from "@/components/Charts";
import WaterTracker from "@/components/lifestyle/WaterTracker";
import MealLogger from "@/components/lifestyle/MealLogger";
import ActivityLogger from "@/components/lifestyle/ActivityLogger";
import SleepTracker from "@/components/lifestyle/SleepTracker";
import MoodCheckIn from "@/components/lifestyle/MoodCheckIn";
import { T } from "@/lib/tokens";
import { MealEntry, ActivityEntry, SleepQuality, Mood } from "@/lib/lifestyle-types";
import { TODAY_MEALS, TODAY_ACTIVITIES, CALORIE_TARGET, WATER_TARGET } from "@/lib/lifestyle-data";

export default function TrackPage() {
  const [glasses, setGlasses] = useState(4);
  const [meals, setMeals] = useState<MealEntry[]>(TODAY_MEALS);
  const [activities, setActivities] = useState<ActivityEntry[]>(TODAY_ACTIVITIES);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>("Good");
  const [mood, setMood] = useState<Mood | null>("good");

  const calories = meals.reduce((s, m) => s + m.calories, 0);
  const activeMinutes = activities.reduce((s, a) => s + a.duration_minutes, 0);

  return (
    <div>
      <TopBar title="Today's log" subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} />

      <div className="rounded-xl p-5 mb-6 flex flex-wrap items-center justify-around gap-6" style={{ background: T.card, border: `1px solid ${T.border}` }}>
        <ProgressRing value={glasses} target={WATER_TARGET} color={T.low} label="Water" sublabel={`${glasses}/${WATER_TARGET} glasses`} />
        <ProgressRing value={calories} target={CALORIE_TARGET} color={T.gold} label="Calories" sublabel={`${calories}/${CALORIE_TARGET} kcal`} />
        <ProgressRing value={activeMinutes} target={45} color={T.primary} label="Active minutes" sublabel={`${activeMinutes}/45 min`} />
        <ProgressRing value={sleepHours} target={8} color={T.inkSoft} label="Sleep" sublabel={`${sleepHours}/8 hrs`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WaterTracker glasses={glasses} target={WATER_TARGET} onChange={setGlasses} />
        <MoodCheckIn mood={mood} onChange={setMood} />

        <MealLogger
          meals={meals}
          target={CALORIE_TARGET}
          onAdd={(m) => setMeals((prev) => [...prev, { ...m, id: crypto.randomUUID() }])}
          onRemove={(id) => setMeals((prev) => prev.filter((m) => m.id !== id))}
        />
        <ActivityLogger
          activities={activities}
          onAdd={(a) => setActivities((prev) => [...prev, { ...a, id: crypto.randomUUID() }])}
          onRemove={(id) => setActivities((prev) => prev.filter((a) => a.id !== id))}
        />

        <div className="lg:col-span-2">
          <SleepTracker hours={sleepHours} quality={sleepQuality} onChange={(h, q) => { setSleepHours(h); setSleepQuality(q); }} />
        </div>
      </div>
    </div>
  );
}
