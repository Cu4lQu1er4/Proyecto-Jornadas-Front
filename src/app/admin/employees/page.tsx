import { cookies } from "next/headers";
import EmployeeList from "./components/EmployeeList";
import { http } from "@/lib/http";

async function getEmployees() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) return [];
  try {
    const employees = await http("/work/admin/employees",{
      headers: {
        Cookie: `access_token=${token.value}`,
      },
      cache: "no-store",
    }) as any[];

    return employees;
  } catch (error) {
    console.error("Error cargando employees:", error);
    return[];
  }
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
