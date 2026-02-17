'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { toast } from "sonner";

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

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const clearPin = pin.replace(/\D/g, "");

    if (!cleanFirstName) {
      toast.error("Nombre es obligatorio");
      return;
    }

    if (!cleanLastName) {
      toast.error("Apellido es obligatorio");
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("Telefono invalido");
      return;
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error("Correo invalido");
      return;
    }

    if (!/^\d{4}$/.test(clearPin)) {
      toast.error("PIN debe ser de 4 digitos");
      return;
    }

    if (isWeakPin(clearPin)) {
      toast.error("PIN demasiado inseguro");
      return;
    }

    setLoading(true);

    try {
      await http<{ succcess: true }>("/auth/complete-profile", {
        method: "POST",
        body: JSON.stringify({
          firstName: cleanFirstName,
          lastName: cleanLastName,
          phone: cleanPhone,
          email: cleanEmail,
          pin: clearPin,
        }),
      });

      toast.success("Perfil configurado correctamente");

      router.refresh();
      router.push("/employee");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo completar el perfil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-border rounded-2xl p-6 flex flex-col gap-6"
      >
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-text">
            Completar perfil
          </h1>
          <p className="text-sm text-text-muted">
            Configura tu informacion y crea tu PIN
          </p>
        </header>

        <div className="flex flex-col gap-4">
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
            type="text"
            placeholder="Telefono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            inputMode="numeric"
            maxLength={4}
            placeholder="PIN (4 digitos)"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="h-11 px-3 rounded-xl border border-border bg-background text-sm text-text outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </main>
  );
}