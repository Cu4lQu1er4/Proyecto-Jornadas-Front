import LogoutButton from "@/components/LogoutButton"
import { LogOut } from "lucide-react"

export default function EmployeeHeader() {
  return (
    <header
      className="
        bg-white rounded-2xl flex items-center
        justify-between mx-6 p-5"
    >
      <div>
        <h1 className="text-h1 text-text py-4">Mi jornada</h1>
        <p className="text-body text-text-muted">Empleado</p>
      </div>

      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>

      
    </header>
  )
}