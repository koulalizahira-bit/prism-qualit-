import { redirect } from "next/navigation";
import { getCurrentUser, homePathForRole } from "@/lib/auth";
import NavShell, { type NavItem } from "@/components/NavShell";

// Navigation principale — l'ordre suit le déroulé du travail : je constate (Accueil),
// j'audite, j'agis (Démarche), je forme l'équipe, je consulte les fiches, je prépare la certif.
const CADRE_ITEMS: NavItem[] = [
  { href: "/cadre", label: "Accueil", icon: "dashboard" },
  { href: "/cadre/audit", label: "Audit", icon: "audit", primary: true },
  { href: "/cadre/paqss", label: "Démarche", icon: "paqss" },
  { href: "/cadre/equipe", label: "Formation", icon: "equipe" },
  { href: "/cadre/fiches", label: "Fiches", icon: "fiches" },
  { href: "/cadre/certif", label: "Certification", icon: "has" },
];

// Menu déroulant (compte) — accès secondaire, moins fréquent au quotidien.
const CADRE_SECONDARY: NavItem[] = [
  { href: "/cadre/profil", label: "Mon profil", icon: "profil" },
  { href: "/cadre/rapports", label: "Rapports", icon: "rapports" },
  { href: "/cadre/quiz", label: "Quiz de l'équipe", icon: "quiz" },
  { href: "/cadre/calendrier", label: "Calendrier", icon: "calendrier" },
  { href: "/cadre/affiche", label: "Affiche A3", icon: "affiche" },
  { href: "/cadre/visite", label: "Visite guidée", icon: "visite" },
  { href: "/cadre/contenu", label: "Réglages", icon: "contenu" },
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
      secondary={CADRE_SECONDARY}
      brand="Espace Cadre"
      userName={user.displayName}
      roleLabel="Cadre de santé"
    >
      {children}
    </NavShell>
  );
}
