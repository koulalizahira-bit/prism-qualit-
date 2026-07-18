import { getDb } from "@/lib/db";
import { FichesIndex } from "@/components/Fiches";

export default async function CadreFichesPage() {
  const db = await getDb();
  return <FichesIndex themes={db.thematiques} fiches={db.fiches} basePath="/cadre/fiches" />;
}
