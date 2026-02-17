'use client';

import { useEffect, useState } from "react";

type Period = {
  id: string;
  startDate: string;
  endDate: string;
  closedAt: string | null;
};

export default function EmployeePeriods({
  employeeId,
  onSelectPeriod,
}: {
  employeeId: string;
  onSelectPeriod: (periodId: string) => void;
}) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    async function load() {
      const res = await fetch(
        'http://localhost:3001/api/work/periods',
        { credentials: 'include' }
      );

      if (!res.ok) return;

      const data = await res.json();
      setPeriods(data.items ?? data);
    }

    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    onSelectPeriod(selected);
  }, [selected]);

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">
          Resumen por período
        </h2>
        <p className="text-sm text-text-muted">
          Selecciona un período para ver su detalle
        </p>
      </div>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="
          w-full h-11 rounded-xl border border-border
          px-4 text-sm
          outline-none
          focus:ring-2 focus:ring-primary/30
          bg-background
        "
      >
        <option value="">
          Selecciona un período
        </option>

        {periods.map((p) => {
          const isClosed = !!p.closedAt;

          return (
            <option key={p.id} value={p.id}>
              {new Date(p.startDate).toLocaleDateString()} —{" "}
              {new Date(p.endDate).toLocaleDateString()}
              {isClosed ? " (Cerrado)" : ""}
            </option>
          );
        })}
      </select>

    </div>
  );
}