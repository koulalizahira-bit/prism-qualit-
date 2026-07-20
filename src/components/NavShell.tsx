"use client";

import { useState } from "react";
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
  ChevronDown,
  Sparkles,
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
  visite: Sparkles,
};

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  primary?: boolean; // mis en avant (ex : audit)
}

export default function NavShell({
  items,
  secondary = [],
  brand,
  userName,
  roleLabel,
  children,
}: {
  items: NavItem[];
  secondary?: NavItem[];
  brand: string;
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === items[0].href;
  const [menuOpen, setMenuOpen] = useState(false);

  // Détermine l'onglet actif (en évitant que l'accueil soit actif partout)
  const active = (href: string) => {
    if (pathname === href) return true;
    if (href.split("/").length > 2 && pathname.startsWith(href)) return true;
    return false;
  };

  const onSecondary = secondary.some((it) => active(it.href));

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

          {/* Menu compte — profil, rapports, quiz, réglages… */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              className={`flex items-center gap-2.5 rounded-2xl border px-2.5 py-1.5 transition ${
                menuOpen || onSecondary
                  ? "border-menthe-200 bg-menthe-50"
                  : "border-ardoise-100 bg-white hover:bg-ardoise-50"
              }`}
            >
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold leading-tight text-marine-900">{userName}</span>
                <span className="block text-[11px] text-ardoise-500">{roleLabel}</span>
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-marine-900 text-white">
                <UserIcon className="h-4.5 w-4.5" />
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-ardoise-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-ardoise-100 bg-white shadow-xl">
                  <div className="border-b border-ardoise-100 px-4 py-3 sm:hidden">
                    <p className="text-sm font-semibold text-marine-900">{userName}</p>
                    <p className="text-[11px] text-ardoise-500">{roleLabel}</p>
                  </div>
                  <nav className="py-1.5">
                    {secondary.map((it) => {
                      const Icon = ICONS[it.icon];
                      const on = active(it.href);
                      return (
                        <Link
                          key={it.href}
                          href={it.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition ${
                            on ? "bg-menthe-50 text-menthe-700" : "text-marine-800 hover:bg-ardoise-50"
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5" />
                          {it.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <form action={logoutAction} className="border-t border-ardoise-100 py-1.5">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rouge hover:bg-rouge-soft/40"
                    >
                      <LogOut className="h-4.5 w-4.5" />
                      Se déconnecter
                    </button>
                  </form>
                </div>
              </>
            )}
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
        <div
          className="mx-auto grid max-w-md"
          style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        >
          {items.map((it) => {
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
