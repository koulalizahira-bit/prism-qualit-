"use server";

import { revalidatePath } from "next/cache";
import {
  addSeance,
  deleteSeance,
  addPlanningEvent,
  deletePlanningEvent,
  addAgent,
  deleteAgent,
} from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { EventType, Implication, Portee, PlanningEvent } from "@/lib/types";

async function assertCadre() {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") throw new Error("Action non autorisée");
}
function reval() {
  revalidatePath("/cadre/calendrier");
  revalidatePath("/cadre/contenu");
  revalidatePath("/superieur/calendrier");
}

export async function addSeanceAction(formData: FormData): Promise<void> {
  await assertCadre();
  const eventId = String(formData.get("eventId") ?? "");
  const date = String(formData.get("date") ?? "").trim();
  if (!eventId || !date) return;
  const heure = String(formData.get("heure") ?? "").trim() || undefined;
  const note = String(formData.get("note") ?? "").trim() || undefined;
  await addSeance(eventId, { id: `s-${Date.now()}`, date, heure, note });
  reval();
}

export async function deleteSeanceAction(formData: FormData): Promise<void> {
  await assertCadre();
  const eventId = String(formData.get("eventId") ?? "");
  const seanceId = String(formData.get("seanceId") ?? "");
  if (eventId && seanceId) await deleteSeance(eventId, seanceId);
  reval();
}

export async function addEventAction(formData: FormData): Promise<void> {
  await assertCadre();
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) return;
  const mois = String(formData.get("mois") ?? "")
    .split(/[\s,;]+/)
    .map((x) => parseInt(x, 10))
    .filter((n) => n >= 1 && n <= 12);
  const ev: PlanningEvent = {
    id: `e-${Date.now()}`,
    nom,
    type: (String(formData.get("type") ?? "audit") as EventType),
    portee: (String(formData.get("portee") ?? "service") as Portee),
    frequence: String(formData.get("frequence") ?? "").trim() || "Ponctuel",
    mois,
    implication: (String(formData.get("implication") ?? "realisation") as Implication),
    pilote: String(formData.get("pilote") ?? "").trim() || "CDS / IDEC",
    pourMoi: String(formData.get("pourMoi") ?? "").trim(),
    seances: [],
  };
  await addPlanningEvent(ev);
  reval();
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await assertCadre();
  const id = String(formData.get("id") ?? "");
  if (id) await deletePlanningEvent(id);
  reval();
}

export async function addAgentAction(formData: FormData): Promise<void> {
  await assertCadre();
  const role = String(formData.get("role") ?? "") as "IDE" | "AS" | "ASH";
  if (["IDE", "AS", "ASH"].includes(role)) await addAgent(role);
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre/contenu");
  revalidatePath("/cadre");
}

export async function deleteAgentAction(formData: FormData): Promise<void> {
  await assertCadre();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteAgent(id);
  revalidatePath("/cadre/equipe");
  revalidatePath("/cadre/contenu");
  revalidatePath("/cadre");
}
