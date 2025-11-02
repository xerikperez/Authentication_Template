import { FoodEntry } from "@prisma/client";

const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const DAY_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const MS_IN_DAY = 1000 * 60 * 60 * 24;

export function getDayKey(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  const parts = DAY_KEY_FORMATTER.formatToParts(normalized);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const day = parts.find((part) => part.type === "day")?.value ?? "00";

  return `${year}-${month}-${day}`;
}

export function getDisplayDate(date: Date) {
  return DAY_FORMATTER.format(date);
}

export function groupEntriesByDay(entries: FoodEntry[]) {
  const groups = new Map<string, FoodEntry[]>();

  entries.forEach((entry) => {
    const key = getDayKey(entry.loggedDate);
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([key, items]) => ({
      key,
      date: new Date(key),
      entries: items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    }));
}

export function calculateTotals(entries: FoodEntry[]) {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function calculateDailyTotals(entries: FoodEntry[], dayKey: string) {
  return calculateTotals(entries.filter((entry) => getDayKey(entry.loggedDate) === dayKey));
}

function previousDayKey(key: string) {
  const date = new Date(key);
  date.setDate(date.getDate() - 1);
  return getDayKey(date);
}

export function calculateStreak(entries: FoodEntry[]) {
  if (entries.length === 0) {
    return 0;
  }

  const keys = Array.from(new Set(entries.map((entry) => getDayKey(entry.loggedDate))));

  if (keys.length === 0) {
    return 0;
  }

  keys.sort((a, b) => (a > b ? -1 : 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = getDayKey(today);

  const daySet = new Set(keys);

  let currentKey = todayKey;

  if (!daySet.has(todayKey)) {
    const mostRecentKey = keys[0];
    const mostRecentDate = new Date(mostRecentKey);
    const diff = Math.floor((today.getTime() - mostRecentDate.getTime()) / MS_IN_DAY);

    if (diff > 1) {
      return 0;
    }

    currentKey = mostRecentKey;
  }

  let streak = 0;

  while (daySet.has(currentKey)) {
    streak += 1;
    currentKey = previousDayKey(currentKey);
  }

  return streak;
}
