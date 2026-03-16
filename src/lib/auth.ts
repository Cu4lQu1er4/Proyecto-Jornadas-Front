const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function refreshSession() {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    })

    if (!res.ok) {
      throw new Error("refresh failed")
    }

    return true
  } catch {
    return false
  }
}