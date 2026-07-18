"use client";

import { useMemo, useState, useTransition } from "react";
import { saveAuditAction } from "@/app/actions/audit";
import type { Reponse } from "@/lib/types";
import { Check, X, SlashSquare, Save, Loader2, BedDouble, Undo2 } from "lucide-react";

interface ZoneLite { id: string; label: string }
interface ItemLite { id: string; libelle: string; themeId: string }
interface SectionLite { id: string; nom: string; ordre: number; zones: ZoneLite[]; items: ItemLite[] }

const OPTIONS: { value: Reponse; label: string; icon: typeof Check; on: string }[] = [
  { value: "OUI", label: "Conforme", icon: Check, on: "bg-vert text-white border-vert" },
  { value: "NON", label: "Non conf.", icon: X, on: "bg-rouge text-white border-rouge" },
  { value: "NA", label: "N/A", icon: SlashSquare, on: "bg-ardoise-500 text-white border-ardoise-500" },
];

type Valeurs = Record<string, Record<string, Reponse>>;

export default function AuditForm({
  sections,
  grilleId = "g-service",
  grilleNom,
  thematique = false,
}: {
  sections: SectionLite[];
  grilleId?: string;
  grilleNom?: string;
  thematique?: boolean;
}) {
  const [roulement, setRoulement] = useState(thematique ? "Audit thématique" : "1er roulement");
  const [valeurs, setValeurs] = useState<Valeurs>({});
  const [skipped, setSkipped] = useState<string[]>([]); // clés "secId:zoneId"
  const [secId, setSecId] = useState(sections[0].id);
  const section = sections.find((s) => s.id === secId)!;
  const [zoneId, setZoneId] = useState(section.zones[0].id);
  const [pending, startTransition] = useTransition();

  const skipKey = (sid: string, zid: string) => `${sid}:${zid}`;
  const isSkipped = (sid: string, zid: string) => skipped.includes(skipKey(sid, zid));

  const answered = useMemo(() => {
    let o = 0, n = 0, total = 0;
    for (const z of Object.values(valeurs)) for (const v of Object.values(z)) {
      total++;
      if (v === "OUI") o++; else if (v === "NON") n++;
    }
    return { o, n, total };
  }, [valeurs]);
  const score = answered.o + answered.n > 0 ? Math.round((answered.o / (answered.o + answered.n)) * 100) : null;

  function setVal(itemId: string, zid: string, v: Reponse) {
    setValeurs((prev) => ({ ...prev, [itemId]: { ...prev[itemId], [zid]: v } }));
  }
  function selectSection(id: string) {
    setSecId(id);
    const s = sections.find((x) => x.id === id)!;
    setZoneId(s.zones[0].id);
  }
  function toggleSkip(sid: string, zid: string) {
    const key = skipKey(sid, zid);
    if (skipped.includes(key)) {
      setSkipped((s) => s.filter((k) => k !== key));
    } else {
      // marquer inoccupé : on efface les réponses de ce secteur pour cette section
      setSkipped((s) => [...s, key]);
      setValeurs((prev) => {
        const copy = { ...prev };
        for (const it of section.items) {
          if (copy[it.id]) {
            const z = { ...copy[it.id] };
            delete z[zid];
            copy[it.id] = z;
          }
        }
        return copy;
      });
    }
  }

  const zoneAnswered = (zid: string) => section.items.filter((it) => valeurs[it.id]?.[zid]).length;
  const currentSkipped = isSkipped(secId, zoneId);

  function submit() {
    if (answered.total === 0) return;
    startTransition(() => {
      void saveAuditAction(roulement, valeurs, {}, grilleId);
    });
  }

  return (
    <div className="space-y-5 pb-28">
      {/* En-tête sticky */}
      <div className="card sticky top-[68px] z-20 !rounded-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {thematique ? (
              <>
                <p className="text-xs font-semibold text-ardoise-500">Audit thématique</p>
                <p className="mt-1 text-sm font-bold text-marine-900 truncate">{grilleNom}</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-ardoise-500">Roulement audité</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {["1er roulement", "2e roulement"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoulement(r)}
                      className={`rounded-xl px-3 py-1.5 text-sm font-bold ${roulement === r ? "bg-marine-900 text-white" : "bg-ardoise-100 text-marine-800"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-marine-900">{score === null ? "—" : `${score}%`}</div>
            <div className="text-[11px] text-ardoise-500">{answered.total} évalués</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => selectSection(s.id)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${s.id === secId ? "bg-turquoise-500 text-marine-950" : "bg-white text-marine-800 border-2 border-marine-100"}`}
          >
            {s.ordre}. {s.nom}
          </button>
        ))}
      </div>

      {/* Zones */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ardoise-500">Zone / secteur à auditer</p>
        <div className="flex flex-wrap gap-2">
          {section.zones.map((z) => {
            const sk = isSkipped(secId, z.id);
            const a = zoneAnswered(z.id);
            const active = z.id === zoneId;
            return (
              <button
                key={z.id}
                onClick={() => setZoneId(z.id)}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  sk
                    ? "bg-ardoise-100 text-ardoise-400 line-through"
                    : active
                      ? "bg-marine-900 text-white"
                      : "bg-white text-marine-800 border-2 border-marine-100"
                }`}
              >
                {z.label}
                {sk && <span className="ml-1.5 no-underline">💤</span>}
                {!sk && a > 0 && (
                  <span className={`ml-1.5 rounded-md px-1.5 text-xs ${active ? "bg-white/20" : "bg-turquoise-100 text-turquoise-600"}`}>
                    {a}/{section.items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="card">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-marine-900">{section.nom}</h2>
            <p className="text-sm font-semibold text-turquoise-600">
              {section.zones.find((z) => z.id === zoneId)?.label}
            </p>
          </div>
          {!thematique && (
            <button
              onClick={() => toggleSkip(secId, zoneId)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                currentSkipped ? "bg-turquoise-500 text-marine-950" : "bg-ardoise-100 text-ardoise-700"
              }`}
            >
              {currentSkipped ? <Undo2 className="h-4 w-4" /> : <BedDouble className="h-4 w-4" />}
              {currentSkipped ? "Auditer ce secteur" : "Secteur inoccupé"}
            </button>
          )}
        </div>

        {currentSkipped ? (
          <div className="rounded-2xl bg-ardoise-50 px-4 py-8 text-center">
            <BedDouble className="mx-auto mb-2 h-8 w-8 text-ardoise-400" />
            <p className="font-semibold text-ardoise-600">Secteur non audité (chambre inoccupée)</p>
            <p className="text-sm text-ardoise-400">Il n&apos;est pas compté dans le score.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {section.items.map((it) => {
              const val = valeurs[it.id]?.[zoneId];
              return (
                <div key={it.id} className="border-b border-ardoise-100 pb-5 last:border-0 last:pb-0">
                  <p className="mb-3 font-semibold text-marine-900">{it.libelle}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {OPTIONS.map((opt) => {
                      const active = val === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setVal(it.id, zoneId, opt.value)}
                          className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 text-xs font-bold transition active:scale-95 ${active ? opt.on : "bg-white text-ardoise-500 border-ardoise-200"}`}
                        >
                          <Icon className="h-5 w-5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Validation */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ardoise-100 bg-white/95 p-3 backdrop-blur md:pl-60">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-1">
          <div className="flex-1 text-sm">
            <span className="font-bold text-marine-900">Score : {score === null ? "—" : `${score}%`}</span>
            <span className="ml-2 text-xs text-ardoise-500">{answered.total} item(s) évalué(s)</span>
          </div>
          <button onClick={submit} disabled={pending || answered.total === 0} className="btn btn-primary disabled:opacity-50">
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {pending ? "Enregistrement…" : "Valider l'audit"}
          </button>
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>

      <p className="text-center text-xs text-ardoise-400">
        Auditez uniquement les secteurs occupés — marquez les autres « inoccupé ».
      </p>
    </div>
  );
}
