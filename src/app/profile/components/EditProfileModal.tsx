'use client';

import { useState } from "react";
import { http } from "@/lib/http";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string | null;
    phone?: string | null;
  };
};

export default function EditProfileModal({
  open,
  onClose,
  user,
}: Props) {
  const router = useRouter();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanFirstName) {
      toast.error("Nombre obligatorio");
      return;
    }

    if (!cleanLastName) {
      toast.error("Apellido obligatorio");
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Correo inválido");
      return;
    }

    setLoading(true);

    try {
      await http("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          firstName: cleanFirstName,
          lastName: cleanLastName,
          email: cleanEmail || null,
          phone: cleanPhone || null,
        }),
      });

      toast.success("Perfil actualizado correctamente");

      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl border border-border p-6 flex flex-col gap-6">

        <header>
          <h2 className="text-lg font-semibold text-text">
            Editar perfil
          </h2>
          <p className="text-sm text-text-muted">
            Actualiza tu información personal
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none"
          />

          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none"
          />

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none"
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none"
          />

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
