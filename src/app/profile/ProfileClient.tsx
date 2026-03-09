'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import LogoutButton from "@/components/LogoutButton";
import ChangePinModal from "./components/ChangePinModal";
import ChangePasswordModal from "./components/ChangePasswordModal";
import EditProfileModal from "./components/EditProfileModal";
import BackButton from "@/components/BackButton";

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
  fullName,
}: Props) {
  const [pinOpen, setPinOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <main className="min-h-[100dvh] bg-background px-4 sm:px-6 py-8 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-8">

        <BackButton />

        {/* PERFIL */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6"
        >
          <div className="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
          ">
            <div>
              <h1 className="text-xl font-semibold text-text">
                Perfil
              </h1>
              <p className="text-sm text-text-muted">
                Información personal
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setEditOpen(true)}
              className="
                h-9 px-4 rounded-xl
                bg-primary-soft text-primary
                text-sm font-medium
                hover:opacity-80 transition
                w-full sm:w-auto
              "
            >
              Editar
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">

            <InfoItem label="Nombre" value={fullName} />
            <InfoItem label="Documento" value={user.document} />
            <InfoItem label="Correo" value={user.email || "No configurado"} />
            <InfoItem label="Teléfono" value={user.phone || "No configurado"} />
            <InfoItem label="Rol" value={user.role} />

          </div>
        </motion.section>

        {/* SEGURIDAD */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-text">
              Seguridad
            </h2>
            <p className="text-sm text-text-muted">
              Configuración de acceso
            </p>
          </div>

          <div className="flex flex-col gap-4">

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-primary-soft hover:text-primary transition"
              onClick={() => setPasswordOpen(true)}
            >
              Cambiar contraseña
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-primary-soft hover:text-primary transition"
              onClick={() => setPinOpen(true)}
            >
              Cambiar PIN
            </motion.button>

            <LogoutButton />

          </div>
        </motion.section>

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
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-text-muted">{label}</span>
      <p className="text-text">{value}</p>
    </div>
  );
}