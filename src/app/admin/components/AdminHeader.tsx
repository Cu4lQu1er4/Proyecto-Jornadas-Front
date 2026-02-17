import { Bell, Search } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import UserMenu from "@/components/UserMenu";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    role: string;
  };
};

export default function AdminHeader({ user }: Props) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <header
      className="
        h-16 bg-surface border border-border px-6 flex items-center justify-between
        rounded-2xl"
    >
      <div className="felx flex-col">
        <h1 className="text-lg font-semibold text-text">
          Panel Administrador
        </h1>
        <span className="text-sm text-text-muted">
          {fullName} · {user.role}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu user={user} basePath="/admin" />
      </div>
    </header>
  );
}