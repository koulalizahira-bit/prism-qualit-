import CalendrierQualite from "@/components/CalendrierQualite";
import { getDb } from "@/lib/db";
import { CalendarDays } from "lucide-react";

export default async function SuperieurCalendrierPage() {
  const db = await getDb();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <CalendarDays className="h-7 w-7 text-turquoise-500" /> Calendrier qualité de l&apos;année
        </h1>
        <p className="text-ardoise-500">Audits, réunions et temps forts qualité du service</p>
      </div>
      <CalendrierQualite events={db.planning} />
    </div>
  );
}
