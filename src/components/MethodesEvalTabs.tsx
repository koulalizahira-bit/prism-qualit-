"use client";

import { useState } from "react";
import { Clock, Lightbulb } from "lucide-react";
import type { MethodeAccent, MethodeEval } from "@/lib/hasMethodesEval";

// Familles pastel — classes Tailwind écrites en entier (requis par le JIT).
type Fam = { tabActive: string; dot: string; badge: string; pill: string; chip: string; listeBox: string; listeTitre: string };

const FAM: Record<"menthe" | "lavande" | "peche" | "marine", Fam> = {
  menthe: {
    tabActive: "bg-menthe-600 text-white border-menthe-600",
    dot: "bg-menthe-400",
    badge: "bg-menthe-100 text-menthe-700 ring-menthe-200",
    pill: "bg-menthe-100 text-menthe-700",
    chip: "bg-white text-menthe-700 border-menthe-200",
    listeBox: "bg-menthe-50 border-menthe-200",
    listeTitre: "text-menthe-700",
  },
  lavande: {
    tabActive: "bg-lavande-600 text-white border-lavande-600",
    dot: "bg-lavande-400",
    badge: "bg-lavande-100 text-lavande-700 ring-lavande-200",
    pill: "bg-lavande-100 text-lavande-700",
    chip: "bg-white text-lavande-700 border-lavande-200",
    listeBox: "bg-lavande-50 border-lavande-200",
    listeTitre: "text-lavande-700",
  },
  peche: {
    tabActive: "bg-peche-600 text-white border-peche-600",
    dot: "bg-peche-400",
    badge: "bg-peche-100 text-peche-700 ring-peche-200",
    pill: "bg-peche-100 text-peche-700",
    chip: "bg-white text-peche-700 border-peche-200",
    listeBox: "bg-peche-50 border-peche-200",
    listeTitre: "text-peche-700",
  },
  marine: {
    tabActive: "bg-marine-700 text-white border-marine-700",
    dot: "bg-marine-400",
    badge: "bg-marine-50 text-marine-700 ring-marine-100",
    pill: "bg-marine-50 text-marine-700",
    chip: "bg-white text-marine-700 border-marine-100",
    listeBox: "bg-marine-50 border-marine-100",
    listeTitre: "text-marine-700",
  },
};

const ACCENT_FAM: Record<MethodeAccent, keyof typeof FAM> = {
  turquoise: "menthe",
  indigo: "lavande",
  violet: "peche",
  emeraude: "marine",
  rose: "menthe",
};

export default function MethodesEvalTabs({ methodes }: { methodes: MethodeEval[] }) {
  const [activeId, setActiveId] = useState(methodes[0]?.id ?? "");
  const active = methodes.find((m) => m.id === activeId) ?? methodes[0];
  if (!active) return null;
  const a = FAM[ACCENT_FAM[active.accent]];

  return (
    <div className="space-y-4">
      {/* Onglets */}
      <div className="-mx-5 overflow-x-auto px-5 pb-1">
        <div className="flex gap-2 w-max">
          {methodes.map((m) => {
            const isActive = m.id === active.id;
            const acc = FAM[ACCENT_FAM[m.accent]];
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveId(m.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive ? acc.tabActive : "border-ardoise-200 bg-white text-ardoise-500 hover:bg-ardoise-50"
                }`}
              >
                <span className="text-sm leading-none">{m.emoji}</span>
                {m.nomCourt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carte méthode active */}
      <div className="rounded-3xl bg-white border border-ardoise-100 shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-ardoise-100">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ardoise-50 text-2xl">
              {active.emoji}
            </span>
            <h2 className="text-marine-900 text-lg font-extrabold leading-tight">{active.nom}</h2>
          </div>
          <p className="mt-3 text-sm text-ardoise-600 leading-relaxed">{active.sousTitre}</p>
        </div>

        <div className="px-5 py-5 space-y-4">
          {active.format === "etapes" && (
            <ol className="space-y-3">
              {active.etapes.map((e, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ring-2 ${a.badge}`}>
                      {i + 1}
                    </span>
                    {i < active.etapes.length - 1 && <span className="mt-1 w-px flex-1 bg-ardoise-200" />}
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-marine-900 leading-snug">{e.titre}</p>
                      {e.duree && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${a.pill}`}>
                          <Clock className="h-3 w-3" />
                          {e.duree}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ardoise-500 leading-relaxed">{e.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {active.format === "grille" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {active.etapes.map((e, i) => (
                <div key={i} className="rounded-2xl bg-ardoise-50/60 border border-ardoise-100 px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
                    <p className="text-sm font-bold text-marine-900 leading-snug">{e.titre}</p>
                  </div>
                  <p className="mt-1 text-xs text-ardoise-500 leading-relaxed">{e.description}</p>
                </div>
              ))}
            </div>
          )}

          {active.liste && (
            <div className={`rounded-2xl border px-4 py-3 ${a.listeBox}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${a.listeTitre}`}>
                {active.liste.titre}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {active.liste.items.map((item, i) => (
                  <span key={i} className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${a.chip}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-2xl bg-peche-50 border border-peche-200 px-3.5 py-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-peche-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-peche-700 mb-0.5">À retenir</p>
              <p className="text-xs text-ardoise-700 leading-relaxed">{active.aRetenir}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
