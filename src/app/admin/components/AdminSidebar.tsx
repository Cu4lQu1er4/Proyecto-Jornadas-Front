import Link from "next/link";
import { UserRound, BookOpen, ListChecks } from "lucide-react";

const items = [
  {
    icon: <UserRound size={18} />,
    label: "Empleados",
    color: "bg-success-soft",
    href: "/admin/employees",
  },
  {
    icon: <BookOpen size={18} />,
    label: "Periodos",
    color: "bg-primary-soft",
    href: "/admin/periods",
  },
  {
    icon: <ListChecks size={18} />,
    label: "Reportes",
    color: "bg-warning-soft",
    href: "/admin/reports",
  },
];

export default function AdminSidebar() {
  return (
    <aside
      className="
        w-64 min-h-screen
        bg-background
        p-4
        flex flex-col gap-4
      "
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="
            flex items-center gap-3
            p-4
            rounded-2xl
            bg-white
            border border-border
            transition
            hover:bg-surface
          "
        >
          <span className={`p-2 rounded-xl ${item.color}`}>
            {item.icon}
          </span>

          <span className="text-sm text-text font-medium">
            {item.label}
          </span>
        </Link>
      ))}
    </aside>
  );
}
