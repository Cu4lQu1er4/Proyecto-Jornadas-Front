'use client';

import { useState } from "react";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import { toast } from "sonner";

type Props = {
  employeeId: string;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateAdminCaseModal({
  employeeId,
  onClose,
  onCreated,
}: Props) {
  const [type, setType] = useState("PERMISSION");
  const [date, setDate] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!date) {
    toast.warning("Debes seleccionar una fecha");
    return;
  }

  setLoading(true);

  try {
    const scope: any = {
      date,
    };

    if (startMinute) {
      scope.startMinute = timeToMinutes(startMinute);
    }

    if (endMinute) {
      scope.endMinute = timeToMinutes(endMinute);
    }

    await adminCaseApi.create({
      employeeId,
      type,
      notes: notes || undefined,
      scopes: [scope],
    });

    toast.success("Caso creado correctamente");
    onCreated();
    onClose();

  } catch (err: any) {
    toast.error("Error al crear el caso");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">

        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">
            Nuevo caso administrativo
          </h2>
          <p className="text-sm text-text-muted">
            Crear permiso, incapacidad o justificación
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
            >
              <option value="PERMISSION">Permiso</option>
              <option value="INCAPACITY">Incapacidad</option>
              <option value="JUSTIFICATION">Justificación</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">Hora inicio</label>
              <input
                type="time"
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">Hora fin</label>
              <input
                type="time"
                value={endMinute}
                onChange={(e) => setEndMinute(e.target.value)}
                className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="px-3 py-2 rounded-xl border border-border bg-surface text-sm text-text resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">

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
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90"
            >
              {loading ? "Creando..." : "Crear caso"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}