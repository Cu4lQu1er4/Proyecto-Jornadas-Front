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
  const [employeeFilter, setEmployeeFilter] = useState<string>("");
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!periodId) return;

    try {
      setLoading(true);

      const res = await reportsApi.getSummary(periodId, employeeFilter || undefined);

      setData(res);
    } catch {
      toast.error("Error cargando reporte");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [periodId, employeeFilter]);

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

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

            <div className="flex flex-col gap-2">

              <PeriodSelect
                value={periodId}
                onChange={setPeriodId}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-text">
                Filtrar por empleado (opcional)
              </label>

              <input
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                placeholder="ID empleado"
                className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
              />
            </div>

          </div>

        </section>

        {/* CARDS RESUMEN */}
        {data && (
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
        )}

        {/* TABLA */}
        {data && (
          <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-text">
                Detalle por empleado
              </h2>
              <p className="text-sm text-text-muted">
                Datos individuales del periodo seleccionado
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-text">

                <thead className="border-b border-border text-text-muted">
                  <tr>
                    <th className="text-left py-3">Empleado</th>
                    <th className="text-left py-3">Trabajado</th>
                    <th className="text-left py-3">Inasistencias</th>
                    <th className="text-left py-3">Justificado</th>
                    <th className="text-left py-3">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {data.rows.map((row) => (
                    <tr key={row.employeeId} className="border-b border-border">
                      <td className="py-3">{row.document}</td>
                      <td>{row.workedMinutes} min</td>
                      <td>{row.absences}</td>
                      <td>{row.justified}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </section>
        )}

      </div>
    </main>
  );
}
