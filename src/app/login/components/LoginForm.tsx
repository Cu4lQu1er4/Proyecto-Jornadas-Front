'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();

  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!document || !password) {
      toast.warning("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const response: any = await authApi.login(document, password);

      if (response.needsOnboarding) {
        router.replace("/onboarding");
        return;
      }

      if (response.employee.role === "EMPLOYEE") {
        router.replace("/employee");
      } else if (response.employee.role === "ADMIN") {
        router.replace("/admin");
      } else {
        throw new Error("UNKNOWN_ROLE");
      }

    } catch (err: any) {
      if (err?.message === "Credenciales invalidas") {
        toast.error("Documento o contraseña incorrectos");
      } else {
        toast.error("Error al iniciar sesion");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4 py-8">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          w-full max-w-md
          bg-background
          border border-border
          rounded-2xl
          shadow-lg
          p-6 sm:p-8
          space-y-6
        "
      >
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-text-muted">
            Ingresa tus credenciales para continuar
          </p>
        </header>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text">
              Documento
            </label>
            <input
              placeholder="Documento"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="
                h-11 px-4
                rounded-lg
                border border-border
                bg-transparent
                text-sm
                transition
                focus:outline-none
                focus:ring-2 focus:ring-primary
                focus:border-primary
              "
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                h-11 px-4
                rounded-lg
                border border-border
                bg-transparent
                text-sm
                transition
                focus:outline-none
                focus:ring-2 focus:ring-primary
                focus:border-primary
              "
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="
            w-full h-11
            rounded-lg
            bg-primary
            text-white
            text-sm font-medium
            transition
            hover:bg-primary-hover
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </motion.button>
      </motion.form>
    </main>
  );
}