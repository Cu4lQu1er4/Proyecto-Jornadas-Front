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

  deleteUser(id: string) {
    return http(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }
};