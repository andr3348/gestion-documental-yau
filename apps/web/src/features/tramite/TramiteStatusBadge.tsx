const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800" },
  CLASSIFIED: { label: "Derivado", className: "bg-blue-100 text-blue-800" },
  IN_REVIEW: {
    label: "En revisión",
    className: "bg-purple-100 text-purple-800",
  },
  RESOLVED: { label: "Resuelto", className: "bg-green-100 text-green-800" },
  REJECTED: { label: "Rechazado", className: "bg-red-100 text-red-800" },
};

export function TramiteStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
}
