import { cookies } from "next/headers";

export async function getServerUser() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token");

  if (!accessToken) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: {
          Cookie: `access_token=${accessToken.value}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}