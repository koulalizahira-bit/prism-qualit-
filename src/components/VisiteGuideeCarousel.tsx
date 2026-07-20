"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardCheck,
  Compass,
  GraduationCap,
  ShieldCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  accent: string;
  bg: string;
  titre: string;
  texte: string;
  href: string;
  cta: string;
}

const STEPS: Step[] = [
  {
    icon: LayoutDashboard,
    accent: "text-marine-600",
    bg: "from-marine-900 to-marine-700",
    titre: "Accueil",
    texte:
      "En un coup d'œil : la conformité du service, l'avancement des audits du mois, les thématiques à renforcer et la priorité du mois pour l'équipe.",
    href: "/cadre",
    cta: "Voir l'accueil",
  },
  {
    icon: ClipboardCheck,
    accent: "text-turquoise-600",
    bg: "from-turquoise-600 to-turquoise-400",
    titre: "Deux types d'audits",
    texte:
      "L'audit service mensuel (référence, toute la grille) et 6 audits thématiques ciblés — hygiène, circuit du médicament, identitovigilance, dossier patient, douleur, droits & bientraitance — chacun avec ses critères HAS.",
    href: "/cadre/audit",
    cta: "Réaliser un audit",
  },
  {
    icon: Compass,
    accent: "text-emerald-600",
    bg: "from-emerald-600 to-teal-500",
    titre: "Deux plans d'action distincts",
    texte:
      "Le plan équipe : actions de terrain, rattachées à l'audit qui les a révélées. Le plan cadre (PAQSS) : le pilotage du service — formation, CREX, sensibilisation. Un tableau imprimable réunit les deux.",
    href: "/cadre/paqss",
    cta: "Voir la démarche qualité",
  },
  {
    icon: GraduationCap,
    accent: "text-marine-600",
    bg: "from-marine-800 to-marine-600",
    titre: "Formation & habilitations",
    texte:
      "Le suivi des formations de l'équipe, une par une, avec les alertes de recyclage AFGSU pour anticiper les échéances.",
    href: "/cadre/equipe",
    cta: "Voir les formations",
  },
  {
    icon: ShieldCheck,
    accent: "text-indigo-600",
    bg: "from-indigo-700 to-indigo-500",
    titre: "Certification HAS",
    texte:
      "La couverture des critères HAS par chaque audit, le référentiel des 95 critères décodé et cherchable, les méthodes de certification expliquées, et un quiz pour préparer l'équipe.",
    href: "/cadre/certif",
    cta: "Voir la certification",
  },
  {
    icon: FileText,
    accent: "text-ardoise-600",
    bg: "from-ardoise-700 to-ardoise-500",
    titre: "Rapports prêts à l'emploi",
    texte:
      "Comptes rendus d'audit, rapport global du service et dossier de certification HAS complet — générés en PDF, prêts pour la direction ou la visite de certification.",
    href: "/cadre/rapports",
    cta: "Voir les rapports",
  },
];

export default function VisiteGuideeCarousel() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const Icon = step.icon;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className={`rounded-3xl bg-gradient-to-br ${step.bg} p-6 text-white shadow-lg sm:p-8`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-2xl font-extrabold leading-tight">{step.titre}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">{step.texte}</p>
        <Link
          href={step.href}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-marine-900 hover:bg-white/90 transition-colors"
        >
          {step.cta} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="flex items-center gap-1.5 rounded-xl bg-ardoise-100 px-3 py-2 text-sm font-bold text-marine-800 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Précédent
        </button>

        <div className="flex gap-1.5">
          {STEPS.map((s, idx) => (
            <button
              key={s.titre}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Étape ${idx + 1} : ${s.titre}`}
              className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-marine-900" : "w-2 bg-ardoise-200"}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
          disabled={i === STEPS.length - 1}
          className="flex items-center gap-1.5 rounded-xl bg-marine-900 px-3 py-2 text-sm font-bold text-white disabled:opacity-30"
        >
          Suivant <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-center text-xs text-ardoise-400">
        Étape {i + 1} / {STEPS.length}
      </p>
    </div>
  );
}
