'use client';

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-surface"
    >
      ← Volver
    </button>
  )
}