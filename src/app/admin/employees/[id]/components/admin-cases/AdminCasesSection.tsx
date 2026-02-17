'use client';

import { useEffect, useState } from "react";
import { adminCaseApi } from "@/lib/api/adminCase.api";
import { toast } from "sonner";
import AdminCasesList from "./AdminCasesList";
import CreateAdminCaseModal from "./CreateAdminCaseModal";

type Props = {
  employee: string;
};

export default function AdminCaseSection({ employeeId }: Props) {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  async function loadCases() {
    try {
      const data = await adminCaseApi.list(employeeId);
      setCases(data);
    } catch {
      toast.error("Error cargando los casos administrativos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, [employeeId]);

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
          className="
            h-10 px-4
            rounded-xl
            bg-primary text-white
            text-sm font-medium
            transition
            hover:opacity-90
          "
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
          <AdminCasesList
            cases={cases}
            onReload={loadCases}
          />
        )}

      {showModal && (
        <CreateAdminCaseModal
          employeeId={employeeId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadCases();
            toast.success("Caso creado correctamente");
          }}
        />
      )}

    </section>
  );

}