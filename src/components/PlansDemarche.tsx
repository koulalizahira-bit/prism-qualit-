"use client";

import { useState } from "react";
import type { PaqssAction, Thematique } from "@/lib/types";
import PaqssTabs from "./PaqssTabs";
import PlanEquipeView, { type EquipeGroupe } from "./PlanEquipeView";
import { Users, Compass, Info } from "lucide-react";

export default function PlansDemarche({
  cadre,
  equipeGroupes,
  thematiques,
  initialTab = "equipe",
}: {
  cadre: PaqssAction[];
  equipeGroupes: EquipeGroupe[];
  thematiques: Thematique[];
  initialTab?: "equipe" | "cadre";
}) {
  const [tab, setTab] = useState<"equipe" | "cadre">(initialTab);
  const nbEquipe = equipeGroupes.reduce((n, g) => n + g.actions.length, 0);

  return (
    <div className="space-y-5">
      {/* Sélecteur de plan */}
      <div className="flex gap-2 rounded-2xl bg-ardoise-50 p-1">
        <button
          type="button"
          onClick={() => setTab("equipe")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
            tab === "equipe" ? "bg-white text-marine-900 shadow-sm" : "text-ardoise-500"
          }`}
        >
          <Users className="h-4 w-4" />
          Plan équipe
          <span className="ml-0.5 rounded-full bg-marine-100 px-1.5 text-[11px] text-marine-700">{nbEquipe}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("cadre")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
            tab === "cadre" ? "bg-white text-emerald-700 shadow-sm" : "text-ardoise-500"
          }`}
        >
          <Compass className="h-4 w-4" />
          Plan cadre (PAQSS)
          <span className="ml-0.5 rounded-full bg-emerald-100 px-1.5 text-[11px] text-emerald-700">{cadre.length}</span>
        </button>
      </div>

      {tab === "equipe" ? (
        <PlanEquipeView groupes={equipeGroupes} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              <strong>PAQSS = Programme d&apos;Actions pour la Qualité et la Sécurité des Soins.</strong> C&apos;est
              le plan de <strong>pilotage du service</strong>, porté par le cadre : sensibiliser les équipes,
              organiser les formations, animer les CREX/RMM… (distinct du plan de terrain de l&apos;équipe).
            </span>
          </div>
          <PaqssTabs paqss={cadre} thematiques={thematiques} editable />
        </div>
      )}
    </div>
  );
}
