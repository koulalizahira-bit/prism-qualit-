import Link from "next/link";
import { ArrowLeft, BookOpenCheck, Eye, Trophy, ChevronRight } from "lucide-react";

const MODULES = [
  {
    href: "/agent/referentiel",
    icon: BookOpenCheck,
    titre: "Le référentiel HAS, en clair",
    sous: "Les 95 critères traduits en gestes de terrain",
    bg: "bg-menthe-50",
    border: "border-menthe-200",
    tile: "bg-menthe-100",
    color: "text-menthe-600",
    chev: "text-menthe-400",
  },
  {
    href: "/agent/methodes",
    icon: Eye,
    titre: "Comment l'expert HAS m'évalue",
    sous: "Les 5 méthodes de la visite de certification",
    bg: "bg-lavande-50",
    border: "border-lavande-200",
    tile: "bg-lavande-100",
    color: "text-lavande-600",
    chev: "text-lavande-400",
  },
  {
    href: "/agent/quiz",
    icon: Trophy,
    titre: "Prêt pour la certif",
    sous: "Quiz de révision HAS, anonyme et à ton rythme",
    bg: "bg-peche-50",
    border: "border-peche-200",
    tile: "bg-peche-100",
    color: "text-peche-600",
    chev: "text-peche-400",
  },
];

export default function AgentCertifPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <Link
        href="/agent"
        className="flex items-center gap-2 rounded-2xl bg-white border border-ardoise-100 shadow-sm px-4 py-3 text-sm font-bold text-marine-800 hover:bg-ardoise-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l&apos;accueil
      </Link>

      <div>
        <h1 className="text-marine-900 text-xl font-extrabold leading-tight">
          Préparer la certification
        </h1>
        <p className="text-ardoise-500 text-sm mt-0.5">
          Tout pour comprendre la visite HAS, sans stress. La qualité du quotidien,
          elle, reste sur l&apos;accueil.
        </p>
      </div>

      <div className="space-y-2.5">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition-colors ${m.bg} ${m.border} hover:brightness-[0.98]`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${m.tile}`}>
                  <Icon className={`h-5.5 w-5.5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-marine-900">{m.titre}</p>
                  <p className="text-xs text-ardoise-500">{m.sous}</p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 shrink-0 ${m.chev}`} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
