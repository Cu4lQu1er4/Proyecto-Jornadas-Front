'use client';

import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import ChangePinModal from "./components/ChangePinModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import EditProfileModal from "./components/EditProfileModal";

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

export default function ProfileClient({ 
  user, 
  fullName 
}: Props) {
  const [pinOpen, setPinOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="min-h-screem bg-background flex justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <section
          className="
            bg-white border border-border rounded-2xl p-6 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-text">
                Perfil
              </h1>
              <p className="text-sm text-text-muted">
                Informacion personal
              </p>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="
                h-9 px-4 rounded-xl bg-primary-soft text-primary text-sm
                font-medium hover:opacity-80 transition"
            >
              Editar
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm text-text">
            <div>
              <span className="text-text-muted">Nombre</span>
              <p>{fullName}</p>
            </div>

            <div>
              <span className="text-text-muted">Docuento</span>
              <p>{user.document}</p>
            </div>

            <div>
              <span className="text-text-muted">Correo</span>
              <p>{user.email || "No configurado"}</p>
            </div>

            <div>
              <span className="text-text-muted">Telefono</span>
              <p>{user.phone || "No configurado"}</p>
            </div>

            <div>
              <span className="text-text-muted">Rol</span>
              <p>{user.role}</p>
            </div>
          </div>
        </section>

        <section
          className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text">
              Seguridad
            </h2>
            <p className="text-sm text-text-muted">
              Configuracion de acceso
            </p>
          </div>

          <button
            onClick={() => setPasswordOpen(true)}
            className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-primary-soft hover:text-primary transition"
          >
            Cambiar contraseña
          </button>

          <button
            onClick={() => setPinOpen(true)}
            className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-primary-soft hover:text-primary transition"
          >
            Cambiar PIN
          </button>

          <LogoutButton />
        </section>
      </div>

      <ChangePinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
      />

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
      />
    </div>
  )
}