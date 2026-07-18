import Link from "next/link";
import { ShieldCheck, BookOpenCheck, Trophy, ChevronRight } from "lucide-react";
import { getDb } from "@/lib/db";
import { CRITERES_HAS } from "@/lib/hasReferentielData";

export default async function CadreCertifPage() {
  const db = await getDb();
  const nbCrit = CRITERES_HAS.length;
  const nbImp = CRITERES_HAS.filter((c) => c.type === "Impératif").length;
  const nbTentatives = (db.quizResults ?? []).length;

  const MODULES = [
    {
      href: "/cadre/has",
      icon: ShieldCheck,
      titre: "Couverture des critères",
      sous: "Où en est le service sur les critères HAS V2025",
      bg: "bg-menthe-50",
      border: "border-menthe-200",
      tile: "bg-menthe-100",
      color: "text-menthe-600",
      chev: "text-menthe-400",
    },
    {
      href: "/cadre/referentiel",
      icon: BookOpenCheck,
      titre: "Le référentiel HAS, décodé",
      sous: `${nbCrit} critères · ${nbImp} impératifs · traduction terrain`,
      bg: "bg-lavande-50",
      border: "border-lavande-200",
      tile: "bg-lavande-100",
      color: "text-lavande-600",
      chev: "text-lavande-400",
    },
    {
      href: "/cadre/quiz",
      icon: Trophy,
      titre: "Quiz de l'équipe",
      sous:
        nbTentatives > 0
          ? `${nbTentatives} tentative${nbTentatives > 1 ? "s" : ""} · résultats anonymes`
          : "Résultats anonymes et agrégés",
      bg: "bg-peche-50",
      border: "border-peche-200",
      tile: "bg-peche-100",
      color: "text-peche-600",
      chev: "text-peche-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-lavande-600 to-lavande-400 p-5 text-white shadow-lg shadow-lavande-500/20">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-5 w-5 text-lavande-100" />
          <p className="text-xs font-bold text-lavande-100 uppercase tracking-widest">
            Préparer la certification
          </p>
        </div>
        <h1 className="text-xl font-extrabold leading-tight">Espace certification HAS</h1>
        <p className="text-sm text-lavande-50 mt-0.5">
          Tout pour piloter la visite. La qualité du quotidien (audits, PAQSS, équipe) reste
          sur les autres onglets.
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
