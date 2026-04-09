'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmployeePeriods from "./EmployeePeriods";
import EmployeeDayLookup from "./EmployeeDayLookup";
import EmployeePeriodSummary from "../[id]/components/EmployeePeriodSummary";
import AdminCaseSection from "../[id]/components/admin-cases/AdminCasesSection";
import { employeeScheduleApi } from "@/lib/api/employeeSchedule";
import { employeeApi } from "@/lib/api/employee.api";
import { userAdminApi } from "@/lib/api/user.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { scheduleApi } from "@/lib/api/schedule.api";

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

type TabType = "schedule" | "periods" | "lookup" | "cases";

export default function EmployeeDetail({ employee }: { employee: Employee }) {
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [tempPin, setTempPin] = useState<string | null>(null);
  const [tab, setTab] = useState<TabType>("schedule");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      const res: any = await userAdminApi.resetPassword(employee.id);
      setTempPassword(res.temporaryPassword);
    } catch (error: any) {
      toast.error(error?.message || "No se pudo resetear la contraseña");
    }
  }

  async function handleResetPin() {
    try {
      const res: any = await userAdminApi.resetPin(employee.id);
      setTempPin(res.temporaryPin);
    } catch (error: any) {
      toast.error(error?.message || "No se pudo resetear el PIN");
    }
  }

  async function handleAssign(templateId: string) {
    try {
      setAssignLoading(true);

      await employeeScheduleApi.assign(
        employee.id,
        templateId
      );
      
      await loadSchedule();

      const updated = await employeeScheduleApi.current(employee.id);
      setSchedule(updated);
      toast.success("Horario asignado");

      setAssignOpen(false);
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.message ||
        "No se pudo asignar el horario"
      );
    } finally {
      setAssignLoading(false);
    }
  }
   
  async function loadSchedule() {
    try {
      const data = await employeeScheduleApi.current(employee.id);
      setSchedule(data);
    } catch {
      setSchedule(null);
    }
  }

  async function handleDeleteUser() {
    try {
      setDeleteLoading(true);

      await userAdminApi.deleteUser(employee.id);

      toast.success("Usuario eliminado correctamente");

      router.push("/admin/employees");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo eliminar el usuario");
    }
  }
  
  useEffect(() => {
    loadSchedule();
  }, [employee.id]);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data: any = await scheduleApi.list();
        setTemplates(data);
      } catch {
        setTemplates([]);
      }
    }

    loadTemplates();
  }, [])

  function Section({
    title,
    description,
    children,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-text-muted">{description}</p>
          )}
        </div>

        {children}
      </div>
    );
  }

  const tabs = [
    { id: "schedule", label: "Horario" },
    { id: "periods", label: "Períodos" },
    { id: "lookup", label: "Día" },
    { id: "cases", label: "Casos" },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* IDENTIDAD */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-border rounded-2xl p-4 sm:p-6 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-xl font-semibold">
                {`${employee.firstName ?? ""} ${employee.lastName ?? ""}`.trim() || employee.document}
              </h1>
              <p className="text-sm text-text-muted">
                Documento: {employee.document}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-text-muted">
              <span className="px-3 py-1 rounded-full bg-primary-soft text-primary font-medium">
                {employee.role === "ADMIN" ? "Administrador" : "Empleado"}
              </span>
              {employee.email && <span>{employee.email}</span>}
              {employee.phone && <span>{employee.phone}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:items-end">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                employee.active
                  ? "bg-success-soft text-success"
                  : "bg-danger-soft text-danger"
              }`}
            >
              {employee.active ? "Activo" : "Inactivo"}
            </span>

            <span className="text-sm text-text-muted">
              Creado el {new Date(employee.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex flex-wrap gap-3 border-t border-border pt-4">
          <button
            onClick={handleToggleActive}
            className={`h-10 px-4 rounded-xl text-sm font-medium transition hover:opacity-90 ${
              employee.active ? "bg-danger text-white" : "bg-primary text-white"
            }`}
          >
            {employee.active ? "Desactivar usuario" : "Activar usuario"}
          </button>

          <button
            onClick={handleResetPassword}
            className="h-10 px-4 rounded-xl bg-surface border border-border text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
          >
            Resetear contraseña
          </button>

          <button
            onClick={handleResetPin}
            className="h-10 px-4 rounded-xl bg-surface border border-border text-sm font-medium hover:bg-danger-soft hover:text-danger transition"
          >
            Resetear PIN
          </button>

          {employee.role !== "ADMIN" && (
            <button
              onClick={() => setDeleteOpen(true)}
              className="
                h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium hover:opacity-90"
            >
              Eliminar usuario
            </button>
          )}
        </div>
      </motion.section>

      {/* MOBILE TABS */}
      <div className="lg:hidden overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TabType)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                tab === t.id
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE CONTENT */}
      <div className="lg:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "schedule" && (
              <Section title="Horario asignado">
                {!schedule && (
                  <div className="flex flex-col gap-3">
                    <p>No tiene horario asignado</p>

                    <button
                      onClick={() => setAssignOpen(true)}
                      className="h-9 px-4 rounded-lg bg-primary text-white text-sm w-fit"
                    >
                      Asignar horario
                    </button>
                  </div>
                )}
                {schedule && (
                  <div className="flex flex-col gap-4">
                    <ScheduleContent schedule={schedule} />

                    <button
                      onClick={() => setAssignOpen(true)}
                      className="h-9 px-4 rounded-lg border border-border text-sm w-fit"
                    >
                      Cambiar horario
                    </button>
                  </div>
                )}
              </Section>
            )}

            {tab === "periods" && (
              <Section title="Períodos">
                <EmployeePeriods
                  employeeId={employee.id}
                  onSelectPeriod={setSelectedPeriod}
                />
                {selectedPeriod && (
                  <EmployeePeriodSummary
                    employeeId={employee.id}
                    periodId={selectedPeriod}
                  />
                )}
              </Section>
            )}

            {tab === "lookup" && (
              <Section title="Consulta por día">
                <EmployeeDayLookup employeeId={employee.id} />
              </Section>
            )}

            {tab === "cases" && (
              <Section title="Casos administrativos">
                <AdminCaseSection employeeId={employee.id} />
              </Section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DESKTOP CONTENT */}
      <div className="hidden lg:flex lg:flex-col lg:gap-8">
        <Section title="Horario asignado">
          {!schedule && <p>No tiene horario asignado</p>}
          {schedule && <ScheduleContent schedule={schedule} />}

          <button
            onClick={() => setAssignOpen(true)}
            className="h-9 px-4 rounded-lg border border-border text-sm w-fit"
          >
            Cambiar horario
          </button>
        </Section>

        <Section title="Períodos">
          <EmployeePeriods
            employeeId={employee.id}
            onSelectPeriod={setSelectedPeriod}
          />
          {selectedPeriod && (
            <EmployeePeriodSummary
              employeeId={employee.id}
              periodId={selectedPeriod}
            />
          )}
        </Section>

        <Section title="Consulta por día">
          <EmployeeDayLookup employeeId={employee.id} />
        </Section>

        <Section title="Casos administrativos">
          <AdminCaseSection employeeId={employee.id} />
        </Section>
      </div>

      <SecurityModal
        value={tempPassword}
        onClose={() => setTempPassword(null)}
        title="Contraseña temporal generada"
      />

      <SecurityModal
        value={tempPin}
        onClose={() => setTempPin(null)}
        title="PIN temporal generado"
      />

      {assignOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-4"
            >

              <h3 className="text-lg font-semibold">
                Asignar horario
              </h3>

              <div className="flex flex-col gap-2">

                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleAssign(t.id)}
                    disabled={assignLoading}
                    className="border border-border rounded-lg p-3 text-left hover:bg-surface"
                  >
                    <p className="font-medium">{t.name}</p>

                    <div className="text-xs text-text-muted">
                      {t.days.map((d:any)=>(
                        <span key={d.id}>
                          {["Dom","Lun","Mar","Mié","Jue","Vie","Sab"][d.weekday]}{" "}
                        </span>
                      ))}
                    </div>

                  </button>
                ))}

              </div>

              <button
                onClick={() => setAssignOpen(false)}
                className="h-9 px-4 rounded-lg border border-border text-sm"
              >
                Cancelar
              </button>

            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {deleteOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="
                bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-danger">
                  Eliminar usuario
                </h3>

                <p className="text-sm text-text-muted">
                  Esta accion eliminara permanentemente al usuario.
                </p>
                
                <p className="text-sm font-medium text-danger">
                  Esta accion NO se puede deshacer
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="h-10 px-4 rounded-xl border border-border text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleDeleteUser}
                  className="h-10 px-4 rounded-xl bg-danger text-white text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function ScheduleContent({ schedule }: any) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <span className="text-text-muted">Plantilla</span>
        <p className="font-medium">{schedule.template.name}</p>
      </div>

      <div>
        <span className="text-text-muted">Desde</span>
        <p>{new Date(schedule.effectiveFrom).toLocaleDateString()}</p>
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
  );
}

function SecurityModal({
  value,
  onClose,
  title,
}: {
  value: string | null;
  onClose: () => void;
  title: string;
}) {
  if (!value) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-6"
        >
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>

          <div className="flex items-center justify-between bg-primary-soft border border-border rounded-xl px-4 py-3">
            <span className="font-mono text-sm break-all">{value}</span>

            <button
              onClick={() => navigator.clipboard.writeText(value)}
              className="text-primary text-sm font-medium hover:underline"
            >
              Copiar
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );  
}

