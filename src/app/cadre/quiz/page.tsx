import { getDb } from "@/lib/db";
import { QUIZ_QUESTIONS } from "@/lib/quizCertif";
import { Trophy, Users, AlertTriangle, BarChart3, BookOpenText } from "lucide-react";
import QuizReponses from "@/components/QuizReponses";

export default async function CadreQuizPage() {
  const db = await getDb();
  const results = db.quizResults ?? [];

  const nbTentatives = results.length;
  const totalQ = results.reduce((s, r) => s + r.total, 0);
  const totalBon = results.reduce((s, r) => s + r.correct, 0);
  const scoreMoyen = totalQ > 0 ? Math.round((totalBon / totalQ) * 100) : null;

  // Comptage des questions les plus ratées
  const missCount = new Map<number, number>();
  for (const r of results) {
    for (const id of r.missedIds) missCount.set(id, (missCount.get(id) ?? 0) + 1);
  }
  const topRatees = [...missCount.entries()]
    .map(([id, n]) => ({ q: QUIZ_QUESTIONS.find((x) => x.id === id), n }))
    .filter((x) => x.q)
    .sort((a, b) => b.n - a.n)
    .slice(0, 8);

  // Ratés agrégés par thème
  const missByTheme = new Map<string, number>();
  for (const r of results) {
    for (const id of r.missedIds) {
      const q = QUIZ_QUESTIONS.find((x) => x.id === id);
      if (q) missByTheme.set(q.categorie, (missByTheme.get(q.categorie) ?? 0) + 1);
    }
  }
  const themesFaibles = [...missByTheme.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Bandeau ── */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-600 to-amber-400 p-5 text-white shadow-lg shadow-amber-500/20">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="h-5 w-5 text-amber-100" />
          <p className="text-xs font-bold text-amber-100 uppercase tracking-widest">
            Quiz de l&apos;équipe
          </p>
        </div>
        <h1 className="text-xl font-extrabold leading-tight">Prêt pour la certif</h1>
        <p className="text-sm text-amber-50 mt-0.5">
          Résultats anonymes et agrégés. Aucun nom, aucun suivi individuel.
        </p>
      </div>

      {nbTentatives === 0 ? (
        <div className="card text-center py-10">
          <BarChart3 className="mx-auto h-10 w-10 text-ardoise-300" />
          <p className="mt-3 font-bold text-marine-900">Aucune tentative pour le moment</p>
          <p className="mt-1 text-sm text-ardoise-500">
            Les résultats apparaîtront ici dès que l&apos;équipe aura commencé le quiz depuis
            son espace.
          </p>
        </div>
      ) : (
        <>
          {/* ── Chiffres clés ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-marine-50 px-4 py-4">
              <div className="flex items-center gap-1.5 text-marine-500">
                <Users className="h-4 w-4" />
                <p className="text-xs font-semibold">Tentatives</p>
              </div>
              <p className="mt-1 text-3xl font-black text-marine-900">{nbTentatives}</p>
            </div>
            <div className="rounded-2xl bg-marine-50 px-4 py-4">
              <div className="flex items-center gap-1.5 text-marine-500">
                <Trophy className="h-4 w-4" />
                <p className="text-xs font-semibold">Score moyen</p>
              </div>
              <p
                className={`mt-1 text-3xl font-black ${
                  (scoreMoyen ?? 0) >= 80
                    ? "text-green-600"
                    : (scoreMoyen ?? 0) >= 60
                      ? "text-amber-500"
                      : "text-sky-600"
                }`}
              >
                {scoreMoyen}%
              </p>
            </div>
          </div>

          {/* ── Thèmes les plus fragiles ── */}
          {themesFaibles.length > 0 && (
            <section className="card">
              <h2 className="mb-3 text-lg font-bold text-marine-900">
                Thèmes à renforcer en équipe
              </h2>
              <div className="space-y-2">
                {themesFaibles.map(([theme, n]) => {
                  const max = themesFaibles[0][1];
                  const pct = max > 0 ? Math.round((n / max) * 100) : 0;
                  return (
                    <div key={theme}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-marine-800">{theme}</span>
                        <span className="text-ardoise-500">{n} erreur{n > 1 ? "s" : ""}</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ardoise-100">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Questions les plus ratées ── */}
          {topRatees.length > 0 && (
            <section className="card">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-marine-900">
                  Questions les plus ratées
                </h2>
              </div>
              <div className="space-y-2.5">
                {topRatees.map(({ q, n }) => (
                  <div key={q!.id} className="rounded-xl bg-amber-50 px-3.5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-marine-900 leading-snug">
                        {q!.question}
                      </p>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                        {n}×
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ardoise-500">{q!.categorie}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-ardoise-400 italic">
                Idéal pour cibler un point d&apos;équipe ou un rappel en relève.
              </p>
            </section>
          )}
        </>
      )}

      {/* ── Banque de questions & réponses ── */}
      <section className="card">
        <div className="mb-3 flex items-center gap-2">
          <BookOpenText className="h-5 w-5 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold text-marine-900">
              Questions &amp; réponses du quiz
            </h2>
            <p className="text-sm text-ardoise-500">
              Pour retrouver la bonne réponse si un agent vous pose une question.
            </p>
          </div>
        </div>
        <QuizReponses questions={QUIZ_QUESTIONS} />
      </section>
    </div>
  );
}
