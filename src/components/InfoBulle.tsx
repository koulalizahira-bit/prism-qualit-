"use client";

import { useState } from "react";
import { Info } from "lucide-react";

// Petit bouton (i) cliquable qui déplie une explication en clair — pensé pour un
// public qui ne manipule ces notions qu'occasionnellement (ex. certification HAS).
export default function InfoBulle({
  texte,
  className = "",
  dark = false,
}: {
  texte: string;
  className?: string;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Plus d'informations"
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          dark
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
        }`}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute right-0 top-7 z-20 w-64 rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-ardoise-700 shadow-lg"
        >
          {texte}
        </span>
      )}
    </span>
  );
}
