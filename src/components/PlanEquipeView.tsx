"use client";

import { useState, useTransition } from "react";
import type { PaqssAction, StatutAction } from "@/lib/types";
import { setPaqssStatutAction } from "@/app/actions/paqss";
import { formatDate } from "@/lib/ui";
import { CheckCircle2, Clock, Circle, MinusCircle, Ban, ChevronDown, ClipboardCheck, ArrowRight, Users } from "lucide-react";

const STATUT_INFO: Record<StatutAction, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  realisee: { label: "Réalisée", cls: "bg-vert-soft text-vert", icon: CheckCircle2 },
  en_cours: { label: "En cours", cls: "bg-orange-soft text-orange", icon: Clock },
  non_initiee: { label: "À initier", cls: "bg-ardoise-100 text-ardoise-500", icon: Circle },
  non_concerne: { label: "Non concerné", cls: "bg-ardoise-100 text-ardoise-400", icon: MinusCircle },
  sans_objet: { label: "Sans objet", cls: "bg-ardoise-100 text-ardoise-400", icon: Ban },
};
const STATUT_ORDRE: StatutAction[] = ["non_initiee", "en_cours", "realisee", "non_concerne", "sans_objet"];

function StatutControl({ statut, onChange }: { statut: StatutAction; onChange: (s: StatutAction) => void }) {
  const si = STATUT_INFO[statut];
  const SIcon = si.icon;
  return (
    <span className={`relative inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full py-1 pl-2.5 pr-6 text-xs font-bold ring-1 ring-inset ring-black/5 transition hover:brightness-95 ${si.cls}`}>
      <SIcon className="h-3.5 w-3.5" /> {si.label}
      <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 opacity-60" />
      <select
        value={statut}
        onChange={(e) => onChange(e.target.value as StatutAction)}
        aria-label="Modifier le statut de l'action"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {STATUT_ORDRE.map((s) => (
          <option key={s} value={s}>{STATUT_INFO[s].label}</option>
        ))}
      </select>
    </span>
  );
}

export interface EquipeGroupe {
  auditId: string;
  auditDate: string | null;
  auditNom: string;
  actions: PaqssAction[];
}

export default function PlanEquipeView({ groupes }: { groupes: EquipeGroupe[] }) {
  const [statuts, setStatuts] = useState<Record<string, StatutAction>>(() =>
    Object.fromEntries(groupes.flatMap((g) => g.actions.map((a) => [a.id, a.statut]))),
  );
  const [, startTransition] = useTransition();
  const stat = (a: PaqssAction) => statuts[a.id] ?? a.statut;
  function change(id: string, s: StatutAction) {
    setStatuts((prev) => ({ ...prev, [id]: s }));
    startTransition(() => void setPaqssStatutAction(id, s));
  }

  if (groupes.length === 0) {
    return (
      <div className="card text-center py-10">
        <ClipboardCheck className="mx-auto h-10 w-10 text-ardoise-300" />
        <p className="mt-3 font-bold text-marine-900">Aucune action d&apos;équipe pour le moment</p>
        <p className="mt-1 text-sm text-ardoise-500">
          Depuis un audit, ouvrez les <strong>Rapports</strong> et créez une action sur chaque
          non-conformité : elle apparaîtra ici, rattachée à son audit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-2xl bg-marine-50 px-4 py-3 text-sm text-marine-800">
        <Users className="mt-0.5 h-4 w-4 shrink-0 text-marine-500" />
        <span>
          Ce sont les actions <strong>de terrain</strong>, pour l&apos;équipe soignante, issues des
          non-conformités relevées lors des audits. Chaque action est rattachée à son audit source.
        </span>
      </div>

      {groupes.map((g) => (
        <section key={g.auditId}>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-marine-900 text-white">
              <ClipboardCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-marine-900 leading-tight">{g.auditNom}</h3>
              <p className="text-xs text-ardoise-500">
                {g.auditDate ? `Audit du ${formatDate(g.auditDate)}` : "Audit source"} · {g.actions.length} action{g.actions.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {g.actions.map((a) => (
              <article key={a.id} className="card">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h4 className="font-bold text-marine-900">{a.titre}</h4>
                  <StatutControl statut={stat(a)} onChange={(s) => change(a.id, s)} />
                </div>
                <p className="text-sm text-ardoise-600">
                  <span className="font-semibold text-marine-700">Ce qu&apos;on améliore : </span>
                  {a.amelioration}
                </p>
                {a.ceQueJeFais && (
                  <div className="mt-2 flex items-start gap-2 rounded-xl bg-turquoise-50 px-3 py-2 text-sm text-turquoise-700">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-turquoise-500" />
                    <span><span className="font-semibold">Ce que je fais : </span>{a.ceQueJeFais}</span>
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-ardoise-400">
                  {a.objectif && <span>🎯 {a.objectif}</span>}
                  <span>⏱ {a.echeance}</span>
                  <span>👥 {a.responsable}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
