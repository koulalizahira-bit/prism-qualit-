import type {
  Database,
  Thematique,
  Section,
  Fiche,
  Agent,
  User,
  Audit,
  AuditGrille,
  Zone,
  Formation,
  PaqssAction,
} from "./types";
import { FORMATIONS as FORMATIONS_DATA, AGENTS_FORMATIONS } from "./formationsData";
import { generateDemoAudits } from "./auditData";
import { PLANNING } from "./planningData";

// -------- Thématiques HAS --------
export const THEMATIQUES: Thematique[] = [
  { id: "t1", ordre: 1, nom: "Sécurisation du médicament", description: "Circuit du médicament : stockage, étiquetage, traçabilité, stupéfiants.",
    vigilances: ["Étiquetage complet des perfusions et PSE (débit, date).", "Armoire à médicaments et chariots verrouillés en l'absence de l'agent.", "Tracer le motif de non-administration."],
    infos: ["Audit « box à médicament » en cours.", "1 mois / 1 thème produit de santé (mai-juin)."] },
  { id: "t2", ordre: 2, nom: "Identitovigilance", description: "Identification fiable du patient (bracelet).",
    vigilances: ["Vérifier le bracelet avant tout soin à risque.", "Question ouverte : nom + date de naissance."],
    infos: ["Objectif HAS : 80% des critères."] },
  { id: "t3", ordre: 3, nom: "Dossier patient & traçabilité", description: "Traçabilité des soins et transmissions dans DPI.",
    vigilances: ["Tracer au fil de l'eau, pas en fin de poste.", "Transmission des 12h complète."],
    infos: ["Audit DPI / DPI mensuel."] },
  { id: "t4", ordre: 4, nom: "Risques infectieux & hygiène", description: "Hygiène, EPI, déchets, isolements, dépistages.",
    vigilances: ["Friction hydro-alcoolique aux 5 indications.", "DASRI propre et daté ; tablier pour soins mouillants.", "Échelles d'isolement à jour."],
    infos: ["Audit hygiène des mains trimestriel (UVIH/EOH).", "Prérequis en hygiène (avril)."] },
  { id: "t5", ordre: 5, nom: "Douleur & surveillance", description: "Évaluation de la douleur et surveillance du patient.",
    vigilances: ["Tracer évaluation ET réévaluation après antalgique.", "Fourchettes d'alarme du scope renseignées."],
    infos: ["Douleur : audit en continu."] },
  { id: "t6", ordre: 6, nom: "Droits & information du patient", description: "Personne de confiance, livret, présentation, satisfaction, biens.",
    vigilances: ["Recueillir et tracer personne de confiance + directives anticipées.", "Remettre et tracer le livret d'accueil."],
    infos: ["Expérience patient : axe certification HAS V2025."] },
  { id: "t7", ordre: 7, nom: "Urgences & SSE", description: "Chariot d'urgence, matériel vital, plan blanc / SSE.",
    vigilances: ["Chariot d'urgence vérifié, scellé, tracé.", "Connaître les fiches réflexes plan blanc."],
    infos: ["Chariot mis à jour au 01/01/2026.", "Exercices SSE au fil de l'année."] },
  { id: "t8", ordre: 8, nom: "Organisation & environnement", description: "Sécurité des locaux, confidentialité, tenue du service.",
    vigilances: ["Portes et sessions informatiques fermées (confidentialité).", "Couloirs et locaux rangés."],
    infos: ["Déclarer les événements indésirables (logiciel dédié) → CREX."] },
  { id: "t9", ordre: 9, nom: "Bientraitance & dignité", description: "Respect de l'intimité, communication bienveillante, environnement adapté.",
    vigilances: ["Tirer le rideau lors des soins.", "Parler au patient même non communicant.", "Limiter le bruit dans et autour de la chambre."],
    infos: ["Critère HAS V2025 : bientraitance en soins critiques."] },
];

// -------- Zones (colonnes) — libellés génériques, sans lien avec un service réel --------
const ZONES_SALLE: Zone[] = [
  { id: "secteurA", label: "Secteur A" },
  { id: "secteurB", label: "Secteur B" },
];
const ZONES_SECTEURS: Zone[] = [
  { id: "a1", label: "Secteur A · Ch. 1" },
  { id: "a2", label: "Secteur A · Ch. 2" },
  { id: "a3", label: "Secteur A · Ch. 3" },
  { id: "a4", label: "Secteur A · Ch. 4" },
  { id: "b1", label: "Secteur B · Ch. 1" },
  { id: "b2", label: "Secteur B · Ch. 2" },
  { id: "b3", label: "Secteur B · Ch. 3" },
];

