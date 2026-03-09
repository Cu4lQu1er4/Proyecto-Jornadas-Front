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
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      {periods.map((p) => {
        const status = p.isClosed
          ? {
              label: "Cerrado",
              className: "bg-primary-soft text-primary",
            }
          : p.isOverdue
          ? {
              label: `Vencido · ${p.daysOverdue} dias(s)`,
              className: "bg-danger-soft text-danger",
            }
          : {
              label: "Abierto",
              className: "bg-success-soft text-success",
            };
        
        return (
          <div
            key={p.id}
            className="flex flex-col gap-3 p-6 border border-border last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text">
                  {p.year} / {p.month} · {" "}
                  {p.half === 1 ? "1ra" : "2da"} quincena
                </span>

                <span className="text-sm text-text-muted">
                  {new Date(p.startDate).toLocaleDateString()} -{""}
                  {new Date(p.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
                >
                  {status.label}
                </span>

                {!p.isClosed && (
                  <button
                    onClick={() => onClose(p.id)}
                    className="
                      h-9 px-4 rounded-xl bg-danger text-white text-sm font-medium
                      transition hover:opacity-90"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            </div>

            {!p.isClosed && p.isOverdue && (
              <div className="text-sm bg-warning-soft text-warning rounded-xl px-4 py-2">
                Este periodo debia cerrarse hace {p.daysOverdue} dia(s).
              </div>
            )}
          </div>  
        );
      })}
    </div>
  );
}