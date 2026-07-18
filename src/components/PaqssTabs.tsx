"use client";

import { useState, useTransition } from "react";
import type { PaqssAction, StatutAction, Thematique } from "@/lib/types";
import { setPaqssStatutAction } from "@/app/actions/paqss";
import { Sparkles, Table2, CheckCircle2, Clock, Circle, MinusCircle, Ban, ChevronDown, ArrowRight, ListTodo, AlertTriangle, Megaphone } from "lucide-react";

const STATUT_INFO: Record<StatutAction, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  realisee: { label: "Réalisée", cls: "bg-vert-soft text-vert", icon: CheckCircle2 },
  en_cours: { label: "En cours", cls: "bg-orange-soft text-orange", icon: Clock },
  non_initiee: { label: "À initier", cls: "bg-ardoise-100 text-ardoise-500", icon: Circle },
  non_concerne: { label: "Non concerné", cls: "bg-ardoise-100 text-ardoise-400", icon: MinusCircle },
  sans_objet: { label: "Sans objet", cls: "bg-ardoise-100 text-ardoise-400", icon: Ban },
};

// Ordre proposé dans le menu déroulant
const STATUT_ORDRE: StatutAction[] = ["non_initiee", "en_cours", "realisee", "non_concerne", "sans_objet"];

