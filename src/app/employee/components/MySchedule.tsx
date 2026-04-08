'use client';

import { useEffect, useState } from "react";
import { employeeScheduleApi } from "@/lib/api/employeeSchedule";

export default function MySchedule() {
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    async function load() {
      try {
        const data = await employeeScheduleApi.getMySchedule();
        setSchedule(data);
      } catch (err) {
        console.error(err);
        setSchedule(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          Cargando horario...
        </p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          No tienes horario asignado
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border roundde-2xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">
          Tu horario
        </h2>
        <p className="text-sm text-text-muted">
          Jornada asignada
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {schedule.template.days.map((d: any) => (
          <div
            key={d.id}
            className="flex justify-between border-b border-border pb-2 last:border-b-0"
          >
            <span>
              {["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"][d.weekday]}
            </span>

            <span>
              {Math.floor(d.startMinute / 60)}:
              {String(d.startMinute % 60).padStart(2, "0")}
              {" - "}
              {Math.floor(d.endMinute / 60)}:
              {String(d.endMinute % 60).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}