import type { Audit, AuditGrille, Database, Thematique, Section, Config, Item, Formation, PaqssAction } from "./types";

export const SERVICE_GRILLE_ID = "g-service";

// Grille d'un audit (défaut = grille service).
export function grilleForAudit(db: Database, audit: Audit): AuditGrille | null {
  const id = audit.grilleId ?? SERVICE_GRILLE_ID;
  return (db.grilles ?? []).find((g) => g.id === id) ?? null;
}

// Sections utilisées par un audit (grille dédiée, ou grille service = db.sections).
export function sectionsForAudit(db: Database, audit: Audit): Section[] {
  const g = grilleForAudit(db, audit);
  if (g) return g.sections;
  return db.sections; // rétrocompat (audit service sans grille)
}

// Un audit est-il un audit « service » (global) ?
export function isServiceAudit(audit: Audit): boolean {
  return (audit.grilleId ?? SERVICE_GRILLE_ID) === SERVICE_GRILLE_ID;
}

// Audits « service » uniquement (pour le tableau de bord, l'évolution, les alertes).
export function serviceAudits(db: Database): Audit[] {
  return db.audits.filter(isServiceAudit);
}

// Audits d'une grille donnée, triés par date.
export function auditsForGrille(db: Database, grilleId: string): Audit[] {
  return db.audits
    .filter((a) => (a.grilleId ?? SERVICE_GRILLE_ID) === grilleId)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
}

export function latestAuditForGrille(db: Database, grilleId: string): Audit | null {
  const l = auditsForGrille(db, grilleId);
  return l.length ? l[l.length - 1] : null;
}

export type Statut = "vert" | "orange" | "rouge";

export function statutFromScore(score: number | null, config: Config): Statut {
  if (score === null) return "rouge";
  if (score >= config.statutVert) return "vert";
  if (score >= config.statutOrange) return "orange";
  return "rouge";
}

function pct(oui: number, non: number): number | null {
  const total = oui + non;
  if (total === 0) return null;
  return Math.round((oui / total) * 100);
}

// Toutes les réponses d'un audit (toutes zones confondues)
function* iterReponses(audit: Audit): Generator<{ itemId: string; value: string }> {
  for (const [itemId, zones] of Object.entries(audit.valeurs)) {
    for (const value of Object.values(zones)) {
      yield { itemId, value };
    }
  }
}

// Score global d'un audit
export function auditScore(audit: Audit): number | null {
  let oui = 0,
    non = 0;
  for (const { value } of iterReponses(audit)) {
    if (value === "OUI") oui++;
    else if (value === "NON") non++;
  }
  return pct(oui, non);
}

// Index item -> themeId (à partir d'un jeu de sections)
export function itemThemeMapFor(sections: Section[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const s of sections) for (const it of s.items) map[it.id] = it.themeId;
  return map;
}
// Index item -> themeId de la grille service
export function itemThemeMap(db: Database): Record<string, string> {
  return itemThemeMapFor(db.sections);
}

// Score par thématique pour un audit
export function auditThemeScore(audit: Audit, themeId: string, map: Record<string, string>): number | null {
  let oui = 0,
    non = 0;
  for (const { itemId, value } of iterReponses(audit)) {
    if (map[itemId] !== themeId) continue;
    if (value === "OUI") oui++;
    else if (value === "NON") non++;
  }
  return pct(oui, non);
}

// Score d'une section pour un audit
export function auditSectionScore(audit: Audit, section: Section): number | null {
  let oui = 0,
    non = 0;
  for (const it of section.items) {
    const zones = audit.valeurs[it.id] ?? {};
    for (const v of Object.values(zones)) {
      if (v === "OUI") oui++;
      else if (v === "NON") non++;
    }
  }
  return pct(oui, non);
}

// Score d'une zone (sur une section)
export function auditZoneScore(audit: Audit, section: Section, zoneId: string): number | null {
  let oui = 0,
    non = 0;
  for (const it of section.items) {
    const v = audit.valeurs[it.id]?.[zoneId];
    if (v === "OUI") oui++;
    else if (v === "NON") non++;
  }
  return pct(oui, non);
}

// Items non conformes (au moins une zone NON) pour un audit, par thématique
export function itemsNonConformes(audit: Audit, db: Database): { item: Item; themeId: string; nbNon: number }[] {
  const res: { item: Item; themeId: string; nbNon: number }[] = [];
  for (const s of sectionsForAudit(db, audit)) {
    for (const it of s.items) {
      const zones = audit.valeurs[it.id] ?? {};
      const nbNon = Object.values(zones).filter((v) => v === "NON").length;
      if (nbNon > 0) res.push({ item: it, themeId: it.themeId, nbNon });
    }
  }
  return res.sort((a, b) => b.nbNon - a.nbNon);
}

// -------- Tri / sélection (audits SERVICE uniquement) --------
export function auditsTries(db: Database): Audit[] {
  return serviceAudits(db).slice().sort((a, b) => +new Date(a.date) - +new Date(b.date));
}
export function latestAudit(db: Database): Audit | null {
  const l = auditsTries(db);
  return l.length ? l[l.length - 1] : null;
}

// -------- Service --------
export function serviceConformite(db: Database): number | null {
  const a = latestAudit(db);
  return a ? auditScore(a) : null;
}

export interface ThemeScore {
  theme: Thematique;
  score: number | null;
  statut: Statut;
}

export function themeScoresForAudit(db: Database, audit: Audit | null): ThemeScore[] {
  const map = itemThemeMap(db);
  return db.thematiques.map((theme) => {
    const score = audit ? auditThemeScore(audit, theme.id, map) : null;
    return { theme, score, statut: statutFromScore(score, db.config) };
  });
}