// -------- Sections & items de la grille d'audit service, mappés aux thématiques --------
export const SECTIONS: Section[] = [
  {
    id: "s1",
    ordre: 1,
    nom: "Tour salle de soins",
    zones: ZONES_SALLE,
    items: [
      { id: "s1i1", libelle: "Portes fermées", themeId: "t8" },
      { id: "s1i2", libelle: "Portes de l'armoire à médicaments verrouillées", themeId: "t1" },
      { id: "s1i3", libelle: "Traçabilité stupéfiants", themeId: "t1" },
      { id: "s1i4", libelle: "Correction si erreur", themeId: "t3" },
      { id: "s1i5", libelle: "Absence d'effet personnel de l'agent", themeId: "t8" },
      { id: "s1i6", libelle: "Date sur perfusions, flacons et DASRI", themeId: "t1" },
      { id: "s1i7", libelle: "Propreté des locaux", themeId: "t4" },
      { id: "s1i8", libelle: "Session applicative fermée", themeId: "t8" },
      { id: "s1i9", libelle: "Traçabilité frigo / obus", themeId: "t1" },
      { id: "s1i10", libelle: "Absence de surblouse hors usage", themeId: "t4" },
      { id: "s1i11", libelle: "Retour pharmacie demandé et commande ATB OK", themeId: "t1" },
      { id: "s1i12", libelle: "Tenue du tableau de la salle de staff", themeId: "t8" },
      { id: "s1i13", libelle: "Rangement des couloirs", themeId: "t8" },
      { id: "s1i14", libelle: "Propreté des chariots", themeId: "t4" },
      { id: "s1i15", libelle: "Absence de poubelle au sol", themeId: "t4" },
      { id: "s1i16", libelle: "Traçabilité chariot d'urgence / sac", themeId: "t7" },
      { id: "s1i17", libelle: "Tenue des salles de rangement / kiné / ASH / matériel", themeId: "t8" },
      { id: "s1i18", libelle: "Toutes portes fermées", themeId: "t8" },
      { id: "s1i19", libelle: "Traçabilité office", themeId: "t4" },
      { id: "s1i20", libelle: "Tenue du local à déchets", themeId: "t4" },
      { id: "s1i21", libelle: "Tenue des échelles d'isolement", themeId: "t4" },
      { id: "s1i22", libelle: "Port du tablier", themeId: "t4" },
      { id: "s1i23", libelle: "Cheveux, bijoux, ongles", themeId: "t4" },
    ],
  },
  {
    id: "s2",
    ordre: 2,
    nom: "Tour en chambre / Sécurité",
    zones: ZONES_SECTEURS,
    items: [
      { id: "s2i1", libelle: "Présence personne de confiance / directives anticipées", themeId: "t6" },
      { id: "s2i2", libelle: "Traçabilité ménage chambre / biomédical", themeId: "t4" },
      { id: "s2i3", libelle: "Chariot verrouillé", themeId: "t1" },
      { id: "s2i4", libelle: "Sessions fermées", themeId: "t8" },
      { id: "s2i5", libelle: "Absence de surstock dans le chariot", themeId: "t1" },
      { id: "s2i6", libelle: "Présence des dates sur tous les flacons", themeId: "t1" },
      { id: "s2i7", libelle: "Montage de la chambre selon check-list (2 perf / 3 PSE)", themeId: "t1" },
      { id: "s2i8", libelle: "Traçabilité des perfusions / PSE en cours", themeId: "t1" },
      { id: "s2i9", libelle: "DASRI propre et daté", themeId: "t4" },
      { id: "s2i10", libelle: "Installation du patient / tenue / fils du scope", themeId: "t5" },
      { id: "s2i11", libelle: "Présence du bracelet d'identification", themeId: "t2" },
      { id: "s2i12", libelle: "Scope : fourchettes d'alarme renseignées", themeId: "t5" },
      { id: "s2i13", libelle: "Manomètre O₂ avec nécessaire présent", themeId: "t7" },
      { id: "s2i14", libelle: "Aspiration montée et datée", themeId: "t7" },
      { id: "s2i15", libelle: "Présence du livret d'accueil et traçabilité", themeId: "t6" },
      { id: "s2i16", libelle: "Connaissance du risque SSE / plan blanc", themeId: "t7" },
      { id: "s2i17", libelle: "Enquête de satisfaction auprès du patient", themeId: "t6" },
      { id: "s2i18", libelle: "L'agent se présente auprès du patient", themeId: "t6" },
      { id: "s2i19", libelle: "Intimité préservée lors des soins (rideau, paravent)", themeId: "t9" },
      { id: "s2i20", libelle: "Patient non communicant : explications des soins données à voix haute", themeId: "t9" },
      { id: "s2i21", libelle: "Environnement sonore respectueux (bruit limité autour du patient)", themeId: "t9" },
    ],
  },
  {
    id: "s3",
    ordre: 3,
    nom: "Traçabilité du dossier patient",
    zones: ZONES_SECTEURS,
    items: [
      { id: "s3i1", libelle: "Traçabilité PSMT", themeId: "t3" },
      { id: "s3i2", libelle: "Traçabilité inventaire / dépôt de valeurs", themeId: "t6" },
      { id: "s3i3", libelle: "Traçabilité équipement", themeId: "t3" },
      { id: "s3i4", libelle: "Traçabilité transmission par 12h", themeId: "t3" },
      { id: "s3i5", libelle: "Tour de sécurité", themeId: "t7" },
      { id: "s3i6", libelle: "PEC douleur et réévaluation", themeId: "t5" },
      { id: "s3i7", libelle: "Poids", themeId: "t5" },
      { id: "s3i8", libelle: "EPC / PCR (dépistage BMR)", themeId: "t4" },
      { id: "s3i9", libelle: "Traçabilité AS : soins d'hygiène et de confort", themeId: "t3" },
    ],
  },
];

