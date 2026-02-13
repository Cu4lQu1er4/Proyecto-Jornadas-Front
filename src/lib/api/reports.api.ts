import { http } from "../http";

export const reportsApi = {
  getSummary: (periodId: string, document?: string) =>
    http(`/admin/attendance/summary?periodId=${periodId}${document ? `&document=${document}` : ""}`),

  getPeriods: () =>
    http("/work/periods?page=1&limit=50"),
};