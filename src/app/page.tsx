import { redirect } from "next/navigation";
import { getCurrentUser, homePathForRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import LoginForm from "@/components/LoginForm";
// Activity icon remplacé par le SVG ECG Alia Vita (identique à Origin)

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(homePathForRole(user.role));

  const db = await getDb();

  const comptesDemo = [
    { label: "Cadre de santé (accès complet)", login: "cadre", pin: "1234" },
    { label: "Cadre supérieur (lecture seule)", login: "superieur", pin: "1234" },
    { label: "Équipe soignante (vue agents)", login: "equipe", pin: "0000" },
  ];

  return (
    <main className="min-h-dvh bg-gradient-to-b from-marine-900 via-marine-800 to-marine-950 flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-md">
        {/* En-tête / marque */}
        <div className="text-center text-white mb-8">
          {/* Icône ECG — identique à Origin */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
               style={{ background: "#0284C7", boxShadow: "0 12px 40px rgba(15,10,30,.55)" }}>
            <svg viewBox="0 0 48 48" fill="none" width="52" height="52">
              <path d="M 3,24 L 10,24 L 15,7 L 20,24 L 24,24 L 27.5,34 L 31,24 L 45,24"
                    stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="45" cy="24" r="3.5" fill="#FCD34D"/>
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            ALIAVITA · PRISM
          </h1>
          <p className="mt-1.5 text-xs font-bold text-turquoise-400 uppercase tracking-[0.2em]">
            Qualité · Certification HAS
          </p>
          <p className="mt-2 text-sm text-marine-100">{db.config.nomEtablissement}</p>
        </div>

        {/* Carte de connexion */}
        <div className="card rounded-[2rem] p-6 sm:p-8">
          <h2 className="mb-6 text-center text-xl font-bold text-marine-900">
            Connexion
          </h2>
          <LoginForm />
        </div>

        {/* Comptes de démonstration */}
        <div className="mt-6 rounded-3xl bg-white/10 p-5 text-white backdrop-blur">
          <p className="mb-3 text-center text-sm font-semibold text-turquoise-100">
            🔑 Comptes de démonstration
          </p>
          <ul className="grid grid-cols-1 gap-2 text-sm">
            {comptesDemo.map((c) => (
              <li
                key={c.login}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
              >
                <span className="text-marine-100">{c.label}</span>
                <span className="flex items-center gap-1.5">
                  <code className="rounded-md bg-marine-950/60 px-2 py-1 font-mono text-turquoise-200">
                    {c.login}
                  </code>
                  <code className="rounded-md bg-marine-950/60 px-2 py-1 font-mono text-turquoise-200">
                    {c.pin}
                  </code>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
