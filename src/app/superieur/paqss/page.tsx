import { getDb } from "@/lib/db";
import PaqssTabs from "@/components/PaqssTabs";
import { Compass } from "lucide-react";

export default async function SuperieurPaqssPage() {
  const db = await getDb();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <Compass className="h-7 w-7 text-turquoise-500" /> Démarche qualité (PAQSS)
        </h1>
        <p className="text-ardoise-500">Synthèse du plan d&apos;amélioration du service</p>
      </div>
      <PaqssTabs paqss={db.paqss} thematiques={db.thematiques} />
    </div>
  );
}
