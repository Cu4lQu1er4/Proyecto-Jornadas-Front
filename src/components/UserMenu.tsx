'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string | null;
    role: string;
  };
  basePath: string;
};

export default function UserMenu({
  user,
  basePath
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-full bg-primary-soft flex items-center justify-center text-sm font-medium text-primary"
      >
        {user.firstName?.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-border rounded-2xl p-4 flex flex-col gap-4 z-50">

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text">
              {fullName}
            </span>

            {user.email && (
              <span className="text-sm text-text-muted">
                {user.email}
              </span>
            )}

            <span className="text-sm text-text-muted">
              {user.role}
            </span>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-2">

            <button
              onClick={() => {
                setOpen(false);
                router.push(`/profile`);
              }}
              className="h-10 px-4 rounded-xl bg-surface border border-border text-text text-sm font-medium hover:bg-primary-soft hover:text-primary transition"
            >
              Mi perfil
            </button>

            <LogoutButton />

          </div>
        </div>
      )}
    </div>
  );
}