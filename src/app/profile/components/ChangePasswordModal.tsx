'use client';

import { useState } from "react";
import { toast } from "sonner";
import { http } from "@/lib/http";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({
  open, onClose
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await http("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      toast.success("Contraseña actualizada");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white rounded-2xl border border-border p-6 w-full max-w-md
          flex flex-col gap-4"
      >
        <h2 className="text-lg font-semibold">
          Cambiar contraseña
        </h2>

        <input
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border"
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border"
        />

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-primary text-white"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  )
}