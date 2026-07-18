"use client";

import { useMemo, useState } from "react";
import { Check, X, Eye, RotateCcw, ChevronRight, Trophy, ShieldCheck } from "lucide-react";
import { recordQuizAttempt } from "@/app/actions/quiz";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/quizCertif";

type Phase = "choix" | "jeu" | "fin";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizCertif() {
  const categories = useMemo(() => {
    const set = new Map<string, number>();
    for (const q of QUIZ_QUESTIONS) set.set(q.categorie, (set.get(q.categorie) ?? 0) + 1);
    return [...set.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const [phase, setPhase] = useState<Phase>("choix");
  const [categorie, setCategorie] = useState("Tout");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<number[]>([]);

  const demarrer = (cat: string) => {
    const pool = cat === "Tout" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.categorie === cat);
    setCategorie(cat);
    setQuestions(shuffle(pool));
    setIdx(0);
    setRevealed(false);
    setPicked(null);
    setCorrect(0);
    setMissed([]);
    setPhase("jeu");
  };

  const q = questions[idx];

  const noterEtSuivant = (estBon: boolean) => {
    const nextCorrect = correct + (estBon ? 1 : 0);
    const nextMissed = estBon ? missed : [...missed, q.id];
    if (idx + 1 < questions.length) {
      setCorrect(nextCorrect);
      setMissed(nextMissed);
      setIdx(idx + 1);
      setRevealed(false);
      setPicked(null);
    } else {
      setCorrect(nextCorrect);
      setMissed(nextMissed);
      setPhase("fin");
      void recordQuizAttempt({
        categorie,
        total: questions.length,
        correct: nextCorrect,
        missedIds: nextMissed,
      }).catch(() => {});
    }
  };

  // ─────────── Choix de la catégorie ───────────
  if (phase === "choix") {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => demarrer("Tout")}
          className="w-full flex items-center justify-between rounded-2xl bg-menthe-600 px-4 py-4 text-left text-white font-bold hover:bg-menthe-700 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tout réviser — {QUIZ_QUESTIONS.length} questions
          </span>
          <ChevronRight className="h-5 w-5" />
        </button>

        <p className="text-[10px] font-bold uppercase tracking-widest text-ardoise-400 pt-1 px-1">
          ou par thème
        </p>

        <div className="grid grid-cols-1 gap-2">
          {categories.map(([cat, n]) => (
            <button
              key={cat}
              type="button"
              onClick={() => demarrer(cat)}
              className="flex items-center justify-between rounded-2xl bg-white border border-ardoise-100 shadow-sm px-4 py-3 text-left hover:bg-ardoise-50 transition-colors"
            >
              <span className="text-sm font-semibold text-marine-900">{cat}</span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-ardoise-400">{n}</span>
                <ChevronRight className="h-4 w-4 text-ardoise-300" />
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─────────── Écran de fin ───────────
  if (phase === "fin") {
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const couleur = pct >= 80 ? "text-menthe-600" : pct >= 60 ? "text-peche-600" : "text-lavande-600";
    const ratees = QUIZ_QUESTIONS.filter((x) => missed.includes(x.id));
    return (
      <div className="space-y-5">
        <div className="rounded-3xl bg-white border border-ardoise-100 shadow-sm px-5 py-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ardoise-400">Ton score</p>
          <p className={`mt-1 text-5xl font-black ${couleur}`}>{pct}%</p>
          <p className="mt-1 text-sm text-ardoise-600">
            {correct} / {questions.length} bonnes réponses
          </p>
          <p className="mt-3 text-xs text-ardoise-500">
            {pct >= 80
              ? "Bravo, tu es prêt(e) pour la visite 🎯"
              : pct >= 60
                ? "Bien, encore quelques points à revoir"
                : "À retravailler — recommence quand tu veux"}
          </p>
        </div>

        {ratees.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-peche-600 mb-2 px-1">
              À revoir ({ratees.length})
            </p>
            <div className="space-y-1.5">
              {ratees.map((x) => (
                <div key={x.id} className="rounded-2xl bg-peche-50 border border-peche-200 px-3.5 py-2.5">
                  <p className="text-sm font-semibold text-marine-900 leading-snug">{x.question}</p>
                  <p className="mt-1 text-xs text-ardoise-600 leading-relaxed">{x.reponse}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setPhase("choix")}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white border border-ardoise-200 px-4 py-3 text-sm font-bold text-marine-800 hover:bg-ardoise-50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Recommencer
        </button>
      </div>
    );
  }

  // ─────────── Jeu ───────────
  const progression = Math.round((idx / questions.length) * 100);

  return (
    <div className="space-y-4">
      {/* Progression */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ardoise-100">
          <div className="h-full rounded-full bg-menthe-400 transition-all" style={{ width: `${progression}%` }} />
        </div>
        <span className="text-xs font-semibold text-ardoise-500 shrink-0">
          {idx + 1}/{questions.length}
        </span>
      </div>

      {/* Carte question */}
      <div className="rounded-3xl bg-white border border-ardoise-100 shadow-sm px-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-ardoise-100 px-2.5 py-0.5 text-[10px] font-bold text-ardoise-600">
            {q.categorie}
          </span>
          {q.imperatif && (
            <span className="flex items-center gap-1 rounded-full bg-peche-100 px-2.5 py-0.5 text-[10px] font-bold text-peche-700">
              <ShieldCheck className="h-3 w-3" />
              critère impératif
            </span>
          )}
        </div>

        <p className="text-base font-bold text-marine-900 leading-snug">{q.question}</p>

        {/* VRAI / FAUX */}
        {q.type === "vrai_faux" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[true, false].map((val) => {
              const isPicked = picked === (val ? 1 : 0);
              const isGood = q.reponseVF === val;
              let cls = "bg-white border-ardoise-200 text-marine-800 hover:bg-ardoise-50";
              if (revealed) {
                if (isGood) cls = "bg-menthe-100 border-menthe-300 text-menthe-800";
                else if (isPicked) cls = "bg-peche-100 border-peche-300 text-peche-800";
                else cls = "bg-ardoise-50 border-ardoise-100 text-ardoise-400";
              }
              return (
                <button
                  key={String(val)}
                  type="button"
                  disabled={revealed}
                  onClick={() => {
                    setPicked(val ? 1 : 0);
                    setRevealed(true);
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${cls}`}
                >
                  {val ? "VRAI" : "FAUX"}
                </button>
              );
            })}
          </div>
        )}

        {/* QCM */}
        {q.type === "qcm" && q.options && (
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const isPicked = picked === i;
              const isGood = q.bonneIndex === i;
              let cls = "bg-white border-ardoise-200 text-marine-800 hover:bg-ardoise-50";
              if (revealed) {
                if (isGood) cls = "bg-menthe-100 border-menthe-300 text-menthe-800";
                else if (isPicked) cls = "bg-peche-100 border-peche-300 text-peche-800";
                else cls = "bg-ardoise-50 border-ardoise-100 text-ardoise-400";
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => {
                    setPicked(i);
                    setRevealed(true);
                  }}
                  className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Ouverte : révéler */}
        {q.type === "ouverte" && !revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-menthe-50 border border-menthe-200 px-4 py-3 text-sm font-bold text-menthe-700 hover:bg-menthe-100 transition-colors"
          >
            <Eye className="h-4 w-4" />
            Voir la réponse
          </button>
        )}

        {/* Réponse révélée */}
        {revealed && (
          <div className="mt-4 rounded-2xl bg-menthe-50 border border-menthe-200 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-menthe-700 mb-1">Réponse</p>
            <p className="text-sm text-ardoise-700 leading-relaxed">{q.reponse}</p>
          </div>
        )}
      </div>

      {/* Boutons suite */}
      {revealed && (
        <div>
          {q.type === "ouverte" ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => noterEtSuivant(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-ardoise-200 px-4 py-3 text-sm font-bold text-ardoise-600 hover:bg-ardoise-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Je ne savais pas
              </button>
              <button
                type="button"
                onClick={() => noterEtSuivant(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-menthe-100 border border-menthe-300 px-4 py-3 text-sm font-bold text-menthe-800 hover:bg-menthe-200 transition-colors"
              >
                <Check className="h-4 w-4" />
                Je savais
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => noterEtSuivant(picked === (q.type === "vrai_faux" ? (q.reponseVF ? 1 : 0) : q.bonneIndex))}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-menthe-600 px-4 py-3 text-sm font-bold text-white hover:bg-menthe-700 transition-colors"
            >
              {idx + 1 < questions.length ? "Question suivante" : "Voir mon score"}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
