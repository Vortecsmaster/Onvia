import { appConfig } from "../config/app";
export const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export function validDate(v: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v + "T12:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}
export function validTime(v: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}
export function inRange(value: string, min?: string, max?: string) {
  return (!min || value >= min) && (!max || value <= max);
}
export function timeParts(value: string, cycle: 12 | 24) {
  const [h, m] = (validTime(value) ? value : "09:00").split(":").map(Number);
  return {
    hour: cycle === 12 ? h % 12 || 12 : h,
    minute: m,
    period: h >= 12 ? ("PM" as const) : ("AM" as const),
  };
}
export function canonicalTime(
  hour: number,
  minute: number,
  cycle: 12 | 24,
  period: "AM" | "PM",
) {
  const h = cycle === 24 ? hour : (hour % 12) + (period === "PM" ? 12 : 0);
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
export function formatDate(v: string, locale = appConfig.locale) {
  return validDate(v)
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(v + "T12:00:00"))
    : v;
}
export function formatTime(
  v: string,
  cycle: 12 | 24 = appConfig.hourCycle,
  locale = appConfig.locale,
) {
  if (!validTime(v)) return v;
  const [h, m] = v.split(":").map(Number);
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: cycle === 12 ? "h12" : "h23",
  }).format(new Date(2000, 0, 1, h, m));
}
