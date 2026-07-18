import type { Statut } from "./scoring";

// Classes Tailwind associées à chaque statut.
export const statutBg: Record<Statut, string> = {
  vert: "bg-vert",
  orange: "bg-orange",
  rouge: "bg-rouge",
};
export const statutText: Record<Statut, string> = {
  vert: "text-vert",
  orange: "text-orange",
  rouge: "text-rouge",
};
export const statutSoft: Record<Statut, string> = {
  vert: "bg-vert-soft text-vert",
  orange: "bg-orange-soft text-orange",
  rouge: "bg-rouge-soft text-rouge",
};
export const statutHex: Record<Statut, string> = {
  vert: "#16a34a",
  orange: "#f59e0b",
  rouge: "#dc2626",
};
export const statutLabel: Record<Statut, string> = {
  vert: "Conforme",
  orange: "À surveiller",
  rouge: "Non conforme",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateCourt(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function scoreOrTiret(s: number | null): string {
  return s === null ? "—" : `${s}%`;
}
