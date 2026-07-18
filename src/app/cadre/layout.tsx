import { redirect } from "next/navigation";
import { getCurrentUser, homePathForRole } from "@/lib/auth";
import NavShell, { type NavItem } from "@/components/NavShell";

const CADRE_ITEMS: NavItem[] = [
  { href: "/cadre", label: "Accueil", icon: "dashboard" },
  { href: "/cadre/audit", label: "Audit", icon: "audit", primary: true },
  { href: "/cadre/paqss", label: "Démarche", icon: "paqss" },
  { href: "/cadre/equipe", label: "Formation", icon: "equipe" },
  { href: "/cadre/certif", label: "Certification", icon: "has" },   // ← visible mobile (pos. 5)
  { href: "/cadre/fiches", label: "Fiches", icon: "fiches" },
  { href: "/cadre/calendrier", label: "Calendrier", icon: "calendrier" },
  { href: "/cadre/contenu", label: "Réglages", icon: "contenu" },
  { href: "/cadre/rapports", label: "Rapports", icon: "rapports" },
  { href: "/cadre/affiche", label: "Affiche A3", icon: "affiche" },
  { href: "/cadre/quiz", label: "Quiz", icon: "quiz" },
];

export default async function CadreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "cadre") redirect(homePathForRole(user.role));

  return (
    <NavShell
      items={CADRE_ITEMS}
      brand="Espace Cadre"
      userName={user.displayName}
      roleLabel="Cadre de santé"
    >
      {children}
    </NavShell>
  );
}
