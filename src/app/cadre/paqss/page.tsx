import { getDb } from "@/lib/db";
import PlansDemarche from "@/components/PlansDemarche";
import PdfQuickLink from "@/components/PdfQuickLink";
import { plansCadre, plansEquipeParAudit } from "@/lib/scoring";
import type { EquipeGroupe } from "@/components/PlanEquipeView";
import { Rocket } from "lucide-react";

export default async function CadrePaqssPage({
  searchParams,
}: {
  searchParams?: Promise<{ plan?: string }>;
}) {
  const db = await getDb();
  const sp = (await searchParams) ?? {};
  const initialTab = sp.plan === "cadre" ? "cadre" : "equipe";

  const cadre = plansCadre(db);
  const groupesRaw = plansEquipeParAudit(db);

  // Nom de l'audit source pour chaque groupe (via sa grille).
  const auditNom = (auditId: string): string => {
    const audit = db.audits.find((a) => a.id === auditId);
    const grilleId = audit?.grilleId ?? "g-service";
    return (db.grilles ?? []).find((g) => g.id === grilleId)?.nom ?? "Audit service";
  };
  const equipeGroupes: EquipeGroupe[] = groupesRaw.map((g) => ({
    ...g,
    auditNom: auditNom(g.auditId),
  }));

  return (
    <div className="space-y-6">
      {/* ── Bandeau ── */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 p-5 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Rocket className="h-5 w-5 text-emerald-100" />
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest">
            Démarche qualité
          </p>
        </div>
        <h1 className="text-xl font-extrabold leading-tight">Plans d&apos;action</h1>
        <p className="text-sm text-emerald-100 mt-0.5">
          Deux plans complémentaires : le plan de <strong>terrain</strong> de l&apos;équipe (issu des audits)
          et le plan de <strong>pilotage</strong> du cadre (PAQSS service).
        </p>
        <div className="mt-3">
          <PdfQuickLink />
        </div>
      </div>

      <PlansDemarche
        cadre={cadre}
        equipeGroupes={equipeGroupes}
        thematiques={db.thematiques}
        initialTab={initialTab}
      />
    </div>
  );
}