export function serviceThemeScores(db: Database): ThemeScore[] {
  return themeScoresForAudit(db, latestAudit(db));
}

// Évolution : un point par audit
export function dateCourt(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}
export function serviceEvolution(db: Database): { label: string; score: number; date: string }[] {
  return auditsTries(db)
    .map((a) => ({ label: dateCourt(a.date), score: auditScore(a) ?? 0, date: a.date }))
    .filter((p) => p.score > 0 || true);
}

// Évolution d'une thématique donnée sur tous les audits
export function themeEvolution(db: Database, themeId: string): { label: string; score: number; date: string }[] {
  const map = itemThemeMap(db);
  return auditsTries(db).map((a) => ({
    label: dateCourt(a.date),
    score: auditThemeScore(a, themeId, map) ?? 0,
    date: a.date,
  }));
}

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
export function auditsCeMois(db: Database): number {
  const k = currentMonthKey();
  return serviceAudits(db).filter((a) => monthKey(a.date) === k).length;
}

// Thématiques sous l'objectif (alertes)
export function thematiquesEnAlerte(db: Database): ThemeScore[] {
  return serviceThemeScores(db).filter((ts) => ts.score !== null && ts.score < db.config.objectif);
}

// -------- Plans d'action : cadre (PAQSS pilotage) vs équipe (issu des audits) --------
export function plansCadre(db: Database): PaqssAction[] {
  return db.paqss.filter((p) => (p.nature ?? "cadre") === "cadre");
}
export function plansEquipe(db: Database): PaqssAction[] {
  return db.paqss.filter((p) => p.nature === "equipe");
}

export interface PlanEquipeGroupe {
  auditId: string;
  auditDate: string | null;
  actions: PaqssAction[];
}
// Actions équipe regroupées par audit source (le plus récent d'abord).
export function plansEquipeParAudit(db: Database): PlanEquipeGroupe[] {
  const map = new Map<string, PaqssAction[]>();
  for (const a of plansEquipe(db)) {
    const key = a.auditId ?? "sans-audit";
    (map.get(key) ?? map.set(key, []).get(key)!).push(a);
  }
  return [...map.entries()]
    .map(([auditId, actions]) => ({
      auditId,
      auditDate: actions.find((a) => a.auditDate)?.auditDate ?? null,
      actions,
    }))
    .sort((a, b) => +new Date(b.auditDate ?? 0) - +new Date(a.auditDate ?? 0));
}

// Synthèse d'avancement d'un jeu d'actions.
export interface PlanSynthese { total: number; realisee: number; en_cours: number; non_initiee: number; pct: number }
export function planSynthese(actions: PaqssAction[]): PlanSynthese {
  const compte = (s: string) => actions.filter((a) => a.statut === s).length;
  const realisee = compte("realisee");
  const actives = actions.filter((a) => a.statut !== "non_concerne" && a.statut !== "sans_objet").length;
  return {
    total: actions.length,
    realisee,
    en_cours: compte("en_cours"),
    non_initiee: compte("non_initiee"),
    pct: actives > 0 ? Math.round((realisee / actives) * 100) : 0,
  };
}

// -------- Couverture par grille d'audit (pour la certification) --------
export interface GrilleCoverage {
  grille: AuditGrille;
  dernier: Audit | null;
  score: number | null;
  statut: Statut;
  nbAudits: number;
}
export function grillesCoverage(db: Database): GrilleCoverage[] {
  return (db.grilles ?? []).map((grille) => {
    const audits = auditsForGrille(db, grille.id);
    const dernier = audits.length ? audits[audits.length - 1] : null;
    const score = dernier ? auditScore(dernier) : null;
    return { grille, dernier, score, statut: statutFromScore(score, db.config), nbAudits: audits.length };
  });
}

export function effectifParRole(db: Database): { role: string; n: number }[] {
  const m: Record<string, number> = {};
  for (const a of db.agents) m[a.role] = (m[a.role] ?? 0) + 1;
  return Object.entries(m).map(([role, n]) => ({ role, n }));
}

// -------- Axes prioritaires : les n thématiques les plus faibles du dernier audit --------
export function axesPrioritaires(db: Database, n = 3): ThemeScore[] {
  return serviceThemeScores(db)
    .filter((t) => t.score !== null)
    .sort((a, b) => (a.score as number) - (b.score as number))
    .slice(0, n);
}

// Items les plus problématiques d'une thématique (dernier audit)
export function piresItemsTheme(db: Database, themeId: string, n = 3): { libelle: string; nbNon: number }[] {
  const last = latestAudit(db);
  if (!last) return [];
  const items = db.sections.flatMap((s) => s.items).filter((it) => it.themeId === themeId);
  return items
    .map((it) => {
      const z = last.valeurs[it.id] ?? {};
      const nbNon = Object.values(z).filter((v) => v === "NON").length;
      return { libelle: it.libelle, nbNon };
    })
    .filter((x) => x.nbNon > 0)
    .sort((a, b) => b.nbNon - a.nbNon)
    .slice(0, n);
}

// -------- Formations / habilitations --------
export interface FormationStat {
  formation: Formation;
  concernes: number;
  formes: number;
  pct: number | null;
  statut: Statut;
}
export function formationStats(db: Database): FormationStat[] {
  return db.formations.map((f) => {
    const concernes = db.agents.filter((a) => !f.roles || f.roles.includes(a.role));
    const formes = concernes.filter((a) => a.habilitations?.[f.id]).length;
    const pct = concernes.length ? Math.round((formes / concernes.length) * 100) : null;
    const statut: Statut =
      pct === null ? "rouge" : pct >= f.objectif ? "vert" : pct >= f.objectif - 15 ? "orange" : "rouge";
    return { formation: f, concernes: concernes.length, formes, pct, statut };
  });
}
