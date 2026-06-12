import type { CompletionLogEntry } from "@ophan/core";

export type TrendPoint = { date: string; label: string; count: number };

const dayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const aggregateCompletionTrend = (
  entries: CompletionLogEntry[],
  days = 14
): TrendPoint[] => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const finishedAt = entry.idea.finishedAt;
    if (!finishedAt) continue;
    const date = new Date(finishedAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = dayKey(date);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const points: TrendPoint[] = [];
  const today = new Date();
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - offset
    );
    const key = dayKey(date);
    points.push({
      date: key,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      count: counts.get(key) || 0,
    });
  }
  return points;
};
