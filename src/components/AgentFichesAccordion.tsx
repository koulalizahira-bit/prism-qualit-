"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, BookOpen, Info } from "lucide-react";

interface FicheData {
  id: string;
  titre: string;
  resume: string;
  contenu: string[];
}

interface GroupData {
  themeId: string;
  nom: string;
  ordre: number;
  nbFiches: number;
  fiches: FicheData[];
  vigilances: string[];
  infos: string[];
}

// Couleurs pastel alternées par thématique (cycle)
const THEME_ACCENTS = [
  { dot: "bg-menthe-400", label: "text-menthe-700", badge: "bg-menthe-100 text-menthe-700" },
  { dot: "bg-lavande-400", label: "text-lavande-700", badge: "bg-lavande-100 text-lavande-700" },
  { dot: "bg-peche-400", label: "text-peche-700", badge: "bg-peche-100 text-peche-700" },
];

export default function AgentFichesAccordion({ groupes }: { groupes: GroupData[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {groupes.map((g, idx) => {
        const isOpen = openIds.has(g.themeId);
        const accent = THEME_ACCENTS[idx % THEME_ACCENTS.length];

        return (
          <div
            key={g.themeId}
            className={`rounded-2xl border shadow-sm transition-all ${
              isOpen ? "bg-white border-marine-100" : "bg-white border-ardoise-100"
            }`}
          >
            <button
              onClick={() => toggle(g.themeId)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${accent.badge}`}>
                {g.ordre}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-marine-900 leading-snug">{g.nom}</p>
                <p className="text-xs text-ardoise-500 mt-0.5">
                  {g.fiches.length > 0
                    ? `${g.fiches.length} fiche${g.fiches.length > 1 ? "s" : ""}`
                    : ""}
                  {g.fiches.length > 0 && g.vigilances.length > 0 && " · "}
                  {g.vigilances.length > 0
                    ? `${g.vigilances.length} vigilance${g.vigilances.length > 1 ? "s" : ""}`
                    : ""}
                  {g.fiches.length === 0 && g.vigilances.length === 0 && "Aucun contenu"}
                </p>
              </div>

              <ChevronDown
                className={`h-4 w-4 shrink-0 text-ardoise-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-3">
                <div className="h-px bg-ardoise-100" />

                {g.fiches.map((fiche) => (
                  <div key={fiche.id} className="rounded-xl bg-ardoise-50/60 border border-ardoise-100 p-3.5">
                    <div className="flex items-start gap-2.5">
                      <BookOpen className="h-4 w-4 mt-0.5 shrink-0 text-ardoise-400" />
                      <div>
                        <p className="text-sm font-bold text-marine-900">{fiche.titre}</p>
                        <p className="text-xs text-ardoise-500 mt-0.5 leading-relaxed">{fiche.resume}</p>
                        <ul className="mt-2 space-y-1.5">
                          {fiche.contenu.map((ligne, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                              <span className="text-xs text-ardoise-700 leading-relaxed">{ligne}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                {g.vigilances.length > 0 && (
                  <div className="rounded-xl bg-peche-50 border border-peche-200 p-3.5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <AlertTriangle className="h-4 w-4 text-peche-600 shrink-0" />
                      <p className="text-xs font-bold text-peche-700 uppercase tracking-wide">
                        Points de vigilance
                      </p>
                    </div>
                    <ul className="space-y-2">
                      {g.vigilances.map((v, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-peche-400" />
                          <span className="text-xs text-ardoise-700 leading-relaxed">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {g.infos.length > 0 && (
                  <div className="rounded-xl bg-marine-50 border border-marine-100 p-3.5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Info className="h-4 w-4 text-marine-500 shrink-0" />
                      <p className="text-xs font-bold text-marine-600 uppercase tracking-wide">Infos</p>
                    </div>
                    <ul className="space-y-1.5">
                      {g.infos.map((info, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-marine-300" />
                          <span className="text-xs text-ardoise-600 leading-relaxed">{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {g.fiches.length === 0 && g.vigilances.length === 0 && g.infos.length === 0 && (
                  <p className="text-center text-xs text-ardoise-400 py-2">
                    Aucune fiche pour cette thématique
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
