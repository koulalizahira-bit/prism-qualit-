"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { HasMethode } from "@/lib/has";

function MethodeCard({
  m,
  isOpen,
  onToggle,
}: {
  m: HasMethode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-ardoise-100 bg-white overflow-hidden shadow-sm">
      {/* ─ Bouton accordion ─ */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-ardoise-50/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl leading-none flex-shrink-0">{m.emoji}</span>
          <div className="min-w-0">
            <p className="font-bold text-marine-900 text-sm leading-snug">{m.nom}</p>
            <p className="text-xs text-ardoise-400 mt-0.5">{m.frequence}</p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-ardoise-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ─ Contenu déroulé ─ */}
      {isOpen && (
        <div className="border-t border-ardoise-100 px-4 pb-4 pt-3 space-y-3">
          {/* C'est quoi ? */}
          <div>
            <p className="text-[10px] font-bold text-ardoise-400 uppercase tracking-wider mb-1">
              C&apos;est quoi ?
            </p>
            <p className="text-sm text-ardoise-700 leading-relaxed">{m.definition}</p>
          </div>

          {/* Concrètement */}
          <div className="rounded-xl bg-turquoise-50 border border-turquoise-100 px-3 py-2.5">
            <p className="text-[10px] font-bold text-turquoise-600 uppercase tracking-wider mb-1">
              Concrètement pour moi
            </p>
            <p className="text-sm text-turquoise-900 leading-relaxed">{m.concretement}</p>
          </div>

          {/* Exemple USI */}
          {m.exempleUSI && (
            <div className="rounded-xl bg-marine-50 border border-marine-100 px-3 py-2.5">
              <p className="text-[10px] font-bold text-marine-600 uppercase tracking-wider mb-1">
                Exemple en soins intensifs
              </p>
              <p className="text-sm text-marine-800 leading-relaxed">{m.exempleUSI}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HasMethodesAccordion({
  methodes,
}: {
  methodes: HasMethode[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  const certif = methodes.filter((m) => m.categorie === "certification");
  const outils = methodes.filter((m) => m.categorie === "outil_qualite");

  return (
    <div className="space-y-6">
      {/* ─ Explication générale ─ */}
      <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3">
        <p className="text-sm text-indigo-900 leading-relaxed">
          <strong>Une méthode de certification</strong>, c&apos;est la façon dont les
          experts-visiteurs de la HAS vérifient sur le terrain qu&apos;un critère est
          respecté (en observant, en relisant un dossier, en interrogeant l&apos;équipe…).
          Le référentiel HAS V2025 en compte <strong>5</strong>. Les outils qualité du
          service (CREX, RMM, EPP…) sont différents : ce sont des pratiques internes qui
          nourrissent votre préparation à la certification, mais que les experts-visiteurs
          n&apos;utilisent pas eux-mêmes pour évaluer.
        </p>
      </div>

      {/* ─ Les 5 méthodes de certification HAS ─ */}
      <div>
        <p className="mb-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
          Les 5 méthodes de certification HAS
        </p>
        <div className="space-y-2">
          {certif.map((m) => (
            <MethodeCard key={m.id} m={m} isOpen={open === m.id} onToggle={() => toggle(m.id)} />
          ))}
        </div>
      </div>

      {/* ─ Outils qualité du service ─ */}
      <div>
        <p className="mb-2 text-xs font-bold text-turquoise-600 uppercase tracking-wider">
          Outils qualité du service
        </p>
        <div className="space-y-2">
          {outils.map((m) => (
            <MethodeCard key={m.id} m={m} isOpen={open === m.id} onToggle={() => toggle(m.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
