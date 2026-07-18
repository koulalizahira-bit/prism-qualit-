"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ShieldCheck, Eye, X, ArrowLeft, Clock, Lightbulb, Search } from "lucide-react";
import {
  CHAPITRES_HAS,
  OBJECTIFS_HAS,
  CRITERES_HAS,
  type CritereHAS,
  type CritereType,
} from "@/lib/hasReferentielData";
import { TRADUCTION_TERRAIN } from "@/lib/hasReferentielTerrain";
import { HAS_METHODES_EVAL, type MethodeEval } from "@/lib/hasMethodesEval";

// Relie un libellé de méthode (dans les critères) à sa fiche pédagogique.
const METHODE_MAP: Record<string, string> = {
  "Patient traceur": "patient_traceur",
  "Parcours traceur": "parcours_traceur",
  "Audit système": "audit_systeme",
  "Traceur ciblé": "traceur_cible",
  "Observation": "observation",
};

const CHAP_BAR = ["bg-menthe-400", "bg-lavande-400", "bg-peche-400"];

function typeChip(type: CritereType): string {
  return type === "Impératif"
    ? "bg-peche-100 text-peche-700"
    : type === "Standard"
      ? "bg-menthe-100 text-menthe-700"
      : "bg-lavande-100 text-lavande-700";
}
function typeDot(type: CritereType): string {
  return type === "Impératif" ? "bg-peche-500" : type === "Standard" ? "bg-menthe-400" : "bg-lavande-400";
}

