"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import BrandMark from "./BrandMark";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  Settings,
  FileText,
  LogOut,
  User as UserIcon,
  Target,
  Compass,
  GraduationCap,
  CalendarDays,
  Printer,
  ShieldCheck,
  Trophy,
  BookOpenCheck,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  agents: Users,
  equipe: GraduationCap,
  audit: ClipboardCheck,
  fiches: BookOpen,
  contenu: Settings,
  rapports: FileText,
  profil: UserIcon,
  progression: Target,
  paqss: Compass,
  calendrier: CalendarDays,
  affiche: Printer,
  has: ShieldCheck,
  quiz: Trophy,
  referentiel: BookOpenCheck,
};

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  primary?: boolean; // mis en avant (ex : audit)
}

export default function NavShell({
  items,
  brand,
  userName,
  roleLabel,
  children,
}: {
  items: NavItem[];
  brand: string;
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === items[0].href;

  // Détermine l'onglet actif (en évitant que l'accueil soit actif partout)
  const active = (href: string) => {
    if (pathname === href) return true;
    if (href.split("/").length > 2 && pathname.startsWith(href)) return true;
    return false;
  };

  // 4 onglets fixes + un 5e slot qui bascule sur la page active si elle
  // n'est pas déjà visible, pour que la barre du bas reflète toujours où on est.
  const fixedBottom = items.slice(0, 4);
  const activeExtra = items.slice(4).find((it) => active(it.href));
  const bottomItems = [...fixedBottom, activeExtra ?? items[4]].filter(Boolean);

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      {/* En-tête — clair, identique à l'espace agent */}
      <header className="sticky top-0 z-30 border-b border-ardoise-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            {!isHome && (
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Revenir à la page précédente"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-ardoise-100 bg-white text-marine-800 hover:bg-ardoise-50"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Link href={items[0].href} className="flex items-center gap-2.5">
              <BrandMark size={38} />
              <span className="leading-tight">
                <span className="block text-sm font-black tracking-wide text-marine-900">
                  ALIAVITA · PRISM
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-menthe-600">
                  Qualité · Certification
                </span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold leading-tight text-marine-900">{userName}</div>
              <div className="text-[11px] text-ardoise-500">{roleLabel}</div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Se déconnecter"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-ardoise-100 bg-white text-ardoise-500 hover:bg-ardoise-50"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        {/* Barre latérale (ordinateur) */}
        <aside className="hidden md:block w-60 shrink-0 px-3 py-6">
          <nav className="sticky top-20 space-y-1">
            {items.map((it) => {
              const Icon = ICONS[it.icon];
              const on = active(it.href) || (it.href === items[0].href && pathname === it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                    on
                      ? "bg-menthe-100 text-menthe-700"
                      : "text-marine-800 hover:bg-ardoise-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Contenu */}
        <main className="min-w-0 flex-1 px-4 pb-28 pt-5 md:px-6 md:pb-10">
          {children}
        </main>
      </div>

      {/* Barre de navigation (téléphone) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ardoise-100 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {bottomItems.map((it) => {
            const Icon = ICONS[it.icon];
            const on = active(it.href) || (it.href === items[0].href && pathname === it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className="flex flex-col items-center gap-1 py-2.5"
              >
                <span
                  className={`flex h-9 w-11 items-center justify-center rounded-xl ${
                    on ? "bg-menthe-100 text-menthe-700" : "text-ardoise-400"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`text-[10px] font-semibold ${on ? "text-menthe-700" : "text-ardoise-400"}`}>
                  {it.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </nav>
    </div>
  );
}
