import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import OnboardingForm from "./components/OnboardingForm";

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

export default async function OnboardingPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.mustChangePassword) {
    redirect("/change-password");
  }

  if (user.profileCompleted) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/employee");
    }
  }

  return <OnboardingForm />;
}
