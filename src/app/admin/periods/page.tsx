'use client';

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PeriodsTable from "./components/PeriodsTable";
import ConfirmModal from "./components/ConfirmModal";
import { toast } from "sonner";

type Period = {
  id: string;
  year: number;
  month: number;
  half: 1 | 2;
  startDate: string;
  endDate: string;
  closedAt: string | null;
  expectedCloseAt: string;
  isOverdue: boolean;
  daysOverdue: number;
};

function formatPeriodTitle(p: Period) {
  return `${p.year} / ${p.month} · ${p.half === 1 ? "1ra" : "2da"} quincena`;
}

function formatRange(p: Period) {
  return `${new Date(p.startDate).toLocaleDateString()} — ${new Date(p.endDate).toLocaleDateString()}`;
}

function StatusBadge({ period }: { period: Period }) {
  if (period.closedAt) {
    return (
      <span className="px-3 py-1 rounded-full text-sm bg-primary-soft text-primary">
        Cerrado
      </span>
    );
  }

  if (period.isOverdue) {
    return (
      <span className="px-3 py-1 rounded-full text-sm bg-danger-soft text-danger">
        Vencido · {period.daysOverdue} día(s)
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-sm bg-success-soft text-success">
      Abierto
    </span>
  );
}

export default function AdminPeriodPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [toClose, setToClose] = useState<Period | null>(null);
  const [closing, setClosing] = useState(false);

  async function loadPeriods() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/work/periods?page=1&limit=10`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setPeriods(data.items ?? []);
    } catch {
      toast.error("No se pudieron cargar los periodos");
      setPeriods([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPeriods();
  }, []);

  const overdueOpen = useMemo(
    () => periods.find((p) => !p.closedAt && p.isOverdue),
    [periods]
  );

  const openPeriod = useMemo(
    () => periods.find((p) => !p.closedAt),
    [periods]
  );

  useEffect(() => {
    if (overdueOpen) {
      toast.warning("Hay periodos vencidos por cerrar");
    }
  }, [overdueOpen]);

  async function confirmClose() {
    if (!toClose) return;

    setClosing(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/work/periods/${toClose.id}/close`,
        { method: "PATCH", credentials: "include" }
      );

      if (!res.ok) throw new Error();

      toast.success("Periodo cerrado correctamente");
      await loadPeriods();
    } catch {
      toast.error("No se pudo cerrar el periodo");
    } finally {
      setClosing(false);
      setToClose(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-sm text-text-muted">Cargando periodos...</p>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-surface px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-semibold text-text">
            Periodos
          </h1>
          <p className="text-sm text-text-muted">
            El calendario define la quincena. Cerrar un periodo bloquea modificaciones históricas.
          </p>
        </motion.header>

        {overdueOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-warning-soft text-warning border border-border rounded-2xl p-4 sm:p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">
                  Hay un periodo vencido por cerrar
                </p>
                <p className="text-sm">
                  {formatPeriodTitle(overdueOpen)} · {formatRange(overdueOpen)}
                </p>
                <p className="text-sm text-text-muted">
                  Cierre esperado: {new Date(overdueOpen.expectedCloseAt).toLocaleString()}
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                className="h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium transition hover:opacity-90 w-full lg:w-auto"
                onClick={() => setToClose(overdueOpen)}
              >
                Cerrar ahora
              </motion.button>
            </div>
          </motion.div>
        )}

        {openPeriod && (
          <div className="bg-background border border-border rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-text-muted">Periodo actual</p>
                <p className="text-lg font-semibold text-text">
                  {formatPeriodTitle(openPeriod)}
                </p>
                <p className="text-sm text-text-muted">
                  {formatRange(openPeriod)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <StatusBadge period={openPeriod} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium transition hover:opacity-90 w-full sm:w-auto"
                  onClick={() => setToClose(openPeriod)}
                >
                  Cerrar periodo
                </motion.button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-border rounded-2xl p-4 sm:p-6">
          <PeriodsTable
            periods={periods}
            onClose={(id) =>
              setToClose(periods.find((p) => p.id === id) ?? null)
            }
          />
        </div>

        <ConfirmModal
          open={!!toClose}
          title="Cerrar periodo"
          description={
            toClose
              ? `Se cerrará: ${formatPeriodTitle(toClose)} (${formatRange(toClose)}).`
              : ""
          }
          confirmText={closing ? "Cerrando..." : "Cerrar periodo"}
          onCancel={() => setToClose(null)}
          onConfirm={confirmClose}
        />

      </div>
    </main>
  );
}