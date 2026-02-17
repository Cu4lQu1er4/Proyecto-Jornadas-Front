import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.firstName || !user.lastName || !user.hasPin) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}