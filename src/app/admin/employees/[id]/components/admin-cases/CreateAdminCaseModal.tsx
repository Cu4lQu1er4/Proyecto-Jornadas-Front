'use client';

import { useState } from "react";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import { toast } from "sonner";

type Props = {
  employeeId: string;
  onClose: () => void;
  onCreated: (newCase: any) => void;
};

export default function CreateAdminCaseModal({
  employeeId,
  onClose,
  onCreated,
}: Props) {
  const [type, setType] = useState("PERMISSION");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function generateDateRange(start: string, end: string) {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      dates.push(new Date(current).toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!startDate) {
      toast.warning("Debes seleccionar fecha inicio");
      return;
    }

    const finalEndDate = endDate || startDate;

    if (finalEndDate < startDate) {
      toast.error("La fecha fin no puede ser menor a la fecha de inicio");
      return;
    }

    setLoading(true);

    try {
      const dates = generateDateRange(startDate, finalEndDate);

      const singleDay = dates.length === 1;

      const scopes = dates.map((d) => ({
        date: d,
        startMinute: singleDay && startMinute ? timeToMinutes(startMinute) : null,
        endMinute: singleDay && endMinute ? timeToMinutes(endMinute) : null,
      }));

      const newCase = await adminCaseApi.create({
        employeeId,
        type,
        notes: notes || undefined,
        scopes,
      });

      toast.success("Caso creado correctamente");

      onCreated(newCase);
      onClose();

    } catch (err: any) {
      console.log("CREATE ERROR:", err)
      toast.error(
        err?.message ||
        err?.response?.message ||
        "Error al crear el caso"
      );
    } finally {
      setLoading(false);
    }
  }

  const isMultiDay =
    startDate && endDate && startDate !== endDate;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="
          bg-white border border-border rounded-2xl p-6 w-full max-w-md
          flex flex-col gap-6"
      >
        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">
            Nuevo caso administrativo
          </h2>
          <p className="text-sm text-text-muted">
            Permisos, incapacidades o justificaciones
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="
                h-11 px-3 rounded-xl border border-border bg-surface 
                text-sm text-text"
            >
              <option value="PERMISSION">Permiso</option>
              <option value="INCAPACITY">Incapacidad</option>
              <option value="JUSTIFICATION">Justificacion</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">Fecha inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="
                  h-11 px-3 rounded-xl border border-border bg-surface
                  text-sm text-text"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">Fecha fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="
                  h-11 px-3 rounded-xl border border-border bg-surface
                  text-sm text-text"
              />
            </div>
          </div>

          {!isMultiDay && (
            <div className="grid grid-cols gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-text">Hora inicio</label>
                <input
                  type="time"
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="
                    h-11 px-3 rounded-xl border border-border bg-surface
                    text-sm text-text"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-text">Hora fin</label>
                <input
                  type="time"
                  value={endMinute}
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="
                    h-11 px-3 rounded-xl border border-border bg-surface
                    text-sm text-text"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="
                px-3 py-2 rounded-xl border border-border bg-surface
                text-sm text-text resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                h-10 px-4 rounded-xl bg-surface border border-border
                text-text text-sm font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                h-10 px-4 rounded-xl bg-primary text-white text-sm
                font-medium"
            >
              {loading ? "Creando..." : "Crear caso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}