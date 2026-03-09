const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const employeeAdminCaseApi = {
  list: (page = 1, limit = 10, status?: string) => {
    let url = `${API_URL}/employee/admin-cases?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return fetch(url, { credentials: "include" }).then(r => r.json());
  },

  create: async (payload: {
    type: string;
    notes?: string;
    scopes: any[];
    files?: File[];
  }) => {
    const form = new FormData();
    form.append("type", payload.type);
    if (payload.notes) form.append("notes", payload.notes);
    form.append("scopes", JSON.stringify(payload.scopes));

    (payload.files || []).forEach((file) => {
      form.append("files", file);
    });

    const res = await fetch(`${API_URL}/employee/admin-cases`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err;
    }

    return res.json();
  },

  cancel: async (id: string) => {
    const res = await fetch(`${API_URL}/employee/admin-cases/${id}/cancel`, {
      method: "PATCH",
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err;
    }

    return res.json();
  },
};