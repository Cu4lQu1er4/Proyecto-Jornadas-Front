import { http } from "../http";

export const userAdminApi = {
  resetPassword: (id: string) =>
    http(`/auth/admin/${id}/reset-password`, {
      method: "PATCH",
    }),

  resetPin: (id: string) =>
    http(`/auth/admin/${id}/reset-pin`, {
      method: "PATCH",
    }),

  deleteUser: (id: string) => 
    http(`/work/admin/employees/${id}`, {
      method: "DELETE",
    }),
};