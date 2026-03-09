'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { http } from "@/lib/http";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({
  open,
  onClose,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function validatePassword(password: string) {
    if (password.length < 6) {
      return "Debe tener al menos 6 caracteres";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa todos los campos");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("La nueva contraseña no puede ser igual a la actual");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      await http("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      toast.success("Contraseña actualizada correctamente");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Error al cambiar la contraseña");
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
              Cambiar contraseña
            </h2>
            <p className="text-sm text-text-muted">
              Usa una contraseña segura y diferente a la anterior
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <PasswordInput
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={setCurrentPassword}
            />

            <PasswordInput
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={setNewPassword}
            />

            <PasswordInput
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onClose}
                className="
                  h-10 px-4 rounded-xl
                  bg-surface border border-border
                  text-text text-sm font-medium
                  hover:bg-danger-soft hover:text-danger
                  transition
                "
              >
                Cancelar
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="
                  h-10 px-4 rounded-xl
                  bg-primary text-white text-sm font-medium
                  transition hover:opacity-90
                  disabled:opacity-60
                "
              >
                {loading ? "Guardando..." : "Guardar contraseña"}
              </motion.button>

            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PasswordInput({
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
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        h-11 px-4 rounded-xl
        border border-border
        bg-background text-sm text-text
        focus:outline-none focus:ring-2 focus:ring-primary
      "
    />
  );
}