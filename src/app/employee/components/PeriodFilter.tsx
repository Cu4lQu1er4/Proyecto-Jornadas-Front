'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Period = {
  id: string;
  startDate: string;
  endDate: string;
  year: number;
  month: number;
  half: 1 | 2;
  closedAt: string | null;
};

export default function PeriodFilter({
  onChange,
}: {
  onChange: (period: Period) => void;
}) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    async function loadPeriods() {
      try {
        const res = await fetch(
          "http://localhost:3001/api/work/my-periods",
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setPeriods(data ?? []);

        if (data?.length > 0) {
          setSelectedId(data[0].id);
          onChange(data[0]);
        }
      } catch {
        toast.error("No se pudieron cargar los periodos");
      }
    }

    loadPeriods();
  }, [onChange]);

  function handleSelect(id: string) {
    setSelectedId(id);

    const selected = periods.find(p => p.id === id);
    if (selected) onChange(selected);
  }

  if (periods.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No hay periodos disponibles
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm text-text-muted">
        Periodo
      </label>

      <div className="relative">

        <select
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          className="
            w-full
            h-11
            px-4
            rounded-xl
            border border-border
            bg-surface
            text-text
            text-sm
            appearance-none
            focus:outline-none
          "
        >
          {periods.map((period) => {
            const label = `${period.year} - ${
              period.month
            } (${period.half === 1 ? "1ra quincena" : "2da quincena"})`;

            return (
              <option key={period.id} value={period.id}>
                {label}
              </option>
            );
          })}
        </select>

      </div>

      {/* Estado del periodo */}
      {selectedId && (
        <div className="text-xs">
          {periods.find(p => p.id === selectedId)?.closedAt ? (
            <span className="px-3 py-1 rounded-full bg-danger-soft text-danger">
              Periodo cerrado
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-success-soft text-success">
              Periodo abierto
            </span>
          )}
        </div>
      )}

    </div>
  );
}
