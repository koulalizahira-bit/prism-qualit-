"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { SESSION_COOKIE, homePathForRole } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const login = String(formData.get("login") ?? "").trim().toLowerCase();
  const pin = String(formData.get("pin") ?? "").trim();

  if (!login || !pin) {
    return { error: "Veuillez saisir votre identifiant et votre code PIN." };
  }

  const db = await getDb();
  const user = db.users.find((u) => u.login.toLowerCase() === login);

  if (!user || user.pin !== pin) {
    return { error: "Identifiant ou code PIN incorrect." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(homePathForRole(user.role));
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
