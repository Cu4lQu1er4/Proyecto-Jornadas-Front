'use client';

import { useEffect, useState } from "react";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import { toast } from "sonner";
import AdminCasesList from "./AdminCasesList";
import CreateAdminCaseModal from "./CreateAdminCaseModal";

type Props = {
  employeeId: string;
};

export default function AdminCaseSection({ employeeId }: Props) {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  async function loadCases(currentPage = page) {
    try {
      const res = await adminCaseApi.list(employeeId, currentPage, 5);

      setCases(res.data);
      setMeta(res.meta);

    } catch {
      toast.error("Error cargando los casos administrativos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    loadCases(page);
  }, [employeeId, page]);

  return (
    <section className="flex flex-col gap-6">

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            Casos administrativos
          </h2>
          <p className="text-sm text-text-muted">
            Incapacidades, permisos y justificaciones
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium"
        >
          Crear caso
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-sm text-text-muted">
          Cargando casos administrativos...
        </div>
      ) : cases.length === 0 ? (
        <div className="py-10 text-center text-sm text-text-muted">
          No hay casos registrados
        </div>
      ) : (
        <>
          <AdminCasesList
            cases={cases}
            onReload={() => loadCases(page)}
          />

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <button
                disabled={!meta.hasPrev}
                onClick={() => setPage(p => p - 1)}
                className="h-9 px-4 rounded-xl border border-border text-sm disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="text-sm text-text-muted">
                Página {meta.page} de {meta.totalPages}
              </span>

              <button
                disabled={!meta.hasNext}
                onClick={() => setPage(p => p + 1)}
                className="h-9 px-4 rounded-xl border border-border text-sm disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <CreateAdminCaseModal
          employeeId={employeeId}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            loadCases(page);
          }}
        />
      )}

    </section>
  );
}