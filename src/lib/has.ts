// HAS V2025 — Critères de certification & méthodes
// Adapté pour un service de soins intensifs

export interface HasCritere {
  code: string;
  libelle: string;
  description: string;
  themeIds: string[]; // thématiques de l'appli qui couvrent ce critère
  statut: "couvert" | "partiel" | "manquant";
  commentaire?: string;
  suggestion?: string; // si partiel/manquant, que faire ?
}

// "certification" = méthode officielle utilisée par les experts-visiteurs HAS pour évaluer
// (les 5 méthodes du référentiel : Audit système, Parcours traceur, Traceur ciblé, Patient traceur, Observation).
// "outil_qualite" = outil de la démarche qualité du service (CREX, RMM, EPP…) : alimente la préparation
// à la certification, mais n'est pas une méthode d'évaluation HAS au sens strict.
export type HasMethodeCategorie = "certification" | "outil_qualite";

export interface HasMethode {
  id: string;
  nom: string;
  categorie: HasMethodeCategorie;
  emoji: string;
  definition: string;    // "C'est quoi ?" en langage simple
  concretement: string;  // "Concrètement pour moi ?"
  frequence: string;
  exempleUSI?: string;
}

// ── Critères HAS V2025 ──────────────────────────────────────────────────────
export const HAS_CRITERES: HasCritere[] = [
  {
    code: "1.1",
    libelle: "Droits & information du patient",
    description:
      "Personne de confiance, directives anticipées, livret d'accueil, consentement.",
    themeIds: ["t6"],
    statut: "couvert",
    commentaire:
      "Couverts par les items s2i1, s2i15, s2i17, s2i18 et les fiches t6.",
  },
  {
    code: "1.2",
    libelle: "Bientraitance & dignité",
    description:
      "Intimité préservée lors des soins, communication bienveillante, environnement respectueux.",
    themeIds: ["t9"],
    statut: "partiel",
    commentaire:
      "Critère fort HAS V2025 — un seul item couvert (l'agent se présente). Thématique t9 créée avec 3 items dédiés.",
    suggestion:
      "Auditez maintenant les 3 items t9 (intimité, communication, environnement sonore) pour mesurer votre point de départ.",
  },
  {
    code: "2.1",
    libelle: "Identification du patient",
    description:
      "Bracelet d'identité posé et vérifié avant tout soin à risque.",
    themeIds: ["t2"],
    statut: "couvert",
    commentaire: "Objectif 80 % des critères. Items s2i11 + fiches t2.",
  },
  {
    code: "2.2",
    libelle: "Circuit du médicament",
    description:
      "Stockage, étiquetage, traçabilité de l'administration, stupéfiants, transfusion.",
    themeIds: ["t1"],
    statut: "couvert",
    commentaire: "12 items d'audit + 4 PAQSS actifs. Thématique la plus riche du service.",
  },
  {
    code: "2.3",
    libelle: "Prévention des infections associées aux soins",
    description:
      "Hygiène des mains, DASRI, EPI, isolements, dépistage BMR.",
    themeIds: ["t4"],
    statut: "couvert",
    commentaire:
      "9 items audit + 3 PAQSS. Audit hygiène des mains trimestriel (UVIH/EOH).",
  },
  {
    code: "2.4",
    libelle: "Douleur & soins critiques",
    description:
      "Évaluation, réévaluation, sédation-analgésie, surveillance continue.",
    themeIds: ["t5"],
    statut: "partiel",
    commentaire:
      "Évaluation et réévaluation douleur bien couvertes. Sédation, score RASS et prévention VAP ne font pas encore partie de l'audit.",
    suggestion:
      "Prévoir d'ajouter un item « Score RASS documenté » et « Protocole VAP appliqué (soins de bouche, tête de lit à 30°) » lors d'une prochaine révision de l'outil.",
  },
  {
    code: "2.5",
    libelle: "Dossier patient & traçabilité",
    description:
      "Traçabilité des soins, transmissions structurées, dossier Réassist.",
    themeIds: ["t3"],
    statut: "couvert",
    commentaire: "Items s3i1–s3i9 + fiche t3 + audit DPI mensuel.",
  },
  {
    code: "2.6",
    libelle: "Urgences vitales",
    description:
      "Chariot d'urgence, matériel vital (O₂, aspiration), plan blanc / SSE.",
    themeIds: ["t7"],
    statut: "couvert",
    commentaire:
      "Chariot d'urgence tracé, aspiration, manomètre O₂, tour de sécurité et SSE couverts.",
  },
  {
    code: "3.1",
    libelle: "Gestion des risques & déclaration EI",
    description:
      "Déclaration des événements indésirables (logiciel dédié), CREX, culture sécurité.",
    themeIds: ["t8"],
    statut: "partiel",
    commentaire:
      "CREX et EI mentionnés dans t8, mais aucun indicateur de suivi (nb CREX/an) n'est encore intégré à l'audit.",
    suggestion:
      "Renseigner régulièrement le statut de l'action PAQSS p15 « Culture qualité (CREX, RMM, EPP) » et noter le nombre de CREX réalisés.",
  },
  {
    code: "3.2",
    libelle: "Compétences & formation des équipes",
    description:
      "Habilitations, recyclage AFGSU, formations obligatoires et spécifiques USI.",
    themeIds: [],
    statut: "couvert",
    commentaire:
      "Module Équipe : tableau des habilitations, alerte AFGSU (recyclage orange/rouge), suivi des taux de formation.",
  },
  {
    code: "3.3",
    libelle: "Organisation & sécurité environnementale",
    description:
      "Confidentialité, locaux, matériels, documents qualité à jour (GED).",
    themeIds: ["t8"],
    statut: "couvert",
    commentaire:
      "8 items audit s1 + PAQSS p16 sur les procédures GED.",
  },
];

