import Link from "next/link";
import { FileText } from "lucide-react";

// Accès direct aux rapports PDF, à poser dans l'en-tête de n'importe quelle page —
// pour ne plus avoir à chercher tout en bas ou dans un autre onglet.
export default function PdfQuickLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/cadre/rapports"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/25 transition-colors ${className}`}
    >
      <FileText className="h-3.5 w-3.5" />
      Rapport PDF
    </Link>
  );
}
