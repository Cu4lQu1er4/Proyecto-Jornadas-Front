'use client';

import { useEffect, useState } from "react";

type HistorySummary = {
  totalWorkedMinutes: number;
  totalExpectedMinutes: number;
  totalDeltaMinutes: number;
};

type HistoryEntry = {
  id: string;
  startTime: string;
  endTime: string;
  workedMinutes: number;
  expectedMinutes: number;
  deltaMinutes: number;
  status?: string;
  lateArrival?: boolean;
  earlyLeave?: boolean;
};

type Props = {
  period: {
    startDate: string;
    endDate: string;
  } | null;
  onTotalMinutes?: (minutes: number) => void;
};

export default function HistoryList({ period, onTotalMinutes }: Props) {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!period) return;

    async function loadHistory() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3001/api/work/history?from=${encodeURIComponent(
            period.startDate
          )}&to=${encodeURIComponent(period.endDate)}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        setItems(data.entries ?? []);
        setSummary(data.summary ?? null);

        onTotalMinutes?.(data.summary?.totalWorkedMinutes ?? 0);
      } catch {
        setError("No se pudo cargar el historial");
        setItems([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [period, onTotalMinutes]);

  if (!period) {
    return (
      <p className="text-sm text-text-muted">
        Selecciona un período
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-text-muted">
        Cargando historial...
      </p>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-soft text-danger rounded-xl px-3 py-2 text-sm">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No hay jornadas en este período
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ===== RESUMEN GENERAL ===== */}
      {summary && (
        <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4 text-sm">

          <div className="flex justify-between">
            <span className="text-text-muted">
              Total esperado
            </span>
            <span className="font-medium text-text">
              {Math.floor(summary.totalExpectedMinutes / 60)}h{" "}
              {summary.totalExpectedMinutes % 60}m
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">
              Total trabajado
            </span>
            <span className="font-medium text-text">
              {Math.floor(summary.totalWorkedMinutes / 60)}h{" "}
              {summary.totalWorkedMinutes % 60}m
            </span>
          </div>

          <div className="flex justify-between font-medium">
            <span className="text-text">
              Diferencia
            </span>

            <span
              className={
                summary.totalDeltaMinutes >= 0
                  ? "text-success"
                  : "text-danger"
              }
            >
              {summary.totalDeltaMinutes >= 0 ? "+" : "-"}
              {Math.floor(Math.abs(summary.totalDeltaMinutes) / 60)}h{" "}
              {Math.abs(summary.totalDeltaMinutes) % 60}m
            </span>
          </div>

        </div>
      )}

      {/* ===== LISTA DE DÍAS ===== */}
      {items.map((item) => {
        const workedH = Math.floor(item.workedMinutes / 60);
        const workedM = item.workedMinutes % 60;

        const deltaH = Math.floor(Math.abs(item.deltaMinutes) / 60);
        const deltaM = Math.abs(item.deltaMinutes) % 60;

        const isPositive = item.deltaMinutes >= 0;

        const statusStyle =
          item.status === "NORMAL"
            ? "bg-success-soft text-success"
            : item.status === "IRREGULAR"
            ? "bg-warning-soft text-warning"
            : item.status === "INCOMPLETE"
            ? "bg-danger-soft text-danger"
            : "bg-primary-soft text-primary";

        return (
          <div
            key={item.id}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
          >

            <div className="flex items-center justify-between">

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text">
                  {new Date(item.startTime).toLocaleDateString("es-CO", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>

                <span className="text-sm text-text-muted">
                  {new Date(item.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(item.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
              >
                {item.status ?? "NORMAL"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">

              <span className="font-medium text-text">
                {workedH}h {workedM}m
              </span>

              <span
                className={
                  isPositive
                    ? "text-success font-medium"
                    : "text-danger font-medium"
                }
              >
                {isPositive ? "+" : "-"}
                {deltaH}h {deltaM}m
              </span>

            </div>

            {(item.lateArrival || item.earlyLeave) && (
              <div className="flex flex-wrap gap-3 text-xs">

                {item.lateArrival && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning-soft text-warning">
                    Llegada tarde
                  </span>
                )}

                {item.earlyLeave && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning-soft text-warning">
                    Salida anticipada
                  </span>
                )}

              </div>
            )}

          </div>
        );
      })}

    </div>
  );
}
