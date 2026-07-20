import { getDb } from "@/lib/db";
import {
  updateConfigAction,
  addFicheAction,
  deleteFicheAction,
  addItemAction,
  deleteItemAction,
} from "@/app/actions/content";
import {
  addFormationAction,
  updateFormationAction,
  deleteFormationAction,
} from "@/app/actions/formations";
import {
  addSeanceAction,
  deleteSeanceAction,
  addEventAction,
  deleteEventAction,
  addAgentAction,
  deleteAgentAction,
} from "@/app/actions/planning";
import { Settings, ListChecks, BookOpen, Plus, Trash2, GraduationCap, CalendarClock, Users, DownloadCloud } from "lucide-react";

export default async function ContenuPage() {
  const db = await getDb();
  const themes = db.thematiques.slice().sort((a, b) => a.ordre - b.ordre);
  const sections = db.sections.slice().sort((a, b) => a.ordre - b.ordre);
  const themeName = (id: string) => themes.find((t) => t.id === id)?.nom ?? "—";
  const seances = db.planning
    .flatMap((e) => (e.seances ?? []).map((s) => ({ ...s, event: e })))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <Settings className="h-7 w-7 text-turquoise-500" /> Paramétrage
        </h1>
        <p className="text-ardoise-500">Seuils, items des tours d&apos;audit et fiches pratiques</p>
      </div>

      {/* PARAMÈTRES */}
      <section className="card">
        <h2 className="mb-4 text-lg font-bold text-marine-900">Paramètres du service</h2>
        <form action={updateConfigAction} className="grid gap-4 sm:grid-cols-2">
          {/* Le nom du service se règle désormais depuis Mon profil — on le repasse tel quel. */}
          <input type="hidden" name="nomService" value={db.config.nomService} />
          <div className="sm:col-span-2">
            <label className="label-field">Établissement / pôle</label>
            <input name="nomEtablissement" defaultValue={db.config.nomEtablissement} className="input-field" />
          </div>
          <div>
            <label className="label-field">Objectif HAS (%)</label>
            <input name="objectif" type="number" min={0} max={100} defaultValue={db.config.objectif} className="input-field" />
          </div>
          <div>
            <label className="label-field">Audits / mois visés</label>
            <input name="objectifAuditsMois" type="number" min={0} defaultValue={db.config.objectifAuditsMois} className="input-field" />
          </div>
          <div>
            <label className="label-field">Statut vert si ≥ (%)</label>
            <input name="statutVert" type="number" min={0} max={100} defaultValue={db.config.statutVert} className="input-field" />
          </div>
          <div>
            <label className="label-field">Statut orange si ≥ (%)</label>
            <input name="statutOrange" type="number" min={0} max={100} defaultValue={db.config.statutOrange} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <button className="btn btn-primary">Enregistrer les paramètres</button>
          </div>
        </form>
      </section>

      {/* SAUVEGARDE */}
      <section className="card">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-marine-900">
          <DownloadCloud className="h-5 w-5 text-turquoise-500" /> Sauvegarde
        </h2>
        <p className="mb-4 text-sm text-ardoise-500">
          Téléchargez une copie complète de toutes les données de l&apos;application (audits, PAQSS,
          effectif, formations, planning…) au format JSON.
        </p>
        <a
          href="/api/export-donnees"
          download
          className="btn btn-ghost inline-flex w-fit !min-h-[44px]"
        >
          <DownloadCloud className="h-4 w-4" /> Exporter toutes les données
        </a>
      </section>

      {/* ITEMS PAR TOUR */}
      <section className="card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-marine-900">
          <ListChecks className="h-5 w-5 text-turquoise-500" /> Items des tours d&apos;audit
        </h2>
        <div className="space-y-4">
          {sections.map((s) => (
            <details key={s.id} className="rounded-2xl border border-ardoise-100 p-4">
              <summary className="cursor-pointer font-bold text-marine-900">
                {s.ordre}. {s.nom}{" "}
                <span className="text-sm font-normal text-ardoise-500">({s.items.length} items · {s.zones.length} zones)</span>
              </summary>
              <ul className="mt-3 space-y-2">
                {s.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-2 rounded-xl bg-ardoise-50 px-3 py-2">
                    <span className="min-w-0">
                      <span className="block text-sm text-marine-900">{it.libelle}</span>
                      <span className="text-xs text-turquoise-600">{themeName(it.themeId)}</span>
                    </span>
                    <form action={deleteItemAction}>
                      <input type="hidden" name="itemId" value={it.id} />
                      <button className="text-rouge hover:opacity-70" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                    </form>
                  </li>
                ))}
              </ul>
              <form action={addItemAction} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <input type="hidden" name="sectionId" value={s.id} />
                <input name="libelle" placeholder="Nouvel item…" className="input-field !min-h-[44px] !text-base" required />
                <select name="themeId" className="input-field !min-h-[44px] !text-base" required>
                  {themes.map((t) => (
                    <option key={t.id} value={t.id}>{t.nom}</option>
                  ))}
                </select>
                <button className="btn btn-ghost !min-h-[44px]"><Plus className="h-4 w-4" /></button>
              </form>
            </details>
          ))}
        </div>
      </section>

      {/* FICHES */}
      <section className="card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-marine-900">
          <BookOpen className="h-5 w-5 text-turquoise-500" /> Fiches pratiques
        </h2>
        <form action={addFicheAction} className="grid gap-3 rounded-2xl bg-ardoise-50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-field">Thématique</label>
              <select name="themeId" className="input-field" required>
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Titre de la fiche</label>
              <input name="titre" className="input-field" required />
            </div>
          </div>
          <div>
            <label className="label-field">Résumé</label>
            <input name="resume" className="input-field" />
          </div>
          <div>
            <label className="label-field">Contenu (une ligne = un point)</label>
            <textarea name="contenu" rows={4} className="input-field !min-h-[110px] py-3" />
          </div>
          <button className="btn btn-turquoise w-full sm:w-auto"><Plus className="h-5 w-5" /> Ajouter la fiche</button>
        </form>

        <ul className="mt-5 space-y-2">
          {db.fiches.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-2 rounded-xl border border-ardoise-100 px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate font-semibold text-marine-900">{f.titre}</span>
                <span className="text-xs text-ardoise-500">{themeName(f.themeId)}</span>
              </span>
              <form action={deleteFicheAction}>
                <input type="hidden" name="id" value={f.id} />
                <button className="text-rouge hover:opacity-70" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {/* FORMATIONS */}
      <section className="card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-marine-900">
          <GraduationCap className="h-5 w-5 text-turquoise-500" /> Formations suivies
        </h2>

        <div className="space-y-3">
          {db.formations.map((f) => (
            <form
              key={f.id}
              action={updateFormationAction}
              className="grid gap-2 rounded-2xl border border-ardoise-100 p-3 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-center"
            >
              <input type="hidden" name="id" value={f.id} />
              <input name="nom" defaultValue={f.nom} className="input-field !min-h-[42px] !text-base" />
              <select name="priorite" defaultValue={f.priorite ?? "standard"} className="input-field !min-h-[42px] !text-base">
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="standard">Standard</option>
              </select>
              <input name="frequence" defaultValue={f.frequence ?? ""} placeholder="Fréquence" className="input-field !min-h-[42px] !text-base sm:w-36" />
              <div className="flex items-center gap-1">
                <input name="objectif" type="number" min={0} max={100} defaultValue={f.objectif} className="input-field !min-h-[42px] w-20 !text-base" />
                <span className="text-sm text-ardoise-500">%</span>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost !min-h-[42px] !px-3 !text-sm">Enregistrer</button>
              </div>
            </form>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ardoise-100 pt-4">
          {db.formations.map((f) => (
            <form key={f.id} action={deleteFormationAction}>
              <input type="hidden" name="id" value={f.id} />
              <button className="inline-flex items-center gap-1 rounded-xl bg-rouge-soft px-3 py-1.5 text-xs font-semibold text-rouge hover:opacity-80">
                <Trash2 className="h-3.5 w-3.5" /> {f.nom}
              </button>
            </form>
          ))}
        </div>

        <form action={addFormationAction} className="mt-5 grid gap-2 rounded-2xl bg-ardoise-50 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
          <input name="nom" placeholder="Nouvelle formation…" className="input-field !min-h-[44px] !text-base" required />
          <select name="priorite" defaultValue="standard" className="input-field !min-h-[44px] !text-base">
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="standard">Standard</option>
          </select>
          <div className="flex items-center gap-1">
            <input name="objectif" type="number" min={0} max={100} defaultValue={80} className="input-field !min-h-[44px] w-20 !text-base" />
            <span className="text-sm text-ardoise-500">%</span>
          </div>
          <button className="btn btn-turquoise !min-h-[44px]"><Plus className="h-5 w-5" /> Ajouter</button>
        </form>
        <p className="mt-2 text-xs text-ardoise-400">
          La suppression d&apos;une formation retire aussi son suivi pour tous les agents.
        </p>
      </section>

      {/* CALENDRIER */}
      <section className="card">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-marine-900">
          <CalendarClock className="h-5 w-5 text-turquoise-500" /> Calendrier — dates programmées
        </h2>
        <p className="mb-4 text-sm text-ardoise-500">
          Ajoutez une date précise (avec heure) dès que vous la connaissez — elle apparaît dans « Prochaines dates » et « Ce mois-ci ».
        </p>

        <form action={addSeanceAction} className="grid gap-2 rounded-2xl bg-ardoise-50 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
          <select name="eventId" className="input-field !min-h-[44px] !text-base" required>
            {db.planning.map((e) => (
              <option key={e.id} value={e.id}>{e.nom}</option>
            ))}
          </select>
          <input name="date" type="date" className="input-field !min-h-[44px] !text-base" required />
          <input name="heure" type="time" className="input-field !min-h-[44px] !text-base" />
          <button className="btn btn-turquoise !min-h-[44px]"><Plus className="h-5 w-5" /> Ajouter</button>
          <input name="note" placeholder="Note (optionnel, ex. salle de staff)" className="input-field !min-h-[44px] !text-base sm:col-span-4" />
        </form>

        <ul className="mt-4 space-y-2">
          {seances.length === 0 && <li className="text-sm text-ardoise-400">Aucune date programmée.</li>}
          {seances.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2 rounded-xl border border-ardoise-100 px-3 py-2">
              <span className="text-sm">
                <span className="font-semibold text-marine-900">{s.event.nom}</span>
                <span className="ml-2 text-ardoise-500">
                  {new Date(s.date + "T00:00:00").toLocaleDateString("fr-FR")} {s.heure ?? ""} {s.note ? "· " + s.note : ""}
                </span>
              </span>
              <form action={deleteSeanceAction}>
                <input type="hidden" name="eventId" value={s.event.id} />
                <input type="hidden" name="seanceId" value={s.id} />
                <button className="text-rouge hover:opacity-70" title="Supprimer"><Trash2 className="h-4 w-4" /></button>
              </form>
            </li>
          ))}
        </ul>

        <details className="mt-5 border-t border-ardoise-100 pt-4">
          <summary className="cursor-pointer text-sm font-bold text-marine-900">Ajouter / supprimer un temps fort</summary>
          <form action={addEventAction} className="mt-3 grid gap-2 sm:grid-cols-2">
            <input name="nom" placeholder="Nom du temps fort" className="input-field !min-h-[44px] !text-base sm:col-span-2" required />
            <select name="type" className="input-field !min-h-[44px] !text-base">
              <option value="audit">Audit</option><option value="crex">CREX / EI</option><option value="certif">Certif-dating</option>
              <option value="reunion">Réunion</option><option value="groupe">Groupe de travail</option><option value="exercice">Exercice SSE</option><option value="info">Temps fort</option>
            </select>
            <select name="portee" className="input-field !min-h-[44px] !text-base">
              <option value="service">Service</option><option value="chu">Établissement</option>
            </select>
            <input name="frequence" placeholder="Fréquence (ex. Trimestriel)" className="input-field !min-h-[44px] !text-base" />
            <input name="mois" placeholder="Mois (ex. 3, 6, 9, 12 — vide = chaque mois)" className="input-field !min-h-[44px] !text-base" />
            <select name="implication" className="input-field !min-h-[44px] !text-base">
              <option value="realisation">Réalisé par le service</option><option value="participation">Participation</option><option value="tiers">Réalisé par un tiers</option>
            </select>
            <input name="pilote" placeholder="Pilote" className="input-field !min-h-[44px] !text-base" />
            <input name="pourMoi" placeholder="Ce que ça implique pour l'agent" className="input-field !min-h-[44px] !text-base sm:col-span-2" />
            <button className="btn btn-ghost !min-h-[44px] sm:col-span-2"><Plus className="h-5 w-5" /> Ajouter le temps fort</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {db.planning.map((e) => (
              <form key={e.id} action={deleteEventAction}>
                <input type="hidden" name="id" value={e.id} />
                <button className="inline-flex items-center gap-1 rounded-xl bg-rouge-soft px-3 py-1.5 text-xs font-semibold text-rouge hover:opacity-80">
                  <Trash2 className="h-3.5 w-3.5" /> {e.nom}
                </button>
              </form>
            ))}
          </div>
        </details>
      </section>

      {/* AGENTS */}
      <section className="card">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-marine-900">
          <Users className="h-5 w-5 text-turquoise-500" /> Effectif (arrivée / départ)
        </h2>
        <p className="mb-4 text-sm text-ardoise-500">
          Ajoutez un agent à l&apos;arrivée (numéroté automatiquement) ou retirez-le au départ.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {(["IDE", "AS", "ASH"] as const).map((r) => (
            <form key={r} action={addAgentAction}>
              <input type="hidden" name="role" value={r} />
              <button className="btn btn-turquoise !min-h-[44px] !text-base"><Plus className="h-4 w-4" /> {r}</button>
            </form>
          ))}
        </div>
        {(["IDE", "AS", "ASH"] as const).map((r) => {
          const list = db.agents.filter((a) => a.role === r).sort((a, b) => a.numero - b.numero);
          return (
            <details key={r} className="mb-2 rounded-2xl border border-ardoise-100 p-3">
              <summary className="cursor-pointer font-bold text-marine-900">{r} <span className="text-sm font-normal text-ardoise-500">({list.length})</span></summary>
              <div className="mt-3 flex flex-wrap gap-2">
                {list.map((a) => (
                  <form key={a.id} action={deleteAgentAction} className="inline-flex">
                    <input type="hidden" name="id" value={a.id} />
                    <button className="inline-flex items-center gap-1 rounded-xl bg-ardoise-50 px-2.5 py-1.5 text-xs font-semibold text-marine-800 hover:bg-rouge-soft hover:text-rouge" title="Retirer cet agent">
                      {a.label} <Trash2 className="h-3 w-3" />
                    </button>
                  </form>
                ))}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
