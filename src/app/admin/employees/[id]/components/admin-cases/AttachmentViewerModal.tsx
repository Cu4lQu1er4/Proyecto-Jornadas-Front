'use client';

import { useEffect } from "react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/PdfViewer"),
  { ssr: false }
);

type Attachment = {
  id: string;
  url: string;
  originalName?: string;
  resourceType?: string;
  contentType?: string;
};

function isPdf(a: Attachment) {
  const type = (a.resourceType ?? "").toLowerCase();
  const ct = (a.contentType ?? "").toLowerCase();
  const url = (a.url ?? "").toLowerCase();

  return (
    type === "raw" ||
    type.includes("pdf") ||
    ct.includes("pdf") ||
    url.endsWith(".pdf")
  );
}

function getViewerUrl(a: Attachment) {
  const url = a.url;

  if (!url) return "";

  // Si es raw (PDF subido como raw), aseguramos extensión
  if (a.resourceType === "raw" && !url.endsWith(".pdf")) {
    return `${url}.pdf`;
  }

  return url;
}

export default function AttachmentViewerModal({
  open,
  attachment,
  onClose,
}: {
  open: boolean;
  attachment: Attachment | null;
  onClose: () => void;
}) {

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open || !attachment) return null;

  const pdf = isPdf(attachment);
  const viewerUrl = getViewerUrl(attachment);

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="
          w-full max-w-3xl h-[90vh] bg-white border border-border rounded-2xl overflow-hidden
          shadow-xl flex flex-col"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text">
              Evidencia
            </span>
            <span className="text-xs text-text-muted break-all">
              {attachment.originalName || "Archivo"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="
              h-10 px-4 rounded-xl border border-border bg-surface text-sm font-medium
              hover:bg-danger-soft hover:text-danger transition"
          >
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-surface">
          {pdf ? (
            <PdfViewer
              url={`http://localhost:3001/api/admin/admin-cases/attachments/${attachment.id}`}
            />
          ) : (
            <img
              src={`http://localhost:3001/api/admin/admin-cases/attachments/${attachment.id}`}
              className="max-h-[75vh] w-auto object-contain p-4"
            />
          )}  
        </div>
      </div>
    </div>
  );
}