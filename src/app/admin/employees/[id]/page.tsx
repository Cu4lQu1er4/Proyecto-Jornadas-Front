import { cookies } from "next/headers";
import EmployeeDetail from "../components/EmployeeDetail"

async function getEmployee(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) return null;

  const res = await fetch(
    'http://localhost:3001/api/work/admin/employees',
    {
      headers: {
        Cookie: `access_token=${token.value}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const list = await res.json();
  return list.find((e: any) => e.id === id) ?? null;
}

export default async function EmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const employee = await getEmployee(id);

  if (!employee) {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center text-text-muted">
        Empleado no encontrado
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 bg-surface p-6 border border-border rounded-2xl">

      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-text">
          Detalle del empleado
        </h1>
        <p className="text-sm text-text-muted">
          Información y configuración del usuario
        </p>
      </header>

      <section className="bg-white border border-border rounded-2xl p-6">
        <EmployeeDetail employee={employee} />
      </section>

    </div>
  );
}
