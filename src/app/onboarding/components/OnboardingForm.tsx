'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { toast } from "sonner";
import { motion } from "framer-motion";

function isWeakPin(pin: string) {
  return ["0000", "1111", "1234", "2222", "3333"].includes(pin);
}

export default function OnboardingForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanPin = pin.replace(/\D/g, "");

    if (!cleanFirstName) {
      toast.error("Nombre es obligatorio");
      return;
    }

    if (!cleanLastName) {
      toast.error("Apellido es obligatorio");
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Teléfono inválido");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Correo inválido");
      return;
    }

    if (!/^\d{4}$/.test(cleanPin)) {
      toast.error("PIN debe ser de 4 dígitos");
      return;
    }

    if (isWeakPin(cleanPin)) {
      toast.error("PIN demasiado inseguro");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const user = await http<{ role: "EMPLOYEE" }>("/work/complete-profile", {
        method: "PATCH",
        body: JSON.stringify({
          firstName: cleanFirstName,
          lastName: cleanLastName,
          phone: cleanPhone,
          email: cleanEmail,
          pin: cleanPin,
          newPassword: password,
        }),
      });

      toast.success("Perfil configurado correctamente");

      if (user.role === "EMPLOYEE") {
        router.replace("/employee");
      }

    } catch (error: any) {
      toast.error(error?.message || "No se pudo completar el perfil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-border rounded-2xl p-6 flex flex-col gap-6 shadow-sm"
      >
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-text">
            Completar perfil
          </h1>
          <p className="text-sm text-text-muted">
            Configura tu información y crea tu PIN
          </p>
        </header>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="PIN (4 dígitos)"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar"}
        </motion.button>
      </motion.form>
    </main>
  );
}