'use client';

import { useState } from "react";
import EmployeePeriods from "./EmployeePeriods";
import EmployeeDayLookup from "./EmployeeDayLookup";
import EmployeePeriodSummary from "../[id]/components/EmployeePeriodSummary";
import AdminCaseSection from "../[id]/components/admin-cases/AdminCasesSection";

type Employee = {
  id: string;
  document: string;
  active: boolean;
  role: "EMPLOYEE" | "ADMIN";
  createdAt: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
};

export default function EmployeeDetail({
  employee,
}: {
  employee: Employee;
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">

      <section className="bg-white border border-border rounded-2xl p-6 flex items-start justify-between">

        <div className="flex flex-col gap-3">

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-text">
              {`${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim() || employee.document}
            </h1>

            <span className="text-sm text-text-muted">
              Documento: {employee.document}
            </span>
          </div>

          {/* Información secundaria */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">

            <span>
              {employee.role === "ADMIN" ? "Administrador" : "Empleado"}
            </span>

            {employee.email && (
              <span>Email: {employee.email}</span>
            )}

            {employee.phone && (
              <span>Telefono: {employee.phone}</span>
            )}

            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium
                ${employee.active
                  ? "bg-success-soft text-success"
                  : "bg-danger-soft text-danger"}
              `}
            >
              {employee.active ? "Activo" : "Inactivo"}
            </span>

          </div>

        </div>

        <span className="text-xs text-text-muted">
          Creado el {new Date(employee.createdAt).toLocaleDateString()}
        </span>

      </section>



      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            Periodos
          </h2>
          <p className="text-sm text-text-muted">
            Resumen por periodo
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6">
          <EmployeePeriods
            employeeId={employee.id}
            onSelectPeriod={setSelectedPeriod}
          />
        </div>
      </section>


      {selectedPeriod && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">
              Resumen del período
            </h2>
            <p className="text-sm text-text-muted">
              Detalle completo de asistencia del período seleccionado
            </p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-6">
            <EmployeePeriodSummary
              employeeId={employee.id}
              periodId={selectedPeriod}
            />
          </div>
        </section>
      )}


      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            Consulta por día
          </h2>
          <p className="text-sm text-text-muted">
            Buscar jornada específica
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6">
          <EmployeeDayLookup employeeId={employee.id} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <AdminCaseSection employeeId={employee.id} />
      </section>

    </div>
  );
}
