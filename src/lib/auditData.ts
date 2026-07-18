import type { Audit, Reponse, AuditGrille } from "./types";

// ⚠️ Données de démonstration 100 % FICTIVES.
// Les résultats d'audit sont générés de façon déterministe (pseudo-aléatoire à graine
// fixe) à partir des grilles. Ils ne proviennent d'aucun service réel et ne reprennent
// aucun résultat d'audit existant. Objectif : un jeu de démo crédible et stable.

function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Probabilité qu'un item soit conforme ("OUI"), par thématique.
// Certaines thématiques sont volontairement plus faibles pour rendre les alertes réalistes.
const THEME_BIAS: Record<string, number> = {
  t1: 0.82, t2: 0.9, t3: 0.85, t4: 0.8, t5: 0.86,
  t6: 0.78, t7: 0.84, t8: 0.88, t9: 0.72,
};

// Dates des audits « service » mensuels.
const SERVICE_DATES = [
  "2026-02-12T09:30:00.000Z",
  "2026-03-12T09:30:00.000Z",
  "2026-04-14T09:30:00.000Z",
  "2026-05-13T09:30:00.000Z",
];

// Date (fictive, récente) du dernier audit thématique, par grille.
const THEMATIQUE_DATE: Record<string, string> = {
  "g-hygiene": "2026-06-18T10:00:00.000Z",
  "g-medicament": "2026-06-24T10:00:00.000Z",
  "g-identito": "2026-05-28T10:00:00.000Z",
  "g-dossier": "2026-06-11T10:00:00.000Z",
  "g-douleur": "2026-05-21T10:00:00.000Z",
  "g-droits": "2026-06-04T10:00:00.000Z",
};

function buildValeurs(
  grille: AuditGrille,
  rng: () => number,
  trend: number,
): Record<string, Record<string, Reponse>> {
  const valeurs: Record<string, Record<string, Reponse>> = {};
  for (const section of grille.sections) {
    for (const item of section.items) {
      const base = Math.min((THEME_BIAS[item.themeId] ?? 0.83) + trend, 0.97);
      const zones: Record<string, Reponse> = {};
      for (const z of section.zones) {
        if (rng() > 0.9) continue; // ~10 % des cases non évaluées (comme sur le terrain)
        zones[z.id] = rng() < base ? "OUI" : "NON";
      }
      if (Object.keys(zones).length) valeurs[item.id] = zones;
    }
  }
  return valeurs;
}

// Génère les audits de démonstration pour toutes les grilles :
// - grille service : 4 audits mensuels (avec tendance d'amélioration) ;
// - grilles thématiques : 1 audit récent chacune.
export function generateDemoAudits(grilles: AuditGrille[]): Audit[] {
  const audits: Audit[] = [];

  for (const grille of grilles) {
    if (grille.type === "service") {
      SERVICE_DATES.forEach((date, idx) => {
        const rng = makeRng(1009 + idx * 97);
        audits.push({
          id: `aud-demo-${idx + 2}`,
          date,
          roulement: "Audit mensuel",
          auteurId: "u-cadre",
          grilleId: grille.id,
          valeurs: buildValeurs(grille, rng, idx * 0.02),
        });
      });
    } else {
      const date = THEMATIQUE_DATE[grille.id] ?? "2026-06-15T10:00:00.000Z";
      const rng = makeRng(7001 + grille.id.length * 131);
      audits.push({
        id: `aud-${grille.id}`,
        date,
        roulement: "Audit thématique",
        auteurId: "u-cadre",
        grilleId: grille.id,
        valeurs: buildValeurs(grille, rng, 0.04),
      });
    }
  }

  return audits;
}