// -------- Grilles d'audit thématiques (grilles dédiées, 1 colonne d'observation) --------
const ZONE_UNITE: Zone[] = [{ id: "unite", label: "Unité" }];

export const GRILLES: AuditGrille[] = [
  {
    id: "g-service",
    nom: "Audit service",
    type: "service",
    description: "Audit global du service : salle de soins, chambres et dossier patient. C'est l'audit mensuel de référence.",
    frequence: "Mensuel (2 roulements)",
    themeIds: THEMATIQUES.map((t) => t.id),
    criteresHAS: [
      "1.1 — Droits & information du patient",
      "1.2 — Bientraitance & dignité",
      "2.2 — Maîtrise des risques liés aux pratiques",
      "2.3 — Sécurité des prises en charge",
    ],
    sections: SECTIONS,
  },
  {
    id: "g-hygiene",
    nom: "Hygiène des mains & risque infectieux",
    type: "thematique",
    description: "Audit ciblé sur l'hygiène des mains, les précautions standard et complémentaires, et la gestion du risque infectieux.",
    frequence: "Trimestriel",
    themeIds: ["t4"],
    criteresHAS: [
      "2.2 — Maîtrise des risques liés aux pratiques",
      "2.3 — Sécurité des prises en charge en équipe",
    ],
    sections: [
      {
        id: "gh-s1", ordre: 1, nom: "Hygiène & risque infectieux", zones: ZONE_UNITE,
        items: [
          { id: "gh1", libelle: "Friction hydro-alcoolique aux 5 indications", themeId: "t4" },
          { id: "gh2", libelle: "Ongles courts, sans vernis, sans bijou, manches courtes", themeId: "t4" },
          { id: "gh3", libelle: "Port du tablier pour les soins mouillants", themeId: "t4" },
          { id: "gh4", libelle: "EPI adaptés au type d'isolement", themeId: "t4" },
          { id: "gh5", libelle: "Échelles d'isolement tenues à jour", themeId: "t4" },
          { id: "gh6", libelle: "DASRI propre, daté et bien orienté", themeId: "t4" },
          { id: "gh7", libelle: "Dépistage BMR/BHRe réalisé selon le protocole", themeId: "t4" },
          { id: "gh8", libelle: "Propreté des surfaces et du matériel de soins", themeId: "t4" },
        ],
      },
    ],
  },
  {
    id: "g-medicament",
    nom: "Circuit du médicament",
    type: "thematique",
    description: "Audit ciblé sur la sécurisation du circuit du médicament : stockage, étiquetage, traçabilité, stupéfiants.",
    frequence: "Trimestriel",
    themeIds: ["t1"],
    criteresHAS: [
      "2.2 — Maîtrise des risques liés aux pratiques",
      "2.4 — Sécurisation de la prise en charge médicamenteuse",
    ],
    sections: [
      {
        id: "gm-s1", ordre: 1, nom: "Circuit du médicament", zones: ZONE_UNITE,
        items: [
          { id: "gm1", libelle: "Armoire à médicaments verrouillée en l'absence de l'agent", themeId: "t1" },
          { id: "gm2", libelle: "Étiquetage complet des perfusions et PSE (produit, dose, débit, date)", themeId: "t1" },
          { id: "gm3", libelle: "Traçabilité des stupéfiants (registre, comptage, double contrôle)", themeId: "t1" },
          { id: "gm4", libelle: "Dates de péremption vérifiées sur tous les flacons", themeId: "t1" },
          { id: "gm5", libelle: "Absence de surstock non justifié dans le chariot", themeId: "t1" },
          { id: "gm6", libelle: "Traçabilité de l'administration (ou motif de non-administration)", themeId: "t1" },
          { id: "gm7", libelle: "Respect de la chaîne du froid (frigo tracé)", themeId: "t1" },
        ],
      },
    ],
  },
  {
    id: "g-identito",
    nom: "Identitovigilance",
    type: "thematique",
    description: "Audit ciblé sur l'identification fiable du patient tout au long de sa prise en charge.",
    frequence: "Semestriel",
    themeIds: ["t2"],
    criteresHAS: [
      "2.2 — Maîtrise des risques liés aux pratiques",
      "2.3 — Sécurité des prises en charge",
    ],
    sections: [
      {
        id: "gi-s1", ordre: 1, nom: "Identitovigilance", zones: ZONE_UNITE,
        items: [
          { id: "gi1", libelle: "Bracelet d'identification posé dès l'admission", themeId: "t2" },
          { id: "gi2", libelle: "Bracelet lisible (nom, prénom, date de naissance, IPP)", themeId: "t2" },
          { id: "gi3", libelle: "Vérification de l'identité avant tout soin à risque", themeId: "t2" },
          { id: "gi4", libelle: "Question ouverte utilisée (nom + date de naissance)", themeId: "t2" },
          { id: "gi5", libelle: "Bracelet reposé immédiatement si absent ou illisible", themeId: "t2" },
        ],
      },
    ],
  },
  {
    id: "g-dossier",
    nom: "Dossier patient & traçabilité",
    type: "thematique",
    description: "Audit ciblé sur la traçabilité des soins et la qualité des transmissions dans le dossier patient.",
    frequence: "Trimestriel",
    themeIds: ["t3"],
    criteresHAS: [
      "2.1 — Coordination et continuité des soins",
      "2.3 — Sécurité des prises en charge",
    ],
    sections: [
      {
        id: "gd-s1", ordre: 1, nom: "Dossier patient", zones: ZONE_UNITE,
        items: [
          { id: "gd1", libelle: "Traçabilité des soins au fil de l'eau (pas en fin de poste)", themeId: "t3" },
          { id: "gd2", libelle: "Transmission des 12h complète et horodatée", themeId: "t3" },
          { id: "gd3", libelle: "Traçabilité des soins d'hygiène et de confort (AS)", themeId: "t3" },
          { id: "gd4", libelle: "Prescriptions présentes, datées et signées", themeId: "t3" },
          { id: "gd5", libelle: "Surveillance (constantes, poids) tracée selon prescription", themeId: "t3" },
          { id: "gd6", libelle: "Correction d'erreur conforme (pas de blanc/rature masquante)", themeId: "t3" },
        ],
      },
    ],
  },
  {
    id: "g-douleur",
    nom: "Douleur & surveillance",
    type: "thematique",
    description: "Audit ciblé sur l'évaluation de la douleur et la surveillance continue du patient de soins critiques.",
    frequence: "Semestriel",
    themeIds: ["t5"],
    criteresHAS: [
      "1.1 — Soins visant à anticiper et soulager la douleur",
      "2.3 — Sécurité des prises en charge",
    ],
    sections: [
      {
        id: "gp-s1", ordre: 1, nom: "Douleur & surveillance", zones: ZONE_UNITE,
        items: [
          { id: "gp1", libelle: "Douleur évaluée à l'arrivée puis régulièrement", themeId: "t5" },
          { id: "gp2", libelle: "Échelle adaptée au patient (EN, Algoplus…)", themeId: "t5" },
          { id: "gp3", libelle: "Réévaluation tracée après antalgique", themeId: "t5" },
          { id: "gp4", libelle: "Fourchettes d'alarme du scope renseignées et adaptées", themeId: "t5" },
          { id: "gp5", libelle: "Patient bien installé, fils dégagés, alarmes audibles", themeId: "t5" },
        ],
      },
    ],
  },
  {
    id: "g-droits",
    nom: "Droits & bientraitance",
    type: "thematique",
    description: "Audit ciblé sur les droits du patient, son information et les pratiques de bientraitance.",
    frequence: "Semestriel",
    themeIds: ["t6", "t9"],
    criteresHAS: [
      "1.1 — Droits & information du patient",
      "1.2 — Bientraitance & dignité",
    ],
    sections: [
      {
        id: "gr-s1", ordre: 1, nom: "Droits & bientraitance", zones: ZONE_UNITE,
        items: [
          { id: "gr1", libelle: "Personne de confiance recueillie et tracée", themeId: "t6" },
          { id: "gr2", libelle: "Directives anticipées proposées et tracées", themeId: "t6" },
          { id: "gr3", libelle: "Livret d'accueil remis et tracé", themeId: "t6" },
          { id: "gr4", libelle: "L'agent se présente au patient (nom, fonction)", themeId: "t6" },
          { id: "gr5", libelle: "Intimité préservée lors des soins (rideau, paravent)", themeId: "t9" },
          { id: "gr6", libelle: "Patient non communicant : soins expliqués à voix haute", themeId: "t9" },
          { id: "gr7", libelle: "Environnement sonore respectueux au chevet", themeId: "t9" },
        ],
      },
    ],
  },
];

