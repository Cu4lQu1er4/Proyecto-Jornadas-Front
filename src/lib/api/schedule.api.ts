import { http } from "../http";

export const scheduleApi = {
  list: () => http("/work/schedule-templates"),

  create: (data: any) =>
    http("/work/schedule-templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    http(`/work/schedule-templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    http(`/work/schedule-templates/${id}`, {
      method: "DELETE",
    }),
};