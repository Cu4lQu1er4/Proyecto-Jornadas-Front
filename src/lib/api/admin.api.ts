import { http } from "../http";

export const adminApi = {
  listEmployees: () =>
    http("/work/admin/employees"),

  employeeHistory: (id: string, from?: string, to?: string) =>
    http(`/work/admin/employees/${id}/history?from=${from ?? ""}&to=${to ?? ""}`),

  listPeriods: (page = 1, limit = 10) =>
    http(`/work/periods?page=${page}&limit=${limit}`),

  closePeriod: (id: string) =>
    http(`/work/periods/${id}/close`, {
      method: "PATCH",
    }),
};