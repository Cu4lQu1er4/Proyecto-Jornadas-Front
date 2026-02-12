'use client';

import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";

type Day = {
  date: string;
  workedMinutes: number;
  justifiedMinutes: number;
  unjustifiedMinutes: number;
  status:
    | "NORMAL"
    | "JUSTIFIED"
    | "PARTIALLY_UNJUSTIFIED"
    | "UNJUSTIFIED_ABSENCE"
    | "INCAPACITY"
    | "CONFLICT";
};

export default function EmployeePeriodSummary({
  employeeId,
  periodId,
}: {
  employeeId: string;
  periodId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<Day[]>([]);
  const [totals, setTotals] = useState<any>(null);

  useEffect(() => {
    if (!periodId) return;

    async function load() {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3001/api/admin/attendance/period/${employeeId}/${periodId}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();

      setDays(data.days);
      setTotals(data.totals);
      setLoading(false);
    }

    load();
  }, [periodId]);

  if (!periodId) return null;

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          Cargando resumen del período...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">
          Resumen del período
        </h2>
        <p className="text-sm text-text-muted">
          Detalle consolidado de asistencia
        </p>
      </div>

      {/* Totales */}
      {totals && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="flex flex-col gap-1">
            <span className="text-sm text-text-muted">
              Trabajado
            </span>
            <span className="text-xl font-semibold">
              {totals.worked} min
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-text-muted">
              Justificado
            </span>
            <span className="text-xl font-semibold">
              {totals.justified} min
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-text-muted">
              Injustificado
            </span>
            <span className="text-xl font-semibold text-danger">
              {totals.unjustified} min
            </span>
          </div>

        </div>
      )}

      {/* Lista de días */}
      <div className="flex flex-col gap-3 border-t border-border pt-6">

        {days.map((d) => (
          <div
            key={d.date}
            className="
              flex items-center justify-between
              px-4 py-3 rounded-xl
              border border-border
              hover:bg-surface transition
            "
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                {new Date(d.date).toLocaleDateString()}
              </p>

              <p className="text-xs text-text-muted">
                Trab: {d.workedMinutes} · Just: {d.justifiedMinutes} · Injust: {d.unjustifiedMinutes}
              </p>
            </div>

            <StatusBadge status={d.status} />
          </div>
        ))}

        {days.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">
            No hay registros en este período
          </p>
        )}

      </div>

    </div>
  );
}