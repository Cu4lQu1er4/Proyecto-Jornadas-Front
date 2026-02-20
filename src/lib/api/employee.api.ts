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

  create: (data: {
    document: string;
    password: string;
    scheduleTemplateId: string;
  }) => 
    http("/work/admin/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  toggleActive: (userId: string, active: boolean) =>
    http(`/work/users/${userId}/active`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    }),
};