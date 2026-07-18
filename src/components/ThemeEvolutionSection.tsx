"use client";

import { useState } from "react";
import { TrendingUp, ChevronDown } from "lucide-react";
import EvolutionChart from "@/components/charts/EvolutionChart";
import type { Thematique } from "@/lib/types";

interface ThemePoint {
  label: string;
  score: number;
  date: string;
}

export default function ThemeEvolutionSection({
  thematiques,
  evolutionParTheme,
  seuil,
}: {
  thematiques: Thematique[];
  evolutionParTheme: Record<string, ThemePoint[]>;
  seuil: number;
}) {
  const [themeId, setThemeId] = useState(thematiques[0]?.id ?? "");
  const data = evolutionParTheme[themeId] ?? [];
  const theme = thematiques.find((t) => t.id === themeId);

  // Tendance : compare premier et dernier point
  const trend =
    data.length >= 2
      ? data[data.length - 1].score - data[data.length - 2].score
      : null;

  return (
    <div className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-marine-900">
          <TrendingUp className="h-5 w-5 text-turquoise-500" />
          Évolution par thématique
        </h2>
        <div className="relative">
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            className="appearance-none rounded-xl border border-ardoise-200 bg-white py-1.5 pl-3 pr-8 text-sm font-semibold text-marine-900 focus:outline-none focus:ring-2 focus:ring-turquoise-400"
          >
            {thematiques.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nom}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-ardoise-400" />
        </div>
      </div>

      {theme?.description && (
        <p className="text-xs text-ardoise-500">{theme.description}</p>
      )}

      {data.length < 2 ? (
        <p className="py-8 text-center text-sm text-ardoise-400">
          Pas encore assez d&apos;audits pour tracer une évolution sur cette thématique.
        </p>
      ) : (
        <>
          <EvolutionChart data={data} seuil={seuil} height={210} />
          {trend !== null && (
            <p className={`text-right text-xs font-semibold ${trend >= 0 ? "text-vert" : "text-rouge"}`}>
              {trend >= 0 ? "↑" : "↓"} {trend >= 0 ? "+" : ""}{trend} pts par rapport à l&apos;audit précédent
            </p>
          )}
        </>
      )}
    </div>
  );
}
