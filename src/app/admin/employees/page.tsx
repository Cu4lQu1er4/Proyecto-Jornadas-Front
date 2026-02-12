import { cookies } from "next/headers";
import EmployeeList from "./components/EmployeeList"

async function getEmployees() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token");

  if (!token) return [];

  const res = await fetch('http://localhost:3001/api/work/admin/employees', {
    headers: {
      Cookie: `access_token=${token.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function AdminEmployeesPage() {
  const employees = await getEmployees();

  return (
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            Empleados
          </h1>

          <p className="text-sm text-text-muted">
            Gestión y visualización de empleados registrados
          </p>
        </header>

        <section className="bg-white border border-border rounded-2xl shadow-sm p-6">
          <EmployeeList employees={employees} />
        </section>

      </div>
    </main>
  );
}