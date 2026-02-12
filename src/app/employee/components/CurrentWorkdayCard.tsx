'use client';

type Props = {
  data: {
    workedMinutes: number;
    expectedMinutes: number;
    deltaMinutes: number;
    lateArrival: boolean;
    earlyLeave: boolean;
    status: string;
  } | null;
};

export default function CurrentWorkdayCard({ data }: Props) {
  if (!data) {
    return (
      <div className="bg-white border border-border rounded-2xl p-6">
        <p className="text-sm text-text-muted">
          No hay información disponible para hoy
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
  } = data;

  const workedH = Math.floor(workedMinutes / 60);
  const workedM = workedMinutes % 60;

  const expectedH = Math.floor(expectedMinutes / 60);
  const expectedM = expectedMinutes % 60;

  const deltaH = Math.floor(Math.abs(deltaMinutes) / 60);
  const deltaM = Math.abs(deltaMinutes) % 60;

  const isPositive = deltaMinutes >= 0;

  const statusMap: Record<string, string> = {
    NORMAL: "Normal",
    JUSTIFIED: "Justificado",
    PARTIALLY_UNJUSTIFIED: "Parcialmente injustificado",
    UNJUSTIFIED_ABSENCE: "Inasistencia",
    INCAPACITY: "Incapacidad",
    CONFLICT: "Conflicto",
  };

  const statusStyle =
    status === "NORMAL" || status === "JUSTIFIED"
      ? "bg-success-soft text-success"
      : status === "PARTIALLY_UNJUSTIFIED"
      ? "bg-warning-soft text-warning"
      : "bg-danger-soft text-danger";

  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">
            Jornada de hoy
          </h2>
          <p className="text-sm text-text-muted">
            Resumen del día actual
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full ${statusStyle}`}
        >
          {statusMap[status] ?? status}
        </span>
      </div>

      {/* Grid resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

        <div className="flex flex-col gap-1">
          <span className="text-text-muted">
            Trabajado
          </span>
          <span className="font-medium text-text">
            {workedH}h {workedM}m
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-text-muted">
            Esperado
          </span>
          <span className="font-medium text-text">
            {expectedH}h {expectedM}m
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-text-muted">
            Diferencia
          </span>
          <span
            className={`font-medium ${
              isPositive ? "text-success" : "text-danger"
            }`}
          >
            {isPositive ? "+" : "-"}
            {deltaH}h {deltaM}m
          </span>
        </div>

      </div>

      {/* Indicadores */}
      {(lateArrival || earlyLeave) && (
        <div className="flex flex-wrap gap-3 text-xs">

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
