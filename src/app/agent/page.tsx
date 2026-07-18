import { getDb } from "@/lib/db";
import {
  axesPrioritaires,
  piresItemsTheme,
  serviceConformite,
  statutFromScore,
  latestAudit,
  itemsNonConformes,
} from "@/lib/scoring";
import { getPhraseduJour } from "@/lib/quotes";
import Link from "next/link";
import { Sparkles, ShieldCheck, BookOpen, Trophy } from "lucide-react";

// ─── 5 incontournables HAS V2025 — soins intensifs ───────────────────────────
const INCONTOURNABLES = [
  {
    emoji: "🪪",
    geste: "Vérifier le bracelet avant tout soin invasif",
    detail: "Question ouverte : nom + date de naissance",
    critere: "HAS 2.1 · Identitovigilance",
  },
  {
    emoji: "💊",
    geste: "Étiqueter toutes les perfusions et PSE en cours",
    detail: "Nom · date · débit · voie d'administration",
    critere: "HAS 2.2 · Sécurisation du médicament",
  },
  {
    emoji: "🧴",
    geste: "Friction SHA aux 5 indications OMS",
    detail: "Avant / pendant / après tout contact patient",
    critere: "HAS 2.3 · Prévention des infections",
  },
  {
    emoji: "📊",
    geste: "Évaluer la douleur ET réévaluer après antalgique",
    detail: "Les deux doivent être tracées dans le DPI",
    critere: "HAS 2.4 · Prise en charge de la douleur",
  },
  {
    emoji: "🤝",
    geste: "Me présenter au patient avant chaque soin",
    detail: "Même en sédation : expliquer à voix haute",
    critere: "HAS 1.1 & 1.2 · Droits · Bientraitance",
  },
];

// Tuiles d'accès rapide (haut de l'accueil)
const TUILES = [
  {
    href: "/agent/certif",
    icon: ShieldCheck,
    title: "Certification",
    sous: "Référentiel · méthodes · quiz",
    wrap: "bg-lavande-50 border-lavande-200 hover:bg-lavande-100",
    tile: "bg-lavande-100",
    color: "text-lavande-600",
  },
  {
    href: "/agent/fiches",
    icon: BookOpen,
    title: "Fiches pratiques",
    sous: "Vigilances par thématique",
    wrap: "bg-menthe-50 border-menthe-200 hover:bg-menthe-100",
    tile: "bg-menthe-100",
    color: "text-menthe-600",
  },
  {
    href: "/agent/quiz",
    icon: Trophy,
    title: "Prêt pour la certif",
    sous: "Teste tes réflexes",
    wrap: "bg-peche-50 border-peche-200 hover:bg-peche-100",
    tile: "bg-peche-100",
    color: "text-peche-600",
  },
  {
    href: "/agent#incontournables",
    icon: Sparkles,
    title: "Mes réflexes",
    sous: "Les 5 incontournables",
    wrap: "bg-marine-50 border-marine-100 hover:bg-marine-100",
    tile: "bg-marine-100",
    color: "text-marine-600",
  },
];

// Palette pastel douce par axe prioritaire
const AXIS_STYLES = [
  { bg: "bg-menthe-50", border: "border-menthe-200", chip: "bg-menthe-100 text-menthe-700", dot: "bg-menthe-400", label: "text-menthe-700" },
  { bg: "bg-lavande-50", border: "border-lavande-200", chip: "bg-lavande-100 text-lavande-700", dot: "bg-lavande-400", label: "text-lavande-700" },
  { bg: "bg-peche-50", border: "border-peche-200", chip: "bg-peche-100 text-peche-700", dot: "bg-peche-400", label: "text-peche-700" },
];

function SectionTitle({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 px-0.5">
      <span className={`h-5 w-1.5 rounded-full ${accent}`} />
      <h2 className="text-lg font-extrabold text-marine-900 leading-none">{children}</h2>
    </div>
  );
}

