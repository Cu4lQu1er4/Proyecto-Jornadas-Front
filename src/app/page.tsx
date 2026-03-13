import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const host = headers().get("host") || "";

  if (host.startsWith("kiosk.")) {
    redirect("/kiosk");
  }

  redirect("/install")
}