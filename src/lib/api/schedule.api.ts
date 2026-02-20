import { http } from "../http";

export const scheduleApi = {
  list: () => http("/work/schedule-templates"),

  create: (data: any) =>
    http("/work/schedule-templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};