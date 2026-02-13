import { http } from "../http";

export const periodsApi = {
  list: () =>
    http("/work/periods?page=1&limit=50"),
};