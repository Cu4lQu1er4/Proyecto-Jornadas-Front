import { http } from "../http";

export const authApi = {
  login: (document: string, password: string) =>
    http("/auth/login", {
      method: "POST",
      body: JSON.stringify({ document, password }),
    }),

  logout: () =>
    http("/auth/logout", {
      method: "POST",
    }),

  me: () =>
    http("/auth/me"),
};