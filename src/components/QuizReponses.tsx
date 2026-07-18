"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { QuizQuestion } from "@/lib/quizCertif";

// Banque de questions/réponses consultable par le cadre — pour pouvoir aiguiller
// un agent qui pose une question à laquelle il ne sait pas répondre spontanément.
export default function QuizReponses({ questions }: { questions: QuizQuestion[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return questions;
    return questions.filter(
      (item) =>
        item.question.toLowerCase().includes(needle) ||
        item.categorie.toLowerCase().includes(needle) ||
        item.reponse.toLowerCase().includes(needle),
    );
  }, [q, questions]);

  const parCategorie = useMemo(() => {
    const map = new Map<string, QuizQuestion[]>();
    for (const item of filtered) {
      const list = map.get(item.categorie) ?? [];
      list.push(item);
      map.set(item.categorie, list);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ardoise-400" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une question, un thème…"
          className="w-full rounded-xl border border-ardoise-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-marine-900 placeholder:text-ardoise-400 focus:border-amber-400 focus:outline-none"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-ardoise-400 italic">Aucune question ne correspond à cette recherche.</p>
      )}

      {parCategorie.map(([categorie, items]) => (
        <div key={categorie}>
          <p className="mb-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            {categorie}
          </p>
          <div className="space-y-2">
            {items.map((item) => {
              const isOpen = open === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-ardoise-100 bg-white overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => (prev === item.id ? null : item.id))}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ardoise-50/50 transition-colors"
                  >
                    <p className="text-sm font-semibold text-marine-900 leading-snug">
                      {item.question}
                    </p>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-ardoise-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-ardoise-100 bg-amber-50/60 px-4 py-3">
                      {item.type === "qcm" && item.options && (
                        <ul className="mb-2 space-y-1">
                          {item.options.map((opt, i) => (
                            <li
                              key={i}
                              className={`text-xs ${
                                i === item.bonneIndex
                                  ? "font-bold text-green-700"
                                  : "text-ardoise-500"
                              }`}
                            >
                              {i === item.bonneIndex ? "✓ " : "· "}
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-sm text-amber-900 leading-relaxed">{item.reponse}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
