const STATUS_CONFIG: Record<
  string,
  { label: string; dot: string; bg: string }
> = {
  PENDING: {
    label: "Pendiente",
    dot: "bg-yellow-500",
    bg: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  CLASSIFIED: {
    label: "Derivado",
    dot: "bg-blue-500",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  IN_REVIEW: {
    label: "En revisión",
    dot: "bg-purple-500",
    bg: "bg-purple-50 text-purple-700 border-purple-200",
  },
  RESOLVED: {
    label: "Resuelto",
    dot: "bg-green-500",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rechazado",
    dot: "bg-red-500",
    bg: "bg-red-50 text-red-700 border-red-200",
  },
};

export function TramiteStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    dot: "bg-gray-500",
    bg: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${config.bg}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
