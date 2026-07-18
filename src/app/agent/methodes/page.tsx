import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HAS_METHODES_EVAL } from "@/lib/hasMethodesEval";
import MethodesEvalTabs from "@/components/MethodesEvalTabs";

export default function AgentMethodesPage() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <Link
        href="/agent/certif"
        className="flex items-center gap-2 rounded-2xl bg-white border border-ardoise-100 shadow-sm px-4 py-3 text-sm font-bold text-marine-800 hover:bg-ardoise-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div>
        <h1 className="text-marine-900 text-xl font-extrabold leading-tight">
          Comment l&apos;expert HAS m&apos;évalue
        </h1>
        <p className="text-ardoise-500 text-sm mt-0.5">
          Les 5 méthodes de la visite de certification — pour savoir à quoi
          s&apos;attendre, sans stress.
        </p>
      </div>

      <MethodesEvalTabs methodes={HAS_METHODES_EVAL} />
    </div>
  );
}
