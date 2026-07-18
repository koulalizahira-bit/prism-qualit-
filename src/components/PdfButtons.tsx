"use client";

import { useState } from "react";
import { FileDown, FileBadge2, FileCheck2 } from "lucide-react";
import { generateServicePdf, generateAuditCrPdf, generateCertifPdf } from "@/lib/pdf";
import type { ServicePdfData, AuditCrData, CertifPdfData } from "@/lib/pdf";

export function PdfServiceButton({
  data,
  className = "btn btn-primary",
}: {
  data: ServicePdfData;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={className}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        try { generateServicePdf(data); } finally { setBusy(false); }
      }}
    >
      <FileDown className="h-5 w-5" />
      {busy ? "Génération…" : "Rapport PDF"}
    </button>
  );
}

export function PdfAuditCrButton({
  data,
  className = "btn btn-primary",
}: {
  data: AuditCrData;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={className}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        try { generateAuditCrPdf(data); } finally { setBusy(false); }
      }}
    >
      <FileCheck2 className="h-5 w-5" />
      {busy ? "Génération…" : "Compte rendu PDF"}
    </button>
  );
}

export function PdfCertifButton({
  data,
  className = "btn btn-primary",
}: {
  data: CertifPdfData;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={className}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        try { generateCertifPdf(data); } finally { setBusy(false); }
      }}
    >
      <FileBadge2 className="h-5 w-5" />
      {busy ? "Génération…" : "Dossier HAS PDF"}
    </button>
  );
}
