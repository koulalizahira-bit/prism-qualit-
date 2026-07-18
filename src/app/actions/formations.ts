"use server";

import { revalidatePath } from "next/cache";
import { setHabilitation, upsertFormation, deleteFormation } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { Formation, Priorite, RoleAgent } from "@/lib/types";

async function assertCadre() {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");
}

export async function setHabilitationAction(
  agentId: string,
  formationId: string,
  value: string
): Promise<void> {
  await assertCadre();
  await setHabilitation(agentId, formationId, value);
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre");
}

export async function addFormationAction(formData: FormData): Promise<void> {
  await assertCadre();
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) return;
  const objectif = Math.max(0, Math.min(100, Number(formData.get("objectif")) || 80));
  const priorite = (String(formData.get("priorite") ?? "standard") as Priorite);
  const frequence = String(formData.get("frequence") ?? "").trim() || undefined;
  const rolesRaw = formData.getAll("roles").map(String) as RoleAgent[];
  const roles = rolesRaw.length > 0 && rolesRaw.length < 3 ? rolesRaw : undefined;
  const f: Formation = { id: `f-${Date.now()}`, nom, objectif, priorite, frequence, roles };
  await upsertFormation(f);
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre/contenu");
  revalidatePath("/cadre");
}

export async function updateFormationAction(formData: FormData): Promise<void> {
  await assertCadre();
  const id = String(formData.get("id") ?? "");
  const nom = String(formData.get("nom") ?? "").trim();
  if (!id || !nom) return;
  const objectif = Math.max(0, Math.min(100, Number(formData.get("objectif")) || 80));
  const priorite = String(formData.get("priorite") ?? "standard") as Priorite;
  const frequence = String(formData.get("frequence") ?? "").trim() || undefined;
  await upsertFormation({ id, nom, objectif, priorite, frequence });
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre/contenu");
  revalidatePath("/cadre");
}

export async function deleteFormationAction(formData: FormData): Promise<void> {
  await assertCadre();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteFormation(id);
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre/contenu");
  revalidatePath("/cadre");
}