// ── Méthodes HAS V2025 ──────────────────────────────────────────────────────
export const HAS_METHODES: HasMethode[] = [
  {
    id: "audit_processus",
    nom: "L'audit système (audit de processus)",
    categorie: "certification",
    emoji: "📋",
    definition:
      "C'est une observation structurée des pratiques réelles dans le service. On vérifie point par point si ce qui est fait correspond à ce qui devrait être fait, en se basant sur des critères précis. C'est la méthode HAS la plus utilisée dans le référentiel de certification.",
    concretement:
      "C'est exactement ce que fait le cadre chaque mois avec cette application : passer en revue la salle de soins et les chambres, cocher oui/non pour chaque critère, et afficher les résultats à l'équipe.",
    frequence: "Mensuel (objectif : 2 roulements / mois)",
    exempleUSI:
      "Vérification du chariot de médicaments, des dates sur les perfusions, du bracelet d'identité, du rangement des couloirs.",
  },
  {
    id: "patient_traceur",
    nom: "Le patient traceur",
    categorie: "certification",
    emoji: "🔍",
    definition:
      "On choisit un patient hospitalisé et on « relit » tout son parcours depuis son arrivée : admission, soins, transmissions, sortie. L'objectif est de vérifier que rien n'a été raté dans le fil des soins.",
    concretement:
      "Un petit groupe (cadre, soignant, parfois médecin) parcourt le dossier d'un patient et pose des questions à l'équipe soignante : « Quand a-t-il eu son évaluation douleur ? », « La personne de confiance est-elle tracée ? », « Les transmissions sont-elles complètes ? »",
    frequence: "Trimestriel (environ 1 patient traceur / trimestre)",
    exempleUSI:
      "Patient ventilé depuis 5 jours : on vérifie la sédation, la prévention VAP, le dossier, si la famille a été informée, si le bracelet est présent.",
  },
  {
    id: "parcours_traceur",
    nom: "Le parcours traceur",
    categorie: "certification",
    emoji: "🧭",
    definition:
      "Variante du patient traceur, mais centrée sur l'organisation plutôt que sur un patient précis : on suit un parcours de soin type (ex. admission en urgence, sortie vers le domicile) à travers plusieurs services pour vérifier que la coordination fonctionne bien.",
    concretement:
      "On reconstitue le trajet d'un patient entre les secteurs et les équipes impliquées, pour repérer les ruptures de prise en charge (transmission manquante, délai, doublon).",
    frequence: "Selon planification HAS — en général autour de la visite de certification",
    exempleUSI:
      "Suivi d'un patient depuis son admission en soins intensifs jusqu'à son transfert en service conventionnel : les transmissions entre équipes sont-elles complètes ?",
  },
  {
    id: "traceur_cible",
    nom: "Le traceur ciblé",
    categorie: "certification",
    emoji: "🎯",
    definition:
      "On cible une thématique précise à risque (ex. circuit du médicament, hygiène des mains) et on vérifie, via plusieurs sources (dossiers, observation, entretiens), que les pratiques sont maîtrisées sur ce point précis.",
    concretement:
      "L'équipe qualité ou les experts-visiteurs se concentrent sur un seul sujet et croisent plusieurs preuves pour juger si le risque est bien maîtrisé.",
    frequence: "Ponctuel, selon les thématiques à risque identifiées",
    exempleUSI:
      "Traceur ciblé sur la prévention des infections liées aux cathéters : protocole, traçabilité des pansements, formation de l'équipe.",
  },
  {
    id: "observation",
    nom: "L'observation",
    categorie: "certification",
    emoji: "👀",
    definition:
      "On observe directement une pratique en train de se faire (un soin, une transmission, une manipulation) pour voir si les gestes réels correspondent aux bonnes pratiques attendues, sans se limiter à ce qui est écrit dans le dossier.",
    concretement:
      "Un observateur suit un professionnel pendant un soin et note ce qu'il voit réellement, sans interrompre l'activité.",
    frequence: "Ponctuel, souvent combiné à un audit système ou un traceur ciblé",
    exempleUSI:
      "Observation d'une pose de perfusion : hygiène des mains avant/après, vérification de l'identité du patient, élimination du matériel piquant.",
  },
  {
    id: "crex",
    nom: "Le CREX",
    categorie: "outil_qualite",
    emoji: "💬",
    definition:
      "Le Comité de Retour d'Expérience. Quand quelque chose ne s'est pas passé comme prévu dans le service, on en parle en équipe — sans chercher un coupable — pour comprendre pourquoi et éviter que ça recommence.",
    concretement:
      "Une réunion courte (20–30 min) en équipe pluriprofessionnelle. On décrit ce qui s'est passé, on remonte la chaîne des causes (pas la personne, mais le système), et on propose une action concrète et réaliste.",
    frequence: "4 fois par an minimum (critère HAS V2025)",
    exempleUSI:
      "Erreur de branchement de PSE → analyse en CREX → mise en place d'une alerte visuelle et d'une vérification croisée.",
  },
  {
    id: "rmm",
    nom: "La RMM",
    categorie: "outil_qualite",
    emoji: "🏥",
    definition:
      "La Revue de Mortalité et Morbidité. On revoit ensemble les situations où un patient a eu une complication grave ou est décédé, pour se demander si des améliorations de prise en charge étaient possibles — sans pointer du doigt.",
    concretement:
      "Une réunion médico-soignante qui analyse des cas difficiles de façon bienveillante. L'infirmier ou l'aide-soignant qui a vécu la situation peut témoigner. Les conclusions sont documentées et partagées.",
    frequence: "Semestriel (ou à chaque événement grave du service)",
    exempleUSI:
      "Décès inattendu ou complication sévère : revue du dossier, chronologie des faits, pistes d'amélioration organisationnelles.",
  },
  {
    id: "epp",
    nom: "L'EPP",
    categorie: "outil_qualite",
    emoji: "📊",
    definition:
      "L'Évaluation des Pratiques Professionnelles. On évalue collectivement une pratique de soin précise pour savoir si elle correspond aux recommandations actuelles et comment on peut l'améliorer.",
    concretement:
      "Par exemple : « Comment évalue-t-on la douleur chez nos patients non communicants ? » → on regarde les dossiers, on compare aux recommandations, on améliore la pratique si besoin.",
    frequence: "1 à 2 EPP par an sur des thèmes choisis par l'équipe",
    exempleUSI:
      "EPP sur la prévention de la pneumonie associée à la ventilation (PAV) : soins de bouche, positionnement, protocole de sevrage.",
  },
  {
    id: "ei",
    nom: "Déclarer les événements indésirables",
    categorie: "outil_qualite",
    emoji: "🔔",
    definition:
      "Quand quelque chose d'anormal se produit — une erreur, une presqu'erreur, une chute, un problème technique — on le signale via le logiciel de déclaration dédié. Ce n'est pas pour punir : c'est pour améliorer le système et protéger les patients.",
    concretement:
      "Vous constatez un problème → vous le saisissez dans le logiciel de déclaration (2 min) → le responsable qualité analyse → les résultats sont partagés en CREX → une action collective est décidée.",
    frequence: "À chaque événement indésirable (sans minimum — déclarer sans hésiter)",
    exempleUSI:
      "Presqu'erreur médicamenteuse, alarme désactivée involontairement, matériel défaillant, chute d'un patient.",
  },
  {
    id: "iqss",
    nom: "Les indicateurs IQSS",
    categorie: "outil_qualite",
    emoji: "📈",
    definition:
      "Les Indicateurs de Qualité et de Sécurité des Soins sont des chiffres nationaux transmis à la HAS. Ils permettent de comparer objectivement les établissements sur des critères de qualité et sont publiés en toute transparence.",
    concretement:
      "Ces indicateurs sont calculés à partir du dossier patient ou saisis par la direction qualité. Vous y contribuez directement en renseignant correctement le dossier (douleur évaluée, chute tracée, escarres dépistées…).",
    frequence: "Recueil annuel — résultats publiés sur Scope Santé (site public HAS)",
    exempleUSI:
      "Taux d'évaluation de la douleur, taux d'hygiène des mains, taux d'escarre de stade 2 ou plus.",
  },
  {
    id: "visite_risque",
    nom: "La visite de risque",
    categorie: "outil_qualite",
    emoji: "👁️",
    definition:
      "Un tour du service fait avec les yeux d'un observateur extérieur, pour repérer les risques avant qu'ils causent un problème. C'est de la prévention a priori (avant l'accident) plutôt que a posteriori (après).",
    concretement:
      "Différent de l'audit : on n'a pas de grille à cocher, on observe librement l'environnement. On note tout ce qui pourrait mal tourner : accès à des produits dangereux, matériel mal rangé, signalétique manquante.",
    frequence: "Annuel (ou en préparation d'une visite HAS)",
    exempleUSI:
      "Détection d'un produit ménager rangé à côté des médicaments, prise électrique endommagée, chariot sans frein dans un couloir.",
  },
];
