import { http } from "../http";

export const adminCaseApi = {
  list: (employeeId: string) =>
    http(`/admin-cases?employeeId=${employeeId}`),

  create: (data: any) =>
    http("/admin-cases", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  apply: (id: string) =>
    http(`/admin-cases/${id}/apply`, {
      method: "PATCH",
    }),

  cancel: (id: string, reason: string) =>
    http(`/admin-cases/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),
};