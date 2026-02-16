'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "sonner";

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

    setLoading(true);

    try {
      await authApi.login(document, password);

      const response = await authApi.login(document, password);

      if (response.employee.role === "EMPLOYEE") {
        router.replace("/employee");
      } else if (response.employee.role === "ADMIN") {
        router.replace("/admin");
      } else {
        throw new Error ("UNKNOW_ROLE");
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
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-md bg-background border border-border rounded-lg
          shadow-sm p-6 space-y-6"
      >
        <header className="space-y-1">
          <h1 className="text-h1">Iniciar sesion</h1>
          <p className="text-body text-text-muted">
            Ingresa tus credenciales para continuar
          </p>
        </header>

        <div className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text">Documento</span>
            <input
              placeholder="Documento"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="
                h-10 px-3 rounded-md border border-border focus:outline-none
                focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text">Contraseña</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                h-10 px-3 rounded-md border border-border focus:outline-none
                focus:ring-2 focus:ring-primary"
            />
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-10 rounded-md bg-primary text-white font-medium
              hover:bg-primary-hover disabled:opacity-50" 
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </main>
  );
}