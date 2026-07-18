"use client";

import { useState, type ReactNode } from "react";
import { ShieldCheck, BookOpenCheck } from "lucide-react";

export default function CertifSousOnglets({
  couverture,
  methodes,
}: {
  couverture: ReactNode;
  methodes: ReactNode;
}) {
  const [tab, setTab] = useState<"couverture" | "methodes">("couverture");

  return (
    <div className="space-y-5">
      <div className="flex gap-2 rounded-2xl bg-ardoise-50 p-1">
        <button
          type="button"
          onClick={() => setTab("couverture")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
            tab === "couverture"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-ardoise-500"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Couverture des critères
        </button>
        <button
          type="button"
          onClick={() => setTab("methodes")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
            tab === "methodes"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-ardoise-500"
          }`}
        >
          <BookOpenCheck className="h-4 w-4" />
          Méthodes de certification
        </button>
      </div>

      <div className={tab === "couverture" ? "block" : "hidden"}>{couverture}</div>
      <div className={tab === "methodes" ? "block" : "hidden"}>{methodes}</div>
    </div>
  );
}
