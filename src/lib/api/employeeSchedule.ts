import { http } from "../http";

function getTodayYmd() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
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
        effectiveFrom: effectiveFrom ?? getTodayYmd(),
      }),
    });
  },
};