export default function ArborescenceHAS() {
  const [openObj, setOpenObj] = useState<string | null>(null);
  const [selected, setSelected] = useState<CritereHAS | null>(null);
  const [methode, setMethode] = useState<MethodeEval | null>(null);
  const [search, setSearch] = useState("");

  const critByObj = useMemo(() => {
    const m = new Map<string, CritereHAS[]>();
    for (const c of CRITERES_HAS) {
      const arr = m.get(c.objectif) ?? [];
      arr.push(c);
      m.set(c.objectif, arr);
    }
    return m;
  }, []);

  // Recherche par code (ex: "1.3" ou "3.4-06") ou par mot-clé (ex: "douleur", "dignité").
  const searchResults = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return null;
    return CRITERES_HAS.filter(
      (c) =>
        c.code.toLowerCase().includes(needle) ||
        c.titre.toLowerCase().includes(needle) ||
        c.intention.toLowerCase().includes(needle),
    );
  }, [search]);

  const ouvrirMethode = (nom: string) => {
    const id = METHODE_MAP[nom];
    const m = HAS_METHODES_EVAL.find((x) => x.id === id);
    if (m) setMethode(m);
  };

  return (
    <div className="space-y-4">
      {/* Recherche par code ou mot-clé */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ardoise-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un code (1.3, 3.4-06…) ou un mot-clé (douleur, dignité…)"
          className="w-full rounded-xl border border-ardoise-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-marine-900 placeholder:text-ardoise-400 focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {searchResults ? (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-ardoise-500">
            {searchResults.length} critère{searchResults.length !== 1 ? "s" : ""} trouvé
            {searchResults.length !== 1 ? "s" : ""}
          </p>
          {searchResults.map((c) => {
            const open = selected?.code === c.code;
            return (
              <div key={c.code} className="rounded-2xl border border-ardoise-100 bg-white shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSelected(open ? null : c)}
                  className="w-full flex items-start gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-ardoise-50/60"
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeDot(c.type)}`} />
                  <span className="min-w-0 flex-1">
                    <span className="text-[11px] font-mono font-bold text-ardoise-500">{c.code}</span>
                    <span className="block text-sm leading-snug text-marine-900">{c.titre}</span>
                  </span>
                </button>
                {open && (
                  <div className="px-2 pb-2">
                    <DetailBulle c={c} onClose={() => setSelected(null)} onMethode={ouvrirMethode} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Légende */}
          <div className="flex flex-wrap items-center gap-3">
            {(["Impératif", "Standard", "Avancé"] as CritereType[]).map((ty) => (
              <span key={ty} className="inline-flex items-center gap-1.5 text-xs text-ardoise-500">
                <span className={`h-2.5 w-2.5 rounded-full ${typeDot(ty)}`} />
                {ty}
              </span>
            ))}
          </div>

          {CHAPITRES_HAS.map((ch) => {
        const objs = OBJECTIFS_HAS.filter((o) => o.id.startsWith(String(ch.id)));
        const nb = CRITERES_HAS.filter((c) => c.chapitre === ch.id).length;
        return (
          <div key={ch.id} className="rounded-3xl border border-ardoise-100 bg-white shadow-sm overflow-hidden">
            {/* En-tête chapitre */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className={`h-9 w-1.5 rounded-full ${CHAP_BAR[ch.id - 1]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ardoise-400">
                  Chapitre {ch.id}
                </p>
                <p className="font-extrabold leading-tight text-marine-900">{ch.titre}</p>
                <p className="text-xs mt-0.5 text-ardoise-500">{ch.sous}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-ardoise-500">{nb}</span>
            </div>

            {/* Objectifs */}
            <div className="px-3 pb-3 space-y-1.5">
              {objs.map((o) => {
                const list = critByObj.get(o.id) ?? [];
                const isOpen = openObj === o.id;
                const nbImp = list.filter((c) => c.type === "Impératif").length;
                return (
                  <div key={o.id}>
                    <button
                      type="button"
                      onClick={() => setOpenObj(isOpen ? null : o.id)}
                      className="w-full flex items-center gap-3 rounded-2xl border border-ardoise-100 bg-ardoise-50/50 px-3.5 py-2.5 text-left transition-colors hover:bg-ardoise-50"
                    >
                      <span className="shrink-0 rounded-lg bg-marine-50 px-2 py-0.5 text-[11px] font-mono font-bold text-marine-600">
                        {o.id}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-semibold text-marine-900">
                        {o.titre}
                      </span>
                      {nbImp > 0 && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeChip("Impératif")}`}>
                          {nbImp} imp.
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-ardoise-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-1 space-y-1 pl-2">
                        {list.map((c) => {
                          const open = selected?.code === c.code;
                          return (
                            <div key={c.code}>
                              <button
                                type="button"
                                onClick={() => setSelected(open ? null : c)}
                                className="w-full flex items-start gap-2.5 rounded-xl border-b border-ardoise-100 px-3 py-2 text-left transition-colors hover:bg-ardoise-50/60"
                              >
                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeDot(c.type)}`} />
                                <span className="min-w-0 flex-1">
                                  <span className="text-[11px] font-mono font-bold text-ardoise-500">{c.code}</span>
                                  <span className="block text-sm leading-snug text-marine-900">{c.titre}</span>
                                </span>
                                {c.champ === "Soins critiques" && (
                                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${typeChip("Standard")}`}>
                                    USI
                                  </span>
                                )}
                              </button>

                              {open && (
                                <DetailBulle
                                  c={c}
                                  onClose={() => setSelected(null)}
                                  onMethode={ouvrirMethode}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
          })}
        </>
      )}

      {/* Overlay fiche méthode */}
      {methode && <MethodeOverlay m={methode} onClose={() => setMethode(null)} />}
    </div>
  );
}

function DetailBulle({
  c,
  onClose,
  onMethode,
}: {
  c: CritereHAS;
  onClose: () => void;
  onMethode: (nom: string) => void;
}) {
  const terrain = TRADUCTION_TERRAIN[c.code];
  const estImperatif = c.type === "Impératif";
  return (
    <div className="mt-1 mb-2 rounded-2xl border border-ardoise-100 bg-ardoise-50/50 px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeChip(c.type)}`}>
            {estImperatif && <ShieldCheck className="mr-1 inline h-3 w-3" />}
            {c.type}
          </span>
          <span className="rounded-full bg-ardoise-100 px-2 py-0.5 text-[10px] font-semibold text-ardoise-600">
            {c.champ}
          </span>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 text-ardoise-400 hover:opacity-70" aria-label="Fermer">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Ce qu'on attend de toi (fiche enrichie pour les impératifs) */}
      <div className={`mt-3 rounded-xl border px-3 py-2.5 ${estImperatif ? "bg-peche-50 border-peche-200" : "bg-menthe-50 border-menthe-200"}`}>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${estImperatif ? "text-peche-700" : "text-menthe-700"}`}>
          {estImperatif ? "Ce qu'on attend concrètement de toi" : "Ce que ça veut dire pour toi"}
        </p>
        <p className="text-sm leading-relaxed text-ardoise-700">{terrain ?? c.intention}</p>
      </div>

      {/* Intention officielle du manuel */}
      {terrain && c.intention && (
        <p className="mt-2 text-xs leading-relaxed italic text-ardoise-400">Manuel HAS : {c.intention}</p>
      )}

      {/* Méthodes d'évaluation — cliquables */}
      {c.methodes.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1.5 text-ardoise-400">
            <Eye className="h-3 w-3" />
            L&apos;expert le vérifie par
          </p>
          <div className="flex flex-wrap gap-1.5">
            {c.methodes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onMethode(m)}
                className="rounded-lg bg-marine-50 px-2.5 py-1 text-[11px] font-medium text-marine-700 hover:bg-marine-100 transition-colors"
              >
                {m} ›
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Overlay plein écran : fiche pédagogique d'une méthode d'évaluation ──
function MethodeOverlay({ m, onClose }: { m: MethodeEval; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-marine-900/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-ardoise-100 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-ardoise-100 bg-white px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl bg-ardoise-50 px-3 py-1.5 text-sm font-bold text-marine-800 hover:bg-ardoise-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xl leading-none">{m.emoji}</span>
            <p className="font-extrabold text-marine-900 leading-tight truncate">{m.nom}</p>
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          <p className="text-sm text-ardoise-600 leading-relaxed">{m.sousTitre}</p>

          {/* Étapes */}
          <ol className="space-y-2.5">
            {m.etapes.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-menthe-100 text-xs font-black text-menthe-700">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-marine-900 leading-snug">{e.titre}</p>
                    {e.duree && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-lavande-100 px-2 py-0.5 text-[10px] font-bold text-lavande-700">
                        <Clock className="h-3 w-3" />
                        {e.duree}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ardoise-500 leading-relaxed">{e.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Liste (cibles / thèmes) */}
          {m.liste && (
            <div className="rounded-2xl border border-menthe-200 bg-menthe-50 px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-menthe-700 mb-2">{m.liste.titre}</p>
              <div className="flex flex-wrap gap-1.5">
                {m.liste.items.map((it, i) => (
                  <span key={i} className="rounded-lg border border-menthe-200 bg-white px-2 py-1 text-[11px] font-medium text-menthe-700">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* À retenir */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-peche-200 bg-peche-50 px-3.5 py-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-peche-600" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-peche-700 mb-0.5">À retenir</p>
              <p className="text-xs text-ardoise-700 leading-relaxed">{m.aRetenir}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
