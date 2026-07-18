import { BookOpenCheck } from "lucide-react";
import ArborescenceHAS from "@/components/ArborescenceHAS";
import SchemaVisiteHAS from "@/components/SchemaVisiteHAS";
import { CRITERES_HAS } from "@/lib/hasReferentielData";

export default function CadreReferentielPage() {
  const nbImp = CRITERES_HAS.filter((c) => c.type === "Impératif").length;

  return (
    <div className="space-y-6">
      {/* Bandeau */}
      <div className="rounded-3xl bg-gradient-to-br from-marine-800 to-marine-600 p-5 text-white shadow-lg shadow-marine-500/20">
        <div className="flex items-center gap-2 mb-1">
          <BookOpenCheck className="h-5 w-5 text-marine-100" />
          <p className="text-xs font-bold text-marine-100 uppercase tracking-widest">
            Référentiel de certification
          </p>
        </div>
        <h1 className="text-xl font-extrabold leading-tight">HAS V2025, décodé</h1>
        <p className="text-sm text-marine-100 mt-0.5">
          95 critères, 12 objectifs, 3 chapitres. {nbImp} critères impératifs. Cliquez un
          critère pour sa traduction terrain et la méthode d&apos;évaluation associée.
        </p>
      </div>

      {/* Schéma de la visite */}
      <section className="card">
        <h2 className="mb-3 text-lg font-bold text-marine-900">
          La logique de la visite
        </h2>
        <SchemaVisiteHAS />
      </section>

      {/* Arborescence */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-6 w-1 rounded-full bg-marine-400" />
          <div>
            <h2 className="text-lg font-bold text-marine-900">
              Le référentiel, objectif par objectif
            </h2>
            <p className="text-sm text-ardoise-500">
              Même outil que vos équipes voient de leur côté.
            </p>
          </div>
        </div>
        <ArborescenceHAS />
      </section>
    </div>
  );
}
