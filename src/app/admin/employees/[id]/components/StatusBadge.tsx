export default function StatusBadge({
  status,
}: {
  status: Status;
}) {
  const map: Record<Status, string> = {
    NORMAL: "bg-success-soft text-success",
    JUSTIFIED: "bg-primary-soft text-primary",
    PARTIALLY_UNJUSTIFIED: "bg-warning-soft text-warning",
    UNJUSTIFIED_ABSENCE: "bg-danger-soft text-danger",
    INCAPACITY: "bg-surface text-text-muted",
    CONFLICT: "bg-danger-soft text-danger font-semibold",
  };

  const labelMap: Record<Status, string> = {
    NORMAL: "Normal",
    JUSTIFIED: "Justificado",
    PARTIALLY_UNJUSTIFIED: "Parcial",
    UNJUSTIFIED_ABSENCE: "Inasistencia",
    INCAPACITY: "Incapacidad",
    CONFLICT: "Conflicto",
  };

  return (
    <span
      className={`
        px-2.5 py-1
        rounded-full
        text-xs font-medium
        ${map[status] ?? "bg-surface text-text-muted"}
      `}
    >
      {labelMap[status] ?? status}
    </span>
  );
}