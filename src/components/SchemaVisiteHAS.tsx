import { User, Users, Building2, ArrowDown } from "lucide-react";

// Schéma : la certification croise 3 regards (patient / équipes / établissement)
// pour construire une vision intégrée du niveau de qualité.
const COLONNES = [
  {
    icon: User,
    titre: "Le patient",
    sous: "Son vécu, ses droits, sa sécurité ressentie",
    tile: "bg-menthe-100 text-menthe-700",
  },
  {
    icon: Users,
    titre: "Les équipes",
    sous: "Les pratiques réelles, la coordination, les risques",
    tile: "bg-lavande-100 text-lavande-700",
  },
  {
    icon: Building2,
    titre: "L'établissement",
    sous: "Le pilotage de la qualité par la gouvernance",
    tile: "bg-peche-100 text-peche-700",
  },
];

export default function SchemaVisiteHAS() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {COLONNES.map((col) => {
          const Icon = col.icon;
          return (
            <div key={col.titre} className="rounded-2xl border border-ardoise-100 bg-white shadow-sm px-4 py-4">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${col.tile}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-2.5 font-bold leading-tight text-marine-900">{col.titre}</p>
              <p className="mt-0.5 text-xs leading-snug text-ardoise-500">{col.sous}</p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <ArrowDown className="h-5 w-5 text-ardoise-300" />
      </div>

      <div className="rounded-2xl border border-marine-100 bg-marine-50 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-marine-900">
          Une vision intégrée du niveau de qualité de la prise en charge
        </p>
        <p className="mt-0.5 text-xs text-ardoise-500">
          L&apos;expert recoupe ces 3 regards via le patient traceur, le parcours traceur,
          le traceur ciblé, l&apos;audit système et l&apos;observation.
        </p>
      </div>
    </div>
  );
}
