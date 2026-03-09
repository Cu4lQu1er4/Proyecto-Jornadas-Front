'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PdfViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const file = useMemo(() => {
    return {
      url,
      withCredentials: true,
    };
  }, [url]);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto flex justify-center p-4"
    >
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p>Cargando PDF...</p>}
        error={<p>Error al cargar el PDF</p>}
      >
        {Array.from(new Array(numPages ?? 0), (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            width={width > 0 ? width - 32 : undefined}
          />
        ))}
      </Document>
    </div>
  );
}