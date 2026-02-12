import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth-server";
import LoginForm from "./components/LoginForm";

export default async function LoginPage() {
  const user = await getServerUser();

  if (user) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/employee")
    }
  }

  return <LoginForm />
}