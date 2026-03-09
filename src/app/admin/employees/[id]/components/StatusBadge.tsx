type Status =
  | "NORMAL"
  | "JUSTIFIED"
  | "PARTIALLY_UNJUSTIFIED"
  | "UNJUSTIFIED_ABSENCE"
  | "INCAPACITY"
  | "CONFLICT"
  | "NON_OPERATIONAL_DAY";

export default function StatusBadge({
  status,
}: {
  status: Status;
}) {
  const styleMap: Record<Status, string> = {
    NORMAL: "bg-success-soft text-success",
    JUSTIFIED: "bg-success-soft text-success",
    PARTIALLY_UNJUSTIFIED: "bg-warning-soft text-warning",
    UNJUSTIFIED_ABSENCE: "bg-danger-soft text-danger",
    INCAPACITY: "bg-primary-soft text-primary",
    CONFLICT: "bg-danger-soft text-danger font-semibold",
    NON_OPERATIONAL_DAY: "bg-surface text-text-muted",
  };

  const labelMap: Record<Status, string> = {
    NORMAL: "Correcto",
    JUSTIFIED: "Justificado",
    PARTIALLY_UNJUSTIFIED: "Parcialmente injustificado",
    UNJUSTIFIED_ABSENCE: "Inasistencia injustificada",
    INCAPACITY: "Incapacidad",
    CONFLICT: "Conflicto",
    NON_OPERATIONAL_DAY: "No operativo"
  };

  return (
    <span
      className={`
        px-2.5 py-1
        rounded-full
        text-xs font-medium
        ${styleMap[status] ?? "bg-surface text-text-muted"}
      `}
    >
      {labelMap[status] ?? status}
    </span>
  );
}