import { getDb } from "@/lib/db";
import {
  serviceConformite,
  serviceEvolution,
  serviceThemeScores,
  thematiquesEnAlerte,
  latestAudit,
  auditSectionScore,
  formationStats,
  themeEvolution,
  itemsNonConformes,
  grillesCoverage,
  plansCadre,
  plansEquipeParAudit,
} from "@/lib/scoring";
import { recyclagesEnAlerte } from "@/lib/recyclage";
import { PdfServiceButton, PdfAuditCrButton, PdfCertifButton } from "@/components/PdfButtons";
import { ThemeScoreList } from "@/components/cards";
import ThemeEvolutionSection from "@/components/ThemeEvolutionSection";
import { formatDate } from "@/lib/ui";
import type { ServicePdfData, AuditCrData, CertifPdfData } from "@/lib/pdf";
import { FileText, FileBadge2, FileCheck2, AlertTriangle, PlusCircle } from "lucide-react";
import { createPaqssFromItemAction } from "@/app/actions/paqss";

const STATUT_LABEL: Record<string, string> = {
  non_initiee: "À initier",
  en_cours: "En cours",
  realisee: "Réalisée",
  non_concerne: "Non concerné",
  sans_objet: "Sans objet",
};
const STATUT_COLOR: Record<string, string> = {
  non_initiee: "bg-red-100 text-red-700",
  en_cours: "bg-orange-100 text-orange-700",
  realisee: "bg-green-100 text-green-700",
  non_concerne: "bg-ardoise-100 text-ardoise-500",
  sans_objet: "bg-ardoise-100 text-ardoise-500",
};

