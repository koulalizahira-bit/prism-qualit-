import Link from "next/link";
import { getDb } from "@/lib/db";
import { plansCadre, plansEquipeParAudit } from "@/lib/scoring";
import { formatDate } from "@/lib/ui";
import PrintButton from "@/components/PrintButton";
import { ArrowLeft, ClipboardList } from "lucide-react";

const STATUT_LABEL: Record<string, string> = {
  non_initiee: "À initier",
  en_cours: "En cours",
  realisee: "Réalisée",
  non_concerne: "Non concerné",
  sans_objet: "Sans objet",
};

export default async function ImprimerPlanActionPage() {
  const db = await getDb();
  const themeName = (id: string) => db.thematiques.find((t) => t.id === id)?.nom ?? "—";

  const groupesRaw = plansEquipeParAudit(db);
  const auditNom = (auditId: string): string => {
    const audit = db.audits.find((a) => a.id === auditId);
    const grilleId = audit?.grilleId ?? "g-service";
    return (db.grilles ?? []).find((g) => g.id === grilleId)?.nom ?? "Audit service";
  };
  const groupesEquipe = groupesRaw.map((g) => ({ ...g, auditNom: auditNom(g.auditId) }));
  const cadre = plansCadre(db);

  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/cadre/paqss"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-marine-700 hover:text-marine-900"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la démarche qualité
        </Link>
        <PrintButton label="Imprimer le plan d'action" />
      </div>

      {/* En-tête imprimé */}
      <div className="mb-6 hidden items-center justify-between border-b-2 border-marine-900 pb-3 print:flex">
        <div>
          <p className="text-lg font-black text-marine-900">Plan d&apos;action — {db.config.nomService}</p>
          <p className="text-xs text-ardoise-500">Édité le {today}</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-marine-500">Aliavita · Prism</p>
      </div>

      <h1 className="mb-1 flex items-center gap-2 text-2xl font-extrabold text-marine-900 print:hidden">
        <ClipboardList className="h-7 w-7 text-turquoise-500" /> Plan d&apos;action imprimable
      </h1>
      <p className="mb-6 text-ardoise-500 print:hidden">
        Tableau clair, prêt à imprimer ou annoter — action, personne responsable et échéance pour
        chaque défaillance relevée en audit.
      </p>

      {/* ── Plan équipe : par audit ── */}
      <section className="mb-8 break-inside-avoid">
        <h2 className="mb-3 text-lg font-bold text-marine-900">
          Plan d&apos;action équipe — actions de terrain issues des audits
        </h2>
        {groupesEquipe.length === 0 ? (
          <p className="text-sm text-ardoise-400 italic">Aucune action d&apos;équipe pour le moment.</p>
        ) : (
          groupesEquipe.map((g) => (
            <div key={g.auditId} className="mb-6 break-inside-avoid">
              <p className="mb-2 text-sm font-bold text-marine-800">
                {g.auditNom}
                {g.auditDate && <span className="ml-2 font-normal text-ardoise-500">Audit du {formatDate(g.auditDate)}</span>}
              </p>
              <table className="w-full border-collapse overflow-hidden rounded-xl border border-ardoise-200 text-sm">
                <thead>
                  <tr className="bg-marine-900 text-left text-white">
                    <th className="px-3 py-2 font-bold">Item défaillant</th>
                    <th className="px-3 py-2 font-bold">Thématique</th>
                    <th className="px-3 py-2 font-bold">Action</th>
                    <th className="px-3 py-2 font-bold">Responsable</th>
                    <th className="px-3 py-2 font-bold">Échéance</th>
                    <th className="px-3 py-2 font-bold">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {g.actions.map((a, i) => (
                    <tr key={a.id} className={i % 2 ? "bg-ardoise-50" : "bg-white"}>
                      <td className="border-t border-ardoise-100 px-3 py-2 font-semibold text-marine-900">{a.titre}</td>
                      <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{themeName(a.themeId)}</td>
                      <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{a.ceQueJeFais || a.amelioration}</td>
                      <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{a.responsable}</td>
                      <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{a.echeance}</td>
                      <td className="border-t border-ardoise-100 px-3 py-2 font-semibold text-marine-900">{STATUT_LABEL[a.statut]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </section>

      {/* ── Plan cadre : PAQSS ── */}
      <section className="break-inside-avoid">
        <h2 className="mb-1 text-lg font-bold text-marine-900">
          Plan d&apos;action cadre — PAQSS (pilotage du service)
        </h2>
        <p className="mb-3 text-xs text-ardoise-500">
          Programme d&apos;Actions pour la Qualité et la Sécurité des Soins.
        </p>
        <table className="w-full border-collapse overflow-hidden rounded-xl border border-ardoise-200 text-sm">
          <thead>
            <tr className="bg-emerald-700 text-left text-white">
              <th className="px-3 py-2 font-bold">Action</th>
              <th className="px-3 py-2 font-bold">Thématique</th>
              <th className="px-3 py-2 font-bold">Responsable</th>
              <th className="px-3 py-2 font-bold">Échéance</th>
              <th className="px-3 py-2 font-bold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {cadre.map((a, i) => (
              <tr key={a.id} className={i % 2 ? "bg-ardoise-50" : "bg-white"}>
                <td className="border-t border-ardoise-100 px-3 py-2 font-semibold text-marine-900">{a.titre}</td>
                <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{themeName(a.themeId)}</td>
                <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{a.responsable}</td>
                <td className="border-t border-ardoise-100 px-3 py-2 text-ardoise-600">{a.echeance}</td>
                <td className="border-t border-ardoise-100 px-3 py-2 font-semibold text-marine-900">{STATUT_LABEL[a.statut]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, .print\\:hidden { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          @page { size: A4 portrait; margin: 12mm; }
        }
      `}</style>
    </>
  );
}
