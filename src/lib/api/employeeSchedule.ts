import { http } from "../http";

function getTodayLocalYMD() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

export const employeeScheduleApi = {
  getMySchedule: () => 
    http("/employee-schedules/me"),

  current: (employeeId: string) =>
    http(`/employee-schedules/current/${employeeId}`),

  assign(employeeId: string, templateId: string, effectiveFrom?: string) {
    return http("/employee-schedules/assign", {
      method: "POST",
      body: JSON.stringify({
        employeeId,
        scheduleTemplateId: templateId,
        effectiveFrom: effectiveFrom ?? getTodayLocalYMD(),
      }),
    });
  },
};