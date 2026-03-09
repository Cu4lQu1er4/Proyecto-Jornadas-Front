'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InstallPage() {
  const router = useRouter()

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches

    setIsStandalone(standalone);

    const handler = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    
    if (!installPrompt) return

    installPrompt.prompt()

    const result = await installPrompt.userChoise

    if (result.outcome === "accepted") {
      console.log("App instalada")
    }

    setInstallPrompt(null);
  }

  useEffect(() => {
    if (isStandalone) {
      router.push("/login")
   }
  }, [isStandalone, router])

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-surface px-4"
    >
      <div
        className="
          w-full max-w-md bg-white border border-border rounded-2xl p-8
          flex flex-col gap-6 text-center"
      >
        <header className="flex flex-col gap-1">
          <h1 className="text-h2 font-semibold">
            Instalar la aplicacion
          </h1>

          <p className="text-sm text-text-muted">
            Para usar el sistema debes instalar la aplicacion.
          </p>
        </header>

        {installPrompt && (
          <button
            onClick={handleInstall}
            className="h-11 rounded-xl bg-primary text-white text-sm font-medium
              transition hover:opacity-90"
          >
            Instalar aplicacion
          </button>
        )}

        <button
          onClick={() => router.push("/login")}
          className="h-11 rounded-xl border border-border bg-surface text-sm
            font-medium transition hover:bg-surface"
        >
          Ir al sistema
        </button>
      </div>
    </main>
  );
}