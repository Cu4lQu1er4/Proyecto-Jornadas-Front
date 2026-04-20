import { http } from "../http";

function getLocalISODate() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0
  ).toISOString();
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
        effectiveFrom: effectiveFrom ?? getLocalISODate(),
      }),
    });
  },
};