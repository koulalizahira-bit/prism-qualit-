import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "cadre") {
    return NextResponse.json({ error: "Action non autorisée" }, { status: 403 });
  }

  const db = await getDb();
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(db, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="prism-sauvegarde-${date}.json"`,
    },
  });
}
