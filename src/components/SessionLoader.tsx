'use client';

import { useEffect } from "react";
import { refreshSession } from "@/lib/auth";

export default function SessionLoader() {
  useEffect(() => {
    refreshSession().then((ok) => {
      if (!ok) {
        window.location.href = "/login"
      }
    })
  }, [])

  return null
}