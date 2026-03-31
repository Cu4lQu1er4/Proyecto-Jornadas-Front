"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { refreshSession } from "@/lib/auth";

export default function SessionLoader () {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    refreshSession().then((ok) => {
      if (!ok && pathname !== "/login") {
        router.replace("/login");
      }
    });
  }, [pathname]);

  return null;
}