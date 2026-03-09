import { http } from "../http";

export const adminCaseApi = {
  list: (employeeId: string, page = 1, limit = 10, status?: string) => {
    let url = `/admin/admin-cases?employeeId=${employeeId}&page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }

    return http(url);
  },

  approve: (id: string) =>
    http(`/admin/admin-cases/${id}/approve`, {
      method: "PATCH",
    }),

  reject: (id: string, reason: string) =>
    http(`/admin/admin-cases/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  cancel: (id: string, reason: string) =>
    http(`/admin/admin-cases/${id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    }),

  create: (data: any) =>
    http(`/admin/admin-cases`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};