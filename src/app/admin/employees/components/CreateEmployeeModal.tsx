'use client';

import { useEffect, useState } from "react";
import { employeeApi } from "@/lib/api/employee.api";
import { scheduleApi } from "@/lib/api/schedule.api";
import { toast } from "sonner";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

type Template = {
  id: string;
  name: string;
};

export default function CreateEmployeeModal({
  onClose,
  onCreated,
}: Props) {

  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [scheduleTemplateId, setScheduleTemplateId] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await scheduleApi.list();
        setTemplates(data);
      } catch {
        toast.error("No se pudieron cargar los horarios");
      }
    }

    loadTemplates();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!document || !password || !scheduleTemplateId) {
      toast.warning("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      await employeeApi.create({
        document,
        password,
        scheduleTemplateId,
      });

      toast.success("Empleado creado correctamente");
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error("Error al crear empleado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text">
            Nuevo empleado
          </h2>
          <p className="text-sm text-text-muted">
            Crear usuario con horario asignado
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <input
            placeholder="Documento"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="h-11 px-4 rounded-xl border border-border bg-surface text-sm"
          />

          <input
            type="password"
            placeholder="Contraseña temporal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 px-4 rounded-xl border border-border bg-surface text-sm"
          />

          <select
            value={scheduleTemplateId}
            onChange={(e) => setScheduleTemplateId(e.target.value)}
            className="h-11 px-4 rounded-xl border border-border bg-surface text-sm"
          >
            <option value="">Seleccionar horario</option>

            {templates.map((t) => (
              <option
                key={t.id}
                value={t.id}
              >
                {t.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-border text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm"
            >
              {loading ? "Creando..." : "Crear"}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}