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
  const [document, setDocument] = useState('');
  const [password, setPassword] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [status, setStatus] = useState<WorkdayStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e: any) {
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
    if (!status) return;

    setLoading(true);
    setError(null);

    const url = status.hasOpenWorkday
      ? 'http://localhost:3001/api/work/end'
      : 'http://localhost:3001/api/work/start';

    try {
      const res = await fetch (url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Client': 'kiosk',
        },
      });

      if (res.status === 409) {
        await fetchStatus();
        return;
      }

      if (!res.ok) throw new Error('ACTION_FAILED');

      await fetchStatus();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!employee) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-surface px-4"
      >
        <div
          className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-6"
        >
          <h1 className="text-2xl font-semibold text-center">
            Registro de jornada
          </h1>

          <input
            placeholder="Documento"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="
              w-full rounded-xl border border-border px-4 py-3 text-lg
              outline-none focus:ring-2 focus:ring-primary/30"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full rounded-xl border border-border px-4 py-3 text-lg
              outline-none focus:ring-2 focus:ring-primary/30"
          />

          {error && (
            <p className="text-sm text-danger text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-primary py-4 text-lg
              font-semibold text-white transition hover:opacity-90
              disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-surface px-4"
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-lg flex flex-col gap-6 text-center p-8"
      >
        <h1 className="text-2xl font-semibold">
          Bienvenido
        </h1>

        <p className="text-text-muted">
          Documento <b>{employee.document}</b>
        </p>

        {status === null && (
          <p className="text-sm text-text-muted">
            Verificando el estado de la jornada...
          </p>
        )}

        {status !== null && (
          <button
            onClick={handleMainAction}
            disabled={loading}
            className={`w-full rounded-xl py-5 text-xl font-semibold text-white transition
              ${status.hasOpenWorkday
                ? 'bg-danger hover:opacity-90'
                : 'bg-success hover:opacity-90'
              }
            `}
          >
            {loading
              ? 'Procesando...'
              : status.hasOpenWorkday
                ? 'Cerrar jornada'
                : 'Iniciar jornada'
            }
          </button>
        )}

        {error && (
          <p className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
    
  );
}