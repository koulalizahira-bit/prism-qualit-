"use server";

import { revalidatePath } from "next/cache";
import { updateConfig, upsertFiche, deleteFiche, addItem, deleteItem } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function assertCadre() {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");
}

function revalidateAll() {
  revalidatePath("/cadre");
  revalidatePath("/cadre/contenu");
  revalidatePath("/cadre/fiches");
  revalidatePath("/cadre/audit");
  revalidatePath("/superieur");
}

export async function updateConfigAction(formData: FormData): Promise<void> {
  await assertCadre();
  const num = (k: string, d: number) => {
    const v = Number(formData.get(k));
    return Number.isFinite(v) && v >= 0 ? v : d;
  };
  await updateConfig({
    nomEtablissement: String(formData.get("nomEtablissement") ?? "").trim() || "CHU",
    nomService: String(formData.get("nomService") ?? "").trim() || "Service",
    objectif: num("objectif", 80),
    objectifAuditsMois: num("objectifAuditsMois", 2),
    statutVert: num("statutVert", 85),
    statutOrange: num("statutOrange", 75),
  });
  revalidateAll();
}

export async function addFicheAction(formData: FormData): Promise<void> {
  await assertCadre();
  const themeId = String(formData.get("themeId") ?? "");
  const titre = String(formData.get("titre") ?? "").trim();
  const resume = String(formData.get("resume") ?? "").trim();
  const contenu = String(formData.get("contenu") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!themeId || !titre) return;
  await upsertFiche({ id: `f-${Date.now()}`, themeId, titre, resume, contenu });
  revalidateAll();
}

export async function deleteFicheAction(formData: FormData): Promise<void> {
  await assertCadre();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteFiche(id);
  revalidateAll();
}

export async function addItemAction(formData: FormData): Promise<void> {
  await assertCadre();
  const sectionId = String(formData.get("sectionId") ?? "");
  const libelle = String(formData.get("libelle") ?? "").trim();
  const themeId = String(formData.get("themeId") ?? "");
  if (!sectionId || !libelle || !themeId) return;
  await addItem(sectionId, libelle, themeId);
  revalidateAll();
}

export async function deleteItemAction(formData: FormData): Promise<void> {
  await assertCadre();
  const itemId = String(formData.get("itemId") ?? "");
  if (itemId) await deleteItem(itemId);
  revalidateAll();
}
