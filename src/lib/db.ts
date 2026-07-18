import fs from "node:fs";
import path from "node:path";
import type { Database, Audit, Fiche, Thematique, Formation, PlanningEvent, Seance, StatutAction, QuizResult } from "./types";
import { buildSeed } from "./seed";

const SCHEMA = 17;
const KV_KEY = "prism:db";

// Dual-mode: Vercel KV si configuré, sinon fichier JSON (local ou /tmp sur Vercel)
const IS_PROD = !!process.env.KV_REST_API_URL;
const DATA_DIR = process.env.VERCEL
  ? "/tmp/prism-data"
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

type RawDb = Database & { __schema?: number };

// ─── Migrations (inchangées) ──────────────────────────────────────────────────
const MIGRATIONS: Record<number, (db: RawDb) => void> = {
  11: (db) => {
    for (const f of db.formations ?? []) {
      if (f.id !== "f4") delete (f as unknown as Record<string, unknown>).validite;
    }
  },
  12: (db) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type AnyArr = any[];
    const themes = db.thematiques as AnyArr;
    if (!themes.find((t) => t.id === "t9")) {
      themes.push({
        id: "t9", ordre: 9,
        nom: "Bientraitance & dignité",
        description: "Respect de l'intimité, communication bienveillante, environnement adapté.",
        vigilances: [
          "Tirer le rideau lors des soins.",
          "Parler au patient même non communicant.",
          "Limiter le bruit dans et autour de la chambre.",
        ],
        infos: ["Critère HAS V2025 : bientraitance en soins critiques."],
      });
    }
    const s2 = (db.sections as AnyArr).find((s) => s.id === "s2");
    if (s2 && !(s2.items as AnyArr).find((i) => i.id === "s2i19")) {
      (s2.items as AnyArr).push(
        { id: "s2i19", libelle: "Intimité préservée lors des soins (rideau, paravent)", themeId: "t9" },
        { id: "s2i20", libelle: "Patient non communicant : explications des soins données à voix haute", themeId: "t9" },
        { id: "s2i21", libelle: "Environnement sonore respectueux (bruit limité autour du patient)", themeId: "t9" },
      );
    }
    const fiches = db.fiches as AnyArr;
    if (!fiches.find((f) => f.id === "f19")) {
      fiches.push({
        id: "f19", themeId: "t9",
        titre: "Bientraitance en soins critiques",
        resume: "Soigner aussi la personne, pas seulement le corps.",
        contenu: [
          "Parler au patient avant chaque soin, même s'il ne répond pas.",
          "Tirer le rideau / paravent lors des soins.",
          "Limiter les bruits inutiles (conversations, alarmes prolongées).",
          "Expliquer chaque geste au patient inconscient ou sédaté.",
          "Impliquer les proches dans les soins quand c'est possible.",
        ],
      });
    }
    const paqss = db.paqss as AnyArr;
    if (!paqss.find((p) => p.id === "p17")) {
      paqss.push({
        id: "p17", themeId: "t9",
        titre: "Bientraitance en soins critiques",
        amelioration: "Intégrer les pratiques bientraitantes dans les routines de soins.",
        ceQueJeFais: "Je parle au patient, je préserve son intimité, je limite le bruit au chevet.",
        statut: "non_initiee",
        responsable: "Cadre de santé",
        echeance: "déc. 2026",
        objectif: "Critère HAS V2025",
      });
    }
  },
  13: (db) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const users = db.users as any[];
    if (!users.find((u) => u.id === "u-agent")) {
      users.push({ id: "u-agent", login: "equipe", pin: "0000", role: "agent", displayName: "Équipe soignante" });
    }
  },
  14: (db) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyDb = db as any;
    if (!Array.isArray(anyDb.quizResults)) anyDb.quizResults = [];
  },
  15: (db) => {
    // Anonymisation : purge toute donnée de démo issue d'anciennes versions
    // (audits/effectif/secteurs pouvant contenir des traces réelles) et
    // reconstruit l'intégralité du jeu de démonstration depuis le seed anonymisé.
    reseedFromScratch(db);
  },
  16: (db) => {
    // Ajout des grilles d'audit thématiques (audits dédiés). Reseed complet pour
    // disposer des nouvelles grilles + de leurs audits de démonstration.
    reseedFromScratch(db);
  },
  17: (db) => {
    // Plan d'action équipe (actions issues des audits) + champ nature. Reseed complet.
    reseedFromScratch(db);
  },
};

function reseedFromScratch(db: RawDb): void {
  const fresh = buildSeed() as RawDb;
  for (const k of Object.keys(db)) {
    if (k === "__schema") continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (db as any)[k];
  }
  Object.assign(db, fresh);
}

function applyMigrations(raw: RawDb): RawDb {
  const from = raw.__schema ?? 0;
  if (from < SCHEMA) {
    for (let v = from + 1; v <= SCHEMA; v++) MIGRATIONS[v]?.(raw);
    raw.__schema = SCHEMA;
  }
  return raw;
}

// ─── Backends ────────────────────────────────────────────────────────────────

async function kvGet(): Promise<RawDb | null> {
  const { kv } = await import("@vercel/kv");
  return kv.get<RawDb>(KV_KEY);
}

async function kvSet(db: RawDb): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(KV_KEY, db);
}

function fsGet(): RawDb | null {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8")) as RawDb;
  } catch {
    return null;
  }
}

function fsSet(db: RawDb): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify({ ...db, __schema: SCHEMA }, null, 2), "utf8");
}

// ─── API publique (async) ─────────────────────────────────────────────────────

