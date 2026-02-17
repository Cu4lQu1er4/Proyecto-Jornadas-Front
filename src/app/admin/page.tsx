import { cookies } from "next/headers";
import { Card } from "@/components/Card";

async function getData() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");

  if (!token) return null;

  const headers = {
    Cookie: `access_token=${token.value}`,
  };

  const [employeesRes, periodsRes] = await Promise.all([
    fetch("http://localhost:3001/api/work/admin/employees", {
      headers,
      cache: "no-store",
    }),
    fetch("http://localhost:3001/api/work/periods", {
      headers,
      cache: "no-store",
    }),
  ]);

  const employees = employeesRes.ok ? await employeesRes.json() : [];
  const periodsData = periodsRes.ok ? await periodsRes.json() : { data: [] };

  const openPeriods =
    periodsData.data?.filter((p: any) => !p.closedAt) ?? [];

  return {
    totalEmployees: employees.length,
    openPeriods: openPeriods.length,
  };
}

export default async function AdminDashboard() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-surface p-6 rounded-2xl border border-border">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-text">
            Panel de administración
          </h1>
          <p className="text-sm text-text-muted">
            Resumen general del sistema
          </p>
        </header>

        {/* Grid */}
        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          <Card
            title="Usuarios activos"
            value={data?.totalEmployees ?? 0}
          />

          <Card
            title="Períodos abiertos"
            value={data?.openPeriods ?? 0}
          />

          <Card
            title="Estadísticas"
            span="wide"
          />

          <Card
            title="Actividad reciente"
            height="tall"
          />
        </section>

      </div>
    </main>
  );
}
