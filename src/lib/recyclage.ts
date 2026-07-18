import type { Database, Agent, Formation } from "./types";

// Statut d'une cellule d'habilitation vis-à-vis du recyclage.
export type CellStatut = "vide" | "ok" | "orange" | "rouge";

// Classes Tailwind associées (utilisées dans le tableau).
export const CELL_CLS: Record<CellStatut, string> = {
  vide: "border-ardoise-200 bg-white text-ardoise-500",
  ok: "border-vert/40 bg-vert-soft/60 text-marine-900 font-semibold",
  orange: "border-orange bg-orange-soft text-orange font-bold",
  rouge: "border-rouge bg-rouge-soft text-rouge font-bold",
};

// Ancienneté (en années) à partir d'un texte de date libre (« 05/2024 », « 2025 »…).
export function ageAnnees(val: string): number | null {
  const m = val.match(/(\d{4})/);
  if (!m) return null;
  const annee = parseInt(m[1], 10);
  if (annee < 2000 || annee > 2100) return null;
  let mois = 0;
  const mm = val.match(/(\d{1,2})\s*[/\-.]\s*\d{4}/);
  if (mm) mois = parseInt(mm[1], 10) - 1;
  const dateForm = new Date(annee, Math.max(0, mois), 1);
  return (Date.now() - dateForm.getTime()) / (365.25 * 24 * 3600 * 1000);
}

export function statutCellule(val: string, validite?: number): CellStatut {
  if (!val.trim()) return "vide";
  if (!validite || validite < 2) return "ok"; // pas de logique de recyclage
  const age = ageAnnees(val);
  if (age === null) return "ok";
  if (age >= validite) return "rouge"; // à recycler en urgence
  if (age >= validite - 1) return "orange"; // bientôt à recycler
  return "ok";
}

export function formationApplicable(f: Pick<Formation, "roles">, role: string): boolean {
  return !f.roles || f.roles.includes(role as Agent["role"]);
}

export interface RecyclageAlerte {
  rouge: number; // habilitations à recycler en urgence
  orange: number; // bientôt à recycler
  total: number; // rouge + orange
  agentsConcernes: number; // nb d'agents distincts avec au moins une alerte
  parRole: Record<string, number>; // nb d'agents concernés par rôle (IDE, AS, ASH…)
}

// Agrège, sur tout le service, les habilitations qui arrivent à échéance.
export function recyclagesEnAlerte(db: Database): RecyclageAlerte {
  let rouge = 0;
  let orange = 0;
  const agentsSet = new Set<string>();
  const parRole: Record<string, Set<string>> = {};
  for (const f of db.formations) {
    if (!f.validite || f.validite < 2) continue;
    for (const a of db.agents) {
      if (!formationApplicable(f, a.role)) continue;
      const st = statutCellule(a.habilitations?.[f.id] ?? "", f.validite);
      if (st === "rouge" || st === "orange") {
        if (st === "rouge") rouge++; else orange++;
        agentsSet.add(a.id);
        if (!parRole[a.role]) parRole[a.role] = new Set();
        parRole[a.role].add(a.id);
      }
    }
  }
  const parRoleCount: Record<string, number> = {};
  for (const [role, set] of Object.entries(parRole)) parRoleCount[role] = set.size;
  return { rouge, orange, total: rouge + orange, agentsConcernes: agentsSet.size, parRole: parRoleCount };
}
