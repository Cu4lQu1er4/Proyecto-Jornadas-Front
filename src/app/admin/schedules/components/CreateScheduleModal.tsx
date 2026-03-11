'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scheduleApi } from "@/lib/api/schedule.api";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
  onCreated: () => void;
  editing?: any;
};

const weekdays = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export default function CreateScheduleModal({
  onClose,
  onCreated,
  editing,
}: Props) {
  const [name, setName] = useState(editing?.name ?? "");
  const [days, setDays] = useState<any[]>(editing?.days ?? []);
  const [loading, setLoading] = useState(false);

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function upsertDay(weekday: number, start: string, end: string) {
    setDays((prev) => {
      const exists = prev.find((d) => d.weekday === weekday);

      const newDay = {
        weekday,
        startMinute: timeToMinutes(start),
        endMinute: timeToMinutes(end),
      };

      if (exists) {
        return prev.map((d) =>
          d.weekday === weekday ? newDay : d
        );
      }

      return [...prev, newDay];
    });
  }

  function removeDay(weekday: number) {
    setDays((prev) => prev.filter((d) => d.weekday !== weekday));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || days.length === 0) {
      toast.warning("Completa el nombre y al menos un día");
      return;
    }

    setLoading(true);

    try {
      if (editing) {
        await scheduleApi.update(editing.id, {
          name, days,
        });

        toast.success("Horario actualizado");
      } else {
        await scheduleApi.create({ name, days });

        toast.success("Horario creado");
      }

      onCreated();
      onClose();
    } catch {
      toast.error("Error al crear horario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="
            bg-white border border-border rounded-2xl
            w-full max-w-2xl
            max-h-[90vh] overflow-y-auto
            p-6 flex flex-col gap-6
          "
        >

          <h2 className="text-lg font-semibold">
            {editing ? "Editar horario" : "Nuevo horario"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >

            <input
              placeholder="Nombre del horario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                h-11 px-4 rounded-xl
                border border-border
                bg-surface text-sm
                focus:outline-none focus:ring-2 focus:ring-primary
              "
            />

            <div className="flex flex-col gap-4">

              <p className="text-sm font-medium">
                Días
              </p>

              {weekdays.map((d) => {

                const existing = days.find((x) => x.weekday === d.value);

                return (
                  <DayRow
                    key={d.value}
                    day={d}
                    existing={existing}
                    onChange={upsertDay}
                    onRemove={removeDay}
                  />
                );
              })}

            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-xl border border-border"
              >
                Cancelar
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="
                  h-10 px-4 rounded-xl
                  bg-primary text-white
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Guardando..."
                  : editing
                  ? "Actualizar"
                  : "Crear"}
              </motion.button>

            </div>

          </form>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DayRow({ day, existing, onChange, onRemove }: any) {

  const [enabled, setEnabled] = useState(!!existing);
  const [start, setStart] = useState(
    existing
      ? `${String(Math.floor(existing.startMinute / 60)).padStart(2, "0")}:${String(existing.startMinute % 60).padStart(2, "0")}`
      : "07:00"
  );
  const [end, setEnd] = useState(
    existing
      ? `${String(Math.floor(existing.endMinute / 60)).padStart(2, "0")}:${String(existing.endMinute % 60).padStart(2, "0")}`
      : "17:00"
  );

  function handleToggle() {

    const next = !enabled;
    setEnabled(next);

    if (next) {
      onChange(day.value, start, end);
    } else {
      onRemove(day.value);
    }

  }

  function handleTimeChange(
    type: "start" | "end",
    value: string
  ) {

    if (type === "start") setStart(value);
    if (type === "end") setEnd(value);

    if (enabled) {

      onChange(
        day.value,
        type === "start" ? value : start,
        type === "end" ? value : end
      );

    }

  }

  return (
    <motion.div
      layout
      className="
        border border-border rounded-xl p-4
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
      "
    >

      <div className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
        />

        <span className="text-sm font-medium">
          {day.label}
        </span>

      </div>

      <div className="flex gap-3">

        <input
          type="time"
          value={start}
          onChange={(e) =>
            handleTimeChange("start", e.target.value)
          }
          disabled={!enabled}
          className="
            h-10 px-3 border border-border
            rounded-lg text-sm
            disabled:opacity-50
          "
        />

        <input
          type="time"
          value={end}
          onChange={(e) =>
            handleTimeChange("end", e.target.value)
          }
          disabled={!enabled}
          className="
            h-10 px-3 border border-border
            rounded-lg text-sm
            disabled:opacity-50
          "
        />

      </div>

    </motion.div>
  );
}