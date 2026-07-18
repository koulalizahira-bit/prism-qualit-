import Link from "next/link";
import { getDb } from "@/lib/db";
import {
  serviceConformite,
  serviceEvolution,
  thematiquesEnAlerte,
  auditsCeMois,
  statutFromScore,
  latestAudit,
  axesPrioritaires,
  piresItemsTheme,
} from "@/lib/scoring";
import { getPhraseduJour } from "@/lib/quotes";
import { formatDate } from "@/lib/ui";
import {
  ClipboardCheck,
  Compass,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Target,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

// Nom court d'un événement planning (avant "(", "—", "-")
function nomCourt(nom: string): string {
  return nom.split(/[\s]*[(\-—]/)[0].trim();
}

const TYPE_EMOJI: Record<string, string> = {
  audit: "📋", crex: "🔍", certif: "🛡️",
  reunion: "💬", groupe: "👥", exercice: "🏃", info: "ℹ️",
};

export default async function CadreHome() {
  const user = await getCurrentUser();
  const db = await getDb();

  const conformite = serviceConformite(db);
  const statut = statutFromScore(conformite, db.config);
  const evolution = serviceEvolution(db);
  const alertes = thematiquesEnAlerte(db);
  const nbAudits = auditsCeMois(db);
  const objectif = db.config.objectifAuditsMois;
  const last = latestAudit(db);
  const axes = axesPrioritaires(db, 1);
  const topAxe = axes[0] ?? null;
  const topItem = topAxe ? piresItemsTheme(db, topAxe.theme.id, 1)[0] : null;

  const delta =
    evolution.length >= 2
      ? evolution[evolution.length - 1].score - evolution[evolution.length - 2].score
      : null;

  const auditOk = nbAudits >= objectif;

  // Prochaines séances planifiées (à venir)
  const todayStr = new Date().toISOString().slice(0, 10);
  const prochaines = db.planning
    .flatMap((evt) =>
      (evt.seances ?? [])
        .filter((s) => s.date >= todayStr)
        .map((s) => ({
          nom: nomCourt(evt.nom),
          type: evt.type,
          date: s.date,
          heure: s.heure ?? null,
        }))
    )
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  // Score toujours en marine — pas de rouge démotivant sur la home
  const scoreColor = "#1e0a47";

  const phrase = getPhraseduJour();

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6 max-w-2xl">

      {/* ── Salutation ── */}
      <div>
        <p className="text-ardoise-400 capitalize text-sm">{date}</p>
        <h1 className="text-2xl font-extrabold text-marine-900 mt-0.5">
          Bonjour{user?.displayName ? `, ${user.displayName}` : ""} 👋
        </h1>
        <p className="text-ardoise-400 text-sm">
          {db.config.nomService}
          {last && (
            <span className="ml-2 text-ardoise-300">
              · Dernier audit {formatDate(last.date)}
            </span>
          )}
        </p>
      </div>

      {/* ── Phrase du jour ── */}
      <div className="rounded-3xl bg-gradient-to-br from-marine-900 to-marine-700 px-5 py-4">
        <p className="text-[10px] font-bold text-turquoise-400 uppercase tracking-widest mb-2">
          ✦ Pensée du jour
        </p>
        <p className="text-white text-sm font-medium leading-relaxed italic">
          &ldquo;{phrase}&rdquo;
        </p>
      </div>

      {/* ── Score + Audit du mois ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Score global */}
        <div className="card flex flex-col justify-between gap-3 p-5">
          <div>
            <p className="text-xs font-semibold text-ardoise-400 uppercase tracking-wide">
              Conformité
            </p>
            <p className="text-[11px] text-ardoise-400 mt-0.5">
              {last ? `Audit du ${formatDate(last.date)}` : "Aucun audit réalisé"}
            </p>
          </div>

          <div>
            <p
              className="text-5xl font-black leading-none"
              style={{ color: scoreColor }}
            >
              {conformite === null ? "—" : `${conformite}%`}
            </p>

            {delta !== null && (
              <p
                className={`mt-1.5 flex items-center gap-1 text-sm font-semibold ${
                  delta >= 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {delta >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {delta >= 0 ? `+${delta}` : delta} pts
              </p>
            )}
          </div>

          {/* Barre de progression */}
          {conformite !== null && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-ardoise-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(conformite, 100)}%`,
                    backgroundColor: scoreColor,
                  }}
                />
              </div>
              <p className="text-[11px] text-ardoise-400">
                Objectif {db.config.objectif}%
              </p>
            </div>
          )}
        </div>

        {/* Audits du mois + prochaines dates */}
        <div className="card flex flex-col gap-3 p-5">
          <p className="text-xs font-semibold text-ardoise-500 uppercase tracking-wide">
            Audits ce mois
          </p>

          <div>
            <p className="text-5xl font-black leading-none text-marine-900">
              {nbAudits}
              <span className="text-2xl font-semibold text-ardoise-500">
                /{objectif}
              </span>
            </p>
            <p
              className={`mt-1.5 flex items-center gap-1 text-sm font-semibold ${
                auditOk ? "text-green-600" : "text-orange-500"
              }`}
            >
              {auditOk ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <ClipboardCheck className="h-4 w-4" />
              )}
              {auditOk
                ? "Objectif atteint"
                : `${objectif - nbAudits} à réaliser`}
            </p>
          </div>

          {/* Prochaines dates planifiées */}
          {prochaines.length > 0 && (
            <div className="space-y-1.5 border-t border-ardoise-100 pt-3">
              <p className="text-[10px] font-bold text-ardoise-500 uppercase tracking-wide mb-1">
                À venir
              </p>
              {prochaines.map((s, i) => {
                const d = new Date(s.date + "T00:00:00");
                const label = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm">{TYPE_EMOJI[s.type] ?? "📅"}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-marine-900">{label}</span>
                      {s.heure && (
                        <span className="ml-1 text-xs text-ardoise-500">{s.heure}</span>
                      )}
                      <span className="ml-1.5 text-xs text-ardoise-500 truncate">· {s.nom}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            href="/cadre/audit"
            className="mt-auto inline-flex items-center gap-1.5 rounded-xl bg-marine-900 px-3 py-2 text-xs font-bold text-white hover:bg-marine-700 transition-colors"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            Nouvel audit
          </Link>
        </div>
      </div>

      {/* ── Alertes actives ── */}
      {alertes.length > 0 && (
        <div className="space-y-2">
          {/* Thématiques en alerte — ton informatif, pas alarmant */}
          {alertes.length > 0 && (
            <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm font-semibold text-amber-800">
                  {alertes.length} thématique{alertes.length > 1 ? "s" : ""} à renforcer
                  <span className="ml-2 font-normal text-amber-600">
                    ({alertes.map((a) => a.theme.nom.split(" ")[0]).join(", ")})
                  </span>
                  {last && (
                    <span className="block font-normal text-amber-600 text-xs mt-0.5">
                      Audit du {formatDate(last.date)}
                    </span>
                  )}
                </p>
              </div>
              <Link
                href="/cadre/rapports"
                className="shrink-0 text-xs font-semibold text-amber-600 hover:text-amber-800"
              >
                Voir →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Priorité #1 ── */}
      {topAxe && (
        <Link
          href={`/cadre/fiches/${topAxe.theme.id}`}
          className="block rounded-3xl bg-gradient-to-br from-marine-900 to-marine-700 p-5 text-white shadow-lg hover:from-marine-800 transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-turquoise-400 shrink-0" />
                <p className="text-xs font-bold text-white/65 uppercase tracking-wider">
                  Priorité n°1 ce mois
                </p>
              </div>
              <p className="text-lg font-extrabold leading-tight text-white">
                {topAxe.theme.nom}
              </p>
              {topItem && (
                <p className="mt-2 text-sm text-white/65">
                  À cibler : {topItem.libelle}
                </p>
              )}
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-turquoise-400">
                Voir les fiches pratiques <ChevronRight className="h-3.5 w-3.5" />
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-4xl font-black text-amber-400">
                {topAxe.score}%
              </p>
              <p className="text-xs text-white/45 mt-0.5">
                objectif {db.config.objectif}%
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* ── Accès rapides ── */}
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ardoise-400">
          Accès rapides
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            {
              href: "/cadre/paqss",
              icon: <Compass className="h-5 w-5" />,
              label: "Démarche",
              sub: "Plan d'action",
              accent: "text-turquoise-600",
              bg: "bg-turquoise-50 hover:bg-turquoise-100 border-turquoise-100",
            },
            {
              href: "/cadre/equipe",
              icon: <GraduationCap className="h-5 w-5" />,
              label: "Formation",
              sub: "Habilitations",
              accent: "text-marine-600",
              bg: "bg-marine-50 hover:bg-marine-100 border-marine-100",
            },
            {
              href: "/cadre/has",
              icon: <ShieldCheck className="h-5 w-5" />,
              label: "HAS V2025",
              sub: "Certification",
              accent: "text-indigo-600",
              bg: "bg-indigo-50 hover:bg-indigo-100 border-indigo-100",
            },
            {
              href: "/cadre/rapports",
              icon: <Target className="h-5 w-5" />,
              label: "Rapports",
              sub: "Analyses PDF",
              accent: "text-ardoise-600",
              bg: "bg-ardoise-50 hover:bg-ardoise-100 border-ardoise-100",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col gap-2 rounded-2xl border px-4 py-3.5 transition-colors ${item.bg}`}
            >
              <span className={item.accent}>{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-marine-900">{item.label}</p>
                <p className="text-xs text-ardoise-400">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
