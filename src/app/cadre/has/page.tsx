import { getDb } from "@/lib/db";
import { HAS_CRITERES, HAS_METHODES } from "@/lib/has";
import { serviceConformite, grillesCoverage } from "@/lib/scoring";
import { formatDate } from "@/lib/ui";
import HasMethodesAccordion from "@/components/HasMethodesAccordion";
import CertifSousOnglets from "@/components/CertifSousOnglets";
import InfoBulle from "@/components/InfoBulle";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

const STATUT_CLS: Record<string, string> = {
  vert: "text-green-600",
  orange: "text-amber-500",
  rouge: "text-rouge",
};

export default async function HasPage() {
  const db = await getDb();
  const conformite = serviceConformite(db);
  const coverage = grillesCoverage(db);

  const couvert = HAS_CRITERES.filter((c) => c.statut === "couvert").length;
  const partiel = HAS_CRITERES.filter((c) => c.statut === "partiel").length;
  const manquant = HAS_CRITERES.filter((c) => c.statut === "manquant").length;
  const total = HAS_CRITERES.length;

  const pctCouverture = Math.round(
    ((couvert + partiel * 0.5) / total) * 100,
  );

  return (
    <div className="space-y-6">
      {/* ── Bandeau d'identité HAS — institutionnel, certification ── */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-700 to-indigo-500 p-5 text-white shadow-lg shadow-indigo-500/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-indigo-200" />
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                Certification nationale
              </p>
            </div>
            <h1 className="text-xl font-extrabold leading-tight">
              HAS V2025
            </h1>
            <p className="text-sm text-indigo-200 mt-0.5">
              Référentiel de certification — couverture des critères
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-4xl font-black leading-none">{pctCouverture}%</p>
            <p className="flex items-center justify-end gap-1 text-xs text-indigo-200 mt-0.5">
              couverture critères
              <InfoBulle
                dark
                texte={`${pctCouverture}% des critères HAS V2025 sont aujourd'hui couverts par vos audits (${couvert} couverts + ${partiel} partiels sur ${total} critères). Le reste nécessite soit un nouvel audit ciblé, soit une action pour compléter la preuve.`}
              />
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${pctCouverture}%` }}
          />
        </div>
        <div className="mt-2 flex gap-4 text-xs text-indigo-200">
          <span>✓ {couvert} couverts</span>
          <span>≈ {partiel} partiels</span>
          <span>○ {manquant} à compléter</span>
        </div>
      </div>

      <CertifSousOnglets
        couverture={
          <div className="space-y-6">
            {/* ── Score de conformité service (lié aux audits) ── */}
            <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-indigo-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-indigo-900">
                  Conformité service — données audits
                </p>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-indigo-200">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${conformite ?? 0}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-indigo-500">
                  Ce score alimentera directement votre dossier HAS — objectif {db.config.objectif}%
                </p>
              </div>
              <p className="shrink-0 text-xl font-black text-indigo-700">
                {conformite !== null ? `${conformite}%` : "—"}
              </p>
            </div>

            {/* ── Vos audits et les critères HAS qu'ils couvrent ── */}
            <section className="card">
              <div className="mb-1 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-marine-900">Vos audits &amp; leur couverture HAS</h2>
              </div>
              <p className="mb-3 text-sm text-ardoise-500">
                Chaque audit couvre une partie des critères HAS. En les combinant, vous couvrez l&apos;ensemble du référentiel.
              </p>
              <div className="space-y-2.5">
                {coverage.map(({ grille, score, statut, dernier, nbAudits }) => (
                  <div key={grille.id} className="rounded-2xl border border-ardoise-100 p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-marine-900">{grille.nom}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${grille.type === "service" ? "bg-marine-100 text-marine-700" : "bg-indigo-100 text-indigo-600"}`}>
                            {grille.type === "service" ? "Service" : "Thématique"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-ardoise-500">
                          {dernier
                            ? `Dernier audit : ${formatDate(dernier.date)}${nbAudits > 1 ? ` · ${nbAudits} audits` : ""}`
                            : "Aucun audit réalisé"}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`text-2xl font-black ${STATUT_CLS[statut] ?? "text-ardoise-400"}`}>
                          {score !== null ? `${score}%` : "—"}
                        </p>
                      </div>
                    </div>
                    {grille.criteresHAS.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {grille.criteresHAS.map((c) => (
                          <span key={c} className="rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {!dernier && (
                      <Link
                        href="/cadre/audit"
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Réaliser cet audit <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Critères HAS V2025 ── */}
            <section className="card">
              <h2 className="mb-4 text-lg font-bold text-marine-900">
                Critères HAS V2025 — couverture de votre service
              </h2>

              <div className="space-y-2.5">
                {HAS_CRITERES.map((c) => (
            <div
              key={c.code}
              className={`flex items-start gap-3 rounded-xl p-3 ${
                c.statut === "couvert"
                  ? "bg-green-50"
                  : c.statut === "partiel"
                    ? "bg-amber-50"
                    : "bg-ardoise-50/40"
              }`}
            >
              {/* Icône statut */}
              {c.statut === "couvert" && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              )}
              {c.statut === "partiel" && (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              )}
              {c.statut === "manquant" && (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-ardoise-400" />
              )}

              <div className="min-w-0 flex-1">
                {/* Titre + badge */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] bg-indigo-100 text-indigo-600 rounded px-1.5 py-0.5">
                    {c.code}
                  </span>
                  <p className="text-sm font-bold text-marine-900">{c.libelle}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      c.statut === "couvert"
                        ? "bg-green-100 text-green-700"
                        : c.statut === "partiel"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-ardoise-100 text-ardoise-500"
                    }`}
                  >
                    {c.statut === "couvert"
                      ? "Couvert ✓"
                      : c.statut === "partiel"
                        ? "Partiel"
                        : "À compléter"}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-0.5 text-xs text-ardoise-500">{c.description}</p>

                {/* Commentaire */}
                {c.commentaire && (
                  <p className="mt-1 text-xs italic text-ardoise-400">
                    {c.commentaire}
                  </p>
                )}

                {/* Suggestion */}
                {c.suggestion && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    <p className="text-xs text-indigo-700">{c.suggestion}</p>
                  </div>
                )}
              </div>
            </div>
                ))}
              </div>
            </section>
          </div>
        }
        methodes={
          <section>
            <div className="mb-1 flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-indigo-400" />
              <div>
                <h2 className="text-lg font-bold text-marine-900">
                  Méthodes de certification
                </h2>
                <p className="text-sm text-ardoise-500">
                  Ce que chaque méthode signifie — en clair, pour toute l&apos;équipe.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <HasMethodesAccordion methodes={HAS_METHODES} />
            </div>
          </section>
        }
      />

      {/* ── CTA dossier ── */}
      <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-indigo-500" />
          <div>
            <p className="font-bold text-indigo-900">Prêt pour la visite HAS ?</p>
            <p className="mt-1 text-sm text-indigo-700">
              Générez votre dossier de certification complet (conformité par
              thématique&nbsp;+ PAQSS complet&nbsp;+ habilitations AFGSU) depuis la
              page Rapports.
            </p>
            <Link
              href="/cadre/rapports"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Générer le dossier HAS
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
