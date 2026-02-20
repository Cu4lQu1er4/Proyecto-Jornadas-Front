import { http } from "../http";

export const employeeScheduleApi = {
  current: (employeeId: string) =>
    http(`/employee-schedules/current/${employeeId}`),
};