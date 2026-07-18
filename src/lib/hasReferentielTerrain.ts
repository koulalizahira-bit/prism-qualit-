// « Traduction terrain » des critères HAS : ce que ça veut dire concrètement,
// au lit du patient, en soins intensifs. Écrit à la main, en priorité pour les
// critères impératifs et ceux du champ « Soins critiques ».
// Les critères sans entrée ici affichent l'intention officielle du manuel.

export const TRADUCTION_TERRAIN: Record<string, string> = {
  "1.1-01":
    "Frappe avant d'entrer, ferme la porte ou tire le rideau, couvre le patient pendant les soins. Pas de propos infantilisants, lit en position basse, couloirs dégagés. C'est ce que l'expert observe directement en passant dans le service.",
  "1.1-02":
    "Si un mineur est accueilli en secteur adulte, garantis-lui un espace réservé, des professionnels attentifs, la présence des parents et un environnement qui respecte son intimité et sa sécurité.",
  "1.1-05":
    "Évalue la douleur à l'entrée (moins de 48 h), au moins une fois par 24 h, à chaque manifestation, et réévalue moins de 4 h après un antalgique. Trace chaque évaluation, même chez le patient sédaté (échelles adaptées : Algoplus, BPS…).",
  "1.1-06":
    "Réponds vite aux sonnettes, respecte l'autonomie et les besoins fondamentaux (hydratation, élimination, hygiène), écoute le vécu du patient. En cas de refus de soin : comprendre, expliquer, s'adapter.",
  "1.3-01":
    "Le patient (ou sa personne de confiance s'il ne peut pas s'exprimer) consent à son projet de soins. Trace ce consentement, en particulier avant les actes à risque.",
  "1.4-02":
    "La satisfaction du patient compte : invite-le à remplir le questionnaire de sortie, oriente-le vers E-Satis. Les retours alimentent les actions d'amélioration du service.",
  "2.2-05":
    "Au moment d'administrer : règle des 5 B (Bon patient, Bon médicament, Bonne dose, Bonne voie, Bon moment), vérification de l'identité par question ouverte, étiquetage des perfusions et PSE, traçabilité juste après l'acte.",
  "2.2-06":
    "Préviens l'erreur : connais les médicaments à haut risque du service, double-vérification quand le protocole l'exige, culture du NO GO si la prescription est incomplète ou douteuse.",
  "2.2-08":
    "Précautions standard : friction SHA aux 5 indications, zéro bijou aux mains, ongles courts sans vernis, tenue conforme, manches courtes. C'est le socle observé en continu par l'expert.",
  "2.2-12":
    "Urgence vitale : tu sais appeler le 15, où est le chariot d'urgence et qu'il est vérifié et scellé, et tu connais ton rôle dans la prise en charge immédiate.",
  "2.2-09":
    "Identitovigilance : bracelet posé et vérifié avant tout soin à risque, concordance de l'identité avec le dossier, étiquetage des prélèvements au lit du patient.",
  "2.3-12":
    "Cœur de ton service : l'équipe pluridisciplinaire des soins critiques maîtrise les risques liés à ses pratiques (sédation, ventilation, surveillance continue, dispositifs invasifs) et travaille de façon coordonnée. L'expert le vérifie surtout par le parcours traceur.",
  "2.4-02":
    "Antibiotiques : la prescription est argumentée, réévaluée (durée, désescalade), en lien avec le référent antibiothérapie. La pertinence prime sur l'habitude.",
  "3.1-04":
    "Déclare les événements indésirables ET les presqu'accidents (erreur rattrapée à temps), sans crainte de sanction. C'est la matière première de l'amélioration et de la culture sécurité du service.",
  "3.1-05":
    "Situations sanitaires exceptionnelles : tu sais ce qu'est le plan blanc / SSE, où trouver la fiche réflexe de ton poste, et comment ton service s'organise en cas de crise.",
  "3.3-05":
    "Personne âgée : anticipe les situations à risque (repérage de la fragilité), évite les transferts évitables, coordonne avec les partenaires et la télémédecine quand c'est possible.",
};
