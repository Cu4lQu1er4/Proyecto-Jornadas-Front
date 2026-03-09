'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scheduleApi } from "@/lib/api/schedule.api";
import CreateScheduleModal from "./components/CreateScheduleModal";

export default function SchedulePage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
            onClick={() => setOpen(true)}
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
                <p className="font-medium text-text">
                  {t.name}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {open && (
          <CreateScheduleModal
            onClose={() => setOpen(false)}
            onCreated={load}
          />
        )}

      </div>
    </main>
  );
}