export async function getDb(): Promise<Database> {
  let raw = IS_PROD ? await kvGet() : fsGet();
  if (!raw) {
    raw = applyMigrations(buildSeed() as RawDb);
    if (IS_PROD) await kvSet(raw); else fsSet(raw);
    return raw as Database;
  }
  const from = raw.__schema ?? 0;
  if (from < SCHEMA) {
    raw = applyMigrations(raw);
    if (IS_PROD) await kvSet(raw); else fsSet(raw);
  }
  return raw as Database;
}

export async function saveDb(db: Database): Promise<void> {
  const raw = { ...db, __schema: SCHEMA } as RawDb;
  if (IS_PROD) await kvSet(raw); else fsSet(raw);
}

export async function resetDb(): Promise<Database> {
  if (!IS_PROD && fs.existsSync(DB_PATH)) {
    try { fs.copyFileSync(DB_PATH, path.join(DATA_DIR, `db.avant-reset-${Date.now()}.json`)); } catch {}
    fs.rmSync(DB_PATH);
  }
  return getDb();
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function addAudit(audit: Audit): Promise<void> {
  const db = await getDb();
  db.audits.push(audit);
  await saveDb(db);
}

export async function addQuizResult(result: QuizResult): Promise<void> {
  const db = await getDb();
  if (!Array.isArray(db.quizResults)) db.quizResults = [];
  db.quizResults.push(result);
  await saveDb(db);
}

export async function updateConfig(patch: Partial<Database["config"]>): Promise<void> {
  const db = await getDb();
  db.config = { ...db.config, ...patch };
  await saveDb(db);
}

export async function upsertFiche(fiche: Fiche): Promise<void> {
  const db = await getDb();
  const i = db.fiches.findIndex((f) => f.id === fiche.id);
  if (i >= 0) db.fiches[i] = fiche; else db.fiches.push(fiche);
  await saveDb(db);
}

export async function deleteFiche(id: string): Promise<void> {
  const db = await getDb();
  db.fiches = db.fiches.filter((f) => f.id !== id);
  await saveDb(db);
}

export async function upsertThematique(theme: Thematique): Promise<void> {
  const db = await getDb();
  const i = db.thematiques.findIndex((t) => t.id === theme.id);
  if (i >= 0) db.thematiques[i] = theme; else db.thematiques.push(theme);
  await saveDb(db);
}

export async function addItem(sectionId: string, libelle: string, themeId: string): Promise<void> {
  const db = await getDb();
  const s = db.sections.find((x) => x.id === sectionId);
  if (!s) return;
  s.items.push({ id: `${sectionId}i-${Date.now()}`, libelle, themeId });
  await saveDb(db);
}

export async function deleteItem(itemId: string): Promise<void> {
  const db = await getDb();
  for (const s of db.sections) s.items = s.items.filter((it) => it.id !== itemId);
  await saveDb(db);
}

export async function setHabilitation(agentId: string, formationId: string, value: string): Promise<void> {
  const db = await getDb();
  const a = db.agents.find((x) => x.id === agentId);
  if (!a) return;
  const hab = { ...(a.habilitations ?? {}) };
  const v = value.trim();
  if (v) hab[formationId] = v; else delete hab[formationId];
  a.habilitations = hab;
  await saveDb(db);
}

export async function setPaqssStatut(id: string, statut: StatutAction): Promise<void> {
  const db = await getDb();
  const action = db.paqss.find((p) => p.id === id);
  if (!action) return;
  action.statut = statut;
  await saveDb(db);
}

export async function addPaqssAction(action: import("./types").PaqssAction): Promise<void> {
  const db = await getDb();
  db.paqss.push(action);
  await saveDb(db);
}

export async function upsertFormation(f: Formation): Promise<void> {
  const db = await getDb();
  const i = db.formations.findIndex((x) => x.id === f.id);
  if (i >= 0) db.formations[i] = f; else db.formations.push(f);
  await saveDb(db);
}

export async function deleteFormation(id: string): Promise<void> {
  const db = await getDb();
  db.formations = db.formations.filter((f) => f.id !== id);
  for (const a of db.agents) {
    if (a.habilitations) delete a.habilitations[id];
  }
  await saveDb(db);
}

export async function addSeance(eventId: string, seance: Seance): Promise<void> {
  const db = await getDb();
  const ev = db.planning.find((e) => e.id === eventId);
  if (!ev) return;
  ev.seances = [...(ev.seances ?? []), seance];
  await saveDb(db);
}

export async function deleteSeance(eventId: string, seanceId: string): Promise<void> {
  const db = await getDb();
  const ev = db.planning.find((e) => e.id === eventId);
  if (!ev || !ev.seances) return;
  ev.seances = ev.seances.filter((s) => s.id !== seanceId);
  await saveDb(db);
}

export async function addPlanningEvent(ev: PlanningEvent): Promise<void> {
  const db = await getDb();
  db.planning.push(ev);
  await saveDb(db);
}

export async function deletePlanningEvent(id: string): Promise<void> {
  const db = await getDb();
  db.planning = db.planning.filter((e) => e.id !== id);
  await saveDb(db);
}

export async function addAgent(role: "IDE" | "AS" | "ASH"): Promise<void> {
  const db = await getDb();
  const nums = db.agents.filter((a) => a.role === role).map((a) => a.numero);
  const numero = (nums.length ? Math.max(...nums) : 0) + 1;
  db.agents.push({ id: `${role}-${numero}-${Date.now()}`, label: `${role} ${numero}`, role, numero, habilitations: {} });
  await saveDb(db);
}

export async function deleteAgent(id: string): Promise<void> {
  const db = await getDb();
  db.agents = db.agents.filter((a) => a.id !== id);
  await saveDb(db);
}

export async function replaceAgent(id: string): Promise<void> {
  const db = await getDb();
  const a = db.agents.find((x) => x.id === id);
  if (!a) return;
  a.habilitations = {};
  await saveDb(db);
}
