export function formatMinutes(min: number): string {
  if (!min) return "0m";

  const sign = min < 0 ? "-" : "";
  const abs = Math.abs(min);

  const MIN_PER_HOUR = 60;
  const MIN_PER_DAY = 60 * 8;

  const days = Math.floor(abs / MIN_PER_DAY);
  const hours = Math.floor((abs % MIN_PER_DAY) / MIN_PER_HOUR);
  const minutes = abs % MIN_PER_HOUR;

  if (days > 0) {
    if (hours > 0) return `${sign}${days}d ${hours}`;
    return `${sign}${days}d`;
  }

  if (hours > 0) {
    if (minutes > 0) return `${sign}${hours}h ${minutes}m`;
    return `${sign}${hours}h`;
  }

  return `${sign}${minutes}m`;
}