import { getDb } from "@/lib/db";
import {
  serviceConformite,
  serviceEvolution,
  serviceThemeScores,
  statutFromScore,
  latestAudit,
  auditSectionScore,
  thematiquesEnAlerte,
  effectifParRole,
} from "@/lib/scoring";
import Gauge from "@/components/Gauge";
import EvolutionChart from "@/components/charts/EvolutionChart";
import { StatCard, ThemeScoreList, StatusBadge, ProgressBar } from "@/components/cards";
import { roleLabel } from "@/lib/auth";
import { formatDate } from "@/lib/ui";
import { Lock, Activity, AlertTriangle, ClipboardCheck, Users } from "lucide-react";

export default async function SuperieurDashboard() {
  const db = await getDb();
  const conformite = serviceConformite(db);
  const statut = statutFromScore(conformite, db.config);
  const evolution = serviceEvolution(db);
  const themeScores = serviceThemeScores(db);
  const alertes = thematiquesEnAlerte(db);
  const last = latestAudit(db);
  const effectifs = effectifParRole(db);

  const moisCourant = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-marine-900">Synthèse de pôle</h1>
          <p className="capitalize text-ardoise-500">{moisCourant} · {db.config.nomService}</p>
          {last && <p className="mt-1 text-sm text-ardoise-400">Dernier audit : {formatDate(last.date)}</p>}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-marine-50 px-3 py-1.5 text-sm font-semibold text-marine-700">
          <Lock className="h-4 w-4" /> Lecture seule
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Conformité service" value={conformite === null ? "—" : `${conformite}%`} sub={statut === "vert" ? "Conforme" : "À renforcer"} accent={statut} icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Objectif HAS" value={`${db.config.objectif}%`} sub="cible des critères" accent="turquoise" icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard label="Thématiques en alerte" value={alertes.length} sub={`sous ${db.config.objectif}%`} accent={alertes.length ? "rouge" : "vert"} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard label="Effectif" value={db.agents.length} sub="agents suivis" accent="marine" icon={<Users className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center justify-center">
          <h2 className="mb-2 self-start text-lg font-bold text-marine-900">Conformité globale</h2>
          <Gauge score={conformite} thresholds={{ statutVert: db.config.statutVert, statutOrange: db.config.statutOrange }} />
          <div className="mt-3"><StatusBadge statut={statut} /></div>
        </div>
        <div className="card lg:col-span-2">
          <h2 className="mb-1 text-lg font-bold text-marine-900">Évolution des audits</h2>
          <p className="mb-3 text-sm text-ardoise-500">Conformité du service (2 audits / mois)</p>
          <EvolutionChart data={evolution} seuil={db.config.objectif} />
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-bold text-marine-900">Conformité par tour</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {db.sections.slice().sort((a, b) => a.ordre - b.ordre).map((s) => {
            const sc = last ? auditSectionScore(last, s) : null;
            const st = statutFromScore(sc, db.config);
            return (
              <div key={s.id} className="rounded-2xl border border-ardoise-100 p-4">
                <p className="mb-2 text-sm font-semibold text-marine-900">{s.nom}</p>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-marine-900">{sc === null ? "—" : `${sc}%`}</span>
                  <StatusBadge statut={st} />
                </div>
                <ProgressBar value={sc} statut={st} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-bold text-marine-900">Conformité par thématique HAS</h2>
          <ThemeScoreList scores={themeScores} />
        </div>
        <div className="card">
          <h2 className="mb-4 text-lg font-bold text-marine-900">Effectif par métier</h2>
          <div className="space-y-3">
            {effectifs.map((e) => (
              <div key={e.role} className="flex items-center justify-between rounded-2xl bg-ardoise-50 px-4 py-3">
                <span className="font-bold text-marine-900">{roleLabel(e.role)}</span>
                <span className="text-xl font-extrabold text-marine-900">{e.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
