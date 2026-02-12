'use client';

import { useEffect, useState, useCallback } from "react";
import EmployeeLayoutShell from "./components/EmployeeLayoutShell";
import EmployeeHeader from "./components/EmployeeHeader";
import PeriodFilter from "./components/PeriodFilter";
import HistoryList from "./components/HistoryList";
import CurrentWorkdayCard from "./components/CurrentWorkdayCard";

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
  const [isClosed, setIsClosed] = useState(false);

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
    <EmployeeLayoutShell header={<EmployeeHeader />}>

      <div className="flex flex-col gap-6">

        <CurrentWorkdayCard />

        {/* === RESUMEN SUPERIOR === */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2">
            <span className="text-sm text-text-muted">
              Horas trabajadas
            </span>

            <span className="text-lg font-semibold text-text">
              {workedTime}
            </span>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-2">
            <span className="text-sm text-text-muted">
              Periodo actual
            </span>

            <span className="text-lg font-semibold text-text">
              {currentPeriodLabel}
            </span>
          </div>

        </section>


        {/* === HISTORIAL === */}
        <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text">
              Historial de asistencia
            </h2>
            <p className="text-sm text-text-muted">
              Consulta detallada por periodo
            </p>
          </div>

          <PeriodFilter onChange={handlePeriodChange} />

          <div className="flex-1 overflow-y-auto">
            <HistoryList
              period={selectedPeriod}
              onTotalMinutes={handleTotalMinutes}
            />
          </div>

        </section>

      </div>

    </EmployeeLayoutShell>
  );
}