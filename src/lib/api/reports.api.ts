import { http } from "../http";

export const reportsApi = {
  getSummary: (periodId: string, employeeId?: string) =>
    http(`/reports/summary?periodId=${periodId}${employeeId ? `&employeeId=${employeeId}` : ""}`),
};