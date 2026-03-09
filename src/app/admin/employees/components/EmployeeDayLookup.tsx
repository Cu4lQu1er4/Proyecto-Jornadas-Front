'use client';

import { http } from "@/lib/http";
import { useState } from "react";

const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  NORMAL: {
    label: "Normal",
    className: "bg-primary-soft text-primary",
  },
  CONFLICT: {
    label: "Conflicto",
    className: "bg-danger-soft text-danger",
  },
  INCAPACITY: {
    label: "Incapacidad",
    className: "bg-warning-soft text-warning",
  },
  UNJUSTIFIED_ABSENCE: {
    label: "Ausencia injustificada",
    className: "bg-danger-soft text-danger",
  },
  JUSTIFIED: {
    label: "Justificado",
    className: "bg-success-soft text-success",
  },
  PARTIALLY_UNJUSTIFIED: {
    label: "Parcialmente injustificado",
    className: "bg-warning-soft text-warning",
  },
  NON_OPERATIONAL_DAY: {
    label: "Día no laboral",
    className: "bg-surface text-text-muted",
  },
};

export default function EmployeeDayLookup({
  employeeId,
}: {
  employeeId: string;
}) {
  const [date, setDate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!date) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await http(
        `/admin/attendance/day/${employeeId}?date=${date}`
      );

      setResult(data);
    } catch (err) {
      setError("No se pudo obtener la informacion del dia");
    } finally {
      setLoading(false);
    }
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

      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-1">
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
          disabled={loading}
          className="
            h-11 px-6 rounded-xl bg-primary text-white
            font-medium transition hover:opacity-90
            disabled:opacity-50
          "
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

      </div>

      {error && (
        <div className="text-sm text-danger">
          {error}
        </div>
      )}

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

            {(() => {
              const statusConfig =
                STATUS_MAP[result.status] ??
                {
                  label: result.status,
                  className: "bg-surface text-text-muted",
                };

              return (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              );
            })()}
          </div>

        </div>
      )}

    </div>
  );
}