'use client';

import { useEffect, useState } from "react";
import PeriodsTable from "./components/PeriodsTable";
import ConfirmModal from "./components/ConfirmModal";
import { toast } from 'sonner';

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

export default function AdminPeriodPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [toClose, setToClose] = useState<Period | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    async function loadPeriods() {
      try {
        const res = await fetch(
          'http://localhost:3001/api/work/periods?page=1&limit=10',
          { credentials: 'include' }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setPeriods(data.items ?? []);
      } catch {
        toast.error('No se pudieron cargar los periodos');
        setPeriods([]);
      } finally {
        setLoading(false);
      }
    }

    loadPeriods();
  }, []);

  useEffect(() => {
    const overdue = periods.find(p => p.isOverdue && !p.closedAt);
    if (overdue) {
      toast.warning('Hay periodos vencidos por cerrar');
    }
  }, [periods]);

  async function confirmClose() {
    if (!toClose) return;

    setClosing(true);

    try {
      const res = await fetch(
        `http://localhost:3001/api/work/periods/${toClose.id}/close`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );

      if (!res.ok) throw new Error();

      setPeriods(prev =>
        prev.map(p =>
          p.id === toClose.id
            ? { ...p, closedAt: new Date().toISOString() }
            : p
        )
      );

      toast.success('Periodo cerrado correctamente');
    } catch {
      toast.error('No se pudo cerrar el periodo');
    } finally {
      setClosing(false);
      setToClose(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Cargando periodos...</p>;
  }

  return (
    <div className="flex flex-col gap-4 bg-surface border border-border p-6 rounded-2xl">
      <h1 className="text-h2">Periodos</h1>

      <PeriodsTable 
        periods={periods}
        onClose={(id) =>
          setToClose(periods.find(p => p.id === id) ?? null)
        }
      />

      <ConfirmModal 
        open={!!toClose}
        title="Cerrar periodo"
        description="Una vez cerrado, no se podran modificar las jornadas de esta periodo."
        confirmText={closing ? 'Cerrando...' : 'Cerrar periodo'}
        onCancel={() => setToClose(null)}
        onConfirm={confirmClose}
      />
    </div>
  );
}