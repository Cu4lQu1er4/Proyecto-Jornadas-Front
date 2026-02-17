'use client';

import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePinModal({
  open,
  onClose
}: Props) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!/^\d{4}$/.test(pin)) {
      toast.error("El PIN debe tener 4 digitos numericos");
      return;
    }

    if (["0000", "1111", "1234", "2222", "3333"].includes(pin)) {
      toast.error("PIN demasiado inseguro");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("Los PIN no conciden");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        'http://localhost:3001/api/auth/change-pin',
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPin: pin }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      toast.success("PIN actualizado correctamente");

      setPin("");
      setConfirmPin("");
      onClose();
    } catch {
      toast.error("No se pudo actualizar el PIN");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="w-full max-w-sm bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">
            Cambiar PIN
          </h2>
          <p className="text-sm text-text-muted">
            El PIN debe tener 4 dígitos numéricos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Nuevo PIN"
            className="h-11 px-4 rounded-xl border border-border bg-background text-text text-sm outline-none"
          />

          <input
            type="password"
            maxLength={4}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            placeholder="Confirmar PIN"
            className="h-11 px-4 rounded-xl border border-border bg-background text-text text-sm outline-none"
          />

          <div className="flex gap-3">

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
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

