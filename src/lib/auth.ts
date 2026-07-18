import { cookies } from "next/headers";
import { getDb } from "./db";
import type { User } from "./types";

export const SESSION_COOKIE = "sid";

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const id = store.get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const db = await getDb();
  return db.users.find((u) => u.id === id) ?? null;
}

export function homePathForRole(role: User["role"]): string {
  if (role === "superieur") return "/superieur";
  if (role === "agent") return "/agent";
  return "/cadre";
}

export function roleLabel(role: string): string {
  switch (role) {
    case "cadre":
      return "Cadre de santé";
    case "superieur":
      return "Cadre supérieur de pôle";
    case "IDE":
      return "Infirmier(ère) D.E.";
    case "AS":
      return "Aide-soignant(e)";
    case "ASH":
      return "Agent de service hospitalier";
    default:
      return role;
  }
}
