'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { employeeAdminCaseApi } from "@/lib/api/employeeAdminCase.api";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

type Props = {
  onClose: () => void;
  onCreated: (newCase: any) => void;
};

export default function CreateEmployeeCaseModal({
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
  const [files, setFiles] = useState<File[]>([]);

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function generateDateRange(start: string, end: string) {
    const dates: string[] = [];

    const [sy, sm, sd] = start.split("-").map(Number);
    const [ey, em, ed] = end.split("-").map(Number);

    let current = new Date(sy, sm - 1, sd);
    const last = new Date(ey, em - 1, ed);

    while (current <= last) {
      const y = current.getFullYear();
      const m = String(current.getMonth() + 1).padStart(2, "0");
      const d = String(current.getDate()).padStart(2, "0");

      dates.push(`${y}-${m}-${d}`);

      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  async function processFile(files: File[]) {
    const result: File[] = [];

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });

        result.push(compressed);
      } else {
        result.push(file);
      }
    }

    return result;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!startDate) {
      toast.warning("Debes seleccionar fecha inicio");
      return;
    }

    const finalEndDate = endDate || startDate;

    if (finalEndDate < startDate) {
      toast.error("La fecha fin no puede ser menor a la fecha inicio");
      return;
    }

    const dates = generateDateRange(startDate, finalEndDate);
    const singleDay = dates.length === 1;

    if (singleDay) {
      if ((startMinute && !endMinute) || (!startMinute && endMinute)) {
        toast.warning("Si usas horas debes indicar inicio y fin");
        return;
      }

      if (startMinute && endMinute) {
        const s = timeToMinutes(startMinute);
        const en = timeToMinutes(endMinute);
        if (en <= s) {
          toast.error("La hora fin debe ser mayor a la hora inicio");
          return;
        }
      }
    }

    setLoading(true);

    try {
      const scopes = dates.map((d) => ({
        date: d,
        startMinute: singleDay && startMinute ? timeToMinutes(startMinute) : null,
        endMinute: singleDay && endMinute ? timeToMinutes(endMinute) : null,
      }));

      const processedFiles = await processFile(files);

      const newCase = await employeeAdminCaseApi.create({
        type,
        notes: notes?.trim() || undefined,
        scopes,
        files: processedFiles,
      });

      toast.success("Solicitud enviada correctamente");

      onCreated(newCase);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.message ||
        err?.response?.message ||
        "Error al enviar la solicitud"
      );
    } finally {
      setLoading(false);
    }
  }

  const isMultiDay = startDate && endDate && startDate !== endDate;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="
            bg-white border border-border rounded-2xl
            w-full max-w-md
            max-h-[90vh] overflow-y-auto
            p-6 flex flex-col gap-6
          "
        >
          <header className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text">
              Nueva solicitud
            </h2>
            <p className="text-sm text-text-muted">
              Se enviará para aprobación del administrador
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Tipo */}
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
                <option value="ABSENCE">Ausencia</option>
              </select>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-text">Fecha inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-text">Fecha fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
                />
              </div>
            </div>

            {!isMultiDay && (
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
            )}

            {/* Notas */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="px-3 py-2 rounded-xl border border-border bg-surface text-sm text-text resize-none"
              />
            </div>

            {/* Archivos */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">Adjuntar evidencia</label>

              <label className="flex items-center justify-center h-11 px-4 rounded-xl border border-border bg-surface cursor-pointer text-sm text-text hover:bg-gray-100 transition">
                Seleccionar archivos
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    setFiles(Array.from(e.target.files || []))
                  }
                  className="hidden"
                />
              </label>

              {files.length > 0 && (
                <span className="text-xs text-text-muted">
                  {files.length} archivo(s) seleccionado(s)
                </span>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm"
              >
                Cancelar
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="h-10 px-4 rounded-xl bg-primary text-white text-sm disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </motion.button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}