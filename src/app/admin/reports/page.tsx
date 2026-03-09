'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <main className="min-h-[100dvh] bg-surface px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-1"
        >
          <h1 className="text-2xl font-semibold text-text">
            Reportes de asistencia
          </h1>
          <p className="text-sm text-text-muted">
            Resumen general por periodo
          </p>
        </motion.section>

        {/* FILTROS */}
        <section className="bg-white border border-border rounded-2xl p-4 sm:p-6 flex flex-col gap-6">
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
                className="
                  h-11 px-4 rounded-xl
                  border border-border
                  bg-surface text-text text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
              />
            </div>

          </div>
        </section>

        {loading && (
          <div className="text-sm text-text-muted">
            Cargando reporte...
          </div>
        )}

        {data && !loading && (
          <>
            {/* RESUMEN */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <SummaryCard
                label="Total empleados"
                value={data.totalEmployees}
              />

              <SummaryCard
                label="Inasistencias"
                value={data.totalAbsences}
                danger
              />

              <SummaryCard
                label="Justificaciones"
                value={data.totalJustified}
                warning
              />
            </motion.section>

            {/* DETALLE */}
            <section className="bg-white border border-border rounded-2xl p-4 sm:p-6 flex flex-col gap-6">

              <div>
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
                    <motion.div
                      key={row.employeeId}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 250 }}
                      className="
                        border border-border rounded-xl p-4
                        flex flex-col gap-4
                        lg:flex-row lg:justify-between lg:items-center
                      "
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
                      <div className="
                        flex flex-wrap gap-2
                        lg:items-center
                      ">
                        <Badge danger>
                          Inasistencias: {row.absences}
                        </Badge>

                        <Badge warning>
                          Justificado: {row.justified}
                        </Badge>

                        <Badge
                          success={row.status !== "IRREGULAR"}
                          danger={row.status === "IRREGULAR"}
                        >
                          {row.status}
                        </Badge>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  danger,
  warning,
}: {
  label: string;
  value: number;
  danger?: boolean;
  warning?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2"
    >
      <span className="text-sm text-text-muted">
        {label}
      </span>

      <span
        className={`text-xl font-semibold ${
          danger
            ? "text-danger"
            : warning
            ? "text-warning"
            : "text-text"
        }`}
      >
        {value}
      </span>
    </motion.div>
  );
}

function Badge({
  children,
  danger,
  warning,
  success,
}: any) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";

  const color = danger
    ? "bg-danger-soft text-danger"
    : warning
    ? "bg-warning-soft text-warning"
    : success
    ? "bg-success-soft text-success"
    : "bg-surface text-text";

  return <span className={`${base} ${color}`}>{children}</span>;
}