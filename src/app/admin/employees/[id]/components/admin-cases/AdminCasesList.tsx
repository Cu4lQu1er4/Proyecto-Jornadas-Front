'use client';

import { useState } from "react";
import { toast } from "sonner";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import CancelCaseModal from "./CancelCaseModal";
import AttachmentViewerModal from "./AttachmentViewerModal";

type Scope = {
  id: string;
  date: string;
  startMinute: number | null;
  endMinute: number | null;
};

type AdminCase = {
  id: string;
  type: string;
  status: "PENDING" | "APPLIED" | "REJECTED" | "CANCELLED";
  notes: string | null;
  scopes: Scope[];
  attachments?: {
    id: string;
    url: string;
    resourceType: string;
    originalName?: string;
  }[];
};

const STATUS_MAP = {
  PENDING : {
    label: "Pendiente",
    className: "bg-warning-soft text-warning",
  },
  APPLIED: {
    label: "Aplicado",
    className: "bg-success-soft text-success",
  },
  REJECTED: {
    label: "Rechazado",
    className: "bg-danger-soft text-danger",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-surface text-text-muted",
  },
};

export default function AdminCasesList({
  cases,
  onReload,
}: {
  cases: AdminCase[];
  onReload: () => void;
}) {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

  async function handleApprove(id: string) {
    try {
      await adminCaseApi.approve(id);
      toast.success("Caso aprobado correctamente");
      onReload();
    } catch {
      toast.error("No se pudo aprobar el caso");
    }
  }

  async function confirmReject() {
    if (!rejectId || !rejectReason.trim()) {
      toast.warning("Debes indicar un motivo");
      return;
    }

    try {
      await adminCaseApi.reject(rejectId, rejectReason);
      toast.success("Caso rechazado correctamente");
      setRejectId(null);
      setRejectReason("");
      onReload();
    } catch {
      toast.error("No se pudo rechazar el caso");
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
        {cases.map((c) => {
          const status = STATUS_MAP[c.status];

          return (
            <div
              key={c.id}
              className="
                bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-text">
                    {c.notes}
                  </span>

                  {c.notes && (
                    <span className="text-sm text-text-muted">
                      {c.notes}
                    </span>
                  )}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-sm text-text-muted">
                {c.scopes.map((s) => (
                  <span key={s.id}>
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                ))}
              </div>

              {c.attachments && c.attachments.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-text-muted">
                    Evidencias
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {c.attachments.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          console.log("CLICK ATTACHMENT:", a);
                          console.log("URL:", a.url)
                          setSelectedAttachment(a);
                          setViewerOpen(true);
                        }}
                        className="
                          text-xs px-3 py-1 rounded-xl
                          bg-surface border border-border
                          text-text hover:bg-primary-soft hover:text-primary
                          transition"
                      >
                        {a.originalName || "Ver archivo"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {c.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleApprove(c.id)}
                      className="
                        h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium
                        transition hover:opacity-90"
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => setRejectId(c.id)}
                      className="
                        h-10 px-4 rounded-xl bg-surface border border-border text-text
                        text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {c.status === "APPLIED" && (
                  <button
                    onClick={() => setCancelId(c.id)}
                    className="
                      h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium
                      transition hover:opacity-90"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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

      {rejectId && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-background/80 z-50"
        >
          <div
            className="
              bg-white border border-border rounded-2xl p-6 w-full max-w-md flex
              flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-text">
                Rechazar el caso
              </h3>
              <p className="text-sm text-text-muted">
                Indicar el motivo del rechazo
              </p>
            </div>

            <input
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo..."
              className="
                h-11 px-4 rounded-xl border border-border bg-surface text-text
                text-sm"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setRejectId(null);
                  setRejectReason("");
                }}
                className="
                  h-10 px-4 rounded-xl bg-surface border border-border text-text
                  text-sm font-medium"
              >
                Volver
              </button>

              <button
                onClick={confirmReject}
                className="
                  h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <AttachmentViewerModal
        open={viewerOpen}
        attachment={selectedAttachment}
        onClose={() => {
          setViewerOpen(false);
          setSelectedAttachment(null);
        }}
      />
    </>
  );
}