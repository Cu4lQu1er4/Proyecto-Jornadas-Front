'use client';

import { useState } from "react";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import { toast } from "sonner";

export default function CancelCaseModal({
  caseId,
  onClose,
  onSuccess,
}: {
  caseId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!reason.trim()) {
      toast.warning("Debes indicar un motivo");
      return;
    }

    try {
      setLoading(true);

      await adminCaseApi.cancel(caseId, reason);

      console.log("Caso cancelado correctamente");

      onSuccess();
      onClose();

    } catch {
      toast.error("No se pudo cancelar el caso");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">

      <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-text">
            Cancelar caso
          </h3>
          <p className="text-sm text-text-muted">
            Indica el motivo de cancelación
          </p>
        </div>

        {/* Input */}
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo..."
          className="h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Cancelando..." : "Confirmar"}
          </button>

        </div>

      </div>
    </div>
  );
}