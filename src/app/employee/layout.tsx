import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "EMPLOYEE") {
    redirect("/admin");
  }

  return<>{children}</>;
}