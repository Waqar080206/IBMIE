export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface MealEntry {
  id: string;
  name: string;
  type: MealType;
  calories: number;
  time: string;
}

export type ActivityType = "Walking" | "Running" | "Cycling" | "Yoga" | "Strength" | "Swimming" | "Other";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  duration_minutes: number;
  calories_burned: number;
  time: string;
}

export type SleepQuality = "Poor" | "Fair" | "Good" | "Excellent";

export interface SleepEntry {
  date: string;
  hours: number;
  quality: SleepQuality;
}

export interface WeightEntry {
  date: string;
  value: number;
  unit: "kg" | "lb";
}

export interface Habit {
  id: string;
  name: string;
  icon: "water" | "walk" | "sleep" | "meal" | "meditation" | "steps";
  // last 7 days, oldest -> newest, today not yet included
  history: boolean[];
  completedToday: boolean;
}

export type Mood = "great" | "good" | "okay" | "low" | "bad";

export interface MoodEntry {
  id: string;
  mood: Mood;
  note: string;
  time: string;
}

export interface Goal {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  icon: "water" | "calories" | "steps" | "sleep" | "activity";
}
