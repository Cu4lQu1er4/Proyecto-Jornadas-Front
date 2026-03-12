'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { queuePunch, syncQueue, syncEmployees } from "@/lib/kioskQueue";
import { http } from "@/lib/http";
import Head from "next/head";

type WorkdayStatus = {
  hasOpenWorkday: boolean;
  startTime: string | null;
};

type Employee = {
  document: string;
};

export default function KioskPage() {
  const [document, setDocument] = useState("");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [status, setStatus] = useState<WorkdayStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [pin, setPin] = useState("");
  const [kioskToken, setKioskToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("kioskToken");
    if (saved) setKioskToken(saved);
  }, []);

  useEffect(() => {
    syncEmployees();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (employee) fetchStatus();
  }, [employee]);

  useEffect(() => {

    const handleOnline = () => {
      syncQueue();
    };

    window.addEventListener("online", handleOnline);

    syncQueue();

    return () => {
      window.removeEventListener("online", handleOnline);
    };

  }, []);


  async function handleKioskLogin(pinValue: string) {
    if (!document) {
      setError("Ingrese su documento");
      setPin("");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data: any = await http("/kiosk/auth", {
        method: "POST",
        body: JSON.stringify({ document, pin: pinValue }),
      });

      sessionStorage.setItem("kioskToken", data.kioskToken);
      setKioskToken(data.kioskToken);

      localStorage.setItem(
        "kioskEmployee",
        JSON.stringify({
          document,
          employeeId: data.employee.id,
        })
      );

      setEmployee({ document });

      setStatus({
        hasOpenWorkday: false,
        startTime: null,
      });

      setPin("");
    } catch (err) {
      toast.error("PIN incorrecto");
      setPin("");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStatus() {
    if (!kioskToken) return;

    try {
      const data: any = await http("/kiosk/status", {
        headers: {
          Authorization: `Bearer ${kioskToken}`,
        },
      });

      setStatus(data);
    } catch (err:any) {
      if (err?.status === 401) {
        handleLogout();
        return;
      }

      console.log("Offline - no se pudo obtener el estado");

      setStatus({
        hasOpenWorkday: false,
        startTime: null
      });
    }
  }

  async function handleMainAction() {
    if (!status || loading) return;

    const endpoint = status.hasOpenWorkday
      ? "/kiosk/end"
      : "/kiosk/start";

    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const body = JSON.stringify({
      timestamp: new Date().toISOString(),
    });

    try {
      setLoading(true);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...(kioskToken && {Authorization: `Bearer ${kioskToken}` }),
          "Content-Type": "application/json",
        },
        body,
      });

      if (!res.ok) throw new Error();

      await fetchStatus();
    } catch (err) {
      if (navigator.onLine) {
        toast.error("Error al registrat jornada");
      }
      
      const cached = localStorage.getItem("kioskEmployee");
      const employee = cached ? JSON.parse(cached) : null;

      if (!employee) {
        toast.error("Empleado no disponible offline");
        return;
      }

      await queuePunch({
        url: `${process.env.NEXT_PUBLIC_API_URL}/kiosk/punch`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          type: status.hasOpenWorkday ? "end" : "start",
          timestamp: new Date().toISOString(),
        }),
      });

      setStatus((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          hasOpenWorkday: !prev.hasOpenWorkday,
        };
      });

      toast.warning("Sin internet. Registro guardado");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("kioskToken");
    setKioskToken(null);
    setEmployee(null);
    setStatus(null);
    setDocument("");
    setPin("");
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
    if (newPin.length === 4) handleKioskLogin(newPin);
  }

  function clearPin() {
    setPin("");
  }


  if (!employee) {
    return (
      <>
      <Head>
        <link rel="manifest" href="/kiosk-manifest.json" />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white border border-border rounded-3xl p-8 flex flex-col gap-8 shadow-xl"
        >
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
            className="h-14 px-4 rounded-2xl border border-border bg-surface text-text text-lg text-center"
          />

          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center"
              >
                {pin[i] && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <motion.button
                whileTap={{ scale: 0.92 }}
                key={n}
                onClick={() => handlePinInput(String(n))}
                className="h-20 rounded-2xl bg-gray-100 text-2xl font-semibold hover:bg-gray-200"
              >
                {n}
              </motion.button>
            ))}

            <button
              onClick={clearPin}
              className="h-20 rounded-2xl bg-danger-soft text-danger font-semibold"
            >
              Borrar
            </button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => handlePinInput("0")}
              className="h-20 rounded-2xl bg-gray-100 text-2xl font-semibold hover:bg-gray-200"
            >
              0
            </motion.button>

            <div />
          </div>

          {error && (
            <p className="text-sm text-danger text-center">
              {error}
            </p>
          )}
        </motion.div>
      </main>
      </>
    );
  }


  return (
    <>
    <Head>
        <link rel="manifest" href="/kiosk-manifest.json" />
      </Head>
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl flex flex-col gap-8 text-center p-10"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">
            Registro de jornada
          </h1>

          <span className="text-5xl font-bold tracking-wider text-primary">
            {formatTime(now)}
          </span>
        </div>

        <p className="text-text-muted">
          Documento <b>{employee.document}</b>
        </p>

        {status && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleMainAction}
            disabled={loading}
            className={`w-full rounded-2xl py-8 text-2xl font-semibold text-white transition
              ${
                status.hasOpenWorkday
                  ? "bg-danger"
                  : "bg-success"
              }
              disabled:opacity-60
            `}
          >
            {loading
              ? "Procesando..."
              : status.hasOpenWorkday
                ? "Cerrar jornada"
                : "Iniciar jornada"}
          </motion.button>
        )}

        <button
          onClick={handleLogout}
          className="w-full rounded-2xl py-4 text-sm font-medium bg-gray-100 hover:bg-gray-200"
        >
          Cerrar sesión
        </button>

        {error && (
          <p className="text-sm text-danger font-medium">
            {error}
          </p>
        )}
      </motion.div>
    </div>
    </>
  );
}