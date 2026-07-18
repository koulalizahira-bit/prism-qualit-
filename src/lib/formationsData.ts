// Plan de formation + effectif de DÉMONSTRATION.
// ⚠️ L'effectif et les habilitations ci-dessous sont 100 % FICTIFS : ils sont générés
// de façon déterministe (aucun agent réel, aucune date de formation réelle, aucun
// effectif de service existant). Objectif : un jeu de démo crédible et stable.
import type { Formation, Agent, RoleAgent } from "./types";

export const FORMATIONS: Formation[] = [
  { "id": "f1",
    "nom": "Doublure soins intensifs",
    "objectif": 70,
    "priorite": "haute",
    "frequence": "Tous les 3 ans" },
  { "id": "f2",
    "nom": "BASI soins intensifs",
    "objectif": 90,
    "priorite": "haute",
    "frequence": "Tous les 3 ans",
    "roles": [
      "IDE",
      "AS"
    ] },
  { "id": "f3",
    "nom": "Parcours nouvel arrivant",
    "objectif": 90,
    "priorite": "haute",
    "frequence": "Tous les 3 ans",
    "roles": [
      "IDE",
      "AS"
    ] },
  { "id": "f4",
    "nom": "AFGSU",
    "objectif": 80,
    "priorite": "moyenne",
    "frequence": "Tous les 4 ans"
  , "validite": 4 },
  {
    "id": "f5",
    "nom": "Plaie et Cicatrisation",
    "objectif": 50,
    "priorite": "moyenne",
    "frequence": "Une fois",
    "roles": [
      "IDE"
    ]
  },
  { "id": "f6",
    "nom": "Trachéotomie",
    "objectif": 70,
    "priorite": "haute",
    "frequence": "Annuelle",
    "roles": [
      "IDE",
      "AS"
    ] },
  { "id": "f7",
    "nom": "UVIH (gestes urgence)",
    "objectif": 70,
    "priorite": "moyenne",
    "frequence": "Tous les 3 ans",
    "roles": [
      "IDE",
      "AS"
    ] },
  {
    "id": "f8",
    "nom": "Hemocue",
    "objectif": 80,
    "priorite": "standard",
    "frequence": "Une fois",
    "roles": [
      "IDE"
    ]
  },
  { "id": "f9",
    "nom": "Sécurité incendie",
    "objectif": 90,
    "priorite": "standard",
    "frequence": "Annuelle" },
  {
    "id": "f10",
    "nom": "Appropriation CUSC (chariot urgence)",
    "objectif": 90,
    "priorite": "haute",
    "frequence": "Annuelle"
  }
];

// -------- Générateur d'effectif fictif --------
function makeRng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Date d'habilitation fictive au format MM/YYYY, répartie sur 2021→2026.
function fakeDate(rng: () => number): string {
  const annee = 2021 + Math.floor(rng() * 6);
  const mois = 1 + Math.floor(rng() * 12);
  return `${String(mois).padStart(2, "0")}/${annee}`;
}

// Effectif de démonstration : nombres ronds, sans lien avec un service réel.
const EFFECTIF: Record<RoleAgent, number> = { IDE: 30, AS: 24, ASH: 8 };

function generateAgents(): Agent[] {
  const rng = makeRng(4242);
  const agents: Agent[] = [];
  for (const role of ["IDE", "AS", "ASH"] as RoleAgent[]) {
    for (let i = 1; i <= EFFECTIF[role]; i++) {
      const habilitations: Record<string, string> = {};
      for (const f of FORMATIONS) {
        if (f.roles && !f.roles.includes(role)) continue;
        // Taux de formation ~ objectif du plan, avec de la variance pour laisser des marges.
        const p = Math.min(0.95, (f.objectif / 100) * 0.85);
        if (rng() < p) habilitations[f.id] = fakeDate(rng);
      }
      agents.push({ id: `${role}-${i}`, label: `${role} ${i}`, role, numero: i, habilitations });
    }
  }
  return agents;
}

export const AGENTS_FORMATIONS: Agent[] = generateAgents();
