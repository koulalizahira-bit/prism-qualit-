import { getDb } from "@/lib/db";
import { FichesIndex } from "@/components/Fiches";

export default async function SuperieurFichesPage() {
  const db = await getDb();
  return <FichesIndex themes={db.thematiques} fiches={db.fiches} basePath="/superieur/fiches" />;
}
