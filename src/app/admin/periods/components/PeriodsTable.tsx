type Period = {
  id: string;
  year: number;
  month: number;
  half: 1 | 2;
  startDate: string;
  endDate: string;
  closedAt: string | null;
  isClosed: boolean;
  isOverdue: boolean;
  daysOverdue: number;
};

export default function PeriodsTable({
  periods,
  onClose,
}: {
  periods: Period[];
  onClose: (id: string) => void;
}) {
  if (periods.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No hay periodos registrados
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      {periods.map(p => {
        const status =
          p.isClosed
            ? { label: 'Cerrado', className: 'bg-surface text-text-muted' }
            : p.isOverdue
            ? {
                label: `Vencido (${p.daysOverdue}d)`,
                className: 'bg-danger-soft text-danger',
              }
            : {
                label: 'Abierto',
                className: 'bg-success-soft text-success',
              };

        return (
          <div
            key={p.id}
            className="px-5 py-4 flex flex-col gap-2 border-b border-border last:border-b-0"
          >
            {/* Fila principal */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="font-medium">
                  {p.year} / {p.month + 1} ·{' '}
                  {p.half === 1 ? '1ra' : '2da'} quincena
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(p.startDate).toLocaleDateString()} –{' '}
                  {new Date(p.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Estado */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>

                {/* Acción */}
                {!p.isClosed && (
                  <button
                    onClick={() => onClose(p.id)}
                    className="text-primary text-xs hover:underline"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>

            {/* Info extra solo si aplica */}
            {!p.isClosed && p.isOverdue && (
              <div className="text-xs text-warning">
                ⚠️ Este periodo debía cerrarse hace {p.daysOverdue} días
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
