import {
  TYPE_INFO,
  IMPLICATION_INFO,
  MOIS_COURTS,
} from "@/lib/planningData";
import type { PlanningEvent, Implication } from "@/lib/types";
import { CalendarDays, Repeat, Info, CalendarClock, Clock } from "lucide-react";

const MOIS_LONGS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function actif(ev: PlanningEvent, m: number) {
  return ev.mois.length === 0 ? true : ev.mois.includes(m);
}

function ImplicationBadge({ implication }: { implication: Implication }) {
  const info = IMPLICATION_INFO[implication];
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ardoise-500">
      <span className={`h-2.5 w-2.5 rounded-full ${info.cls}`} /> {info.label}
    </span>
  );
}

function EventCard({ ev }: { ev: PlanningEvent }) {
  const ti = TYPE_INFO[ev.type];
  return (
    <div className="rounded-2xl border border-ardoise-100 p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${ti.bg} ${ti.text}`}>
          <span className={`h-2 w-2 rounded-full ${ti.dot}`} /> {ti.label}
        </span>
        <span className="shrink-0 text-[11px] font-semibold text-ardoise-400">{ev.frequence}</span>
      </div>
      <p className="font-semibold text-marine-900">{ev.nom}</p>
      <p className="mt-1 flex items-start gap-1.5 text-sm text-turquoise-700">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-turquoise-500" />
        {ev.pourMoi}
      </p>
      <div className="mt-2">
        <ImplicationBadge implication={ev.implication} />
      </div>
    </div>
  );
}

export default function CalendrierQualite({ events }: { events: PlanningEvent[] }) {
  const moisCourant = new Date().getMonth() + 1;
  const anneeCourante = new Date().getFullYear();
  const continus = events.filter((e) => e.mois.length === 0);
  const dates = events.filter((e) => e.mois.length > 0);
  const ceMois = events.filter((e) => actif(e, moisCourant));

  // Séances datées (dates prévues) à venir
  const ajd = new Date();
  ajd.setHours(0, 0, 0, 0);
  const seances = events
    .flatMap((e) => (e.seances ?? []).map((s) => ({ ...s, event: e })))
    .filter((s) => new Date(s.date) >= ajd)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "long" });

  return (
    <div className="space-y-6">
      {/* Légende */}
      <div className="card flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-sm font-bold text-marine-900">Légende :</span>
        {Object.values(TYPE_INFO).map((t) => (
          <span key={t.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ardoise-600">
            <span className={`h-3 w-3 rounded-full ${t.dot}`} /> {t.label}
          </span>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-ardoise-200 sm:block" />
        {Object.values(IMPLICATION_INFO).map((i) => (
          <span key={i.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ardoise-500">
            <span className={`h-3 w-3 rounded-full ${i.cls}`} /> {i.label}
          </span>
        ))}
      </div>

      {/* Ce mois-ci */}
      <div className="rounded-3xl bg-gradient-to-br from-marine-900 to-marine-700 p-5 text-white shadow-lg">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <CalendarDays className="h-5 w-5 text-turquoise-300" /> Ce mois-ci — {MOIS_LONGS[moisCourant - 1]} {anneeCourante}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {ceMois.map((e) => {
            const ti = TYPE_INFO[e.type];
            return (
              <span key={e.id} className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold">
                <span className={`h-2 w-2 rounded-full ${ti.dot}`} /> {e.nom}
              </span>
            );
          })}
        </div>
      </div>

      {/* Prochaines dates programmées (séances) */}
      <div className="card">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-marine-900">
          <CalendarClock className="h-5 w-5 text-turquoise-500" /> Prochaines dates programmées
        </h2>
        <p className="mb-3 text-sm text-ardoise-500">Les dates précises connues (ajoutées dans Réglages → Calendrier)</p>
        {seances.length === 0 ? (
          <p className="rounded-2xl bg-ardoise-50 px-4 py-5 text-center text-sm text-ardoise-500">
            Aucune date programmée pour le moment.
          </p>
        ) : (
          <ul className="space-y-2">
            {seances.map((s) => {
              const ti = TYPE_INFO[s.event.type];
              return (
                <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-ardoise-100 p-3">
                  <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl text-white ${ti.dot}`}>
                    <span className="text-base font-extrabold leading-none">{new Date(s.date + "T00:00:00").getDate()}</span>
                    <span className="text-[10px] uppercase">{MOIS_COURTS[new Date(s.date + "T00:00:00").getMonth()]}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-marine-900">{s.event.nom}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-sm text-ardoise-500">
                      <span className="capitalize">{fmtDate(s.date)}</span>
                      {s.heure && <span className="inline-flex items-center gap-1 font-semibold text-turquoise-600"><Clock className="h-3.5 w-3.5" />{s.heure}</span>}
                      {s.note && <span>· {s.note}</span>}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Grille annuelle — ordinateur */}
      <div className="card hidden !p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ardoise-100">
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-bold text-marine-900" style={{ minWidth: 280 }}>
                  Temps fort qualité
                </th>
                {MOIS_COURTS.map((m, i) => (
                  <th key={m} className={`px-1 py-3 text-center text-xs font-bold ${i + 1 === moisCourant ? "bg-turquoise-50 text-turquoise-700" : "text-ardoise-500"}`}>
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...continus, ...dates].map((ev) => {
                const ti = TYPE_INFO[ev.type];
                return (
                  <tr key={ev.id} className="border-b border-ardoise-50 last:border-0">
                    <td className="sticky left-0 z-10 bg-white px-4 py-2.5">
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${ti.dot}`} />
                        <span className="font-semibold text-marine-900">{ev.nom}</span>
                      </span>
                      <span className="ml-4 text-[11px] text-ardoise-400">{ev.frequence} · {ev.pilote}</span>
                    </td>
                    {MOIS_COURTS.map((_, i) => {
                      const on = actif(ev, i + 1);
                      const isCur = i + 1 === moisCourant;
                      return (
                        <td key={i} className={`px-1 py-2.5 text-center ${isCur ? "bg-turquoise-50/60" : ""}`}>
                          {on && <span className={`mx-auto block h-4 w-4 rounded-md ${ti.dot}`} />}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frise par mois — téléphone */}
      <div className="space-y-5 md:hidden">
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-bold text-marine-900">
            <Repeat className="h-4 w-4 text-turquoise-500" /> En continu chaque mois
          </h3>
          <div className="space-y-2.5">
            {continus.map((e) => <EventCard key={e.id} ev={e} />)}
          </div>
        </div>

        {MOIS_COURTS.map((mLabel, idx) => {
          const m = idx + 1;
          const evs = dates.filter((e) => e.mois.includes(m));
          if (evs.length === 0) return null;
          const isCur = m === moisCourant;
          return (
            <div key={m}>
              <h3 className={`mb-2 flex items-center gap-2 font-bold ${isCur ? "text-turquoise-600" : "text-marine-900"}`}>
                <span className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-sm ${isCur ? "bg-turquoise-500 text-marine-950" : "bg-marine-900 text-white"}`}>
                  {mLabel}
                </span>
                {isCur && <span className="text-xs font-semibold text-turquoise-600">ce mois-ci</span>}
              </h3>
              <div className="space-y-2.5">
                {evs.map((e) => <EventCard key={e.id} ev={e} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
