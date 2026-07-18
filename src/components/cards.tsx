import type { ReactNode } from "react";
import type { Statut, ThemeScore } from "@/lib/scoring";
import { statutBg, statutSoft, statutLabel, scoreOrTiret } from "@/lib/ui";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "marine",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: "marine" | "turquoise" | "vert" | "orange" | "rouge";
}) {
  const accentMap: Record<string, string> = {
    marine: "bg-marine-50 text-marine-700",
    turquoise: "bg-turquoise-50 text-turquoise-600",
    vert: "bg-vert-soft text-vert",
    orange: "bg-orange-soft text-orange",
    rouge: "bg-rouge-soft text-rouge",
  };
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ardoise-500">{label}</span>
        {icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentMap[accent]}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="text-3xl font-extrabold text-marine-900">{value}</div>
      {sub && <div className="text-sm text-ardoise-500">{sub}</div>}
    </div>
  );
}

export function StatusBadge({ statut }: { statut: Statut }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statutSoft[statut]}`}
    >
      <span className={`dot ${statutBg[statut]}`} />
      {statutLabel[statut]}
    </span>
  );
}

export function ProgressBar({ value, statut }: { value: number | null; statut: Statut }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-ardoise-100">
      <div
        className={`h-full rounded-full ${statutBg[statut]} transition-all`}
        style={{ width: `${value ?? 0}%` }}
      />
    </div>
  );
}

export function ThemeScoreList({ scores }: { scores: ThemeScore[] }) {
  return (
    <div className="space-y-4">
      {scores.map((ts) => (
        <div key={ts.theme.id}>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-marine-900">
              {ts.theme.ordre}. {ts.theme.nom}
            </span>
            <span className={`text-sm font-bold ${statutSoft[ts.statut].split(" ")[1]}`}>
              {scoreOrTiret(ts.score)}
            </span>
          </div>
          <ProgressBar value={ts.score} statut={ts.statut} />
        </div>
      ))}
    </div>
  );
}
