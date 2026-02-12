import { Bell, Search } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function AdminHeader() {
  return (
    <header
      className="
        h-16 bg-[#f6f7f9] px-6 flex items-center justify-between
        rounded-lg"
    >
      <h1 className="text-text text-h2">
        Panel Administrador
      </h1>

      <div className="flex items-center gap-3">

        <div
          className="
            flex items-center gap-2 px-3 py-2 bg-white rounded-xl"
        >
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Buscar..."
            className="
              bg-transparent outline-none text-sm text-gray-700
              placeholder:text-gray-400 w-40"
          />
        </div>

        <button
          className="p-2 rounded-xl bg-white hover:bg-gray-50 transition"
        >
          <Bell size={18} className="text-gray-600" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gray-300" />

        <LogoutButton />
      </div>
    </header>
  );
}
