'use client';

import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "sonner";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await authApi.logout();
      toast.success("Sesion cerrada correctamente");
      router.replace("/login");
    } catch {
      toast.error("Error al cerrar sesion");
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
        h-10 px-4 rounded-xl bg-danger text-white text-sm
        font-medium transition hover:opacity-90 disabled:opacity-60"
    >
      {loading ? 'Cerrando...' : 'Cerrar sesion'}
    </button>
  );
}