// -------- Fiches pratiques (par thématique HAS) --------
export const FICHES: Fiche[] = [
  { id: "f1", themeId: "t1", titre: "Étiquetage des perfusions et PSE", resume: "Ce que doit comporter chaque étiquette.", contenu: [
    "Nom du patient.", "Produit et dose.", "Débit / vitesse.", "Date et heure de pose.", "Initiales de l'agent." ] },
  { id: "f2", themeId: "t1", titre: "Traçabilité des stupéfiants", resume: "Objectif 100% — coffre, registre, comptage.", contenu: [
    "Stockage dans un coffre verrouillé dédié.", "Traçabilité unitaire à chaque prise.", "Double contrôle des sorties.", "Comptage à chaque relève jour/nuit." ] },
  { id: "f3", themeId: "t1", titre: "Chariot de médicaments sécurisé", resume: "Verrouillage, dates, absence de surstock.", contenu: [
    "Chariot verrouillé en l'absence de l'agent.", "Aucun surstock non justifié.", "Dates présentes sur tous les flacons.", "Armoire à médicaments fermée." ] },
  { id: "f4", themeId: "t2", titre: "Le bracelet d'identification", resume: "Objectif identitovigilance : 80% des critères.", contenu: [
    "Bracelet posé dès l'admission.", "Lisible : nom, prénom, date de naissance, IPP.", "Vérifié avant tout soin à risque.", "Reposé immédiatement si absent ou illisible." ] },
  { id: "f5", themeId: "t2", titre: "Vérifier l'identité du patient", resume: "Question ouverte systématique.", contenu: [
    "« Pouvez-vous me donner votre nom et date de naissance ? ».", "Comparer au bracelet ET au dossier.", "Ne jamais se fier au numéro de lit.", "Signaler toute discordance." ] },
  { id: "f6", themeId: "t3", titre: "Traçabilité dans DPI", resume: "Tracer au fil de l'eau, pas en fin de poste.", contenu: [
    "Tracer le soin au moment où il est fait.", "Transmission = fait observable + action.", "Transmission des 12h complète.", "Horodatage systématique." ] },
  { id: "f7", themeId: "t3", titre: "Traçabilité AS : hygiène et confort", resume: "Valoriser et tracer les soins AS.", contenu: [
    "Tracer toilette, change, installation.", "Noter l'état cutané.", "Transmettre les points de vigilance.", "Renseigner le poids quand prescrit." ] },
  { id: "f8", themeId: "t4", titre: "Hygiène des mains : les 5 indications", resume: "La friction au bon moment.", contenu: [
    "Avant contact patient.", "Avant geste aseptique.", "Après risque d'exposition à un liquide biologique.", "Après contact patient.", "Après contact avec l'environnement." ] },
  { id: "f9", themeId: "t4", titre: "Tri des déchets (DASRI)", resume: "DASRI propre, daté, bien orienté.", contenu: [
    "DASRI dans les contenants jaunes.", "Piquants/coupants dans le collecteur dédié.", "Sac daté et fermé avant remplissage max.", "Tablier porté pour les soins mouillants." ] },
  { id: "f10", themeId: "t4", titre: "Précautions complémentaires & isolements", resume: "Échelles d'isolement et EPC/PCR.", contenu: [
    "Échelle d'isolement tenue à jour.", "EPI adaptés au type d'isolement.", "Dépistage EPC/PCR selon protocole.", "Information de l'équipe et du patient." ] },
  { id: "f11", themeId: "t5", titre: "Évaluer et réévaluer la douleur", resume: "Objectif HAS : tracer évaluation ET réévaluation.", contenu: [
    "Évaluer à l'arrivée et régulièrement.", "Échelle adaptée (EN, Algoplus…).", "Réévaluer après antalgique.", "Tracer systématiquement dans le dossier." ] },
  { id: "f12", themeId: "t5", titre: "Surveillance scope & installation", resume: "Sécuriser la surveillance continue.", contenu: [
    "Fourchettes d'alarme renseignées et adaptées.", "Patient bien installé, fils dégagés.", "Alarmes audibles.", "Surveillance visuelle et sonore assurée." ] },
  { id: "f13", themeId: "t6", titre: "Personne de confiance & directives anticipées", resume: "Recueil et traçabilité.", contenu: [
    "Proposer la désignation d'une personne de confiance.", "Recueillir les directives anticipées.", "Tracer dans le dossier.", "Respecter le choix du patient." ] },
  { id: "f14", themeId: "t6", titre: "Accueil et information du patient", resume: "Livret, présentation, satisfaction.", contenu: [
    "Remettre le livret d'accueil et le tracer.", "Se présenter : nom et fonction.", "Informer sur les soins.", "Proposer l'enquête de satisfaction." ] },
  { id: "f15", themeId: "t7", titre: "Le chariot d'urgence", resume: "Vérifié, tracé, prêt à l'emploi.", contenu: [
    "Vérifié et scellé selon la procédure.", "Check-list datée et signée.", "Emplacement connu de tous.", "Réassort immédiat après usage." ] },
  { id: "f16", themeId: "t7", titre: "Matériel vital en chambre", resume: "Manomètre O₂ et aspiration opérationnels.", contenu: [
    "Manomètre O₂ avec nécessaire présent.", "Aspiration montée et datée.", "Testée à chaque prise de poste.", "Consommables disponibles." ] },
  { id: "f17", themeId: "t7", titre: "Risque SSE / Plan blanc", resume: "Connaître les fiches réflexes.", contenu: [
    "Savoir où trouver les fiches réflexes.", "Connaître l'alerte et le circuit.", "Participer aux exercices.", "Maintenir ses connaissances SSE." ] },
  { id: "f18", themeId: "t8", titre: "Confidentialité & sécurité des locaux", resume: "Portes, sessions, environnement.", contenu: [
    "Portes fermées (confidentialité, sécurité).", "Sessions informatiques fermées.", "Pas d'effet personnel dans les zones de soins.", "Couloirs et locaux rangés." ] },
  { id: "f19", themeId: "t9", titre: "Bientraitance en soins critiques", resume: "Soigner aussi la personne, pas seulement le corps.", contenu: [
    "Parler au patient avant chaque soin, même s'il ne répond pas.",
    "Tirer le rideau / paravent lors des soins.",
    "Limiter les bruits inutiles (conversations, alarmes prolongées).",
    "Expliquer chaque geste au patient inconscient ou sédaté.",
    "Impliquer les proches dans les soins quand c'est possible." ] },
];

