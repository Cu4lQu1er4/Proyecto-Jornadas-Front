'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { http } from "@/lib/http";

type Props = {
  open: boolean;
  onClose: () => void;
};

function isWeakPin(pin: string) {
  return ["0000", "1111", "1234", "2222", "3333"].includes(pin);
}

export default function ChangePinModal({
  open,
  onClose,
}: Props) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const cleanNewPin = newPin.replace(/\D/g, "");
    const cleanCurrentPin = currentPin.replace(/\D/g, "");
    const cleanConfirmPin = confirmPin.replace(/\D/g, "");

    if (!/^\d{4}$/.test(cleanNewPin)) {
      toast.error("El PIN debe tener 4 dígitos numéricos");
      return;
    }

    if (isWeakPin(cleanNewPin)) {
      toast.error("PIN demasiado inseguro");
      return;
    }

    if (cleanNewPin === cleanCurrentPin) {
      toast.error("El nuevo PIN no puede ser igual al actual");
      return;
    }

    if (cleanNewPin !== cleanConfirmPin) {
      toast.error("Los PIN no coinciden");
      return;
    }

    setLoading(true);

    try {
      await http("/auth/change-pin", {
        method: "PATCH",
        body: JSON.stringify({
          currentPin: cleanCurrentPin || undefined,
          newPin: cleanNewPin,
        }),
      });

      toast.success("PIN actualizado correctamente");

      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el PIN");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            bg-white w-full max-w-md
            rounded-2xl border border-border
            p-6 flex flex-col gap-6
            max-h-[90vh] overflow-y-auto
          "
        >
          <header>
            <h2 className="text-lg font-semibold text-text">
              Cambiar PIN
            </h2>
            <p className="text-sm text-text-muted">
              El PIN debe tener 4 dígitos numéricos
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <PinInput
              placeholder="PIN actual"
              value={currentPin}
              onChange={setCurrentPin}
            />

            <PinInput
              placeholder="Nuevo PIN"
              value={newPin}
              onChange={setNewPin}
            />

            <PinInput
              placeholder="Confirmar PIN"
              value={confirmPin}
              onChange={setConfirmPin}
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
              >
                Cancelar
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar PIN"}
              </motion.button>

            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PinInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="password"
      maxLength={4}
      inputMode="numeric"
      pattern="[0-9]*"
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        onChange(e.target.value.replace(/\D/g, ""))
      }
      className="
        h-11 px-4 rounded-xl
        border border-border
        bg-background text-sm text-text
        focus:outline-none focus:ring-2 focus:ring-primary
      "
    />
  );
}