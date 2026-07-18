"use client";

import { useMemo, useState, useTransition } from "react";
import { setHabilitationAction } from "@/app/actions/formations";
import { statutCellule, CELL_CLS, formationApplicable } from "@/lib/recyclage";

interface AgentLite { id: string; label: string; role: "IDE" | "AS" | "ASH"; habilitations?: Record<string, string> }
interface FormationLite { id: string; nom: string; objectif: number; priorite?: string; frequence?: string; validite?: number; roles?: ("IDE" | "AS" | "ASH")[] }

const PRIO_BADGE: Record<string, string> = {
  haute: "bg-rouge-soft text-rouge",
  moyenne: "bg-orange-soft text-orange",
  standard: "bg-ardoise-100 text-ardoise-500",
};

export default function HabilitationsTable({
  agents,
  formations,
}: {
  agents: AgentLite[];
  formations: FormationLite[];
}) {
  const [hab, setHab] = useState<Record<string, Record<string, string>>>(() => {
    const m: Record<string, Record<string, string>> = {};
    for (const a of agents) m[a.id] = { ...(a.habilitations ?? {}) };
    return m;
  });
  const [, startTransition] = useTransition();
  const [role, setRole] = useState<"Tous" | "IDE" | "AS" | "ASH">("Tous");

  // Une seule formation affichée à la fois par défaut (lisible sur mobile) — "toutes" pour tout voir.
  const [selF, setSelF] = useState<string>(formations[0]?.id ?? "toutes");
  const visibleFormations = selF === "toutes" ? formations : formations.filter((f) => f.id === selF);

  function save(agentId: string, fId: string, value: string) {
    setHab((h) => ({ ...h, [agentId]: { ...h[agentId], [fId]: value } }));
    startTransition(() => {
      void setHabilitationAction(agentId, fId, value);
    });
  }

  const stats = useMemo(() => {
    return visibleFormations.map((f) => {
      const concernes = agents.filter((a) => formationApplicable(f, a.role));
      const formes = concernes.filter((a) => (hab[a.id]?.[f.id] ?? "").trim()).length;
      const pct = concernes.length ? Math.round((formes / concernes.length) * 100) : null;
      const statut = pct === null ? "rouge" : pct >= f.objectif ? "vert" : pct >= f.objectif - 15 ? "orange" : "rouge";
      return { f, concernes: concernes.length, formes, pct, statut };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hab, visibleFormations, agents]);

  const statutColor: Record<string, string> = { vert: "text-vert", orange: "text-orange", rouge: "text-rouge" };
  const filtered = agents.filter((a) => (role === "Tous" ? true : a.role === role));

  return (
    <div className="space-y-6">
      {/* Indicateurs % formés */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.f.id} className="card !p-4">
            <div className="mb-1 flex items-center justify-between gap-1">
              <p className="text-sm font-semibold leading-tight text-marine-900">{s.f.nom}</p>
              {s.f.priorite && (
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${PRIO_BADGE[s.f.priorite] ?? ""}`}>
                  {s.f.priorite}
                </span>
              )}
            </div>
            <p className={`text-3xl font-extrabold ${statutColor[s.statut]}`}>{s.pct === null ? "—" : `${s.pct}%`}</p>
            <p className="text-xs text-ardoise-500">{s.formes}/{s.concernes} · objectif {s.f.objectif}%</p>
          </div>
        ))}
      </div>

      {/* Filtre rôle */}
      <div className="flex flex-wrap items-center gap-2">
        {(["Tous", "IDE", "AS", "ASH"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${role === r ? "bg-marine-900 text-white" : "bg-white text-marine-800 border-2 border-marine-100"}`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Sélecteur de formation — une seule à la fois par défaut, "Toutes" pour tout voir */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ardoise-500">
          Formation affichée
        </label>
        <select
          value={selF}
          onChange={(e) => setSelF(e.target.value)}
          className="w-full rounded-2xl border-2 border-marine-100 bg-white px-4 py-2.5 text-sm font-bold text-marine-900 outline-none focus:border-turquoise-500"
        >
          <option value="toutes">Toutes les formations</option>
          {formations.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Légende recyclage */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-ardoise-50 px-4 py-3 text-xs font-semibold">
        <span className="text-marine-900">Recyclage (AFGSU, UVIH…) :</span>
        <span className="inline-flex items-center gap-1.5 text-vert"><span className="h-3 w-3 rounded bg-vert-soft border border-vert/40" /> À jour</span>
        <span className="inline-flex items-center gap-1.5 text-orange"><span className="h-3 w-3 rounded bg-orange-soft border border-orange" /> Bientôt à recycler (dès 3 ans)</span>
        <span className="inline-flex items-center gap-1.5 text-rouge"><span className="h-3 w-3 rounded bg-rouge-soft border border-rouge" /> À recycler en urgence (4 ans et +)</span>
      </div>

      {/* Tableau dates */}
      <div className="card !p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ardoise-100">
              <th className="sticky left-0 z-10 bg-white px-3 py-3 text-left font-bold text-marine-900">Agent</th>
              {visibleFormations.map((f) => (
                <th key={f.id} className="px-2 py-3 text-center font-semibold text-marine-700" style={{ minWidth: 96 }}>
                  <span className="block text-xs leading-tight">{f.nom}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-ardoise-50 last:border-0">
                <td className="sticky left-0 z-10 bg-white px-3 py-1.5 font-semibold text-marine-900">{a.label}</td>
                {visibleFormations.map((f) => {
                  const ok = formationApplicable(f, a.role);
                  const val = hab[a.id]?.[f.id] ?? "";
                  if (!ok) return <td key={f.id} className="px-2 py-1.5 text-center text-ardoise-300">—</td>;
                  return (
                    <td key={f.id} className="px-1.5 py-1.5">
                      <input
                        defaultValue={val}
                        onBlur={(e) => {
                          if (e.target.value !== val) save(a.id, f.id, e.target.value);
                        }}
                        placeholder="—"
                        title={f.validite ? `Validité ${f.validite} ans` : undefined}
                        className={`w-full rounded-lg border px-2 py-1.5 text-center text-xs outline-none transition focus:border-turquoise-500 ${CELL_CLS[statutCellule(val, f.validite)]}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ardoise-400">
        Saisissez la date de formation (ex. « 05/2024 ») pour marquer l&apos;agent comme formé — laissez vide sinon. L&apos;enregistrement est automatique.
      </p>
    </div>
  );
}
