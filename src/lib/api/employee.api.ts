import { http } from "../http";

export const employeeApi = {
  start: () =>
    http("/work/start", {
      method: "POST",
      headers: {
        "x-client": "kiosk",
      },
    }),

  end: () =>
    http("/work/end", {
      method: "POST",
      headers: {
        "x-client": "kiosk",
      },
    }),

  status: () =>
    http("/work/status"),

  history: (from?: string, to?: string) =>
    http(`/work/history?from=${from ?? ""}&to=${to ?? ""}`),

  myPeriods: () =>
    http("/work/my-periods"),
};