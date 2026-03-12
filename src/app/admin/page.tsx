"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/Card";

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalEmployees: 0,
    openPeriods: 0,
    openWorkdays: 0,
    activeEmployees: [] as any[],
  });

  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [employeesRes, periodsRes, liveRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/admin/employees`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/periods`, {
          credentials: "include",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/work/admin/live-workdays`, {
          credentials: "include",
        }),
      ]);

      const employees = employeesRes.ok ? await employeesRes.json() : [];
      const periodsData = periodsRes.ok ? await periodsRes.json() : { items: [] };
      const liveData = liveRes.ok ? await liveRes.json() : { count: 0 };

      setData({
        totalEmployees: employees.length,
        openPeriods:
          periodsData.items?.filter((p: any) => !p.closedAt).length ?? 0,
        openWorkdays: liveData.count ?? 0,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-[100dvh] bg-surface px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-semibold text-text tracking-tight">
            Panel de administración
          </h1>
          <p className="text-sm text-text-muted">
            Resumen general del sistema
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          <Card
            title="Jornadas abiertas"
            value={loading ? "..." : data.openWorkdays}
          />
          <Card
            title="Períodos abiertos"
            value={loading ? "..." : data.openPeriods}
          />
          <Card
            title="Usuarios activos"
            value={loading ? "..." : data.totalEmployees}
          />
        </motion.section>

        {data.activeEmployees?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">
              Empleados en jornada
            </h2>

            <div className="flex flex-col gap-3">
              {data.activeEmployees.map((emp: any) => (
                <div
                  key={emp.id}
                  className="flex justify-between items-center border-b border-border pb-2 last:border-none"
                >
                  <span className="font-medium">
                    {emp.name || emp.document}
                  </span>

                  <span className="text-sm text-text-muted">
                    Desde {new Date(emp.startTime).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}

      </div>
    </main>
  );
}