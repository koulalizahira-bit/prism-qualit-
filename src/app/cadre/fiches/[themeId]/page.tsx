import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { FicheTheme } from "@/components/Fiches";

export default async function CadreFicheThemePage({
  params,
}: {
  params: Promise<{ themeId: string }>;
}) {
  const { themeId } = await params;
  const db = await getDb();
  const theme = db.thematiques.find((t) => t.id === themeId);
  if (!theme) notFound();
  const fiches = db.fiches.filter((f) => f.themeId === themeId);
  return <FicheTheme theme={theme} fiches={fiches} backHref="/cadre/fiches" />;
}
