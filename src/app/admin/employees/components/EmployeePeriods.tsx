'use client';

import { http } from "@/lib/http";
import { useEffect, useState } from "react";
import { formatMinutes } from "@/lib/utils/time";

type Period = {
  id: string;
  startDate: string;
  endDate: string;
  closedAt: string | null;
  workedDays: number;
  absences: number;
  justified: number;
  partial: number;
  totalDeltaMinutes: number;
};

export default function EmployeePeriods({
  employeeId,
  onSelectPeriod,
}: {
  employeeId: string;
  onSelectPeriod: (periodId: string) => void;
}) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await http(
          `/work/admin/employees/${employeeId}/periods`
        ) as Period[];

        setPeriods(data ?? []);
      } catch (error) {
        console.error("Error loading periods:", error);
        setPeriods([]);
      }
    }
    load();
  }, [employeeId]);

  function handleSelect(id: string) {
    setSelected(id);
    onSelectPeriod(id);
  }

  if (periods.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Este empleado no tiene periodos registrados
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {periods.map((p) => {
        const isClosed = !!p.closedAt;
        const delta = p.totalDeltaMinutes;
        const isIrregular = isClosed && delta !== 0;

        const deltaStyle =
          delta < 0
            ? "bg-danger-soft text-danger"
            : delta > 0
            ? "bg-warning-soft text-warning"
            : "bg-success-soft text-success";

        return (
          <button
            key={p.id}
            onClick={() => handleSelect(p.id)}
            className={`
              w-full text-left border border-border rounded-2xl p-4 transition
              ${selected === p.id ? "bg-primary-soft" : "bg-white"}
            `}
          >
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">
                  {new Date(p.startDate).toLocaleDateString()} -{" "}
                  {new Date(p.endDate).toLocaleDateString()}
                </span>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-success-soft text-success px-2 py-1 rounded-full">
                    {p.workedDays} trabajados
                  </span>

                  <span className="bg-danger-soft text-danger px-2 py-1 rounded-full">
                    {p.absences} ausencias
                  </span>

                  <span className="bg-warning-soft text-warning px-2 py-1 rounded-full">
                    {p.justified} justificados
                  </span>

                  {p.partial > 0 && (
                    <span className="bg-primary-soft text-primary px-2 py-1 rounded-full">
                      {p.partial} parciales
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                  {isClosed ? (
                    <span>Periodo cerrado</span>
                  ) : (
                    <span>Periodo en curso</span>
                  )}

                  {isClosed && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isIrregular
                          ? "bg-danger-soft text-danger"
                          : "bg-success-soft text-success"
                      }`}
                    >
                      {isIrregular ? "Irregular" : "Correcto"}
                    </span>
                  )}
                </div>
              </div>

              {isClosed && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${deltaStyle}`}
                >
                  {formatMinutes(delta)}
                </span>
              )}

              {!isClosed && (
                <span
                  className="
                    px-3 py-1 rounded-full text-sm font-medium bg-success-soft text-success"
                >
                  Abierto
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}