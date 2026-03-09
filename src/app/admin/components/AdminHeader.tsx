'use client';

import { Menu } from "lucide-react";
import UserMenu from "@/components/UserMenu";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    role: string;
  };
  onMenuClick?: () => void; // 👈 importante
};

export default function AdminHeader({ user, onMenuClick }: Props) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <header
      className="
        h-16 bg-surface border border-border
        px-4 sm:px-6
        flex items-center justify-between
        rounded-2xl
      "
    >
      {/* IZQUIERDA */}
      <div className="flex items-center gap-3">

        {/* BOTÓN SOLO EN MOBILE */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-surface transition"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-text">
            Panel Administrador
          </h1>
          <span className="text-sm text-text-muted">
            {fullName} · {user.role}
          </span>
        </div>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-4">
        <UserMenu user={user} basePath="/admin" />
      </div>
    </header>
  );
}