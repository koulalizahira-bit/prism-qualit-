import Link from "next/link";
import { getDb } from "@/lib/db";
import HabilitationsTable from "@/components/HabilitationsTable";
import GestionEffectif from "@/components/GestionEffectif";
import { recyclagesEnAlerte } from "@/lib/recyclage";
import { GraduationCap, ShieldCheck, AlertTriangle, ChevronRight, Trophy } from "lucide-react";

export default async function EquipePage() {
  const db = await getDb();
  const recyclage = recyclagesEnAlerte(db);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <GraduationCap className="h-7 w-7 text-turquoise-500" /> Formations de l&apos;équipe
        </h1>
        <p className="text-ardoise-500">
          {db.agents.length} agents · suivi des habilitations (objectifs PAQSS)
        </p>
      </div>

      <Link
        href="/cadre/quiz"
        className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 transition hover:bg-amber-100"
      >
        <span className="flex items-center gap-3">
          <Trophy className="h-5 w-5 shrink-0 text-amber-500" />
          <span className="text-sm font-semibold text-marine-900">
            Quiz de l&apos;équipe
            <span className="mt-0.5 block text-xs font-normal text-ardoise-500">
              Résultats, thèmes à renforcer, questions &amp; réponses
            </span>
          </span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-ardoise-300" />
      </Link>

      {recyclage.total > 0 && (
        <Link
          href="#habilitations"
          className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
            recyclage.rouge > 0
              ? "border-rouge/30 bg-rouge-soft/50 hover:bg-rouge-soft"
              : "border-orange/30 bg-orange-soft/50 hover:bg-orange-soft"
          }`}
        >
          <span className="flex items-center gap-3">
            <AlertTriangle className={`h-5 w-5 shrink-0 ${recyclage.rouge > 0 ? "text-rouge" : "text-orange"}`} />
            <span className="text-sm font-semibold text-marine-900">
              AFGSU — {recyclage.total} recyclage{recyclage.total > 1 ? "s" : ""} à prévoir
              {recyclage.rouge > 0 && (
                <span className="text-rouge"> · dont {recyclage.rouge} en urgence</span>
              )}
              <span className="mt-0.5 block text-xs font-normal text-ardoise-500">
                {(["IDE", "AS", "ASH"] as const)
                  .filter((r) => recyclage.parRole[r])
                  .map((r) => `${recyclage.parRole[r]} ${r}`)
                  .join(" · ")}{" "}
                concerné{recyclage.agentsConcernes > 1 ? "s" : ""} — voir le tableau ci-dessous
              </span>
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-ardoise-300" />
        </Link>
      )}

      <div className="flex items-center gap-2 rounded-2xl bg-turquoise-50 px-4 py-3 text-sm font-semibold text-turquoise-600">
        <ShieldCheck className="h-4 w-4" /> Effectif anonymisé (IDE 1, AS 1, ASH 1…). Cochez qui est formé : le % d&apos;agents formés se met à jour automatiquement.
      </div>

      <div id="habilitations">
        <HabilitationsTable agents={db.agents} formations={db.formations} />
      </div>

      <GestionEffectif agents={db.agents} />
    </div>
  );
}
