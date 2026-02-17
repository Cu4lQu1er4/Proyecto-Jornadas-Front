'use client';

import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import ChangePinModal from "./components/ChangePinModal";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    document: string;
    email?: string | null;
    phone?: string | null;
    role: string;
  };
  fullName: string;
};

export default function ProfileClient({ user, fullName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Información personal */}
        <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-text">
              Perfil
            </h1>
            <p className="text-sm text-text-muted">
              Información personal
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-text">

            <div>
              <span className="text-text-muted">Nombre</span>
              <p>{fullName}</p>
            </div>

            <div>
              <span className="text-text-muted">Documento</span>
              <p>{user.document}</p>
            </div>

            {user.email && (
              <div>
                <span className="text-text-muted">Correo</span>
                <p>{user.email}</p>
              </div>
            )}

            {user.phone && (
              <div>
                <span className="text-text-muted">Teléfono</span>
                <p>{user.phone}</p>
              </div>
            )}

            <div>
              <span className="text-text-muted">Rol</span>
              <p>{user.role}</p>
            </div>

          </div>
        </section>

        {/* Seguridad */}
        <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text">
              Seguridad
            </h2>
            <p className="text-sm text-text-muted">
              Configuración de acceso
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-primary-soft hover:text-primary transition"
          >
            Cambiar PIN
          </button>

          <LogoutButton />

        </section>

      </div>

      <ChangePinModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