export default async function RapportsPage() {
  const db = await getDb();
  const date = new Date().toLocaleDateString("fr-FR");
  const last = latestAudit(db);
  const themeScores = serviceThemeScores(db);
  const recyclage = recyclagesEnAlerte(db);

  // ---- Rapport global ----
  const serviceData: ServicePdfData = {
    etablissement: db.config.nomEtablissement,
    service: db.config.nomService,
    date,
    conformite: serviceConformite(db),
    objectif: db.config.objectif,
    dernierAudit: last ? `${formatDate(last.date)} (${last.roulement})` : "—",
    evolution: serviceEvolution(db).map((e) => ({ label: e.label, score: e.score })),
    themes: themeScores.map((t) => ({ nom: t.theme.nom, score: t.score })),
    sections: db.sections
      .slice()
      .sort((a, b) => a.ordre - b.ordre)
      .map((s) => ({ nom: s.nom, score: last ? auditSectionScore(last, s) : null })),
    grilles: grillesCoverage(db).map((c) => ({
      nom: c.grille.nom,
      type: c.grille.type,
      score: c.score,
      date: c.dernier ? formatDate(c.dernier.date) : null,
    })),
    alertes: thematiquesEnAlerte(db).map((a) => ({ nom: a.theme.nom, score: a.score })),
    formations: formationStats(db).map((s) => ({ nom: s.formation.nom, pct: s.pct, objectif: s.formation.objectif })),
  };

  // ---- Compte rendu du dernier audit ----
  const themeMap = Object.fromEntries(db.thematiques.map((t) => [t.id, t.nom]));
  const nonConformes = last
    ? itemsNonConformes(last, db).map((nc) => ({
        libelle: nc.item.libelle,
        theme: themeMap[nc.themeId] ?? nc.themeId,
        nbNon: nc.nbNon,
      }))
    : [];

  const crData: AuditCrData = {
    etablissement: db.config.nomEtablissement,
    service: db.config.nomService,
    date: last ? formatDate(last.date) : date,
    roulement: last?.roulement ?? "—",
    score: last
      ? (() => {
          let oui = 0, non = 0;
          for (const zones of Object.values(last.valeurs)) {
            for (const v of Object.values(zones)) {
              if (v === "OUI") oui++;
              else if (v === "NON") non++;
            }
          }
          const t = oui + non;
          return t === 0 ? null : Math.round((oui / t) * 100);
        })()
      : null,
    objectif: db.config.objectif,
    sections: db.sections
      .slice()
      .sort((a, b) => a.ordre - b.ordre)
      .map((s) => ({ nom: s.nom, score: last ? auditSectionScore(last, s) : null })),
    themeScores: themeScores.map((t) => ({ nom: t.theme.nom, score: t.score })),
    nonConformes,
    paqssActifs: db.paqss
      .filter((p) => p.statut === "en_cours" || p.statut === "non_initiee")
      .map((p) => ({ titre: p.titre, statut: p.statut, echeance: p.echeance })),
  };

  // ---- Dossier HAS ----
  const auditNomPourGrille = (auditId: string): string => {
    const audit = db.audits.find((a) => a.id === auditId);
    const grilleId = audit?.grilleId ?? "g-service";
    return (db.grilles ?? []).find((g) => g.id === grilleId)?.nom ?? "Audit service";
  };
  const certifData: CertifPdfData = {
    ...serviceData,
    planCadre: plansCadre(db).map((p) => ({
      titre: p.titre,
      statut: p.statut,
      echeance: p.echeance,
      responsable: p.responsable,
    })),
    planEquipe: plansEquipeParAudit(db).flatMap((g) =>
      g.actions.map((p) => ({
        titre: p.titre,
        statut: p.statut,
        echeance: p.echeance,
        responsable: p.responsable,
        auditNom: auditNomPourGrille(g.auditId),
      })),
    ),
    afgsuAlerte: recyclage,
  };

  // ---- Évolution par thématique ----
  const evolutionParTheme: Record<string, { label: string; score: number; date: string }[]> = {};
  for (const t of db.thematiques) {
    evolutionParTheme[t.id] = themeEvolution(db, t.id);
  }

  // ---- Non-conformités brutes (pour section plan d'action) ----
  const nonConformesRaw = last ? itemsNonConformes(last, db).slice(0, 15) : [];
  // Pour chaque item non conforme, on cherche les PAQSS actifs liés au même thème
  const paqssActifsParTheme: Record<string, typeof db.paqss> = {};
  for (const nc of nonConformesRaw) {
    if (!paqssActifsParTheme[nc.themeId]) {
      paqssActifsParTheme[nc.themeId] = db.paqss.filter(
        (p) => p.themeId === nc.themeId && p.statut !== "realisee" && p.statut !== "non_concerne" && p.statut !== "sans_objet",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <FileText className="h-7 w-7 text-turquoise-500" /> Rapports PDF
        </h1>
        <p className="text-ardoise-500">Pour la HAS, la direction ou la réunion de service</p>
      </div>

      {/* Boutons PDF */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* CR dernier audit */}
        <section className="card flex flex-col gap-3">
          <div className="flex items-center gap-2 text-base font-bold text-marine-900">
            <FileCheck2 className="h-5 w-5 text-turquoise-500" />
            Compte rendu d&apos;audit
          </div>
          <p className="text-sm text-ardoise-500">
            {last
              ? `Dernier audit : ${formatDate(last.date)} — ${last.roulement}`
              : "Aucun audit réalisé pour l'instant."}
          </p>
          {last ? (
            <PdfAuditCrButton data={crData} className="btn btn-primary mt-auto" />
          ) : (
            <span className="mt-auto text-sm text-ardoise-400 italic">Réalisez d&apos;abord un audit.</span>
          )}
        </section>

        {/* Rapport global */}
        <section className="card flex flex-col gap-3">
          <div className="flex items-center gap-2 text-base font-bold text-marine-900">
            <FileText className="h-5 w-5 text-turquoise-500" />
            Rapport global du service
          </div>
          <p className="text-sm text-ardoise-500">
            Conformité, thématiques HAS, évolution, plan d&apos;action.
          </p>
          <PdfServiceButton data={serviceData} className="btn btn-primary mt-auto" />
        </section>

        {/* Dossier HAS */}
        <section className="card flex flex-col gap-3">
          <div className="flex items-center gap-2 text-base font-bold text-marine-900">
            <FileBadge2 className="h-5 w-5 text-turquoise-500" />
            Dossier certification HAS
          </div>
          <p className="text-sm text-ardoise-500">
            3 pages : conformité + PAQSS complet + habilitations AFGSU.
          </p>
          <PdfCertifButton data={certifData} className="btn btn-primary mt-auto" />
        </section>
      </div>

      {/* Aperçu scores */}
      <section className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-marine-900">Score par thématique HAS</h2>
          {last && (
            <span className="text-xs text-ardoise-400">
              Dernier audit : {formatDate(last.date)}
            </span>
          )}
        </div>
        <ThemeScoreList scores={themeScores} />
      </section>

      {/* ── Non-conformités → Plan d'action ── */}
      {last && nonConformesRaw.length > 0 && (
        <section className="card">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-marine-900">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Non-conformités — Plan d&apos;action
              </h2>
              <p className="mt-0.5 text-xs text-ardoise-400">
                Dernier audit : {formatDate(last.date)} — {last.roulement}
                {" · "}Cliquez « + Action » pour créer un PAQSS pré-rempli.
              </p>
            </div>
          </div>

          <div className="divide-y divide-ardoise-100">
            {nonConformesRaw.map(({ item, themeId, nbNon }) => {
              const themeNom = themeMap[themeId] ?? themeId;
              const paqssLies = paqssActifsParTheme[themeId] ?? [];
              return (
                <div key={item.id} className="flex items-start gap-3 py-3">
                  {/* Infos item */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-marine-900 leading-snug">
                      {item.libelle}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-marine-100 px-2 py-0.5 text-[11px] font-semibold text-marine-700">
                        {themeNom}
                      </span>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                        {nbNon} zone{nbNon > 1 ? "s" : ""} NON
                      </span>
                    </div>
                    {/* PAQSS liés existants */}
                    {paqssLies.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {paqssLies.map((p) => (
                          <span
                            key={p.id}
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUT_COLOR[p.statut] ?? ""}`}
                          >
                            {p.titre.length > 40 ? p.titre.slice(0, 40) + "…" : p.titre}
                            {" — "}
                            {STATUT_LABEL[p.statut]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bouton créer action */}
                  <form action={createPaqssFromItemAction} className="shrink-0">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="itemLibelle" value={item.libelle} />
                    <input type="hidden" name="themeId" value={themeId} />
                    <input type="hidden" name="auditId" value={last.id} />
                    <input type="hidden" name="auditDate" value={last.date} />
                    <button
                      type="submit"
                      title="Créer une action d'équipe pour cet item"
                      className="flex items-center gap-1.5 rounded-xl border border-turquoise-300 bg-turquoise-50 px-3 py-1.5 text-xs font-semibold text-turquoise-700 hover:bg-turquoise-100 transition-colors"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Action
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Évolution par thématique */}
      <ThemeEvolutionSection
        thematiques={db.thematiques}
        evolutionParTheme={evolutionParTheme}
        seuil={db.config.objectif}
      />
    </div>
  );
}
