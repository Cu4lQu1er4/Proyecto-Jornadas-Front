'use client';

import { useState } from "react";
import { toast } from "sonner";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import CancelCaseModal from "./CancelCaseModal";

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

export default function AdminCasesList({
  cases,
  onReload,
}: {
  cases: AdminCase[];
  onReload: () => void;
}) {
  const [cancelId, setCancelId] = useState<string | null>(null);

  async function handleApply(id: string) {
    try {
      await adminCaseApi.apply(id);
      toast.success("Caso aplicado correctamente");
      onReload();
    } catch {
      toast.error("No se pudo aplicar el caso");
    }
  }

  if (cases.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No hay casos administrativos
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">

        {cases.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
          >

            {/* Header */}
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

            {/* Scopes */}
            <div className="text-sm text-text-muted flex flex-col gap-1">
              {c.scopes.map((s) => (
                <span key={s.id}>
                  {new Date(s.date).toLocaleDateString()}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">

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
        ))}

      </div>

      {/* Modal */}
      {cancelId && (
        <CancelCaseModal
          caseId={cancelId}
          onClose={() => setCancelId(null)}
          onSuccess={() => {
            setCancelId(null);
            onReload();
            toast.success("Caso cancelado correctamente");
          }}
        />
      )}
    </>
  );
}
