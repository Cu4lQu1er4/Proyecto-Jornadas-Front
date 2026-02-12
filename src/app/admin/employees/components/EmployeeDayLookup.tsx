'use client';

import { useState } from "react";

export default function EmployeeDayLookup({
  employeeId,
}: {
  employeeId: string;
}) {
  const [date, setDate] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleSearch() {
    if (!date) return;

    const res = await fetch(
      `http://localhost:3001/api/admin/attendance/day/${employeeId}?date=${date}`,
      { credentials: "include" }
    );

    if (!result.ok) return;

    const data = await result.json();
    setResult(data);
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">
          Consultar día específico
        </h2>
        <p className="text-sm text-text-muted">
          Selecciona una fecha para ver el detalle de asistencia
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">

        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium text-text">
              Fecha
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                h-11 px-4 rounded-xl border border-border
                outline-none
                focus:ring-2 focus:ring-primary/30
              "
            />
          </div>

          <button
            onClick={handleSearch}
            className="
              h-11 px-6 rounded-xl bg-primary text-white
              font-medium transition hover:opacity-90
            "
          >
            Buscar
          </button>
        </div>

        {result && (
          <div className="border-t border-border pt-4 text-sm flex flex-col gap-3">

            <div className="flex justify-between">
              <span className="text-text-muted">Trabajado</span>
              <span className="font-medium">
                {result.workedMinutes} min
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">Justificado</span>
              <span>
                {result.justifiedMinutes} min
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-muted">Injustificado</span>
              <span>
                {result.unjustifiedMinutes} min
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-muted">Estado</span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${
                    result.status === "NORMAL"
                      ? "bg-primary-soft text-primary"
                      : result.status === "INCOMPLETE"
                      ? "bg-danger-soft text-danger"
                      : result.status === "IRREGULAR"
                      ? "bg-warning-soft text-warning"
                      : result.status === "EXTRA"
                      ? "bg-success-soft text-success"
                      : "bg-surface text-text-muted"
                  }
                `}
              >
                {result.status}
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
