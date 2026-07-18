"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addAudit } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Reponse } from "@/lib/types";

export async function saveAuditAction(
  roulement: string,
  valeurs: Record<string, Record<string, Reponse>>,
  commentaires: Record<string, string> = {},
  grilleId: string = "g-service"
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");

  await addAudit({
    id: `aud-${Date.now()}`,
    date: new Date().toISOString(),
    roulement: roulement || "Roulement jour",
    auteurId: user.id,
    grilleId,
    valeurs,
    commentaires,
  });

  revalidatePath("/cadre");
  revalidatePath("/cadre/rapports");
  revalidatePath("/superieur");
  redirect("/cadre?audit=ok");
}
