import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLayoutShell from "./components/AdminLayoutShell";

async function getSession() {
  const cookieStore = await 
  cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) return null;

  const res = await fetch('http://localhost:3001/api/auth/me', {
    headers: {
      Cookie: `access_token=${accessToken.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/employee");
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>
}