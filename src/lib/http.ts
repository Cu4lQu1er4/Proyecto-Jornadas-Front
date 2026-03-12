const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refresh.ok) {
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    const retry = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!retry.ok) {
      const error = await retry.json().catch(() => ({}));
      throw error;
    }

    const text = await retry.text();
    return text ? (JSON.parse(text) as T) : (null as unknown as T);
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw error;
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as unknown as T);
}