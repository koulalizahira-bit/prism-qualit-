"use client";

import { useState, useTransition } from "react";
import { addAgentAction, replaceAgentAction, deleteAgentAction } from "@/app/actions/agents";
import { UserPlus, UserCog, ChevronDown, ChevronUp, RefreshCw, Trash2 } from "lucide-react";

interface AgentLite { id: string; label: string; role: "IDE" | "AS" | "ASH"; numero: number }

const ROLES = ["IDE", "AS", "ASH"] as const;

export default function GestionEffectif({ agents }: { agents: AgentLite[] }) {
  const [ouvert, setOuvert] = useState(false);
  const [pending, startTransition] = useTransition();

  function ajouter(role: "IDE" | "AS" | "ASH") {
    startTransition(() => {
      void addAgentAction(role);
    });
  }
  function remplacer(a: AgentLite) {
    if (!window.confirm(`Remplacer ${a.label} par un nouvel arrivant ?\n\nLe numéro « ${a.label} » est conservé, mais les habilitations repartent à zéro (nouvelle personne). Pensez à mettre à jour votre fichier de correspondance des noms.`)) return;
    startTransition(() => {
      void replaceAgentAction(a.id);
    });
  }
  function retirer(a: AgentLite) {
    if (!window.confirm(`Retirer définitivement ${a.label} de l'effectif ?\n\nCette ligne et ses habilitations seront supprimées.`)) return;
    startTransition(() => {
      void deleteAgentAction(a.id);
    });
  }

  return (
    <div className="card">
      <button
        onClick={() => setOuvert((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-lg font-bold text-marine-900">
          <UserCog className="h-5 w-5 text-turquoise-500" /> Gérer l&apos;effectif
        </span>
        {ouvert ? <ChevronUp className="h-5 w-5 text-ardoise-400" /> : <ChevronDown className="h-5 w-5 text-ardoise-400" />}
      </button>

      {ouvert && (
        <div className={`mt-4 space-y-5 ${pending ? "opacity-60" : ""}`}>
          {/* Ajouter un nouvel arrivant */}
          <div>
            <p className="mb-2 text-sm font-semibold text-marine-900">Nouvel arrivant (numéro attribué à la suite)</p>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  disabled={pending}
                  onClick={() => ajouter(r)}
                  className="flex items-center gap-1.5 rounded-2xl bg-marine-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-marine-800 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" /> Nouvel {r}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des agents par rôle : remplacement / retrait */}
          {ROLES.map((r) => {
            const list = agents.filter((a) => a.role === r).sort((a, b) => a.numero - b.numero);
            if (list.length === 0) return null;
            return (
              <div key={r}>
                <p className="mb-2 text-sm font-semibold text-marine-900">
                  {r} <span className="font-normal text-ardoise-400">· {list.length}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {list.map((a) => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-ardoise-100 bg-white py-1 pl-3 pr-1.5 text-sm"
                    >
                      <span className="font-semibold text-marine-900">{a.label}</span>
                      <button
                        disabled={pending}
                        onClick={() => remplacer(a)}
                        title="Remplacer (départ → nouvel arrivant, mêmes numéro, habilitations remises à zéro)"
                        className="rounded-lg p-1 text-turquoise-600 transition hover:bg-turquoise-50 disabled:opacity-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={pending}
                        onClick={() => retirer(a)}
                        title="Retirer définitivement de l'effectif"
                        className="rounded-lg p-1 text-rouge transition hover:bg-rouge-soft disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="rounded-xl bg-ardoise-50 px-3 py-2 text-xs text-ardoise-500">
            <RefreshCw className="mr-1 inline h-3 w-3 text-turquoise-600" /> <strong>Remplacer</strong> : le numéro reste, les habilitations repartent à zéro (nouvelle personne).
            <Trash2 className="ml-2 mr-1 inline h-3 w-3 text-rouge" /> <strong>Retirer</strong> : supprime l&apos;agent. Les vrais noms se gèrent dans votre fichier de correspondance, hors de l&apos;appli.
          </p>
        </div>
      )}
    </div>
  );
}
