'use client';

import { useState, useEffect } from "react";
import EmployeePeriods from "./EmployeePeriods";
import EmployeeDayLookup from "./EmployeeDayLookup";
import EmployeePeriodSummary from "../[id]/components/EmployeePeriodSummary";
import AdminCaseSection from "../[id]/components/admin-cases/AdminCasesSection";
import { employeeScheduleApi } from "@/lib/api/employeeSchedule";
import { employeeApi } from "@/lib/api/employee.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { userAdminApi } from "@/lib/api/user.api";

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
  const [schedule, setSchedule] = useState<any>(null);
  const router = useRouter();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [tempPin, setTempPin] = useState<string | null>(null);


  async function handleToggleActive() {
    try {
      await employeeApi.toggleActive(employee.id, !employee.active);

      toast.success(
        employee.active
          ? "Usuario desactivado correctamente"
          : "Usuario activado correctamente"
      );

      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el usuario");
    }
  }

  async function handleResetPassword() {
    try {

      const res = await userAdminApi.resetPassword(employee.id);

      setTempPassword(res.temporaryPassword);
      
    } catch (error: any) {
      toast.error(error?.message || "No se pudo resetear la contraseña");
    }
  }

  async function handleResetPin() {
    try {
      
      const res = await userAdminApi.resetPin(employee.id);

      setTempPin(res.temporaryPin);

    } catch (error: any) {
      toast.error(error?.message || "No se pudo resetear el PIN");
    }
  }


  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await employeeScheduleApi.current(employee.id);
        setSchedule(data);
      } catch {
        setSchedule(null);
      }
    }

    loadSchedule();
  }, [employee.id]);

  return (
    <div className="flex flex-col gap-8">

      <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

        {/* Top row */}
        <div className="flex items-start justify-between">

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold text-text">
              {`${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim() || employee.document}
            </h1>

            <span className="text-sm text-text-muted">
              Documento: {employee.document}
            </span>

            <div className="flex items-center gap-3 text-sm text-text-muted flex-wrap">
              <span>
                {employee.role === "ADMIN" ? "Administrador" : "Empleado"}
              </span>

              {employee.email && <span>Email: {employee.email}</span>}
              {employee.phone && <span>Teléfono: {employee.phone}</span>}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
                ${employee.active
                  ? "bg-success-soft text-success"
                  : "bg-danger-soft text-danger"}
              `}
            >
              {employee.active ? "Activo" : "Inactivo"}
            </span>

            <span className="text-xs text-text-muted">
              Creado el {new Date(employee.createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>

        {/* Admin Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">

          <button
            onClick={handleToggleActive}
            className={`h-10 px-4 rounded-xl border text-sm font-medium transition
              ${employee.active
                ? "bg-danger-soft text-danger border-danger-soft hover:opacity-80"
                : "bg-success-soft text-success border-success-soft hover:opacity-80"
              }
            `}
          >
            {employee.active ? "Desactivar usuario" : "Activar usuario"}
          </button>

          <button
            onClick={handleResetPassword}
            className="h-10 px-4 rounded-xl bg-warning-soft text-warning border border-warning-soft text-sm font-medium hover:opacity-80 transition"
          >
            Resetear contraseña
          </button>

          <button
            onClick={handleResetPin}
            className="h-10 px-4 rounded-xl bg-primary-soft text-primary border border-primary-soft text-sm font-medium hover:opacity-80 transition"
          >
            Resetear PIN
          </button>

        </div>

      </section>


      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            Horario asignado
          </h2>
          <p className="text-sm text-text-muted">
            Configuración actual del empleado
          </p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6">
          {!schedule && (
            <p className="text-sm text-text-muted">
              No tiene horario asignado
            </p>
          )}

          {schedule && (
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="text-text-muted">Plantilla</span>
                <p className="font-medium">
                  {schedule.template.name}
                </p>
              </div>

              <div>
                <span className="text-text-muted">Desde</span>
                <p>
                  {new Date(schedule.effectiveFrom).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {schedule.template.days.map((d: any) => (
                  <div
                    key={d.id}
                    className="flex justify-between border-b border-border pb-2 last:border-b-0"
                  >
                    <span>
                      {["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][d.weekday]}
                    </span>
                    <span>
                      {Math.floor(d.startMinute / 60)}:{String(d.startMinute % 60).padStart(2,"0")}
                      {" - "}
                      {Math.floor(d.endMinute / 60)}:{String(d.endMinute % 60).padStart(2,"0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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

      {tempPassword && (
        <div className="fixed top-6 right-6 z-50 w-full max-w-sm">

          <div className="bg-white border border-warning rounded-2xl shadow-xl p-5 flex flex-col gap-4">

            <div>
              <h3 className="text-sm font-semibold text-warning">
                Contraseña temporal generada
              </h3>
              <p className="text-xs text-text-muted">
                El empleado deberá cambiarla al iniciar sesión.
              </p>
            </div>

            <div className="flex items-center justify-between bg-warning-soft border border-warning rounded-xl px-4 py-3">
              <span className="font-mono text-sm break-all">
                {tempPassword}
              </span>

              <button
                onClick={() => navigator.clipboard.writeText(tempPassword)}
                className="text-primary text-xs font-medium hover:underline"
              >
                Copiar
              </button>
            </div>

            <button
              onClick={() => setTempPassword(null)}
              className="
                text-xs text-text-muted bg-background p-2 border border-border 
                rounded-2xl self-end "
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

      {tempPin && (
        <div className="fixed top-6 right-6 z-50 w-full max-w-sm">

          <div className="bg-white border border-primary rounded-2xl shadow-xl p-5 flex flex-col gap-4">

            <div>
              <h3 className="text-sm font-semibold text-primary">
                PIN temporal generado
              </h3>
              <p className="text-xs text-text-muted">
                El empleado deberá cambiarlo al iniciar sesión.
              </p>
            </div>

            <div className="flex items-center justify-between bg-primary-soft border border-primary rounded-xl px-4 py-3">
              <span className="font-mono text-sm">
                {tempPin}
              </span>

              <button
                onClick={() => navigator.clipboard.writeText(tempPin)}
                className="text-primary text-xs font-medium hover:underline"
              >
                Copiar
              </button>
            </div>

            <button
              onClick={() => setTempPin(null)}
              className="
                text-xs text-text-muted bg-background p-2 border border-border 
                rounded-2xl self-end
              "
            >
              Cerrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
