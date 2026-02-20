'use client';

import { useEffect, useState } from "react";
import { scheduleApi } from "@/lib/api/schedule.api";
import CreateScheduleModal from "./components/CreateScheduleModal";

export default function SchedulePage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const data = await scheduleApi.list();
    setTemplates(data);
  }

  useEffect(() => {
    load();
  }, []);

  return(
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              Horarios
            </h1>
            <p className="text-sm text-text-muted">
              Gestion de plantillas de horario
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-xl bg-primary text-white text-sm"
          >
            Nuevo horario
          </button>
        </header>

        <section className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="border border-border rounded-xl p-4"
            >
              <p className="font-medium">{t.name}</p>
            </div>
          ))}
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