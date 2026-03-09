'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { employeeAdminCaseApi } from "@/lib/api/employeeAdminCase.api";
import CreateEmployeeCaseModal from "./CreateEmployeeCaseModal";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";

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
};

export default function EmployeeCasesPage() {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  async function loadCases(currentPage = page) {
    try {
      setLoading(true);
      const res = await employeeAdminCaseApi.list(currentPage, 5, statusFilter);
      setCases(res.data);
      setMeta(res.meta);
    } catch {
      toast.error("No se pudieron cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases(page);
  }, [page, statusFilter]);

  async function handleCancel(id: string) {
    try {
      await employeeAdminCaseApi.cancel(id);
      toast.success("Solicitud cancelada");
      loadCases();
    } catch {
      toast.error("No se pudo cancelar la solicitud");
    }
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <p className="text-sm text-text-muted">
          Cargando solicitudes...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-background px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        <BackButton />

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-xl font-semibold text-text">
              Mis solicitudes
            </h1>
            <p className="text-sm text-text-muted">
              Permisos, incapacidades y justificaciones
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="
              h-11 px-5 rounded-xl
              bg-primary text-white text-sm font-medium
              shadow-sm hover:opacity-90 transition
              w-full sm:w-auto
            "
          >
            + Nueva solicitud
          </motion.button>
        </motion.div>

        {/* FILTRO */}
        <div className="flex">
          <select
            value={statusFilter || ""}
            onChange={(e) => {
              const value = e.target.value || undefined;
              setStatusFilter(value);
            }}
            className="
              h-10 px-4 rounded-xl
              border border-border bg-white
              text-sm w-full sm:w-auto
              focus:outline-none focus:ring-2 focus:ring-primary
            "
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendientes</option>
            <option value="APPLIED">Aplicados</option>
            <option value="REJECTED">Rechazados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
        </div>

        {/* LISTA */}
        {cases.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-6 text-sm text-text-muted">
            No tienes solicitudes registradas
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cases.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="
                  bg-white border border-border rounded-2xl p-5
                  flex flex-col gap-4
                "
              >
                {/* TOP */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-text">
                      {c.type}
                    </span>

                    {c.notes && (
                      <p className="text-sm text-text-muted">
                        {c.notes}
                      </p>
                    )}
                  </div>

                  <StatusBadge status={c.status} />
                </div>

                {/* FECHAS */}
                <div className="text-sm text-text-muted flex flex-col gap-1">
                  {c.scopes.map((s) => (
                    <span key={s.id}>
                      {new Date(s.date).toLocaleDateString()}
                    </span>
                  ))}
                </div>

                {/* ACCION */}
                {c.status === "PENDING" && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCancel(c.id)}
                    className="
                      h-10 px-4 rounded-xl
                      bg-danger text-white text-sm font-medium
                      hover:opacity-90 transition
                      w-full sm:w-auto
                    "
                  >
                    Cancelar solicitud
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* PAGINACIÓN */}
        {meta && meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">

            <button
              disabled={!meta.hasPrev}
              onClick={() => setPage(p => p - 1)}
              className="h-9 px-4 rounded-xl border border-border text-sm disabled:opacity-40 w-full sm:w-auto"
            >
              Anterior
            </button>

            <span className="text-sm text-text-muted">
              Página {meta.page} de {meta.totalPages}
            </span>

            <button
              disabled={!meta.hasNext}
              onClick={() => setPage(p => p + 1)}
              className="h-9 px-4 rounded-xl border border-border text-sm disabled:opacity-40 w-full sm:w-auto"
            >
              Siguiente
            </button>

          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <CreateEmployeeCaseModal
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              loadCases();
            }}
          />
        )}

      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = "text-xs px-3 py-1 rounded-full font-medium";

  const color =
    status === "PENDING"
      ? "bg-warning-soft text-warning"
      : status === "APPLIED"
      ? "bg-success-soft text-success"
      : status === "REJECTED"
      ? "bg-danger-soft text-danger"
      : "bg-surface text-text-muted";

  return <span className={`${base} ${color}`}>{status}</span>;
}