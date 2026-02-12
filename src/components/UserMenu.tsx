import { LogOut } from "lucide-react";

type UserMenuProps = {
  name?: string;
};

export default function UserMenu({ name = "Usuario" }: UserMenuProps) {
  return (
    <button
      className="
        flex items-center gap-2 px-3 py-2 bg-white
        rounded-lg hover:gray-50 transition"
      arial-label="Menu de usuario"
    >
      <div className="w-7 h-7 rounded-full bg-gray-300" />

      <span className="text-sm text-text font-medium">
        {name}
      </span>

      <LogOut size={16} className="text-text-muted" />
    </button>
  );
}