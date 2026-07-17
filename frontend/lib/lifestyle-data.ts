import { MealEntry, ActivityEntry, SleepEntry, WeightEntry, Habit, Goal } from "./lifestyle-types";

export const TODAY_MEALS: MealEntry[] = [
  { id: "m1", name: "Oats with banana", type: "Breakfast", calories: 320, time: "08:10 AM" },
  { id: "m2", name: "Dal, rice & salad", type: "Lunch", calories: 540, time: "01:15 PM" },
  { id: "m3", name: "Almonds (handful)", type: "Snack", calories: 90, time: "04:30 PM" },
];

export const TODAY_ACTIVITIES: ActivityEntry[] = [
  { id: "a1", type: "Walking", duration_minutes: 25, calories_burned: 110, time: "07:00 AM" },
  { id: "a2", type: "Strength", duration_minutes: 30, calories_burned: 180, time: "06:30 PM" },
];

export const WEEK_SLEEP: SleepEntry[] = [
  { date: "Mon", hours: 6.1, quality: "Fair" },
  { date: "Tue", hours: 7.2, quality: "Good" },
  { date: "Wed", hours: 5.8, quality: "Poor" },
  { date: "Thu", hours: 7.5, quality: "Good" },
  { date: "Fri", hours: 6.9, quality: "Fair" },
  { date: "Sat", hours: 8.1, quality: "Excellent" },
  { date: "Sun", hours: 7.0, quality: "Good" },
];

export const WEIGHT_HISTORY: WeightEntry[] = [
  { date: "Jun 20", value: 81.4, unit: "kg" },
  { date: "Jun 27", value: 81.0, unit: "kg" },
  { date: "Jul 4", value: 80.3, unit: "kg" },
  { date: "Jul 11", value: 79.8, unit: "kg" },
];

export const HABITS: Habit[] = [
  { id: "h1", name: "Drink 8 glasses of water", icon: "water", history: [true, true, false, true, true, true, true], completedToday: false },
  { id: "h2", name: "30 min walk", icon: "walk", history: [true, false, true, true, false, true, true], completedToday: true },
  { id: "h3", name: "Sleep before 11 PM", icon: "sleep", history: [false, true, false, true, true, false, true], completedToday: false },
  { id: "h4", name: "5 min breathing / meditation", icon: "meditation", history: [true, true, true, false, true, true, false], completedToday: false },
];

export const GOALS: Goal[] = [
  { id: "g1", label: "Water intake", current: 4, target: 8, unit: "glasses", icon: "water" },
  { id: "g2", label: "Calories", current: 950, target: 2000, unit: "kcal", icon: "calories" },
  { id: "g3", label: "Steps", current: 4200, target: 8000, unit: "steps", icon: "steps" },
  { id: "g4", label: "Sleep", current: 7.0, target: 8, unit: "hours", icon: "sleep" },
  { id: "g5", label: "Active minutes", current: 55, target: 45, unit: "min", icon: "activity" },
];

export const CALORIE_TARGET = 2000;
export const WATER_TARGET = 8;
