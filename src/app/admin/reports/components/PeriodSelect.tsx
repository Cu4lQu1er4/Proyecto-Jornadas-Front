'use client';

import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import { toast } from "sonner";

type Period = {
  id: string;
  startDate: string;
  endDate: string;
  closedAt: string | null;
};

export default function PeriodSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [periods, setPeriods] = useState<Period[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await http("/work/periods?page=1&limit=50");
        setPeriods(res.data ?? []);
      } catch {
        toast.error("Error cargando periodos");
      }
    }

    load();
  }, []);

  function formatLabel(p: Period) {
    const formatter = new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
    });

    return `${formatter.format(new Date(p.startDate))} - ${formatter.format(
      new Date(p.endDate)
    )}${p.closedAt ? " (Cerrado)" : ""}`;
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-text">
        Periodo
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 px-3 rounded-xl border border-border bg-surface text-sm text-text"
      >
        <option value="">
          Selecciona un periodo
        </option>

        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {formatLabel(p)}
          </option>
        ))}
      </select>
    </div>
  );
}
