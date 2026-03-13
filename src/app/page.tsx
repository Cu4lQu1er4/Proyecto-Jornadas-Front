import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (host.startsWith("kiosk.")) {
    redirect("/kiosk");
  }

  redirect("/install");
}