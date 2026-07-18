"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { setPaqssStatut, addPaqssAction } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { StatutAction } from "@/lib/types";

const STATUTS_VALIDES: StatutAction[] = [
  "non_initiee",
  "en_cours",
  "realisee",
  "non_concerne",
  "sans_objet",
];

export async function setPaqssStatutAction(id: string, statut: StatutAction): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");
  if (!id || !STATUTS_VALIDES.includes(statut)) return;
  await setPaqssStatut(id, statut);
  revalidatePath("/cadre/paqss");
  revalidatePath("/cadre");
  revalidatePath("/superieur/paqss");
  revalidatePath("/superieur");
}

// Crée une action PAQSS pré-remplie depuis un item non conforme de l'audit,
// puis redirige vers la page PAQSS pour que le cadre complète les détails.
export async function createPaqssFromItemAction(formData: FormData): Promise<never> {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");

  const itemId = (formData.get("itemId") as string | null) ?? "";
  const itemLibelle = (formData.get("itemLibelle") as string | null) ?? "";
  const themeId = (formData.get("themeId") as string | null) ?? "";
  const auditId = (formData.get("auditId") as string | null) ?? "";
  const auditDate = (formData.get("auditDate") as string | null) ?? "";
  if (!itemId || !itemLibelle || !themeId) redirect("/cadre/rapports");

  const id = `p-nc-${itemId}-${Date.now()}`;
  // Action ÉQUIPE : terrain, rattachée à l'audit source (nature + auditId + date).
  await addPaqssAction({
    id,
    themeId,
    nature: "equipe",
    auditId: auditId || undefined,
    auditDate: auditDate || undefined,
    itemId,
    titre: itemLibelle.length > 70 ? itemLibelle.slice(0, 70) + "…" : itemLibelle,
    amelioration: `Améliorer la conformité sur : ${itemLibelle}`,
    ceQueJeFais: "", // à compléter par le cadre
    statut: "non_initiee",
    responsable: "Équipe soignante",
    echeance: "déc. 2026",
    objectif: "",
  });

  revalidatePath("/cadre/paqss");
  revalidatePath("/cadre/rapports");
  redirect("/cadre/paqss?plan=equipe");
}
