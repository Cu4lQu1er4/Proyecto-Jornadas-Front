'use client';

import { http } from "@/lib/http";
import { useEffect, useState } from "react";

type DaySummary = {
  workedMinutes: number;
  expectedMinutes: number;
  deltaMinutes: number;
  lateArrival: boolean;
  earlyLeave: boolean;
  status: string;
  isOpen: boolean;
};

export default function CurrentWorkdayCard() {
  const [data, setData] = useState<DaySummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDay() {
    try {
      const data: DaySummary = await http("/work/my-day");

      setData(data);
    } catch {
      console.error("Error cargando jornada");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDay();
  }, []);

  // 🔁 Polling SOLO si está abierta
  useEffect(() => {
    if (!data?.isOpen) return;

    const interval = setInterval(() => {
      fetchDay();
    }, 30000); // cada 30 segundos

    return () => clearInterval(interval);
  }, [data?.isOpen]);

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          Cargando jornada...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          No hay información disponible
        </p>
      </div>
    );
  }

  const {
    workedMinutes,
    expectedMinutes,
    deltaMinutes,
    lateArrival,
    earlyLeave,
    status,
    isOpen,
  } = data;

  const workedH = Math.floor(workedMinutes / 60);
  const workedM = workedMinutes % 60;

  const expectedH = Math.floor(expectedMinutes / 60);
  const expectedM = expectedMinutes % 60;

  const deltaH = Math.floor(Math.abs(deltaMinutes) / 60);
  const deltaM = Math.abs(deltaMinutes) % 60;

  const isPositive = deltaMinutes >= 0;

  const statusStyle =
    status === "NORMAL"
      ? "bg-success-soft text-success"
      : status === "JUSTIFIED"
      ? "bg-primary-soft text-primary"
      : status === "PARTIALLY_UNJUSTIFIED"
      ? "bg-warning-soft text-warning"
      : "bg-danger-soft text-danger";

  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">
            Jornada de hoy
          </h2>
          {isOpen && (
            <span className="text-xs text-warning font-medium">
              En curso
            </span>
          )}
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

        <div>
          <span className="text-text-muted">Trabajado</span>
          <p className="font-medium text-text">
            {workedH}h {workedM}m
          </p>
        </div>

        <div>
          <span className="text-text-muted">Esperado</span>
          <p className="font-medium text-text">
            {expectedH}h {expectedM}m
          </p>
        </div>

        <div>
          <span className="text-text-muted">Diferencia</span>
          <p className={`font-medium ${isPositive ? "text-success" : "text-danger"}`}>
            {isPositive ? "+" : "-"}
            {deltaH}h {deltaM}m
          </p>
        </div>

      </div>

      {(lateArrival || earlyLeave) && (
        <div className="flex gap-3 text-xs">
          {lateArrival && (
            <span className="px-3 py-1 rounded-full bg-warning-soft text-warning">
              Llegada tarde
            </span>
          )}
          {earlyLeave && (
            <span className="px-3 py-1 rounded-full bg-warning-soft text-warning">
              Salida anticipada
            </span>
          )}
        </div>
      )}

    </div>
  );
}