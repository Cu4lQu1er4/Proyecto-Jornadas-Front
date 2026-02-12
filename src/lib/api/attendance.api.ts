import { http } from "../http";

export const attendanceApi = {
  getDay: (employeeId: string, date: string) =>
    http(`/admin/attendance/day/${employeeId}?date=${date}`),

  getPeriod: (employeeId: string, periodId: string) =>
    http(`/admin/attendance/period/${employeeId}/${periodId}`),
};