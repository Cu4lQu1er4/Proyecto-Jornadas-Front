'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scheduleApi } from "@/lib/api/schedule.api";
import CreateScheduleModal from "./components/CreateScheduleModal";
import { toast } from "sonner";

export default function SchedulePage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data: any = await scheduleApi.list();
      setTemplates(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    try {
      await scheduleApi.remove(id);
      toast.success("Horario eliminado");
      load();
    } catch {
      toast.error("No se pudo eliminar el horario");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-surface px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          <div>
            <h1 className="text-2xl font-semibold">
              Horarios
            </h1>
            <p className="text-sm text-text-muted">
              Gestión de plantillas de horario
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="
              h-10 px-4 rounded-xl
              bg-primary text-white text-sm font-medium
              transition hover:opacity-90
              w-full sm:w-auto
            "
          >
            Nuevo horario
          </motion.button>
        </motion.header>

        {/* LISTA */}
        <section className="
          bg-white border border-border rounded-2xl
          p-4 sm:p-6
        ">
          {loading && (
            <div className="text-sm text-text-muted">
              Cargando horarios...
            </div>
          )}

          {!loading && templates.length === 0 && (
            <div className="text-sm text-text-muted">
              No hay plantillas creadas
            </div>
          )}

          <div className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4
          ">
            {templates.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="
                  border border-border
                  rounded-xl p-4
                  bg-white
                  cursor-pointer
                  transition hover:shadow-md
                "
              >
                <div className="flex flex-col gap-3">
                  <p className="font-medium text-text">
                    {t.name}
                  </p>

                  <div className="text-xs text-text-muted flex flex-col gap-1">
                    {t.days?.map((d:any) => (
                      <span key={d.id}>
                        {["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"][d.weekday]} -
                        {Math.floor(d.startMinute/60)}:
                        {String(d.startMinute%60).padStart(2, "0")}
                        {" - "}
                        {Math.floor(d.endMinute/60)}:
                        {String(d.endMinute%60).padStart(2, "0")}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditing(t);
                        setOpen(true);
                      }}
                      className="
                        text-xs px-3 py-1 border border-border rounded-lg hover:bg-surface"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="
                        text-xs px-3 py-1 border border-danger text-danger rounded-lg
                        hover:bg-danger-soft"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {open && (
          <CreateScheduleModal
            editing={editing}
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            onCreated={load}
          />
        )}

        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="
                bg-white bprder border-border rounded-2xl p-6 w-full max-w-sm
                flex flex-col gap-4"
            >
              <h3 className="text-lg font-semibold">
                Eliminar horario
              </h3>

              <p className="text-sm text-text-muted">
                ¿Estas segudo de eliminar este horario?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="h-9 px-4 rounded-lg border border-border text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => handleDelete(deleteId)}
                  className="h-9 px-4 rpunded-lg bg-danger text-white text-sm"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}