import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import AgentTabBar from "@/components/AgentTabBar";
import BrandMark from "@/components/BrandMark";

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "agent") redirect("/");

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      {/* En-tête */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ardoise-100 bg-white/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <BrandMark size={38} />
          <div className="leading-tight">
            <p className="text-sm font-black text-marine-900 tracking-wide">ALIAVITA · PRISM</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-menthe-600">
              Équipe soignante
            </p>
          </div>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            title="Se déconnecter"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ardoise-500 border border-ardoise-100 hover:bg-ardoise-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </header>

      {/* Contenu */}
      <main className="px-5 pb-28 pt-2">
        {children}
      </main>

      {/* Barre d'onglets permanente */}
      <AgentTabBar />
    </div>
  );
}
