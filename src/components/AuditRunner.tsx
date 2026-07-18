"use client";

import { useState } from "react";
import AuditForm from "./AuditForm";
import { ArrowLeft, ClipboardCheck, Target, ChevronRight } from "lucide-react";

interface ZoneLite { id: string; label: string }
interface ItemLite { id: string; libelle: string; themeId: string }
interface SectionLite { id: string; nom: string; ordre: number; zones: ZoneLite[]; items: ItemLite[] }
interface GrilleLite {
  id: string;
  nom: string;
  type: "service" | "thematique";
  description?: string;
  frequence?: string;
  criteresHAS: string[];
  sections: SectionLite[];
}

export default function AuditRunner({ grilles }: { grilles: GrilleLite[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = grilles.find((g) => g.id === selectedId) ?? null;

  const service = grilles.find((g) => g.type === "service");
  const thematiques = grilles.filter((g) => g.type === "thematique");

  if (selected) {
    const nbItems = selected.sections.reduce((n, s) => n + s.items.length, 0);
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-ardoise-100 px-3 py-1.5 text-sm font-bold text-marine-800 hover:bg-ardoise-200"
        >
          <ArrowLeft className="h-4 w-4" /> Changer d&apos;audit
        </button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-marine-900">
            <ClipboardCheck className="h-6 w-6 text-turquoise-500" />
            {selected.nom}
          </h1>
          {selected.description && (
            <p className="mt-0.5 text-sm text-ardoise-500">{selected.description}</p>
          )}
        </div>
        <AuditForm
          sections={selected.sections}
          grilleId={selected.id}
          grilleNom={selected.nom}
          thematique={selected.type === "thematique"}
          key={selected.id}
        />
        <p className="text-center text-xs text-ardoise-400">{nbItems} points de contrôle</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <ClipboardCheck className="h-7 w-7 text-turquoise-500" />
          Réaliser un audit
        </h1>
        <p className="text-ardoise-500">Choisissez l&apos;audit à réaliser : l&apos;audit global du service ou un audit thématique ciblé.</p>
      </div>

      {/* Audit service — mis en avant */}
      {service && (
        <button
          type="button"
          onClick={() => setSelectedId(service.id)}
          className="block w-full rounded-3xl bg-gradient-to-br from-marine-900 to-marine-700 p-5 text-left text-white shadow-lg transition hover:from-marine-800"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <Target className="h-4 w-4 text-turquoise-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-white/65">Audit de référence</p>
              </div>
              <p className="text-lg font-extrabold">{service.nom}</p>
              <p className="mt-1 text-sm text-white/70">{service.description}</p>
              {service.frequence && (
                <p className="mt-2 text-xs font-semibold text-turquoise-300">{service.frequence}</p>
              )}
            </div>
            <ChevronRight className="h-6 w-6 shrink-0 text-white/60" />
          </div>
        </button>
      )}

      {/* Audits thématiques */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ardoise-400">
          Audits thématiques ciblés
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {thematiques.map((g) => {
            const nbItems = g.sections.reduce((n, s) => n + s.items.length, 0);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedId(g.id)}
                className="flex items-start justify-between gap-3 rounded-2xl border border-ardoise-100 bg-white p-4 text-left shadow-sm transition hover:border-turquoise-300 hover:bg-turquoise-50/40"
              >
                <div className="min-w-0">
                  <p className="font-bold text-marine-900">{g.nom}</p>
                  <p className="mt-0.5 text-xs text-ardoise-500">
                    {nbItems} points{g.frequence ? ` · ${g.frequence}` : ""}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-ardoise-300" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
