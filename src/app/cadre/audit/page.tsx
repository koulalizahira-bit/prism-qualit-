import { getDb } from "@/lib/db";
import AuditRunner from "@/components/AuditRunner";
import { SECTIONS } from "@/lib/seed";

export default async function AuditPage() {
  const db = await getDb();

  // Grilles (service + thématiques). Fallback sur la grille service si absente.
  const grillesRaw = db.grilles?.length
    ? db.grilles
    : [{
        id: "g-service", nom: "Audit service", type: "service" as const,
        description: "Audit global du service.", frequence: "Mensuel (2 roulements)",
        themeIds: [], criteresHAS: [], sections: SECTIONS,
      }];

  const grilles = grillesRaw.map((g) => ({
    id: g.id,
    nom: g.nom,
    type: g.type,
    description: g.description,
    frequence: g.frequence,
    criteresHAS: g.criteresHAS ?? [],
    sections: g.sections
      .slice()
      .sort((a, b) => a.ordre - b.ordre)
      .map((s) => ({ id: s.id, nom: s.nom, ordre: s.ordre, zones: s.zones, items: s.items })),
  }));

  return <AuditRunner grilles={grilles} />;
}