export default async function AgentPage() {
  const db = await getDb();
  const phrase = getPhraseduJour();
  const axes = axesPrioritaires(db, 3);
  const conformite = serviceConformite(db);
  const statut = statutFromScore(conformite, db.config);
  const dernierAudit = latestAudit(db);

  const nonConformes = dernierAudit
    ? itemsNonConformes(dernierAudit, db).slice(0, 3)
    : [];

  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
  const reflexeDuJour = dayOfYear % INCONTOURNABLES.length;

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const scoreColor =
    statut === "vert" ? "text-menthe-600" : statut === "orange" ? "text-peche-600" : "text-lavande-600";

  return (
    <div className="mx-auto max-w-md space-y-6 pb-6">

      {/* ── Date & salutation ── */}
      <div className="pt-2">
        <p className="text-ardoise-400 text-xs capitalize tracking-wide">{date}</p>
        <h1 className="text-marine-900 text-2xl font-extrabold mt-0.5 leading-tight">
          Bonne prise en charge,<br />
          <span className="text-menthe-600">l&apos;équipe</span> 💙
        </h1>
      </div>

      {/* ── Accès rapide (tuiles) ── */}
      <div className="grid grid-cols-2 gap-3">
        {TUILES.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col gap-2 rounded-3xl border p-4 transition-colors ${t.wrap}`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${t.tile}`}>
                <Icon className={`h-5.5 w-5.5 ${t.color}`} />
              </span>
              <span className="text-sm font-bold text-marine-900 leading-tight">{t.title}</span>
              <span className="text-xs text-ardoise-500 leading-snug">{t.sous}</span>
            </Link>
          );
        })}
      </div>

      {/* ── Phrase du jour ── */}
      <div className="rounded-3xl bg-white border border-ardoise-100 shadow-sm px-5 py-4">
        <p className="text-[10px] font-bold text-menthe-600 uppercase tracking-widest mb-2.5">
          ✦ Pensée du jour
        </p>
        <p className="text-ardoise-700 text-sm font-medium leading-relaxed italic">
          &ldquo;{phrase}&rdquo;
        </p>
      </div>

      {/* ── Score service ── */}
      {conformite !== null && (
        <div className="flex items-center justify-between rounded-2xl bg-white border border-ardoise-100 shadow-sm px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-marine-800">Conformité du service</p>
            <p className="text-xs text-ardoise-500 mt-0.5">
              {statut === "vert"
                ? "Objectif atteint — continuons comme ça 🎯"
                : statut === "orange"
                  ? "En progression — on y est presque"
                  : "Des axes à renforcer — l'équipe travaille dessus"}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-black ${scoreColor}`}>{conformite}%</p>
            <p className="text-[10px] text-ardoise-400">objectif {db.config.objectif}%</p>
          </div>
        </div>
      )}

      {/* ── Ce que l'audit a révélé ── */}
      {nonConformes.length > 0 && (
        <div>
          <SectionTitle accent="bg-peche-400">Points à soigner</SectionTitle>
          <div className="space-y-2">
            {nonConformes.map(({ item, themeId, nbNon }) => {
              const theme = db.thematiques.find((t) => t.id === themeId);
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl bg-peche-50 border border-peche-200 px-3.5 py-3"
                >
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-peche-400" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-marine-900 leading-snug">
                      {item.libelle}
                    </p>
                    <p className="text-xs text-peche-700 mt-0.5">
                      {theme?.nom ?? ""}
                      {nbNon > 1 && <span className="ml-1.5 font-bold">· {nbNon}×</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5 incontournables HAS V2025 ── */}
      <div id="incontournables" className="scroll-mt-4">
        <div className="mb-3 flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1.5 rounded-full bg-menthe-400" />
            <h2 className="text-lg font-extrabold text-marine-900 leading-none">Mes réflexes du jour</h2>
          </div>
          <span className="text-[10px] text-ardoise-400 italic">critères officiels</span>
        </div>

        <div className="space-y-1.5">
          {INCONTOURNABLES.map((item, i) => {
            const isToday = i === reflexeDuJour;
            return (
              <div
                key={i}
                className={`rounded-2xl border px-4 py-3 shadow-sm ${
                  isToday ? "bg-menthe-50 border-menthe-200" : "bg-white border-ardoise-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-menthe-50 text-base">
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold leading-snug text-marine-900">{item.geste}</p>
                      {isToday && (
                        <span className="shrink-0 rounded-full bg-menthe-100 px-2 py-0.5 text-[9px] font-black text-menthe-700 uppercase tracking-wide">
                          aujourd&apos;hui
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5 text-ardoise-500">{item.detail}</p>
                    <p className="mt-1 text-[10px] font-semibold text-ardoise-400 italic">{item.critere}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Axes prioritaires ── */}
      {axes.length > 0 && (
        <div>
          <SectionTitle accent="bg-lavande-400">Nos priorités ce mois</SectionTitle>
          <div className="space-y-2">
            {axes.map((a, i) => {
              const styles = AXIS_STYLES[i] ?? AXIS_STYLES[2];
              const pire = piresItemsTheme(db, a.theme.id, 1)[0];
              const paqssTheme = db.paqss
                .filter((p) => p.themeId === a.theme.id && p.ceQueJeFais.trim() !== "")
                .slice(0, 1);
              const geste = paqssTheme[0]?.ceQueJeFais ?? a.theme.vigilances?.[0] ?? null;

              return (
                <div key={a.theme.id} className={`rounded-2xl border p-3.5 ${styles.bg} ${styles.border}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${styles.chip}`}>
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-marine-900 font-bold text-sm leading-snug">{a.theme.nom}</p>
                        {pire && (
                          <p className={`text-xs mt-0.5 ${styles.label}`}>À renforcer : {pire.libelle}</p>
                        )}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-xl px-2.5 py-1 text-sm font-bold ${styles.chip}`}>
                      {a.score}%
                    </span>
                  </div>
                  {geste && (
                    <div className="mt-2.5 flex items-start gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
                      <p className="text-xs text-ardoise-600 leading-relaxed">{geste}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
