import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import EmployeeLayoutShell from "./components/EmployeeLayoutShell";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (user.profileCompleted) {
    redirect("/onboarding");
  }

  if (user.role !== "EMPLOYEE") {
    redirect("/admin");
  }

  return (
    <EmployeeLayoutShell user={user}>
      {children}
    </EmployeeLayoutShell>
  )
}