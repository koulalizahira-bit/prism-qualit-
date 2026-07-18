// Les 5 méthodes d'évaluation HAS V2025 — telles que l'expert les applique en visite.
// Objectif : que l'équipe de terrain comprenne COMMENT elle va être interrogée.
// Source : fiches pédagogiques HAS "méthodes d'évaluation" (septembre 2025).

export type MethodeAccent =
  | "turquoise"
  | "indigo"
  | "violet"
  | "emeraude"
  | "rose";

export interface MethodeEtape {
  titre: string;
  duree?: string;
  description: string;
}

export interface MethodeListe {
  titre: string;
  items: string[];
}

export interface MethodeEval {
  id: string;
  nom: string;
  nomCourt: string;
  emoji: string;
  accent: MethodeAccent;
  sousTitre: string; // ce que l'expert évalue, en une phrase
  format: "etapes" | "grille"; // etapes = timeline numérotée, grille = cartes
  etapes: MethodeEtape[];
  liste?: MethodeListe; // cibles possibles, thèmes évalués...
  aRetenir: string;
}

export const HAS_METHODES_EVAL: MethodeEval[] = [
  // ── 1. Patient traceur ──────────────────────────────────────────────────
  {
    id: "patient_traceur",
    nom: "Le patient traceur",
    nomCourt: "Patient",
    emoji: "🔍",
    accent: "turquoise",
    sousTitre:
      "L'expert évalue la prise en charge d'UN patient, de son entrée à sa sortie.",
    format: "etapes",
    etapes: [
      {
        titre: "Identification du patient",
        description:
          "L'expert choisit un patient hospitalisé, au plus proche de sa sortie, et recueille son consentement. Un médecin lui présente le dossier.",
      },
      {
        titre: "Entretien avec le patient",
        duree: "20 min",
        description:
          "En tête à tête, l'expert interroge le patient : douleur, information reçue, vérification d'identité, ressenti. Il ne pose pas de question médicale.",
      },
      {
        titre: "Entretien avec l'équipe soignante",
        duree: "40 min",
        description:
          "L'expert réunit l'équipe (médecins, IDE, AS…) et suit le parcours du patient dans le dossier. Chacun présente ses preuves de traçabilité.",
      },
    ],
    aRetenir:
      "Ce n'est PAS un jugement des choix diagnostiques ou thérapeutiques. Ce sont la traçabilité et la sécurité du parcours qui sont évaluées.",
  },

  // ── 2. Parcours traceur ─────────────────────────────────────────────────
  {
    id: "parcours_traceur",
    nom: "Le parcours traceur",
    nomCourt: "Parcours",
    emoji: "🛤️",
    accent: "indigo",
    sousTitre:
      "L'expert suit un parcours patient complet, de service en service.",
    format: "etapes",
    etapes: [
      {
        titre: "Identification du parcours",
        description:
          "Un dossier « fil rouge » (patient sorti depuis 2 à 3 mois) est choisi pour représenter un parcours type du service.",
      },
      {
        titre: "Rencontre avec les équipes",
        duree: "1 h",
        description:
          "L'encadrement de toutes les équipes du parcours est réuni (urgences, imagerie, bloc, soins, support). Chacune présente ses indicateurs et ses actions.",
      },
      {
        titre: "Parcours physique",
        duree: "2 h",
        description:
          "L'expert refait le trajet réel du patient, service par service, observe les pratiques sur le terrain et échange avec les soignants et des patients.",
      },
    ],
    aRetenir:
      "Ce qui est évalué : la coordination entre vos services et la traçabilité des transmissions tout au long du parcours.",
  },

  // ── 3. Traceur ciblé ────────────────────────────────────────────────────
  {
    id: "traceur_cible",
    nom: "Le traceur ciblé",
    nomCourt: "Ciblé",
    emoji: "🎯",
    accent: "violet",
    sousTitre:
      "L'expert suit un processus précis à risque, de bout en bout.",
    format: "etapes",
    etapes: [
      {
        titre: "Identification de la cible",
        description:
          "L'expert choisit, avec l'établissement, un processus précis à tracer : un médicament injectable, une transfusion, un isolement, un événement indésirable…",
      },
      {
        titre: "Suivi du circuit",
        duree: "45 min à 2 h",
        description:
          "Il suit la cible étape par étape et interroge chaque professionnel impliqué (prescripteur, pharmacie, équipe soignante), preuves à l'appui.",
      },
      {
        titre: "En cas d'écart",
        description:
          "Si une faille est trouvée, l'expert remonte tout le circuit pour en chercher la cause (formation, locaux, matériel inadapté…).",
      },
    ],
    liste: {
      titre: "Les 8 cibles possibles",
      items: [
        "Circuit du médicament",
        "Transfusion",
        "Infections associées aux soins",
        "Événements indésirables",
        "SAMU / SMUR",
        "Secteurs interventionnels",
        "Isolement / contention",
        "Restrictions de liberté",
      ],
    },
    aRetenir:
      "L'expert part du terrain pour remonter vers le processus. Un écart est vu comme systémique, jamais comme une faute individuelle.",
  },

  // ── 4. Audit système ────────────────────────────────────────────────────
  {
    id: "audit_systeme",
    nom: "L'audit système",
    nomCourt: "Système",
    emoji: "🏛️",
    accent: "emeraude",
    sousTitre:
      "L'expert évalue la stratégie qualité, de la direction jusqu'au terrain.",
    format: "etapes",
    etapes: [
      {
        titre: "Consultation documentaire",
        description:
          "Environ 4 mois avant la visite, l'expert analyse vos documents : projet d'établissement, politique qualité, PAQSS, bilan des événements indésirables…",
      },
      {
        titre: "Rencontre avec la gouvernance",
        duree: "1 h 30 à 2 h",
        description:
          "Direction générale, présidence de CME, direction des soins : comment la stratégie qualité est-elle pilotée et déclinée ?",
      },
      {
        titre: "Rencontre avec les professionnels",
        duree: "45 min",
        description:
          "Les équipes de terrain (tous les corps de métier) : la politique qualité est-elle réellement connue, appropriée et appliquée ?",
      },
      {
        titre: "Rencontre avec l'encadrement",
        duree: "45 min",
        description:
          "L'encadrement médical et paramédical : implication dans la démarche qualité, accompagnement et soutien des équipes.",
      },
      {
        titre: "Rencontre avec les représentants des usagers",
        duree: "1 h 15",
        description:
          "Sans aucun professionnel présent : les usagers participent-ils vraiment à la vie et aux décisions de l'établissement ?",
      },
    ],
    liste: {
      titre: "Les 5 thèmes évalués",
      items: [
        "Management par la qualité et les risques",
        "Positionnement territorial",
        "Engagement des patients",
        "Maîtrise des ressources et compétences",
        "Maîtrise des risques numériques",
      ],
    },
    aRetenir:
      "Contrairement au traceur ciblé, l'audit système part de l'organisation pour vérifier qu'elle vit réellement sur le terrain.",
  },

  // ── 5. Méthode d'observation ────────────────────────────────────────────
  {
    id: "observation",
    nom: "La méthode d'observation",
    nomCourt: "Observation",
    emoji: "👁️",
    accent: "rose",
    sousTitre:
      "L'expert observe en silence, dans tous les services, en complément des autres méthodes.",
    format: "grille",
    etapes: [
      {
        titre: "Dignité & confidentialité",
        description:
          "Portes des chambres fermées, intimité respectée, aucun patient dénudé dans les couloirs.",
      },
      {
        titre: "Risque infectieux",
        description:
          "Mains sans bijou, tenues conformes, solution hydroalcoolique disponible, friction avant et après chaque soin.",
      },
      {
        titre: "Produits de santé",
        description:
          "Aucun produit périmé, stockage et étiquetage conformes.",
      },
      {
        titre: "Accessibilité (handicap)",
        description:
          "Rampes d'accès, hauteur adaptée des guichets, signalétique adaptée à tout type de handicap.",
      },
      {
        titre: "Affichage",
        description:
          "Coordonnées des représentants des usagers, messages de santé publique, niveau de certification affiché.",
      },
      {
        titre: "Environnement de travail",
        description:
          "Locaux propres, salle de repos accessible, tri des déchets en place et facile d'accès.",
      },
    ],
    aRetenir:
      "L'expert regarde sans vous prévenir, pendant qu'il applique les autres méthodes. Tout se joue dans les détails du quotidien.",
  },
];
