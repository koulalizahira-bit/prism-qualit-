import { getDb } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AgentFichesAccordion from "@/components/AgentFichesAccordion";

export default async function AgentFichesPage() {
  const db = await getDb();

  // Construire les groupes par thématique (toutes, même sans fiche)
  const groupes = db.thematiques
    .slice()
    .sort((a, b) => a.ordre - b.ordre)
    .map((t) => ({
      themeId: t.id,
      nom: t.nom,
      ordre: t.ordre,
      nbFiches: db.fiches.filter((f) => f.themeId === t.id).length,
      fiches: db.fiches
        .filter((f) => f.themeId === t.id)
        .map((f) => ({
          id: f.id,
          titre: f.titre,
          resume: f.resume,
          contenu: f.contenu,
        })),
      vigilances: t.vigilances ?? [],
      infos: t.infos ?? [],
    }))
    // Trier : ceux avec contenu en premier
    .sort((a, b) => {
      const aHas = a.fiches.length + a.vigilances.length;
      const bHas = b.fiches.length + b.vigilances.length;
      if (bHas !== aHas) return bHas - aHas;
      return a.ordre - b.ordre;
    });

  const totalFiches = groupes.reduce((s, g) => s + g.fiches.length, 0);

  return (
    <div className="mx-auto max-w-md space-y-4">

      {/* ── Bouton retour prominent ── */}
      <Link
        href="/agent"
        className="flex items-center gap-2 rounded-2xl bg-white border border-ardoise-100 shadow-sm px-4 py-3 text-sm font-bold text-marine-800 hover:bg-ardoise-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l&apos;accueil
      </Link>

      {/* ── En-tête ── */}
      <div>
        <h1 className="text-marine-900 text-xl font-extrabold leading-tight">
          Fiches pratiques
        </h1>
        <p className="text-ardoise-500 text-sm mt-0.5">
          {totalFiches} fiche{totalFiches > 1 ? "s" : ""} · {groupes.length} thématiques
          — Appuyez pour dérouler
        </p>
      </div>

      {/* ── Accordéon ── */}
      <AgentFichesAccordion groupes={groupes} />

    </div>
  );
}
