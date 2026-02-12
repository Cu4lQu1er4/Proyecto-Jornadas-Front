'use client';

import { useEffect, useState } from "react";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import CreateAdminCaseModal from "./admin-cases/CreateAdminCaseModal";
import { toast } from "sonner";

type Scope = {
  id: string;
  date: string;
  startMinute: number | null;
  endMinute: number | null;
};

type AdminCase = {
  id: string;
  type: string;
  status: "DRAFT" | "APPLIED" | "CANCELLED";
  notes: string | null;
  scopes: Scope[];
};

export default function EmployeeAdminCases({
  employeeId,
}: {
  employeeId: string;
}) {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  async function loadCases() {
    try {
      const res = await fetch(
        `http://localhost:3001/api/admin-cases?employeeId=${employeeId}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setCases(data);
    } catch {
      toast.error("Error cargando casos administrativos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, [employeeId]);

  async function handleApply(id: string) {
    try {
      await adminCaseApi.apply(id);
      toast.success("Caso aplicado correctamente");
      loadCases();
    } catch {
      toast.error("No se pudo aplicar el caso");
    }
  }

  async function confirmCancel() {
    if (!cancelId || !cancelReason.trim()) {
      toast.warning("Debes indicar un motivo");
      return;
    }

    try {
      await adminCaseApi.cancel(cancelId, cancelReason);
      toast.success("Caso cancelado");
      setCancelId(null);
      setCancelReason("");
      loadCases();
    } catch {
      toast.error("No se pudo cancelar el caso");
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-text-muted">
        Cargando casos administrativos...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header + botón crear */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">
            Casos administrativos
          </h2>
          <p className="text-sm text-text-muted">
            Permisos, incapacidades y justificaciones
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90"
        >
          Nuevo caso
        </button>
      </div>

      {/* Lista */}
      {cases.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-6">
          <p className="text-sm text-text-muted">
            Este empleado no tiene casos administrativos
          </p>
        </div>
      ) : (
        cases.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
          >

            {/* Header card */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text">
                  {c.type}
                </span>

                {c.notes && (
                  <span className="text-sm text-text-muted">
                    {c.notes}
                  </span>
                )}
              </div>

              <span
                className={`
                  text-xs px-3 py-1 rounded-full
                  ${
                    c.status === "APPLIED"
                      ? "bg-success-soft text-success"
                      : c.status === "DRAFT"
                      ? "bg-warning-soft text-warning"
                      : "bg-danger-soft text-danger"
                  }
                `}
              >
                {c.status}
              </span>
            </div>

            {/* Fechas */}
            <div className="text-sm text-text-muted flex flex-col gap-1">
              {c.scopes.map((s) => (
                <span key={s.id}>
                  {new Date(s.date).toLocaleDateString()}
                </span>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-2">

              {c.status === "DRAFT" && (
                <button
                  onClick={() => handleApply(c.id)}
                  className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90"
                >
                  Aplicar
                </button>
              )}

              {c.status === "APPLIED" && (
                <button
                  onClick={() => setCancelId(c.id)}
                  className="h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium transition hover:opacity-90"
                >
                  Cancelar
                </button>
              )}

            </div>
          </div>
        ))
      )}

      {/* Modal Crear */}
      {showCreateModal && (
        <CreateAdminCaseModal
          employeeId={employeeId}
          onClose={() => setShowCreateModal(false)}
          onCreated={loadCases}
        />
      )}

      {/* Modal Cancelación */}
      {cancelId && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">

          <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-text">
                Cancelar caso
              </h3>
              <p className="text-sm text-text-muted">
                Indica el motivo de cancelación
              </p>
            </div>

            <input
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Motivo..."
              className="h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setCancelId(null);
                  setCancelReason("");
                }}
                className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
              >
                Volver
              </button>

              <button
                onClick={confirmCancel}
                className="h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium transition hover:opacity-90"
              >
                Confirmar
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
