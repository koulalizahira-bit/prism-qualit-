import Link from "next/link";
import type { Fiche, Thematique } from "@/lib/types";
import { ArrowLeft, BookOpen, ChevronRight, WifiOff } from "lucide-react";

const THEME_COLORS = [
  "bg-marine-900",
  "bg-turquoise-600",
  "bg-marine-700",
  "bg-turquoise-500",
  "bg-marine-600",
  "bg-turquoise-600",
  "bg-marine-800",
];

export function FichesIndex({
  themes,
  fiches,
  basePath,
}: {
  themes: Thematique[];
  fiches: Fiche[];
  basePath: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <BookOpen className="h-7 w-7 text-turquoise-500" />
          Fiches pratiques HAS
        </h1>
        <p className="text-ardoise-500">{fiches.length} fiches classées par thématique</p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-turquoise-50 px-4 py-3 text-sm font-semibold text-turquoise-600">
        <WifiOff className="h-4 w-4" /> Consultables même sans connexion internet.
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {themes
          .slice()
          .sort((a, b) => a.ordre - b.ordre)
          .map((t) => {
            const n = fiches.filter((f) => f.themeId === t.id).length;
            return (
              <Link
                key={t.id}
                href={`${basePath}/${t.id}`}
                className="card flex items-center gap-4 transition hover:border-turquoise-400 hover:shadow-md"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-white ${THEME_COLORS[(t.ordre - 1) % THEME_COLORS.length]}`}
                >
                  {t.ordre}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-marine-900">{t.nom}</div>
                  <div className="text-sm text-ardoise-500">{n} fiche{n > 1 ? "s" : ""}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-ardoise-300" />
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export function FicheTheme({
  theme,
  fiches,
  backHref,
}: {
  theme: Thematique;
  fiches: Fiche[];
  backHref: string;
}) {
  return (
    <div className="space-y-5">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-semibold text-marine-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Toutes les thématiques
      </Link>

      <div>
        <p className="text-sm font-bold text-turquoise-600">Thématique {theme.ordre}</p>
        <h1 className="text-2xl font-extrabold text-marine-900">{theme.nom}</h1>
        {theme.description && <p className="mt-1 text-ardoise-500">{theme.description}</p>}
      </div>

      <div className="space-y-4">
        {fiches.map((f) => (
          <article key={f.id} id={f.id} className="card scroll-mt-24">
            <h2 className="flex items-center gap-2 text-lg font-bold text-marine-900">
              <BookOpen className="h-5 w-5 text-turquoise-500" />
              {f.titre}
            </h2>
            <p className="mt-1 text-sm font-medium text-ardoise-500">{f.resume}</p>
            <ul className="mt-3 space-y-2">
              {f.contenu.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-marine-900">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise-500" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
        {fiches.length === 0 && (
          <p className="text-ardoise-500">Aucune fiche pour cette thématique.</p>
        )}
      </div>
    </div>
  );
}
