'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type Props = {
  user: {
    firstName?: string;
    lastName?: string;
    role: string;
  };
  children: React.ReactNode;
};

export default function AdminLayoutShell({
  user,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface">

      {/* ===== DESKTOP SIDEBAR (exactamente como antes) ===== */}
      <div className="hidden lg:block p-2">
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col">

        {/* ===== HEADER ===== */}
        <div className="p-2">
          <AdminHeader
            user={user}
            onMenuClick={() => setOpen(true)}
          />
        </div>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 p-2">
          {children}
        </main>
      </div>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-64 bg-white z-50 p-4 lg:hidden"
            >
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}