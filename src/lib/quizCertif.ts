// « Prêt pour la certif » — banque de questions ORIGINALE.
// Rédigée à partir du référentiel HAS V2025 (public, © HAS) et des bonnes
// pratiques générales de qualité et sécurité des soins. Contenu propre à
// l'application, générique (aucun nom d'établissement, de logiciel, de personne
// ni de document interne).

export type QuizType = "vrai_faux" | "qcm" | "ouverte";

export interface QuizQuestion {
  id: number;
  categorie: string;
  question: string;
  type: QuizType;
  imperatif?: boolean; // touche un critère impératif HAS
  // vrai_faux
  reponseVF?: boolean;
  // qcm
  options?: string[];
  bonneIndex?: number;
  // réponse / explication révélée (tous types)
  reponse: string;
}

export const QUIZ_CATEGORIES = [
  "Droits & information",
  "Bientraitance & dignité",
  "Identitovigilance",
  "Sécurité du médicament",
  "Risque infectieux",
  "Douleur & surveillance",
  "Urgences & crise",
  "Gestion des risques",
  "Parcours & coordination",
  "Méthodes d'évaluation HAS",
] as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ─── Droits & information ───────────────────────────────────────────────
  {
    id: 1,
    categorie: "Droits & information",
    type: "vrai_faux",
    reponseVF: true,
    imperatif: true,
    question: "Le patient peut désigner une personne de confiance, et la changer quand il le souhaite.",
    reponse:
      "VRAI. La désignation est écrite, cosignée, et révocable à tout moment. La personne de confiance est consultée si le patient ne peut plus exprimer sa volonté ; son témoignage prévaut alors sur les autres.",
  },
  {
    id: 2,
    categorie: "Droits & information",
    type: "ouverte",
    question: "Un patient veut rédiger ses directives anticipées. Que lui dire ?",
    reponse:
      "Toute personne majeure peut en rédiger, pour le cas où elle ne pourrait plus s'exprimer. Elles indiquent ce qu'elle accepte ou refuse comme traitement, sont modifiables et révocables à tout moment, et s'imposent au médecin (sauf urgence vitale le temps d'évaluer, ou si manifestement inappropriées). On trace leur existence dans le dossier.",
  },
  {
    id: 3,
    categorie: "Droits & information",
    type: "vrai_faux",
    reponseVF: true,
    question: "Tout patient peut demander à accéder à son dossier médical.",
    reponse:
      "VRAI. La demande se fait par écrit auprès de la direction de l'établissement. Le dossier est communiqué dans les délais légaux ; des frais de copie peuvent s'appliquer.",
  },
  {
    id: 4,
    categorie: "Droits & information",
    type: "qcm",
    question: "À quoi sert le recueil de la satisfaction du patient après son hospitalisation ?",
    options: [
      "À noter les soignants individuellement",
      "À alimenter des actions d'amélioration du service",
      "À rien, c'est purement administratif",
      "À comparer les patients entre eux",
    ],
    bonneIndex: 1,
    reponse:
      "Le recueil de la satisfaction et de l'expérience patient (questionnaire de sortie, enquête nationale) sert à comprendre le vécu des patients et à en tirer des actions d'amélioration concrètes.",
  },
  {
    id: 5,
    categorie: "Droits & information",
    type: "ouverte",
    question: "Comment garantir la confidentialité de la prise en charge au quotidien ?",
    reponse:
      "Ne pas parler d'un patient dans les lieux de passage, baisser la voix si un tiers est proche, vérifier l'identité de l'interlocuteur au téléphone, verrouiller sa session informatique en quittant le poste, et ranger les documents nominatifs.",
  },

  // ─── Bientraitance & dignité ────────────────────────────────────────────
  {
    id: 6,
    categorie: "Bientraitance & dignité",
    type: "ouverte",
    imperatif: true,
    question: "Cite des gestes simples qui respectent l'intimité et la dignité du patient.",
    reponse:
      "Frapper avant d'entrer, fermer la porte ou tirer le paravent pendant les soins, couvrir le patient, ne pas l'infantiliser, ne pas crier dans le couloir, et lui expliquer chaque étape de sa prise en charge même s'il est sédaté.",
  },
  {
    id: 7,
    categorie: "Bientraitance & dignité",
    type: "vrai_faux",
    reponseVF: false,
    question: "Répondre rapidement à la sonnette est secondaire quand l'équipe est occupée.",
    reponse:
      "FAUX. Répondre à la sonnette fait partie de la réponse aux besoins fondamentaux et de la bientraitance. Un délai trop long est un signe de prise en charge non bientraitante.",
  },
  {
    id: 8,
    categorie: "Bientraitance & dignité",
    type: "ouverte",
    question: "Un patient refuse un soin. Quelle attitude bientraitante adopter ?",
    reponse:
      "Comprendre la raison du refus, lui réexpliquer l'intérêt et les risques sans le forcer, tracer le refus, et chercher une alternative ou réessayer plus tard. Le consentement du patient prime.",
  },
  {
    id: 9,
    categorie: "Bientraitance & dignité",
    type: "ouverte",
    question: "Comment soutenir l'autonomie d'un patient lors des soins ?",
    reponse:
      "L'encourager à faire ce qu'il peut (toilette, habillage), ôter les protections inutiles, favoriser les déplacements et l'usage des toilettes, mettre la sonnette à portée, et adapter le matériel plutôt que de tout faire à sa place.",
  },

  // ─── Identitovigilance ──────────────────────────────────────────────────
  {
    id: 10,
    categorie: "Identitovigilance",
    type: "ouverte",
    imperatif: true,
    question: "Avant un soin à risque, comment vérifier l'identité du patient ?",
    reponse:
      "Par une question ouverte : « quels sont votre nom, prénom et date de naissance ? », et en vérifiant le bracelet. Les questions fermées (« vous êtes bien M. X ? ») sont à proscrire.",
  },
  {
    id: 11,
    categorie: "Identitovigilance",
    type: "vrai_faux",
    reponseVF: true,
    imperatif: true,
    question: "Le bracelet d'identification est obligatoire, sauf refus du patient tracé dans le dossier.",
    reponse:
      "VRAI. Tous les patients doivent en porter un. Le seul cas d'absence est un refus éclairé du patient, qui doit alors être tracé.",
  },
  {
    id: 12,
    categorie: "Identitovigilance",
    type: "vrai_faux",
    reponseVF: false,
    question: "Pour gagner du temps, on peut étiqueter les tubes de prélèvement à l'avance, avant d'aller voir le patient.",
    reponse:
      "FAUX. L'étiquetage se fait au lit du patient, au moment du prélèvement, après vérification de l'identité. Tout étiquetage en amont est interdit (risque d'inversion).",
  },
  {
    id: 13,
    categorie: "Identitovigilance",
    type: "qcm",
    question: "Que signifie la règle des « 5 B » lors de l'administration d'un médicament ?",
    options: [
      "Bon patient, bon médicament, bonne dose, bonne voie, bon moment",
      "Bracelet, badge, bip, bloc, bilan",
      "Bien lire, bien noter, bien ranger, bien jeter, bien transmettre",
    ],
    bonneIndex: 0,
    reponse:
      "Les 5 B : Bon patient, Bon médicament, Bonne dose, Bonne voie, Bon moment. C'est le réflexe de sécurisation au moment d'administrer.",
  },
  {
    id: 14,
    categorie: "Identitovigilance",
    type: "ouverte",
    question: "Quel réflexe pour ne pas se tromper de dossier dans le logiciel patient ?",
    reponse:
      "Vérifier systématiquement la concordance entre l'identité du patient (bracelet ou question ouverte) et celle affichée à l'écran avant toute saisie ou consultation.",
  },

  // ─── Sécurité du médicament ─────────────────────────────────────────────
  {
    id: 15,
    categorie: "Sécurité du médicament",
    type: "qcm",
    imperatif: true,
    question: "À quelle étape surviennent le plus souvent les erreurs médicamenteuses ?",
    options: ["La prescription", "La dispensation", "L'administration", "Le stockage"],
    bonneIndex: 2,
    reponse:
      "Elles peuvent survenir à toutes les étapes, mais le plus souvent à l'administration, dernière barrière avant le patient.",
  },
  {
    id: 16,
    categorie: "Sécurité du médicament",
    type: "ouverte",
    imperatif: true,
    question: "Cite des exemples de médicaments à haut risque.",
    reponse:
      "Insulines, anticoagulants (AVK, AOD, héparines), potassium injectable, opioïdes, chimiothérapies, certains électrolytes concentrés. La liste est propre à chaque service et doit être connue et affichée.",
  },
  {
    id: 17,
    categorie: "Sécurité du médicament",
    type: "ouverte",
    imperatif: true,
    question: "Quelles informations doivent figurer sur une perfusion ou un PSE en cours ?",
    reponse:
      "L'identité du patient, le nom du produit, la dose, la voie, la date et l'heure de pose, le débit et la durée, et l'identité du soignant. La sécurité prime sur la confidentialité : l'étiquette d'identité ne doit pas être retirée.",
  },
  {
    id: 18,
    categorie: "Sécurité du médicament",
    type: "ouverte",
    question: "Quelles sont les règles de base pour les stupéfiants ?",
    reponse:
      "Stockage à clé dans un endroit dédié, détention de la clé par un(e) IDE, contrôle contradictoire au changement d'équipe, traçabilité de chaque administration juste après le soin, et vérification régulière des stocks.",
  },
  {
    id: 19,
    categorie: "Sécurité du médicament",
    type: "vrai_faux",
    reponseVF: false,
    question: "On peut écraser n'importe quel comprimé pour faciliter la prise.",
    reponse:
      "FAUX. Écraser un comprimé ou ouvrir une gélule peut modifier la dose, la toxicité ou l'efficacité. Il faut vérifier que le médicament figure sur la liste de ceux qui peuvent être écrasés.",
  },
  {
    id: 20,
    categorie: "Sécurité du médicament",
    type: "ouverte",
    imperatif: true,
    question: "Que faire si une prescription est incomplète ou ambiguë ?",
    reponse:
      "Ne pas administrer. C'est une situation de doute : on suspend (« NO GO »), on contacte le prescripteur et on n'exécute qu'une fois la prescription claire et complète. La culture du doute protège le patient.",
  },
  {
    id: 21,
    categorie: "Sécurité du médicament",
    type: "ouverte",
    question: "Quand tracer l'administration d'un médicament ?",
    reponse:
      "Juste après l'avoir administré. En cas de non-administration, on saisit le motif (refus, vomissement, patient absent, à jeun…).",
  },
  {
    id: 22,
    categorie: "Sécurité du médicament",
    type: "ouverte",
    question: "Qu'est-ce que la conciliation médicamenteuse à l'admission ?",
    reponse:
      "C'est la comparaison entre le traitement habituel du patient (à domicile) et les prescriptions à l'admission, pour éviter les oublis, doublons ou interactions. Le traitement personnel est retiré, sécurisé et tracé.",
  },

  // ─── Risque infectieux ──────────────────────────────────────────────────
  {
    id: 23,
    categorie: "Risque infectieux",
    type: "ouverte",
    imperatif: true,
    question: "Quelles sont les conditions d'une bonne hygiène des mains ?",
    reponse:
      "Friction hydro-alcoolique aux moments clés (avant/après contact patient et environnement, avant geste aseptique, après risque d'exposition), zéro bijou aux mains et poignets, ongles courts sans vernis ni faux ongles, manches courtes.",
  },
  {
    id: 24,
    categorie: "Risque infectieux",
    type: "qcm",
    question: "Combien d'indications d'hygiène des mains l'OMS définit-elle ?",
    options: ["3", "5", "7"],
    bonneIndex: 1,
    reponse:
      "5 indications : avant de toucher le patient, avant un geste aseptique, après risque d'exposition à un liquide biologique, après avoir touché le patient, après avoir touché son environnement.",
  },
  {
    id: 25,
    categorie: "Risque infectieux",
    type: "ouverte",
    question: "Avant un acte invasif ou interventionnel, comment maîtriser le risque infectieux ?",
    reponse:
      "Préparation cutanée selon protocole (douche, antisepsie), tenue conforme, zéro bijou, hygiène des mains aux bons moments, et respect des règles d'asepsie pour le matériel et le champ.",
  },
  {
    id: 26,
    categorie: "Risque infectieux",
    type: "ouverte",
    question: "Que faire en cas d'accident d'exposition au sang (AES) ?",
    reponse:
      "Ne pas faire saigner ; nettoyer puis antiseptie de la plaie (ou rinçage abondant pour une projection muqueuse), évaluer le risque, contacter rapidement le référent ou les urgences pour une éventuelle prophylaxie, et déclarer l'accident.",
  },
  {
    id: 27,
    categorie: "Risque infectieux",
    type: "vrai_faux",
    reponseVF: true,
    question: "La traçabilité de la température du réfrigérateur à médicaments est quotidienne, week-end compris.",
    reponse:
      "VRAI. Le contrôle est quotidien. Si un secteur est fermé le week-end, son réfrigérateur ne doit pas contenir de médicaments.",
  },

  // ─── Douleur & surveillance ─────────────────────────────────────────────
  {
    id: 28,
    categorie: "Douleur & surveillance",
    type: "ouverte",
    imperatif: true,
    question: "À quels moments évaluer la douleur d'un patient ?",
    reponse:
      "À l'entrée, au moins une fois par 24 h, à chaque fois que le patient l'exprime, et après un traitement antalgique pour en vérifier l'efficacité. Chaque évaluation est tracée.",
  },
  {
    id: 29,
    categorie: "Douleur & surveillance",
    type: "ouverte",
    question: "Quelles échelles utiliser selon le patient ?",
    reponse:
      "Patient communicant : EVA (visuelle analogique) ou EN (numérique). Patient non communicant ou sédaté : échelles d'hétéro-évaluation (Algoplus, BPS, ou échelles adaptées au nouveau-né et à l'enfant).",
  },
  {
    id: 30,
    categorie: "Douleur & surveillance",
    type: "vrai_faux",
    reponseVF: true,
    question: "Un patient sédaté ou non communicant doit quand même bénéficier d'une évaluation de la douleur.",
    reponse:
      "VRAI. On utilise une échelle d'hétéro-évaluation comportementale. L'absence d'expression verbale ne signifie pas absence de douleur.",
  },
  {
    id: 31,
    categorie: "Douleur & surveillance",
    type: "ouverte",
    question: "Cite des actions du projet de soins liées à l'alimentation d'un patient.",
    reponse:
      "Renseigner régime, texture et aversions, évaluer l'autonomie et aider si besoin, installer assis, vérifier l'état buccal, surveiller la dysphagie, tracer les prises alimentaires et hydriques, surveiller le poids et proposer des compléments si besoin.",
  },
  {
    id: 32,
    categorie: "Douleur & surveillance",
    type: "ouverte",
    question: "Cite des actions de prévention chez un patient à mobilité réduite.",
    reponse:
      "Évaluer le risque de chute et d'escarre, lever et mobiliser dès que possible, bien chausser, mettre en place matelas/coussins adaptés, changer les positions, et tracer la surveillance cutanée.",
  },

  // ─── Urgences & crise ───────────────────────────────────────────────────
  {
    id: 33,
    categorie: "Urgences & crise",
    type: "qcm",
    imperatif: true,
    question: "Quel numéro permet de joindre l'aide médicale urgente ?",
    options: ["15", "17", "112 uniquement"],
    bonneIndex: 0,
    reponse:
      "Le 15 (SAMU) pour une urgence médicale. Le 112 est le numéro d'urgence européen. En intra-hospitalier, chaque établissement a aussi une procédure d'urgence vitale interne.",
  },
  {
    id: 34,
    categorie: "Urgences & crise",
    type: "vrai_faux",
    reponseVF: true,
    imperatif: true,
    question: "Le chariot ou sac d'urgence doit être vérifié régulièrement et scellé.",
    reponse:
      "VRAI. Sa présence, son contenu et la date de péremption sont vérifiés régulièrement ; il est scellé pour garantir qu'il est complet et prêt à l'emploi.",
  },
  {
    id: 35,
    categorie: "Urgences & crise",
    type: "ouverte",
    question: "Qu'est-ce que le plan blanc / plan de gestion des situations sanitaires exceptionnelles ?",
    reponse:
      "Un dispositif activé en cas de crise majeure (afflux massif, épidémie, catastrophe) qui réorganise les ressources humaines, matérielles et logistiques. Une cellule de crise coordonne la réponse ; chacun a une fiche réflexe.",
  },
  {
    id: 36,
    categorie: "Urgences & crise",
    type: "ouverte",
    question: "Que faire en cas de panne informatique majeure (mode dégradé) ?",
    reponse:
      "Basculer sur les procédures papier prévues : prescriptions et transmissions sur support papier, circuits d'acheminement des documents, et suivre la conduite définie par l'établissement. Prévenir le service informatique.",
  },
  {
    id: 37,
    categorie: "Urgences & crise",
    type: "ouverte",
    question: "Quelles sont les sources les plus fréquentes d'attaque informatique ?",
    reponse:
      "Majoritairement les e-mails extérieurs (pièces jointes, liens piégés), puis la navigation internet et les clés USB. Des mots de passe robustes et la vigilance face aux liens réduisent fortement le risque.",
  },

  // ─── Gestion des risques ────────────────────────────────────────────────
  {
    id: 38,
    categorie: "Gestion des risques",
    type: "ouverte",
    imperatif: true,
    question: "Pourquoi et comment déclarer un événement indésirable ?",
    reponse:
      "Pour améliorer la sécurité, pas pour punir. On le signale via l'outil de déclaration dès qu'on constate une erreur, une presqu'erreur, une chute, une complication ou un dysfonctionnement. L'analyse débouche sur des actions.",
  },
  {
    id: 39,
    categorie: "Gestion des risques",
    type: "vrai_faux",
    reponseVF: true,
    question: "On déclare aussi les « presqu'accidents » (erreurs rattrapées à temps).",
    reponse:
      "VRAI. Les presqu'accidents sont précieux : ils révèlent une faille du système sans conséquence pour le patient, donc une occasion d'améliorer avant qu'un dommage survienne.",
  },
  {
    id: 40,
    categorie: "Gestion des risques",
    type: "vrai_faux",
    reponseVF: true,
    question: "Un agent qui signale spontanément un manquement ne doit pas être sanctionné pour cela.",
    reponse:
      "VRAI. La culture de sécurité repose sur la déclaration sans crainte de sanction (sauf manquement délibéré ou répété). C'est l'esprit d'une charte de non-punition.",
  },
  {
    id: 41,
    categorie: "Gestion des risques",
    type: "qcm",
    question: "Que sont le CREX, la RMM ou le REMED ?",
    options: [
      "Des logiciels de prescription",
      "Des réunions d'analyse collective des causes d'un événement",
      "Des indicateurs financiers",
    ],
    bonneIndex: 1,
    reponse:
      "Ce sont des méthodes d'analyse en équipe, sans jugement, qui remontent la chaîne des causes d'un événement pour en tirer des actions d'amélioration.",
  },
  {
    id: 42,
    categorie: "Gestion des risques",
    type: "vrai_faux",
    reponseVF: true,
    question: "Les événements les plus graves font l'objet d'un signalement aux autorités sanitaires.",
    reponse:
      "VRAI. Les événements indésirables graves associés aux soins (EIGS) sont déclarés à l'autorité de santé, avec un signalement sans délai puis un plan d'actions.",
  },

  // ─── Parcours & coordination ────────────────────────────────────────────
  {
    id: 43,
    categorie: "Parcours & coordination",
    type: "ouverte",
    question: "À quoi sert la lettre de liaison à la sortie ?",
    reponse:
      "À assurer la continuité des soins : elle transmet au médecin traitant et au patient les informations utiles (traitements, suites, surveillance) au moment de la sortie. Elle est remise le jour de la sortie.",
  },
  {
    id: 44,
    categorie: "Parcours & coordination",
    type: "ouverte",
    question: "Comment sécuriser un transfert ou une transmission entre équipes ?",
    reponse:
      "Transmettre de façon structurée (identité, situation, antécédents, ce qui a été fait, ce qui reste à surveiller), tracer, et vérifier la bonne réception des informations. Une transmission orale + écrite limite les pertes d'information.",
  },
  {
    id: 45,
    categorie: "Parcours & coordination",
    type: "ouverte",
    question: "Comment prévenir les transferts évitables d'une personne âgée fragile ?",
    reponse:
      "Repérer la fragilité en amont, anticiper les situations à risque, recourir à la télémédecine quand c'est possible, coordonner avec les partenaires de ville, et disposer de protocoles de prise en charge sur place.",
  },
  {
    id: 46,
    categorie: "Parcours & coordination",
    type: "vrai_faux",
    reponseVF: true,
    question: "La check-list de sécurité au bloc opératoire doit être réalisée entièrement et aux temps clés.",
    reponse:
      "VRAI. Elle est faite systématiquement, en présence des professionnels concernés, aux temps clés (avant induction, avant incision, avant sortie de salle).",
  },

  // ─── Méthodes d'évaluation HAS ──────────────────────────────────────────
  {
    id: 47,
    categorie: "Méthodes d'évaluation HAS",
    type: "qcm",
    question: "Quelle méthode consiste à « remonter » tout le parcours d'un patient à partir de son dossier ?",
    options: ["Le patient traceur", "L'audit système", "L'observation"],
    bonneIndex: 0,
    reponse:
      "Le patient traceur : on choisit un patient et on relit toute sa prise en charge, en l'interrogeant puis en échangeant avec l'équipe, preuves à l'appui. Ce n'est pas un jugement des décisions médicales.",
  },
  {
    id: 48,
    categorie: "Méthodes d'évaluation HAS",
    type: "ouverte",
    question: "En quoi consiste la méthode du traceur ciblé ?",
    reponse:
      "L'expert choisit un processus précis à risque (un médicament, une transfusion, un isolement…) et le suit de bout en bout, en interrogeant chaque professionnel impliqué. Un écart est analysé comme systémique, pas comme une faute individuelle.",
  },
  {
    id: 49,
    categorie: "Méthodes d'évaluation HAS",
    type: "vrai_faux",
    reponseVF: true,
    question: "La méthode d'observation se fait en silence, dans tous les secteurs visités.",
    reponse:
      "VRAI. L'expert observe visuellement et oralement le respect des bonnes pratiques (dignité, hygiène, affichage, environnement), en complément des autres méthodes.",
  },
  {
    id: 50,
    categorie: "Méthodes d'évaluation HAS",
    type: "ouverte",
    question: "Que cherche l'audit système lors d'une rencontre avec les équipes de terrain ?",
    reponse:
      "À vérifier que la politique qualité décidée par la gouvernance est réellement connue, appropriée et appliquée sur le terrain. C'est le moment où l'écart entre la stratégie affichée et la réalité vécue se voit.",
  },
];
