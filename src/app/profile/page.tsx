import { getServerUser } from "@/lib/auth-server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await getServerUser();

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <ProfileClient user={user} fullName={fullName} />
  );
}