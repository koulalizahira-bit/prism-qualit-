import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { updateProfilAction } from "@/app/actions/profil";
import { User, Building2 } from "lucide-react";

export default async function ProfilPage() {
  const db = await getDb();
  const user = await getCurrentUser();

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-marine-900">
          <User className="h-7 w-7 text-turquoise-500" /> Mon profil
        </h1>
        <p className="text-ardoise-500">Votre identité affichée dans l&apos;application</p>
      </div>

      <section className="card">
        <form action={updateProfilAction} className="space-y-4">
          <div>
            <label className="label-field">Votre nom</label>
            <input
              name="displayName"
              defaultValue={user?.displayName ?? ""}
              placeholder="ex : Cadre de Santé"
              className="input-field"
            />
            <p className="mt-1 text-xs text-ardoise-400">
              Affiché en haut de l&apos;accueil et dans les rapports générés.
            </p>
          </div>

          <div>
            <label className="label-field flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Nom du service
            </label>
            <input
              name="nomService"
              defaultValue={db.config.nomService}
              placeholder="ex : Unité de Soins Intensifs"
              className="input-field"
            />
            <p className="mt-1 text-xs text-ardoise-400">
              Utilisé partout dans l&apos;application et sur les documents exportés.
            </p>
          </div>

          <button className="btn btn-primary">Enregistrer</button>
        </form>
      </section>

      <p className="text-xs text-ardoise-400">
        Pour les autres réglages (objectifs, items d&apos;audit, fiches, formations…), rendez-vous
        dans <strong>Réglages</strong>.
      </p>
    </div>
  );
}
