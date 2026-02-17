import { cookies } from "next/headers";
import EmployeeList from "./components/EmployeeList";

async function getEmployees() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) return [];

  const res = await fetch(
    "http://localhost:3001/api/work/admin/employees",
    {
      headers: {
        Cookie: `access_token=${token.value}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function AdminEmployeesPage() {
  const employees = await getEmployees();

  return (
    <div className="flex flex-col gap-8 border border-border p-6 bg-surface rounded-2xl">

      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-text">
          Empleados
        </h1>

        <p className="text-sm text-text-muted">
          Gestión y visualización de empleados registrados
        </p>
      </header>

      <section className="bg-white border border-border rounded-2xl p-6">
        <EmployeeList employees={employees} />
      </section>

    </div>
  );
}
