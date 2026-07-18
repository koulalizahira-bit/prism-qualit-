"use server";

import { revalidatePath } from "next/cache";
import { addQuizResult } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Enregistre une tentative de quiz de façon ANONYME (aucune donnée nominative).
export async function recordQuizAttempt(input: {
  categorie: string;
  total: number;
  correct: number;
  missedIds: number[];
}): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Action non autorisée");

  await addQuizResult({
    id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    categorie: input.categorie,
    total: Math.max(0, Math.round(input.total)),
    correct: Math.max(0, Math.round(input.correct)),
    missedIds: Array.isArray(input.missedIds) ? input.missedIds : [],
  });

  revalidatePath("/cadre/quiz");
}
