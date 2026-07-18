"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShieldCheck, BookOpen, Trophy, type LucideIcon } from "lucide-react";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
  // préfixes d'URL qui doivent activer cet onglet
  match: string[];
  exact?: boolean;
}

const TABS: Tab[] = [
  { href: "/agent", label: "Accueil", icon: Home, match: [], exact: true },
  // Certif regroupe le référentiel, les méthodes et le quiz
  { href: "/agent/certif", label: "Certif", icon: ShieldCheck, match: ["/agent/certif", "/agent/referentiel", "/agent/methodes", "/agent/quiz"] },
  { href: "/agent/fiches", label: "Fiches", icon: BookOpen, match: ["/agent/fiches"] },
  { href: "/agent/quiz", label: "Quiz", icon: Trophy, match: ["/agent/quiz"] },
];

export default function AgentTabBar() {
  const pathname = usePathname();

  const isActive = (t: Tab) => {
    if (t.exact) return pathname === t.href;
    // Quiz est aussi dans Certif : on privilégie l'onglet Quiz quand on y est
    if (t.href === "/agent/certif" && pathname.startsWith("/agent/quiz")) return false;
    return t.match.some((m) => pathname === m || pathname.startsWith(m + "/")) || pathname === t.href || pathname.startsWith(t.href + "/");
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ardoise-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = isActive(t);
          return (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span
                className={`flex h-9 w-11 items-center justify-center rounded-xl transition-colors ${
                  on ? "bg-menthe-100 text-menthe-700" : "text-ardoise-400"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={on ? 2.4 : 2} />
              </span>
              <span
                className={`text-[10px] font-semibold ${on ? "text-menthe-700" : "text-ardoise-400"}`}
              >
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
