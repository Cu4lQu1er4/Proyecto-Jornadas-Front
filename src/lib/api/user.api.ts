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
};