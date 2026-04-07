export function formatTime(
  min: number,
  options?: {
    mode?: "full" | "hours" | "days";
    minutesPerDay?: number;
  }
) {
  const minutesPerDay = options?.minutesPerDay ?? 
}