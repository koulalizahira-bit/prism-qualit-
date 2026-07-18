"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Imprimer en A3" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-2xl bg-marine-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-marine-800"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
