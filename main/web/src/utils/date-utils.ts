import { formatNumber } from "./number-utils";

export const formatTime = (date: Date) => {
  const h = formatNumber(date.getHours());
  const m = formatNumber(date.getMinutes());
  const s = formatNumber(date.getSeconds());
  const ms = formatNumber(date.getMilliseconds(), 3);

  return `${h}:${m}:${s}:${ms}`;
};
