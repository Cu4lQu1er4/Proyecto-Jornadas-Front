import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { http } from "@/lib/http";
import { formatMinutes } from "@/lib/utils/time";

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
      try {
        setLoading(true);

        const data = await http<{
          days: Day[];
          totals: any;
        }>(`/admin/attendance/period/${employeeId}/${periodId}`);

        setDays(data.days ?? []);
        setTotals(data.totals ?? null);
      } catch (err) {
        console.error("Error loading period summary:", err);
        setDays([]);
        setTotals(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [periodId, employeeId]);

  if (!periodId) return null;

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          Cargando resumen del periodo...
        </p>
      </div>
    );
  }

  const totalJustified = days.reduce((a, d) => a + d.justifiedMinutes, 0);
  const totalUnjustified = days.reduce((a, d) => a + d.unjustifiedMinutes, 0);

  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">
          Resumen del periodo
        </h2>
        <p className="text-sm text-text-muted">
          Detalle consolidado de asistenia
        </p>
      </div>

      {totals && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">
                Minutes esperados
              </span>
              <span className="text-xl font-semibold text-text">
                {formatMinutes(totals.expectedMinutes)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">
                Minutos trabajados
              </span>
              <span className="text-xl font-semibold text-text">
                {formatMinutes(totals.workedMinutes)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gp-6">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">
                Justificado
              </span>
              <span className="text-lg font-semibold text-primary">
                {formatMinutes(totalJustified)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted">
                Injustificado
              </span>
              <span className="text-lg font-semibold text-danger">
                {formatMinutes(totalUnjustified)}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">
                Delta bruto
              </span>
              <span className="font-medium">
                {formatMinutes(totals.rawDelta)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">
                Balance final
              </span>

              <span
                className={`
                  text-lg font-semibold
                  ${
                    totals.netBalance > 0
                      ? "text-success"
                      : totals.netBalance < 0
                      ? "text-danger"
                      : "text-text"
                  }`
                }
              >
                {formatMinutes(totals.netBalance)}
              </span>
            </div>

            {totals.isIrregular ? (
              <div className="px-4 py-2 rounded-xl bg-danger-soft text-danger text-sm font-medium">
                Periodo con irregularidades
              </div>
            ): (
              <div className="px-4 py-4 rounded-xl bg-success-soft text-success text-sm font-medium">
                Periodo sin irregularidades
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-6">
        {days.map((d) => {
          const hasIssue =
            d.unjustifiedMinutes > 0 || d.status === "CONFLICT";

          return (
            <div
              key={d.date}
              className={`
                flex items-center justify-between
                px-4 py-3 rounded-xl
                border border-border
                transition
                ${hasIssue ? "bg-danger-soft/40" : "hover:bg-surface"}
              `}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text">
                  {new Date(d.date).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <span>Trab: {formatMinutes(d.workedMinutes)}</span>
                  <span>Just: {formatMinutes(d.justifiedMinutes)}</span>
                  <span>Injust: {formatMinutes(d.unjustifiedMinutes)}</span>
                </div>
              </div>

              <StatusBadge status={d.status} />
            </div>
          );
        })}

        {days.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">
            No hay registros en este periodo
          </p>
        )}
      </div>
    </div>
  );
}