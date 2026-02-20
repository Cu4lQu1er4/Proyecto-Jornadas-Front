'use client';

import { useState } from "react";
import { scheduleApi } from "@/lib/api/schedule.api";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

const weekdays = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miercoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sabado" },
  { value: 0, label: "Domingo" },
];

export default function CreateScheduleModal({
  onClose,
  onCreated,
}: Props) {

  const [name, setName] = useState("");
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function addDay(weekday: number, start: string, end: string) {
    setDays(prev => [
      ...prev,
      {
        weekday,
        startMinute: timeToMinutes(start),
        endMinute: timeToMinutes(end),
      },
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || days.length === 0) {
      toast.warning("Completa el nombre y al menos un dia");
      return;
    }

    setLoading(true);

    try {
      await scheduleApi.create({
        name,
        days,
      });

      toast.success("Horario creado");
      onCreated();
      onClose();
    } catch {
      toast.error("Error al crear horario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-xl flex flex-col gap-6">
        <h2 className="text-lg font-semibold">
          Nuevo horario
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <input
            placeholder="Nombre del horario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 px-4 rounded-xl border border-border bg-surface text-sm"
          />

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">
              Dias
            </p>

            {weekdays.map((d) => (
              <DayRow
                key={d.value}
                day={d}
                onAdd={addDay}
              />
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-xl bg-primary text-white"
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DayRow({ day, onAdd }: any) {
  const [enabled, setEnabled] = useState(false);
  const [start, setStart] = useState("07:00");
  const [end, setEnd] = useState("17:00");

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);

    if (next) {
      onAdd(day.value, start, end);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="checkbox"
        checked={enabled}
        onChange={handleToggle}
      />

      <span className="w-24">{day.label}</span>

      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        disabled={!enabled}
        className="h-10 px-2 border border-border rounded-lg"
      />

      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        disabled={!enabled}
        className="h-10 px-2 border border-border rounded-lg"
      />
    </div>
  );
}