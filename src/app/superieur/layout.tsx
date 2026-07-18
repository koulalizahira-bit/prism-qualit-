import { redirect } from "next/navigation";
import { getCurrentUser, homePathForRole } from "@/lib/auth";
import NavShell, { type NavItem } from "@/components/NavShell";

const ITEMS: NavItem[] = [
  { href: "/superieur", label: "Synthèse", icon: "dashboard" },
  { href: "/superieur/paqss", label: "Démarche", icon: "paqss" },
  { href: "/superieur/calendrier", label: "Calendrier", icon: "calendrier" },
  { href: "/superieur/fiches", label: "Fiches", icon: "fiches" },
];

export default async function SuperieurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (user.role !== "superieur") redirect(homePathForRole(user.role));

  return (
    <NavShell
      items={ITEMS}
      brand="Espace Supérieur"
      userName={user.displayName}
      roleLabel="Cadre supérieur"
    >
      {children}
    </NavShell>
  );
}
