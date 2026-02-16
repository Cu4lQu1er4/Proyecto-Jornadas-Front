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
  const [pin, setPin] = useState("");

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

  async function handleKioskLogin(pinValue: string) {
    if (!document) {
      setError("Ingrese su documento");
      setPin("");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        'http://localhost:3001/api/auth/kiosk-login',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            document,
            pin: pinValue,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("PIN incorrecto");
      }

      setEmployee({ document });
      await fetchStatus();
      setPin("");
    } catch {
      setError("PIN incorrecto");
      setPin("");
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

    const wasOpen = status.hasOpenWorkday;

    setLoading(true);
    setError(null);

    const url = wasOpen
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
        
        if (wasOpen) {
          handleLogout();
        }
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

  function handlePinInput(value: string) {
    if (pin.length >= 4) return;

    const newPin = pin + value;
    setPin(newPin);

    if (newPin.length === 4) {
      handleKioskLogin(newPin);
    }
  }

  function clearPin() {
    setPin("");
  }

  if (!employee) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md bg-white border border-border rounded-3xl p-8 flex flex-col gap-8">
          <header className="text-center flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-text">
              Registro de jornada
            </h1>
            <p className="text-sm text-text-muted">
              Ingrese su documento y PIN
            </p>
          </header>

          <input
            placeholder="Documento"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="h-12 px-4 rounded-2xl border border.border bg-surface text-text text-base text-center"
          />

          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center"
              >
                {pin[i] ? (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                ) : null}
              </div>  
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handlePinInput(String(n))}
                className="h-16 rounded-2xl bg-gray-100 text-sl font-semibold hover:bg-gray-200"
              >
                {n}
              </button>
            ))}

            <button
              onClick={clearPin}
              className="h-16 rounded-2xl bg-danger-soft text-danger font-semibold"
            >
              Borrar
            </button>

            <button
              onClick={() => handlePinInput("0")}
              className="h-16 rounded-2xl bg-gray-100 text-xl font-semibold hover:bg-gray-200"
            >
              0
            </button>

            <div />
          </div>

          {error && (
            <p className="text-sm text-danger text-center">
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }


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