// Badge de statut — cliquable (menu déroulant) en mode éditable, sinon simple étiquette.
function StatutControl({
  statut,
  editable,
  onChange,
}: {
  statut: StatutAction;
  editable: boolean;
  onChange: (s: StatutAction) => void;
}) {
  const si = STATUT_INFO[statut];
  const SIcon = si.icon;

  if (!editable) {
    return (
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${si.cls}`}>
        <SIcon className="h-3.5 w-3.5" /> {si.label}
      </span>
    );
  }

  return (
    <span
      className={`relative inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full py-1 pl-2.5 pr-6 text-xs font-bold ring-1 ring-inset ring-black/5 transition hover:brightness-95 ${si.cls}`}
      title="Cliquer pour changer le statut"
    >
      <SIcon className="h-3.5 w-3.5" /> {si.label}
      <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 opacity-60" />
      <select
        value={statut}
        onChange={(e) => onChange(e.target.value as StatutAction)}
        aria-label="Modifier le statut de l'action"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {STATUT_ORDRE.map((s) => (
          <option key={s} value={s}>
            {STATUT_INFO[s].label}
          </option>
        ))}
      </select>
    </span>
  );
}

export default function PaqssTabs({
  paqss,
  thematiques,
  editable = false,
}: {
  paqss: PaqssAction[];
  thematiques: Thematique[];
  editable?: boolean;
}) {
  const [view, setView] = useState<"clair" | "suivi">("clair");

  // État local optimiste : la modification s'affiche tout de suite, puis on enregistre.
  const [statuts, setStatuts] = useState<Record<string, StatutAction>>(() =>
    Object.fromEntries(paqss.map((p) => [p.id, p.statut]))
  );
  const [, startTransition] = useTransition();

  const stat = (p: PaqssAction): StatutAction => statuts[p.id] ?? p.statut;

  function changeStatut(id: string, statut: StatutAction) {
    setStatuts((s) => ({ ...s, [id]: statut }));
    startTransition(() => {
      void setPaqssStatutAction(id, statut);
    });
  }

  const themes = thematiques.slice().sort((a, b) => a.ordre - b.ordre);
  const themeName = (id: string) => thematiques.find((t) => t.id === id)?.nom ?? "—";

  const counts = {
    realisee: paqss.filter((p) => stat(p) === "realisee").length,
    en_cours: paqss.filter((p) => stat(p) === "en_cours").length,
    non_initiee: paqss.filter((p) => stat(p) === "non_initiee").length,
  };
  const nonApplicable = paqss.filter((p) => stat(p) === "non_concerne" || stat(p) === "sans_objet").length;

  return (
    <div className="space-y-6">
      {/* Sélecteur de vue */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("clair")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${view === "clair" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-emerald-800 border-2 border-emerald-100"}`}
        >
          <Sparkles className="h-4 w-4" /> En clair
        </button>
        <button
          onClick={() => setView("suivi")}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${view === "suivi" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white text-emerald-800 border-2 border-emerald-100"}`}
        >
          <Table2 className="h-4 w-4" /> Tableau de suivi
        </button>
      </div>

      {editable && (
        <p className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
          <ChevronDown className="h-3.5 w-3.5" /> Cliquez sur un statut pour le modifier — l&apos;enregistrement est automatique.
        </p>
      )}

      {/* Mini résumé d'avancement horizontal */}
      <div className="flex items-center gap-3 rounded-2xl bg-ardoise-50 px-4 py-3">
        <span className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
          <span className="font-bold text-emerald-700">{counts.realisee}</span>
          <span className="text-ardoise-500 text-xs">réalisées</span>
        </span>
        <span className="text-ardoise-200">·</span>
        <span className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="font-bold text-amber-600">{counts.en_cours}</span>
          <span className="text-ardoise-500 text-xs">en cours</span>
        </span>
        <span className="text-ardoise-200">·</span>
        <span className="flex items-center gap-1.5 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-ardoise-300 inline-block" />
          <span className="font-bold text-ardoise-500">{counts.non_initiee}</span>
          <span className="text-ardoise-500 text-xs">à initier</span>
        </span>
        {nonApplicable > 0 && (
          <>
            <span className="text-ardoise-200">·</span>
            <span className="text-xs text-ardoise-400">{nonApplicable} n/a</span>
          </>
        )}
      </div>

      {view === "clair" ? (
        <div className="space-y-6">
          {themes.map((t) => {
            const actions = paqss.filter((p) => p.themeId === t.id);
            if (actions.length === 0) return null;
            return (
              <section key={t.id}>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-marine-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-marine-900 text-sm text-white">{t.ordre}</span>
                  {t.nom}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {actions.map((a) => (
                    <article key={a.id} className="card">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="font-bold text-marine-900">{a.titre}</h3>
                        <StatutControl statut={stat(a)} editable={editable} onChange={(s) => changeStatut(a.id, s)} />
                      </div>
                      <p className="text-sm text-ardoise-600">
                        <span className="font-semibold text-marine-700">Ce qu&apos;on améliore : </span>
                        {a.amelioration}
                      </p>
                      <div className="mt-2 flex items-start gap-2 rounded-xl bg-turquoise-50 px-3 py-2 text-sm text-turquoise-700">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-turquoise-500" />
                        <span><span className="font-semibold">Ce que je fais : </span>{a.ceQueJeFais}</span>
                      </div>
                      {a.objectif && <p className="mt-2 text-xs font-semibold text-ardoise-400">🎯 Objectif : {a.objectif}</p>}
                    </article>
                  ))}
                </div>

                {(t.vigilances?.length || t.infos?.length) ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {t.vigilances?.length ? (
                      <div className="rounded-2xl border border-orange/30 bg-orange-soft/50 p-4">
                        <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-orange">
                          <AlertTriangle className="h-4 w-4" /> Points de vigilance
                        </h4>
                        <ul className="space-y-1.5">
                          {t.vigilances.map((v, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-marine-900">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" /> {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {t.infos?.length ? (
                      <div className="rounded-2xl border border-turquoise-100 bg-turquoise-50 p-4">
                        <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-turquoise-700">
                          <Megaphone className="h-4 w-4" /> Infos
                        </h4>
                        <ul className="space-y-1.5">
                          {t.infos.map((v, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-marine-900">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise-500" /> {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ardoise-100 text-left">
                <th className="px-4 py-3 font-bold text-marine-900">Action</th>
                <th className="px-3 py-3 font-semibold text-marine-700">Thématique</th>
                <th className="px-3 py-3 font-semibold text-marine-700">Objectif</th>
                <th className="px-3 py-3 font-semibold text-marine-700">Responsable</th>
                <th className="px-3 py-3 font-semibold text-marine-700">Échéance</th>
                <th className="px-3 py-3 text-center font-semibold text-marine-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {paqss.map((a) => (
                <tr key={a.id} className="border-b border-ardoise-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-marine-900">{a.titre}</td>
                  <td className="px-3 py-3 text-ardoise-600">{themeName(a.themeId)}</td>
                  <td className="px-3 py-3 text-ardoise-600">{a.objectif ?? "—"}</td>
                  <td className="px-3 py-3 text-ardoise-600">{a.responsable}</td>
                  <td className="px-3 py-3 text-ardoise-600">{a.echeance}</td>
                  <td className="px-3 py-3 text-center">
                    <StatutControl statut={stat(a)} editable={editable} onChange={(s) => changeStatut(a.id, s)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-xs text-ardoise-400">
        <ListTodo className="h-3.5 w-3.5" /> Synthèse du Programme d&apos;Amélioration de la Qualité et Sécurité des Soins (PAQSS) du pôle.
      </p>
    </div>
  );
}
