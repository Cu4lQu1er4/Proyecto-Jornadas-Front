import { http } from "../http";

export const employeeScheduleApi = {
  current: (employeeId: string) =>
    http(`/employee-schedules/current/${employeeId}`),

  assign(employeeId: string, templateId: string) {
    http("/employee-schedules/assign", {
      method: "POST",
      body: JSON.stringify({
        employeeId,
        scheduleTemplateId: templateId,
        effectiveFrom: new Date().toISOString(),
      }),
    });
  },
};