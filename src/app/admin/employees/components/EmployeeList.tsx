'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CreateEmployeeModal from "./CreateEmployeeModal";

type Employee = {
  id: string;
  document: string;
  active: boolean;
  role: "EMPLOYEE" | "ADMIN";
  firstName?: string;
  lastName?: string;
  email?: string | null;
  pendingCases?: number;
};

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return employees;

    return employees.filter((e) =>
      `${e.firstName ?? ""} ${e.lastName ?? ""} ${e.document}`
        .toLowerCase()
        .includes(t)
    );
  }, [q, employees]);

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="
        flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between
      ">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm text-text-muted">
            Empleados
          </h2>
          <p className="text-sm text-text-muted">
            Total: {employees.length} · Mostrando: {filtered.length}
          </p>
        </div>

        <div className="
          flex flex-col gap-3
          sm:flex-row sm:items-center
          w-full sm:w-auto
        ">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar empleado..."
            className="
              h-11 w-full sm:w-64
              rounded-xl border border-border
              bg-background px-4
              text-sm text-text
              transition
              focus:outline-none
              focus:ring-2 focus:ring-primary
            "
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setOpen(true)}
            className="
              h-11 px-4
              rounded-xl bg-primary text-white
              text-sm font-medium
              transition hover:opacity-90
            "
          >
            Nuevo empleado
          </motion.button>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">

        {filtered.map((e) => {
          const fullName = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim();

          return (
            <motion.button
              key={e.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => router.push(`/admin/employees/${e.id}`)}
              className="
                w-full text-left
                px-4 sm:px-6 py-4
                border-b border-border last:border-b-0
                transition hover:bg-surface
              "
            >
              <div className="
                flex flex-col gap-3
                sm:flex-row sm:items-center sm:justify-between
              ">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text">
                      {fullName || e.document}
                    </p>

                    {e.pendingCases && e.pendingCases > 0 && (
                      <span
                        className="
                          flex items-center justify-center min-w-[20px]
                          h-5 px-1 text-[10px] font-bold bg-danger
                          text-white rounded-full"
                      >
                        {e.pendingCases}
                      </span>
                    )}
                  </div>

                  <div className="
                    flex flex-wrap items-center
                    gap-2 sm:gap-3
                    text-xs sm:text-sm text-text-muted
                  ">
                    <span>{e.document}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      {e.role === "ADMIN" ? "Administrador" : "Empleado"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        e.active
                          ? "bg-success-soft text-success"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      {e.active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                <span className="
                  text-xs sm:text-sm
                  text-text-muted
                  self-start sm:self-auto
                ">
                  Ver →
                </span>
              </div>
            </motion.button>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-text-muted">
            No hay resultados
          </div>
        )}

      </div>

      {open && (
        <CreateEmployeeModal
          onClose={() => setOpen(false)}
          onCreated={() => window.location.reload()}
        />
      )}
    </div>
  );
}