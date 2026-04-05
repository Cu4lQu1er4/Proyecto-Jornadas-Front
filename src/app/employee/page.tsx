'use client';

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import PeriodFilter from "./components/PeriodFilter";
import HistoryList from "./components/HistoryList";
import CurrentWorkdayCard from "./components/CurrentWorkdayCard";
import Link from "next/link";
import { FileText } from "lucide-react";

type Period = {
  id: string;
  startDate: string;
  endDate: string;
  year: number;
  month: number;
  half: 1 | 2;
  closedAt: string | null;
};

export default function EmployeePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [workedTime, setWorkedTime] = useState("0h 0m");
  const [currentPeriodLabel, setCurrentPeriodLabel] = useState("-");

  const handlePeriodChange = useCallback((period: Period) => {
    setSelectedPeriod(period);
  }, []);

  const handleTotalMinutes = useCallback((minutes: number) => {
    setWorkedTime(minutesToHours(minutes));
  }, []);

  function minutesToHours(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  function formatPeriodLabel(start: string, end: string) {
    const formatter = new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
    });

    return `${formatter.format(new Date(start))} - ${formatter.format(
      new Date(end)
    )}`;
  }

  useEffect(() => {
    if (!selectedPeriod) return;

    setCurrentPeriodLabel(
      formatPeriodLabel(selectedPeriod.startDate, selectedPeriod.endDate)
    );
  }, [selectedPeriod]);

  return (
    <main className="min-h-[100dvh] bg-background px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* CURRENT WORKDAY */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CurrentWorkdayCard />
        </motion.div>

        {/* RESUMEN GRID */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Horas trabajadas */}
          <SummaryCard
            label="Horas trabajadas"
            value={workedTime}
          />

          {/* Periodo actual */}
          <SummaryCard
            label="Periodo actual"
            value={currentPeriodLabel}
          />

          {/* Solicitudes */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <Link
              href="/employee/admin-cases"
              className="
                relative
                bg-primary-soft border border-primary/30
                rounded-2xl p-6
                flex flex-col gap-4
                hover:shadow-md hover:border-primary
                transition
              "
            >
              {/* ICONO + TÍTULO */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-3 rounded-xl">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-primary font-medium">
                      Gestionar
                    </span>

                    <span className="text-lg font-semibold text-text">
                      Solicitudes administrativas
                    </span>
                  </div>
                </div>

                <span className="text-primary text-lg font-semibold">
                  →
                </span>
              </div>

              <span className="text-xs text-text-muted">
                Permisos, incapacidades y justificaciones
              </span>

            </Link>
          </motion.div>
        </motion.section>

        {/* HISTORIAL */}
        <section className="bg-surface border border-border rounded-2xl p-4 sm:p-6 flex flex-col gap-6">

          <div>
            <h2 className="text-lg font-semibold text-text">
              Historial de asistencia
            </h2>
            <p className="text-sm text-text-muted">
              Consulta detallada por periodo
            </p>
          </div>

          <PeriodFilter onChange={handlePeriodChange} />

          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            <HistoryList
              periodId={selectedPeriod?.id ?? null}
              onTotalMinutes={handleTotalMinutes}
            />
          </div>

        </section>

      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
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

      <span className="text-xl font-semibold text-text">
        {value}
      </span>
    </motion.div>
  );
}