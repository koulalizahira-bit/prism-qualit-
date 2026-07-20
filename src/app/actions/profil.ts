"use server";

import { revalidatePath } from "next/cache";
import { updateUserDisplayName, updateConfig } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function updateProfilAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const nomService = String(formData.get("nomService") ?? "").trim();

  if (displayName) await updateUserDisplayName(user.id, displayName);
  if (nomService) await updateConfig({ nomService });

  revalidatePath("/cadre");
  revalidatePath("/cadre/profil");
  revalidatePath("/cadre/contenu");
  revalidatePath("/superieur");
}
