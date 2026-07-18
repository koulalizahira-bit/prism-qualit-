"use server";

import { revalidatePath } from "next/cache";
import { addAgent, deleteAgent, replaceAgent } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { RoleAgent } from "@/lib/types";

const ROLES: RoleAgent[] = ["IDE", "AS", "ASH"];

async function assertCadre() {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");
}

function revalider() {
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre");
}

// Nouvel arrivant : numéro suivant attribué automatiquement (à la suite).
export async function addAgentAction(role: RoleAgent): Promise<void> {
  await assertCadre();
  if (!ROLES.includes(role)) return;
  await addAgent(role);
  revalider();
}

// Remplacement d'un départ : le numéro reste, les habilitations repartent à zéro.
export async function replaceAgentAction(id: string): Promise<void> {
  await assertCadre();
  if (id) await replaceAgent(id);
  revalider();
}

// Retrait définitif d'un agent.
export async function deleteAgentAction(id: string): Promise<void> {
  await assertCadre();
  if (id) await deleteAgent(id);
  revalider();
}
