// Calendrier qualité de l'année — curé depuis le planning des audits QSS
// (volet service + temps forts établissement utiles aux équipes).

import type { EventType, Implication, PlanningEvent } from "./types";
export type { EventType, Implication, Portee, PlanningEvent, Seance } from "./types";

export const TYPE_INFO: Record<EventType, { label: string; bg: string; text: string; dot: string }> = {
  audit: { label: "Audit", bg: "bg-turquoise-50", text: "text-turquoise-700", dot: "bg-turquoise-500" },
  crex: { label: "CREX / EI", bg: "bg-marine-50", text: "text-marine-700", dot: "bg-marine-700" },
  certif: { label: "Certif-dating", bg: "bg-orange-soft", text: "text-orange", dot: "bg-orange" },
  reunion: { label: "Réunion", bg: "bg-vert-soft", text: "text-vert", dot: "bg-vert" },
  groupe: { label: "Groupe de travail", bg: "bg-marine-50", text: "text-marine-600", dot: "bg-marine-500" },
  exercice: { label: "Exercice SSE", bg: "bg-rouge-soft", text: "text-rouge", dot: "bg-rouge" },
  info: { label: "Temps fort", bg: "bg-ardoise-100", text: "text-ardoise-600", dot: "bg-ardoise-500" },
};

export const IMPLICATION_INFO: Record<Implication, { label: string; cls: string }> = {
  realisation: { label: "Réalisé par le service", cls: "bg-turquoise-500" },
  participation: { label: "Participation de l'équipe", cls: "bg-marine-700" },
  tiers: { label: "Réalisé par un tiers", cls: "bg-ardoise-400" },
};

export const MOIS_COURTS = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export const PLANNING: PlanningEvent[] = [
  // ---- SERVICE ----
  { id: "e1", nom: "Audit mensuel du service (1 patient/secteur, IDE & AS)", type: "audit", portee: "service", frequence: "Mensuel (2 roulements)", mois: [], implication: "realisation", pilote: "CDS / IDEC", pourMoi: "C'est l'audit de ce tableau de bord — mon secteur peut être audité à tout moment." },
  { id: "e2", nom: "Audit du dossier patient (DPI / Réassist)", type: "audit", portee: "service", frequence: "Mensuel", mois: [], implication: "realisation", pilote: "CDS / IDEC", pourMoi: "Je trace mes soins en temps réel dans Réassist." },
  { id: "e3", nom: "CREX — analyse d'événements indésirables", type: "crex", portee: "service", frequence: "Trimestriel", mois: [3, 6, 9, 12], implication: "realisation", pilote: "CDS / Médecin", pourMoi: "Je déclare les EI (logiciel dédié) ; le CREX en analyse les causes, sans blâme.", seances: [{ id: "sc-crex-06", date: "2026-06-26", heure: "13:30" }] },
  { id: "e4", nom: "Réunion de service", type: "reunion", portee: "service", frequence: "Régulier", mois: [1, 3, 5, 9, 11], implication: "participation", pilote: "CDS", pourMoi: "On y partage les résultats qualité et les axes du mois." },
  { id: "e5", nom: "Audit hygiène des mains & bon usage des EPI", type: "audit", portee: "service", frequence: "Trimestriel", mois: [1, 4, 7, 10], implication: "tiers", pilote: "EOH / UVIH", pourMoi: "Friction hydro-alcoolique aux 5 indications, EPI adaptés." },
  { id: "e6", nom: "Audit tri des déchets / locaux / office", type: "audit", portee: "service", frequence: "Trimestriel", mois: [2, 5, 8, 11], implication: "realisation", pilote: "CDS / IDEC", pourMoi: "Je trie correctement les déchets (DASRI daté), locaux rangés." },
  { id: "e7", nom: "Chariot d'urgence (CUSC/CUVIH) — vérification & appropriation", type: "audit", portee: "service", frequence: "Ponctuel", mois: [3, 4, 10, 11], implication: "tiers", pilote: "Bureau UVIH", pourMoi: "Je connais le chariot mis à jour au 01/01/2026 et sais l'utiliser." },
  { id: "e8", nom: "Audit SSE / Plan blanc", type: "audit", portee: "service", frequence: "Ponctuel", mois: [6], implication: "participation", pilote: "CDS / Groupe SSE", pourMoi: "Je sais où sont les fiches réflexes et le circuit d'alerte." },
  { id: "e9", nom: "Groupes de travail (organisation, tutorat)", type: "groupe", portee: "service", frequence: "Ponctuel", mois: [2, 4, 10, 11], implication: "participation", pilote: "CDS / IDEC", pourMoi: "Je peux participer pour améliorer notre organisation." },
  // ---- Établissement / temps forts ----
  { id: "e10", nom: "Certif-dating (DPI, douleur, médicaments, entretien patient)", type: "certif", portee: "chu", frequence: "3 campagnes/an", mois: [1, 2, 6, 7, 11, 12], implication: "participation", pilote: "DQGR / DCGS", pourMoi: "Mes pratiques sont évaluées sur les grilles HAS — l'occasion de se mettre à niveau.", seances: [{ id: "sc-certif-06", date: "2026-06-23", heure: "14:00", note: "Salle de staff" }] },
  { id: "e11", nom: "Semaine Sécurité du Patient", type: "info", portee: "chu", frequence: "Annuel", mois: [9], implication: "participation", pilote: "DQGR", pourMoi: "Semaine de sensibilisation : animations et ateliers ouverts à tous." },
  { id: "e12", nom: "Patient / Parcours traceur", type: "audit", portee: "chu", frequence: "1 / service / an", mois: [5], implication: "participation", pilote: "DQGR", pourMoi: "Un parcours patient est analysé en équipe, de bout en bout." },
  { id: "e13", nom: "Exercices SSE (simulation, plan blanc, sur table)", type: "exercice", portee: "chu", frequence: "Ponctuel", mois: [1, 4, 5, 10, 11], implication: "participation", pilote: "Groupe SSE", pourMoi: "Je peux être mobilisé(e) sur un exercice — c'est un entraînement réel." },
  { id: "e14", nom: "1 mois / 1 thème « produit de santé » (MAI'dicament)", type: "info", portee: "chu", frequence: "Annuel", mois: [5, 6], implication: "participation", pilote: "Commission PECM", pourMoi: "Un focus médicament : héparine, stupéfiants, étiquetage…" },
  { id: "e15", nom: "Bilan Qualité-Gestion des Risques de pôle", type: "reunion", portee: "chu", frequence: "Annuel", mois: [3], implication: "participation", pilote: "Réf. qualité pôle", pourMoi: "Le bilan annuel qualité du pôle, restitué à l'équipe." },
  { id: "e16", nom: "Revue de gestion documentaire (GED)", type: "info", portee: "chu", frequence: "2 / an", mois: [5, 11], implication: "tiers", pilote: "DQGR", pourMoi: "Les procédures sont mises à jour : je me réfère toujours à la dernière version." },
];