// -------- Plan de formation (démonstration) --------
export const FORMATIONS: Formation[] = FORMATIONS_DATA;

// -------- PAQSS curaté (version lisible) --------
export const PAQSS: PaqssAction[] = [
  { id: "p1", themeId: "t1", titre: "Traçabilité de l'administration des médicaments", amelioration: "Rendre la traçabilité d'administration complète dans le dossier.", ceQueJeFais: "Je trace chaque administration (ou le motif de non-administration) au moment du soin.", statut: "en_cours", responsable: "Cadre de santé", echeance: "déc. 2026", objectif: "80% de conformité" },
  { id: "p2", themeId: "t1", titre: "Étiquetage des perfusions et PSE", amelioration: "Sécuriser la préparation et l'administration des perfusions.", ceQueJeFais: "J'étiquette chaque perfusion (produit, dose, débit, date, initiales).", statut: "en_cours", responsable: "Cadre de santé", echeance: "déc. 2026", objectif: "80% des critères" },
  { id: "p3", themeId: "t1", titre: "Traçabilité des stupéfiants", amelioration: "Garantir une traçabilité et un comptage sans faille.", ceQueJeFais: "Je trace chaque prise et je participe au comptage jour/nuit.", statut: "en_cours", responsable: "Cadre de santé", echeance: "déc. 2027", objectif: "100% du stock" },
  { id: "p4", themeId: "t1", titre: "Sécuriser la transfusion (hémovigilance)", amelioration: "Compléter la traçabilité de réception et de transfusion des PSL.", ceQueJeFais: "Je vérifie et je trace chaque étape transfusionnelle.", statut: "en_cours", responsable: "Cadre de santé", echeance: "déc. 2026", objectif: "75% des IDE formés" },
  { id: "p5", themeId: "t2", titre: "Port du bracelet d'identité", amelioration: "Fiabiliser l'identification des patients.", ceQueJeFais: "Je vérifie le bracelet avant chaque soin à risque, je le repose s'il manque.", statut: "en_cours", responsable: "Cadre de santé", echeance: "déc. 2026", objectif: "80% des critères" },
  { id: "p6", themeId: "t3", titre: "Traçabilité du dossier (DPI)", amelioration: "Tracer les soins en temps réel sur les deux roulements.", ceQueJeFais: "Je trace au fil de l'eau et je complète la transmission des 12h.", statut: "en_cours", responsable: "Cadre de santé", echeance: "déc. 2026", objectif: "80% des critères" },
  { id: "p7", themeId: "t4", titre: "Précautions standard & hygiène", amelioration: "Appliquer systématiquement les précautions standard et complémentaires.", ceQueJeFais: "Friction hydro-alcoolique, tablier, EPI adaptés, échelles d'isolement à jour.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "80% des critères" },
  { id: "p8", themeId: "t4", titre: "Tri des déchets (DASRI)", amelioration: "Fiabiliser le tri et réduire le risque d'AES.", ceQueJeFais: "J'oriente correctement les déchets, DASRI propre et daté.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "Audit trimestriel" },
  { id: "p9", themeId: "t5", titre: "Évaluation et réévaluation de la douleur", amelioration: "Tracer l'évaluation ET la réévaluation après antalgique.", ceQueJeFais: "J'évalue la douleur, je réévalue après traitement et je trace.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "90% de conformité" },
  { id: "p10", themeId: "t5", titre: "Surveillance des patients de soins critiques", amelioration: "Formaliser la surveillance visuelle et sonore.", ceQueJeFais: "Je règle les alarmes (fourchettes), j'assure une surveillance continue.", statut: "non_initiee", responsable: "Chef de service / Cadre", echeance: "2026", objectif: "Procédure formalisée" },
  { id: "p11", themeId: "t6", titre: "Personne de confiance & directives anticipées", amelioration: "Systématiser le recueil et la traçabilité.", ceQueJeFais: "Je propose la personne de confiance et je trace les directives.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "Sur 35 dossiers" },
  { id: "p12", themeId: "t6", titre: "Information & livret d'accueil", amelioration: "Généraliser la remise du livret et l'information du patient.", ceQueJeFais: "Je remets le livret, je me présente, je trace l'information donnée.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "Critères HAS V2025" },
  { id: "p13", themeId: "t7", titre: "Chariots / sacs d'urgence opérationnels", amelioration: "Assurer l'état opérationnel et la traçabilité des vérifications.", ceQueJeFais: "Je vérifie et je trace le chariot d'urgence selon la procédure.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "100% de conformité" },
  { id: "p14", themeId: "t7", titre: "Gestes d'urgence & SSE / Plan blanc", amelioration: "Maintenir les compétences en gestes d'urgence et SSE.", ceQueJeFais: "Je participe aux formations et aux exercices plan blanc.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "80% des agents formés" },
  { id: "p15", themeId: "t8", titre: "Culture qualité (CREX, RMM, EPP)", amelioration: "Développer la déclaration et l'analyse des événements indésirables.", ceQueJeFais: "Je déclare les EI via le logiciel de déclaration, je participe aux CREX/RMM.", statut: "en_cours", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "4 CREX/an minimum" },
  { id: "p16", themeId: "t8", titre: "Documents qualité à jour (GED)", amelioration: "Avoir des procédures de moins de 5 ans.", ceQueJeFais: "Je me réfère aux procédures à jour de la GED.", statut: "realisee", responsable: "Chef de service / Cadre", echeance: "déc. 2026", objectif: "100% < 5 ans" },
  { id: "p17", themeId: "t9", titre: "Bientraitance en soins critiques", amelioration: "Intégrer les pratiques bientraitantes dans les routines de soins.", ceQueJeFais: "Je parle au patient, je préserve son intimité, je limite le bruit au chevet.", statut: "non_initiee", responsable: "Cadre de santé", echeance: "déc. 2026", objectif: "Critère HAS V2025" },

  // --- Plan d'action ÉQUIPE (issu des non-conformités du dernier audit service, mai 2026) ---
  { id: "pe1", themeId: "t1", nature: "equipe", auditId: "aud-demo-5", auditDate: "2026-05-13T09:30:00.000Z", itemId: "s2i6", titre: "Dater tous les flacons ouverts", amelioration: "Aucun flacon sans date d'ouverture en chambre.", ceQueJeFais: "Je note la date sur chaque flacon dès l'ouverture.", statut: "en_cours", responsable: "Équipe soignante", echeance: "juil. 2026", objectif: "0 flacon non daté" },
  { id: "pe2", themeId: "t3", nature: "equipe", auditId: "aud-demo-5", auditDate: "2026-05-13T09:30:00.000Z", itemId: "s3i1", titre: "Tracer les PSMT au fil de l'eau", amelioration: "Compléter la traçabilité du dossier au moment du soin.", ceQueJeFais: "Je trace le soin dès qu'il est réalisé, pas en fin de poste.", statut: "en_cours", responsable: "Équipe soignante", echeance: "juil. 2026", objectif: "Transmission 12h complète" },
  { id: "pe3", themeId: "t6", nature: "equipe", auditId: "aud-demo-5", auditDate: "2026-05-13T09:30:00.000Z", itemId: "s2i17", titre: "Proposer l'enquête de satisfaction", amelioration: "Remettre systématiquement l'enquête de satisfaction au patient.", ceQueJeFais: "Je propose l'enquête et je trace la remise.", statut: "non_initiee", responsable: "Équipe soignante", echeance: "août 2026", objectif: "1 patient / secteur" },
  { id: "pe4", themeId: "t9", nature: "equipe", auditId: "aud-demo-5", auditDate: "2026-05-13T09:30:00.000Z", itemId: "s2i20", titre: "Expliquer les soins au patient non communicant", amelioration: "Verbaliser chaque geste, même chez le patient sédaté.", ceQueJeFais: "J'explique le soin à voix haute avant de le faire.", statut: "non_initiee", responsable: "Équipe soignante", echeance: "août 2026", objectif: "Critère bientraitance" },
];

// -------- Effectif de démonstration (fictif, généré) --------
function buildAgents(): Agent[] {
  return AGENTS_FORMATIONS.map((a) => ({ ...a, habilitations: { ...a.habilitations } }));
}

export function buildSeed(): Database {
  const agents = buildAgents();

  const users: User[] = [
    { id: "u-cadre", login: "cadre", pin: "1234", role: "cadre", displayName: "Cadre de Santé" },
    { id: "u-sup", login: "superieur", pin: "1234", role: "superieur", displayName: "Cadre Supérieur" },
    { id: "u-agent", login: "equipe", pin: "0000", role: "agent", displayName: "Équipe soignante" },
  ];

  // Audits de démonstration (fictifs), générés à partir de toutes les grilles.
  const audits: Audit[] = generateDemoAudits(GRILLES);

  return {
    config: {
      objectif: 80,
      statutVert: 85,
      statutOrange: 75,
      objectifAuditsMois: 2,
      nomService: "Unité de Soins Intensifs",
      nomEtablissement: "Établissement de santé",
    },
    users,
    agents,
    thematiques: THEMATIQUES,
    sections: SECTIONS,
    grilles: GRILLES,
    fiches: FICHES,
    audits,
    formations: FORMATIONS,
    paqss: PAQSS,
    planning: PLANNING,
    quizResults: [],
  };
}
