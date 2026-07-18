import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ArborescenceHAS from "@/components/ArborescenceHAS";
import SchemaVisiteHAS from "@/components/SchemaVisiteHAS";

export default function AgentReferentielPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <Link
        href="/agent/certif"
        className="flex items-center gap-2 rounded-2xl bg-white border border-ardoise-100 shadow-sm px-4 py-3 text-sm font-bold text-marine-800 hover:bg-ardoise-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div>
        <h1 className="text-marine-900 text-xl font-extrabold leading-tight">
          Le référentiel HAS, en clair
        </h1>
        <p className="text-ardoise-500 text-sm mt-0.5">
          Les 95 critères de la certification, traduits en gestes de terrain.
          Appuie sur un critère pour comprendre ce qu&apos;il veut dire pour toi.
        </p>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ardoise-400 mb-2 px-1">
          Comment se construit la certification
        </p>
        <SchemaVisiteHAS />
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ardoise-400 mb-2 px-1">
          Les 3 chapitres, objectif par objectif
        </p>
        <ArborescenceHAS />
      </div>
    </div>
  );
}
