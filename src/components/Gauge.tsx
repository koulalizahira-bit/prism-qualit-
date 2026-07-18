import type { Statut } from "@/lib/scoring";
import { statutHex } from "@/lib/ui";

interface GaugeProps {
  score: number | null;
  size?: number;
  thresholds?: { statutVert: number; statutOrange: number };
  label?: string;
}

// Jauge circulaire (anneau de progression) — pur SVG, lisible de loin.
export default function Gauge({
  score,
  size = 180,
  thresholds = { statutVert: 85, statutOrange: 70 },
  label,
}: GaugeProps) {
  const stroke = size * 0.11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = score === null ? 0 : Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const statut: Statut =
    score === null
      ? "rouge"
      : score >= thresholds.statutVert
        ? "vert"
        : score >= thresholds.statutOrange
          ? "orange"
          : "rouge";
  const color = statutHex[statut];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold" style={{ color }}>
          {score === null ? "—" : `${score}%`}
        </span>
        {label && <span className="mt-1 text-xs font-semibold text-ardoise-500">{label}</span>}
      </div>
    </div>
  );
}
