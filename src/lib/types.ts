// Types métier — Audit GLOBAL du service (note du service, 2x/mois)

export type RoleAgent = "IDE" | "AS" | "ASH";
export type RoleUser = "cadre" | "superieur" | "agent";

export type Reponse = "OUI" | "NON" | "NA"; // 1 / 0 / non applicable

// Thématique HAS (regroupement lisible des items)
export interface Thematique {
  id: string;
  ordre: number;
  nom: string;
  description?: string;
  vigilances?: string[]; // points de vigilance (trame PAQSS)
  infos?: string[]; // infos / nouveautés
}

// Zone de saisie (colonne) : un secteur de la salle de soins ou une chambre
export interface Zone {
  id: string;
  label: string;
}

export interface Item {
  id: string;
  libelle: string;
  themeId: string;
}

// Un « tour » d'audit (salle de soins / chambre / dossier patient)
export interface Section {
  id: string;
  ordre: number;
  nom: string;
  zones: Zone[];
  items: Item[];
}

export interface Fiche {
  id: string;
  themeId: string;
  titre: string;
  resume: string;
  contenu: string[];
}

// Grille d'audit : soit la grille « service » (globale, tous les items), soit une
// grille thématique dédiée (ex : Hygiène des mains) avec ses propres items.
export interface AuditGrille {
  id: string;
  nom: string;
  type: "service" | "thematique";
  description?: string;
  frequence?: string;
  themeIds: string[]; // thématiques de l'appli couvertes par la grille
  criteresHAS: string[]; // critères HAS couverts (ex : "1.1 — Droits du patient")
  sections: Section[]; // grille propre à cet audit
}

// Effectif anonymisé (IDE 1, AS 1, ASH 1…)
export interface Agent {
  id: string;
  label: string; // ex : "IDE 12"
  role: RoleAgent;
  numero: number;
  habilitations?: Record<string, string>; // formationId -> date/label (vide = non formé)
}

export type Priorite = "haute" | "moyenne" | "standard";

// Formation / habilitation suivie pour l'équipe
export interface Formation {
  id: string;
  nom: string;
  description?: string;
  objectif: number; // % d'agents formés visé
  priorite?: Priorite;
  frequence?: string;
  validite?: number; // durée de validité en années (alerte recyclage)
  roles?: RoleAgent[]; // si restreinte à certains métiers (sinon tous)
}

export type StatutAction = "realisee" | "en_cours" | "non_initiee" | "non_concerne" | "sans_objet";

// Action d'un plan d'amélioration, présentée de façon lisible.
// nature "cadre" = pilotage du service (PAQSS : sensibiliser, former, CREX…).
// nature "equipe" = action terrain issue d'une non-conformité d'audit.
export interface PaqssAction {
  id: string;
  themeId: string;
  nature?: "cadre" | "equipe"; // absent = "cadre" (rétrocompat)
  auditId?: string; // audit source (actions équipe)
  auditDate?: string; // date ISO de l'audit source (actions équipe)
  itemId?: string; // item d'audit source (actions équipe)
  titre: string; // intitulé court et clair
  amelioration: string; // « ce qu'on améliore »
  ceQueJeFais: string; // « ce que je fais au quotidien »
  statut: StatutAction;
  responsable: string;
  echeance: string;
  objectif?: string;
}

export interface User {
  id: string;
  login: string;
  pin: string;
  role: RoleUser;
  displayName: string;
}

// Audit global : pour chaque item, une réponse par zone évaluée.
export interface Audit {
  id: string;
  date: string; // ISO
  roulement: string; // ex : "1er roulement", "2e roulement"
  auteurId: string;
  grilleId?: string; // grille utilisée (absent = grille service "g-service")
  // itemId -> { zoneId -> réponse }
  valeurs: Record<string, Record<string, Reponse>>;
  commentaires?: Record<string, string>; // itemId -> commentaire global
}

export interface Config {
  objectif: number; // % cible (80)
  statutVert: number;
  statutOrange: number;
  objectifAuditsMois: number; // 2
  nomService: string;
  nomEtablissement: string;
}

// ---- Calendrier qualité ----
export type EventType = "audit" | "crex" | "certif" | "reunion" | "groupe" | "exercice" | "info";
export type Implication = "realisation" | "participation" | "tiers";
export type Portee = "service" | "chu";

export interface Seance {
  id: string;
  date: string; // YYYY-MM-DD
  heure?: string; // HH:MM
  note?: string;
}

export interface PlanningEvent {
  id: string;
  nom: string;
  type: EventType;
  portee: Portee;
  frequence: string;
  mois: number[]; // 1-12 ; vide = tous les mois
  implication: Implication;
  pilote: string;
  pourMoi: string;
  seances?: Seance[]; // dates précises ajoutées par le cadre
}

// Résultat anonyme d'une tentative de quiz « Les incollables de la certif ».
// Aucune donnée nominative : on agrège seulement la performance de l'équipe.
export interface QuizResult {
  id: string;
  date: string; // ISO
  categorie: string; // "Tout" ou le nom d'une catégorie
  total: number; // nombre de questions répondues
  correct: number; // nombre de bonnes réponses / « je savais »
  missedIds: number[]; // ids des questions ratées (pour repérer les points faibles)
}

export interface Database {
  config: Config;
  users: User[];
  agents: Agent[];
  thematiques: Thematique[];
  sections: Section[]; // grille service (rétrocompat — identique à la grille "g-service")
  grilles: AuditGrille[]; // toutes les grilles d'audit (service + thématiques)
  fiches: Fiche[];
  audits: Audit[];
  formations: Formation[];
  paqss: PaqssAction[];
  planning: PlanningEvent[];
  quizResults: QuizResult[];
}
