import { openDB } from "idb";

export async function getDB() {
  return openDB("kiosk-db", 1, {
    upgrade(db) {

      if (!db.objectStoreNames.contains("punchQueue")) {
        db.createObjectStore("punchQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("employees")) {
        db.createObjectStore("employees", {
          keyPath: "document",
        });
      }

    },
  });
}

export async function queuePunch(data: any) {
  const db = await getDB();
  await db.add("punchQueue", data);
}

export async function syncQueue() {

  if (!navigator.onLine) return;

  const db = await getDB();
  const punches = await db.getAll("punchQueue");

  console.log("Intentando sincronizar", punches.length, "registros");

  for (const punch of punches) {

    try {
      console.log("ENVIANDO:", punch)

      const res = await fetch(punch.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: punch.body,
      });

      console.log("RESPUESTA:", res.status)

      if (!res.ok) {
        console.log("Error API", res.status);
        continue;
      }

      await db.delete("punchQueue", punch.id);

      console.log("Registro sincronizado", punch.id);

    } catch (err) {

      console.log("Sin internet aún");
      return;

    }

  }

  console.log("Sincronización completa");

}

export async function syncEmployees() {

  if (!navigator.onLine) return;

  try {

    const res = await fetch("http://localhost:3001/api/kiosk/employees");

    if (!res.ok) return;

    const employees = await res.json();

    const db = await getDB();

    const tx = db.transaction("employees", "readwrite");
    const store = tx.objectStore("employees");

    await store.clear();

    for (const emp of employees) {
      await store.put(emp);
    }

    await tx.done;

    console.log("Empleados sincronizados");

  } catch (err) {

    console.log("No se pudieron sincronizar empleados");

  }

}