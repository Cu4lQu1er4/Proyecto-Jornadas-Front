import { redirect } from "next/navigation";
import AdminLayoutShell from "./components/AdminLayoutShell";
import { cookies } from "next/headers";

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
    {
      headers: {
        Cookie: `access_token=${token.value}`,
      },
      cache: "no-store",
    }
  );

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

  if (user.mustChangePassword) {
    redirect("/onboarding");
  }

  if (user.role !== "ADMIN") {
    redirect("/employee");
  }

  return (
    <AdminLayoutShell user={user}>
      {children}
    </AdminLayoutShell>
  )
}