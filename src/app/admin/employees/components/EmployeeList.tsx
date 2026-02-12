'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Employee = {
  id: string;
  document: string;
  active: boolean;
  role: "EMPLOYEE" | "ADMIN";
};

export default function EmployeeList({ employees }: { employees: Employee[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return employees;
    return employees.filter((e) => e.document.toLowerCase().includes(t));
  }, [q, employees]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">
          Empleados
        </h1>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por documento..."
          className="
            h-10 w-64 rounded-xl border border-border
            px-4 text-sm
            outline-none
            focus:ring-2 focus:ring-primary/30
          "
        />
      </div>

      <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">

        {filtered.map((e) => (
          <button
            key={e.id}
            onClick={() => router.push(`/admin/employees/${e.id}`)}
            className="
              w-full text-left px-6 py-4
              transition
              hover:bg-surface
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-text">
                  {e.document}
                </p>

                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <span>
                    {e.role === "ADMIN" ? "Administrador" : "Empleado"}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${e.active
                        ? "bg-success-soft text-success"
                        : "bg-danger-soft text-danger"}
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
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted text-sm">
            No hay resultados
          </div>
        )}
      </div>
    </div>
  );
}