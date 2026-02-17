'use client';

import { useEffect, useState } from "react";
import { reportsApi } from "@/lib/api/reports.api";
import { toast } from "sonner";
import PeriodSelect from "./components/PeriodSelect";

type Summary = {
  totalEmployees: number;
  totalAbsences: number;
  totalJustified: number;
  rows: {
    employeeId: string;
    document: string;
    workedMinutes: number;
    absences: number;
    justified: number;
    status: string;
  }[];
};

export default function AdminReportsPage() {
  const [periodId, setPeriodId] = useState<string>("");
  const [documentFilter, setDocumentFilter] = useState<string>("");
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  function formatMinutes(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  }

  async function load() {
    if (!periodId) {
      setData(null);
      return;
    }

    try {
      setLoading(true);

      const res = await reportsApi.getSummary(
        periodId,
        documentFilter || undefined
      );

      setData(res);
    } catch {
      toast.error("Error cargando reporte");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [periodId, documentFilter]);

  return (
    <div className="flex flex-col gap-6 bg-surface border border-border p-6 rounded-2xl">

      {/* HEADER */}
      <section className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-text">
          Reportes de asistencia
        </h1>
        <p className="text-sm text-text-muted">
          Resumen general por periodo
        </p>
      </section>

      {/* FILTROS */}
      <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <PeriodSelect
            value={periodId}
            onChange={setPeriodId}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">
              Filtrar por documento (opcional)
            </label>

            <input
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value)}
              placeholder="EMP-2"
              className="h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none"
            />
          </div>

        </div>

      </section>

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-text-muted">
          Cargando reporte...
        </div>
      )}

      {/* RESUMEN */}
      {data && !loading && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-sm text-text-muted">
                Total empleados
              </span>
              <span className="text-lg font-semibold text-text">
                {data.totalEmployees}
              </span>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-sm text-text-muted">
                Inasistencias
              </span>
              <span className="text-lg font-semibold text-danger">
                {data.totalAbsences}
              </span>
            </div>

            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2">
              <span className="text-sm text-text-muted">
                Justificaciones
              </span>
              <span className="text-lg font-semibold text-warning">
                {data.totalJustified}
              </span>
            </div>

          </section>

          {/* DETALLE */}
          <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-text">
                Detalle por empleado
              </h2>
              <p className="text-sm text-text-muted">
                Datos individuales del periodo seleccionado
              </p>
            </div>

            {data.rows.length === 0 ? (
              <div className="text-sm text-text-muted">
                No hay empleados para este filtro
              </div>
            ) : (
              <div className="flex flex-col gap-4">

                {data.rows.map((row) => (
                  <div
                    key={row.employeeId}
                    className="border border-border rounded-xl p-4 flex justify-between items-center text-sm"
                  >

                    {/* INFO */}
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-text">
                        {row.document}
                      </span>

                      <span className="text-text-muted text-xs">
                        Trabajado: {formatMinutes(row.workedMinutes)}
                      </span>
                    </div>

                    {/* METRICAS */}
                    <div className="flex items-center gap-4">

                      <span className="bg-danger-soft text-danger px-3 py-1 rounded-full text-xs">
                        Inasistencias: {row.absences}
                      </span>

                      <span className="bg-warning-soft text-warning px-3 py-1 rounded-full text-xs">
                        Justificado: {row.justified}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          row.status === "IRREGULAR"
                            ? "bg-danger-soft text-danger"
                            : "bg-success-soft text-success"
                        }`}
                      >
                        {row.status}
                      </span>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        </>
      )}

    </div>
  );
}
