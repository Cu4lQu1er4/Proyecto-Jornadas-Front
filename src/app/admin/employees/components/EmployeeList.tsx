'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Employee = {
  id: string;
  document: string;
  active: boolean;
  role: "EMPLOYEE" | "ADMIN";
  firstName?: string;
  lastName?: string;
  email?: string | null;
};

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

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

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-text">
          Empleados
        </h1>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar empleado..."
          className="h-10 w-64 rounded-xl border border-border bg-background px-4 text-sm text-text outline-none"
        />
      </div>

      {/* List */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">

        {filtered.map((e) => {
          const fullName = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim();

          return (
            <button
              key={e.id}
              onClick={() => router.push(`/admin/employees/${e.id}`)}
              className="w-full text-left px-6 py-4 border-b border-border last:border-b-0 transition hover:bg-surface"
            >
              <div className="flex items-center justify-between">

                <div className="flex flex-col gap-1">

                  {/* Nombre */}
                  <p className="text-sm font-medium text-text">
                    {fullName || e.document}
                  </p>

                  {/* Subinfo */}
                  <div className="flex items-center gap-3 text-sm text-text-muted">

                    <span>{e.document}</span>

                    <span>
                      {e.role === "ADMIN" ? "Administrador" : "Empleado"}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${e.active
                          ? "bg-success-soft text-success"
                          : "bg-danger-soft text-danger"
                        }
                      `}
                    >
                      {e.active ? "Activo" : "Inactivo"}
                    </span>

                  </div>
                </div>

                <span className="text-sm text-text-muted">
                  Ver →
                </span>

              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-text-muted">
            No hay resultados
          </div>
        )}

      </div>
    </div>
  );
}