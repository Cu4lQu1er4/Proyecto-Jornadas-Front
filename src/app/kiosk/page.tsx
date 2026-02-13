'use client';

import { useState, useEffect } from "react";

type WorkdayStatus = {
  hasOpenWorkday: boolean;
  startTime: string | null;
};

type Employee = {
  document: string;
};

export default function KioskPage() {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [status, setStatus] = useState<WorkdayStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    if (employee) {
      fetchStatus();
    }
  }, [employee]);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        'http://localhost:3001/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document, password }),
          credentials: 'include',
        }
      );

      if (!res.ok) throw new Error('Credenciales invalidas');

      setEmployee({ document });
      await fetchStatus();

    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStatus() {
    const res = await fetch(
      'http://localhost:3001/api/kiosk/status',
      {
        credentials: 'include',
        headers: {
          'X-Client': 'kiosk',
        },
      }
    );

    if (!res.ok) throw new Error('STATUS_FAILED');

    const data = await res.json();
    setStatus(data);
  }

  async function handleMainAction() {
    if (!status || loading) return;

    setLoading(true);
    setError(null);

    const url = status.hasOpenWorkday
      ? 'http://localhost:3001/api/work/end'
      : 'http://localhost:3001/api/work/start';

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-Client": "kiosk",
        },
      });

      if (res.status === 409) {
        const data = await res.json();

        if (data?.message?.include("cerrada")) {
          setError("La quincena esta cerrada. Contacte al administrador");
          return;
        }

        await fetchStatus();
        return;
      }

      if (!res.ok) {
        throw new Error("ACTION_FAILED");
      }

      await fetchStatus();

    } catch {
      setError("No se pudo procesar la accion");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      setEmployee(null);
      setStatus(null);
      setDocument('');
      setPassword('');
    });
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (!employee) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white border border-border rounded-2xl p-6 flex flex-col gap-6">

          <header className="flex flex-col gap-1 text-center">
            <h1 className="text-lg font-semibold text-text">
              Registro de jornada
            </h1>
            <p className="text-sm text-text-muted">
              Ingresa tus credenciales
            </p>
          </header>

          <div className="flex flex-col gap-4">

            <input
              placeholder="Documento"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none"
            />

            {error && (
              <p className="text-sm text-danger text-center">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

          </div>

        </div>
      </main>
    );
  }

  /* ================= WORKDAY SCREEN ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl flex flex-col gap-8 text-center p-10">

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            Registro de jornada
          </h1>

          <span className="text-4xl font-bold tracking-wider text-primary">
            {formatTime(now)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-text-muted">
            Documento <b>{employee.document}</b>
          </p>

          {status && (
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                ${
                  status.hasOpenWorkday
                    ? "bg-warning-soft text-warning"
                    : "bg-success-soft text-success"
                }
              `}
            >
              <span className={`w-2 h-2 rounded-full ${
                status.hasOpenWorkday ? "bg-warning" : "bg-success"
              }`} />
              {status.hasOpenWorkday
                ? "Jornada en curso"
                : "Sin jornada activa"}
            </span>
          )}
        </div>

        {status && (
          <button
            onClick={handleMainAction}
            disabled={loading}
            className={`w-full rounded-2xl py-6 text-xl font-semibold text-white transition
              ${
                status.hasOpenWorkday
                  ? "bg-danger hover:opacity-90"
                  : "bg-success hover:opacity-90"
              }
              disabled:opacity-60
            `}
          >
            {loading
              ? "Procesando..."
              : status.hasOpenWorkday
                ? "Cerrar jornada"
                : "Iniciar jornada"}
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full rounded-2xl py-4 text-sm font-medium
            bg-gray-100 hover:bg-gray-200 transition"
        >
          Cerrar sesión
        </button>

        {error && (
          <p className="text-sm text-danger font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}