import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { StatutAction } from "./types";

const MARINE: [number, number, number] = [11, 36, 71];
const TURQUOISE: [number, number, number] = [20, 184, 196];

export interface GrilleCoveragePdf {
  nom: string;
  type: "service" | "thematique";
  score: number | null;
  date: string | null;
}

export interface ServicePdfData {
  etablissement: string;
  service: string;
  date: string;
  conformite: number | null;
  objectif: number;
  dernierAudit: string;
  evolution: { label: string; score: number }[];
  themes: { nom: string; score: number | null }[];
  sections: { nom: string; score: number | null }[];
  grilles: GrilleCoveragePdf[];
  alertes: { nom: string; score: number | null }[];
  formations: { nom: string; pct: number | null; objectif: number }[];
}

function grillesTable(doc: jsPDF, y: number, grilles: GrilleCoveragePdf[]): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...MARINE);
  doc.text("Couverture des audits (service + thématiques)", 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [["Audit", "Type", "Score", "Dernière réalisation"]],
    body: grilles.map((g) => [
      g.nom,
      g.type === "service" ? "Service" : "Thématique",
      fmt(g.score),
      g.date ?? "Non réalisé",
    ]),
    headStyles: { fillColor: MARINE, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 1: { halign: "center", cellWidth: 26 }, 2: { halign: "center", cellWidth: 20 }, 3: { halign: "center", cellWidth: 36 } },
  });
  return finalY(doc) + 8;
}

function header(doc: jsPDF, titre: string, sousTitre: string) {
  doc.setFillColor(...MARINE);
  doc.rect(0, 0, 210, 30, "F");
  doc.setFillColor(...TURQUOISE);
  doc.rect(0, 30, 210, 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(titre, 14, 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(sousTitre, 14, 23);
}

function footer(doc: jsPDF) {
  const n = doc.getNumberOfPages();
  for (let i = 1; i <= n; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Document généré par l'application Qualité Soins Intensifs — usage interne", 14, 290);
    doc.text(`Page ${i}/${n}`, 196, 290, { align: "right" });
  }
}

const fmt = (s: number | null) => (s === null ? "—" : `${s}%`);
const finalY = (doc: jsPDF) => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

export function generateServicePdf(d: ServicePdfData) {
  const doc = new jsPDF();
  header(doc, "Rapport qualité du service", `${d.etablissement} — ${d.service}`);

  doc.setTextColor(80);
  doc.setFontSize(10);
  doc.text(`Édité le ${d.date}  ·  Dernier audit : ${d.dernierAudit}`, 14, 44);

  // Bloc conformité
  doc.setFillColor(238, 243, 251);
  doc.roundedRect(14, 50, 182, 22, 3, 3, "F");
  doc.setTextColor(...MARINE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(fmt(d.conformite), 24, 64);
  doc.setFontSize(11);
  doc.text(`Conformité globale du service  ·  Objectif HAS : ${d.objectif}%`, 55, 64);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Conformité par thématique HAS", 14, 82);
  autoTable(doc, {
    startY: 86,
    head: [["Thématique HAS", "Score"]],
    body: d.themes.map((t) => [t.nom, fmt(t.score)]),
    headStyles: { fillColor: MARINE, fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 1: { halign: "center", cellWidth: 30 } },
  });

  let y = finalY(doc) + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Conformité par tour d'audit (audit service)", 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [["Tour", "Score"]],
    body: d.sections.map((s) => [s.nom, fmt(s.score)]),
    headStyles: { fillColor: MARINE, fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 1: { halign: "center", cellWidth: 30 } },
  });

  y = grillesTable(doc, finalY(doc) + 8, d.grilles);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Évolution des audits", 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [["Audit", ...d.evolution.map((h) => h.label)]],
    body: [["Conformité", ...d.evolution.map((h) => `${h.score}%`)]],
    headStyles: { fillColor: TURQUOISE, textColor: MARINE, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
  });

  y = finalY(doc) + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Plan d'action — thématiques sous l'objectif", 14, y);
  if (d.alertes.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 74);
    doc.text("Toutes les thématiques atteignent l'objectif.", 14, y + 7);
  } else {
    autoTable(doc, {
      startY: y + 3,
      head: [["Thématique à renforcer", "Score"]],
      body: d.alertes.map((a) => [a.nom, fmt(a.score)]),
      headStyles: { fillColor: [220, 38, 38], fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 1: { halign: "center", cellWidth: 30 } },
    });
  }

  if (d.formations.length) {
    y = finalY(doc) + 8;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...MARINE);
    doc.text("Formations de l'équipe", 14, y);
    autoTable(doc, {
      startY: y + 3,
      head: [["Formation", "Agents formés", "Objectif"]],
      body: d.formations.map((f) => [f.nom, fmt(f.pct), `${f.objectif}%`]),
      headStyles: { fillColor: MARINE, fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      columnStyles: { 1: { halign: "center" }, 2: { halign: "center" } },
    });
  }

  footer(doc);
  doc.save(`rapport-service-${d.date.replace(/\//g, "-")}.pdf`);
}

// ─── Compte-rendu d'audit ─────────────────────────────────────────────────────

const STATUT_LABEL: Record<StatutAction, string> = {
  realisee: "Réalisée ✓",
  en_cours: "En cours",
  non_initiee: "À initier",
  non_concerne: "Non concerné",
  sans_objet: "Sans objet",
};

export interface AuditCrData {
  etablissement: string;
  service: string;
  date: string; // jj/mm/aaaa
  roulement: string;
  score: number | null;
  objectif: number;
  sections: { nom: string; score: number | null }[];
  themeScores: { nom: string; score: number | null }[];
  nonConformes: { libelle: string; theme: string; nbNon: number }[];
  paqssActifs: { titre: string; statut: StatutAction; echeance: string }[];
}

export function generateAuditCrPdf(d: AuditCrData): void {
  const doc = new jsPDF();
  header(doc, "Compte rendu d'audit", `${d.etablissement} — ${d.service}`);

  doc.setTextColor(80);
  doc.setFontSize(10);
  doc.text(`${d.roulement}  ·  ${d.date}`, 14, 44);

  // Score global
  doc.setFillColor(238, 243, 251);
  doc.roundedRect(14, 50, 182, 22, 3, 3, "F");
  doc.setTextColor(...MARINE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(fmt(d.score), 24, 64);
  doc.setFontSize(11);
  const scoreStatut = d.score === null ? "" : d.score >= d.objectif ? "✓ Objectif atteint" : "⚠ Sous l'objectif";
  doc.text(`Score global  ·  Objectif : ${d.objectif}%  ${scoreStatut}`, 55, 64);

  // Score par tour
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...MARINE);
  doc.text("Résultats par tour d'audit", 14, 82);
  autoTable(doc, {
    startY: 86,
    head: [["Tour", "Score"]],
    body: d.sections.map((s) => [s.nom, fmt(s.score)]),
    headStyles: { fillColor: MARINE, fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 1: { halign: "center", cellWidth: 30 } },
  });

  // Score par thématique
  let y = finalY(doc) + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...MARINE);
  doc.text("Score par thématique HAS", 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [["Thématique", "Score", "Résultat"]],
    body: d.themeScores.map((t) => [
      t.nom,
      fmt(t.score),
      t.score === null ? "—" : t.score >= d.objectif ? "Conforme" : "À améliorer",
    ]),
    headStyles: { fillColor: MARINE, fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 1: { halign: "center", cellWidth: 20 }, 2: { halign: "center", cellWidth: 35 } },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const sc = d.themeScores[data.row.index]?.score;
        if (sc !== null && sc !== undefined && sc < d.objectif) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        } else if (sc !== null && sc !== undefined) {
          data.cell.styles.textColor = [22, 163, 74];
        }
      }
    },
  });

  // Points non conformes
  y = finalY(doc) + 8;
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...MARINE);
  doc.text("Points non conformes", 14, y);
  if (d.nonConformes.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(22, 163, 74);
    doc.text("Aucun point non conforme relevé.", 14, y + 7);
    y += 15;
  } else {
    autoTable(doc, {
      startY: y + 3,
      head: [["Thématique", "Critère non conforme", "Zones NON"]],
      body: d.nonConformes.map((nc) => [nc.theme, nc.libelle, String(nc.nbNon)]),
      headStyles: { fillColor: [220, 38, 38], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 35 }, 2: { halign: "center", cellWidth: 18 } },
    });
  }

  // PAQSS
  if (d.paqssActifs.length > 0) {
    y = finalY(doc) + 8;
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...MARINE);
    doc.text("Actions PAQSS — à initier ou en cours", 14, y);
    autoTable(doc, {
      startY: y + 3,
      head: [["Action", "Statut", "Échéance"]],
      body: d.paqssActifs.map((p) => [p.titre, STATUT_LABEL[p.statut], p.echeance]),
      headStyles: { fillColor: TURQUOISE, textColor: MARINE, fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 1: { halign: "center", cellWidth: 32 }, 2: { halign: "center", cellWidth: 28 } },
    });
  }

  footer(doc);
  doc.save(`CR-audit-${d.date.replace(/\//g, "-")}-${d.roulement.replace(/\s+/g, "-")}.pdf`);
}

// ─── Rapport certification HAS ────────────────────────────────────────────────

export interface CertifPdfData extends ServicePdfData {
  planCadre: { titre: string; statut: StatutAction; echeance: string; responsable: string }[];
  planEquipe: { titre: string; statut: StatutAction; echeance: string; responsable: string; auditNom: string }[];
  afgsuAlerte: { rouge: number; orange: number; total: number; parRole: Record<string, number> };
}

export function generateCertifPdf(d: CertifPdfData): void {
  const doc = new jsPDF();

  // Page 1 : conformité
  header(doc, "Dossier certification HAS", `${d.etablissement} — ${d.service}`);
  doc.setTextColor(80);
  doc.setFontSize(10);
  doc.text(`Édité le ${d.date}  ·  Dernier audit : ${d.dernierAudit}`, 14, 44);

  doc.setFillColor(238, 243, 251);
  doc.roundedRect(14, 50, 182, 22, 3, 3, "F");
  doc.setTextColor(...MARINE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(fmt(d.conformite), 24, 64);
  doc.setFontSize(11);
  doc.text(`Conformité globale du service  ·  Objectif HAS : ${d.objectif}%`, 55, 64);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...MARINE);
  doc.text("Conformité par thématique HAS", 14, 82);
  autoTable(doc, {
    startY: 86,
    head: [["Thématique HAS", "Score", "Statut"]],
    body: d.themes.map((t) => [
      t.nom,
      fmt(t.score),
      t.score === null ? "—" : t.score >= d.objectif ? "✓ Conforme" : "⚠ À améliorer",
    ]),
    headStyles: { fillColor: MARINE, fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 1: { halign: "center", cellWidth: 20 }, 2: { halign: "center", cellWidth: 35 } },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 2) {
        const sc = d.themes[data.row.index]?.score;
        if (sc !== null && sc !== undefined && sc < d.objectif) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        } else if (sc !== null && sc !== undefined) {
          data.cell.styles.textColor = [22, 163, 74];
        }
      }
    },
  });

  let y = grillesTable(doc, finalY(doc) + 8, d.grilles);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...MARINE);
  doc.text("Évolution de la conformité (audit service)", 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [["Audit", ...d.evolution.map((h) => h.label)]],
    body: [["Score", ...d.evolution.map((h) => `${h.score}%`)]],
    headStyles: { fillColor: TURQUOISE, textColor: MARINE, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
  });

  // Page 2 : Plan d'action équipe (terrain, issu des audits)
  doc.addPage();
  header(doc, "Plan d'action équipe", `Actions de terrain issues des audits — ${d.etablissement} — ${d.service}`);
  if (d.planEquipe.length === 0) {
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Aucune action d'équipe pour le moment.", 14, 44);
  } else {
    autoTable(doc, {
      startY: 38,
      head: [["Action", "Audit source", "Statut", "Responsable", "Échéance"]],
      body: d.planEquipe.map((p) => [p.titre, p.auditNom, STATUT_LABEL[p.statut], p.responsable, p.echeance]),
      headStyles: { fillColor: MARINE, fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: { 2: { halign: "center", cellWidth: 24 }, 4: { halign: "center", cellWidth: 22 } },
    });
  }

  // Page 3 : Plan d'action cadre (PAQSS — pilotage du service)
  doc.addPage();
  header(doc, "Plan d'action cadre — PAQSS", `Pilotage du service — ${d.etablissement} — ${d.service}`);
  autoTable(doc, {
    startY: 38,
    head: [["Action", "Statut", "Responsable", "Échéance"]],
    body: d.planCadre.map((p) => [p.titre, STATUT_LABEL[p.statut], p.responsable, p.echeance]),
    headStyles: { fillColor: MARINE, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 1: { halign: "center", cellWidth: 28 }, 3: { halign: "center", cellWidth: 24 } },
  });

  // Page 4 : habilitations et formations
  doc.addPage();
  header(doc, "Formations & habilitations", `${d.etablissement} — ${d.service}`);

  if (d.afgsuAlerte.total > 0) {
    const roleStr = Object.entries(d.afgsuAlerte.parRole)
      .map(([r, n]) => `${n} ${r}`)
      .join(" · ");
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(14, 38, 182, 18, 3, 3, "F");
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(
      `⚠ AFGSU : ${d.afgsuAlerte.total} recyclage${d.afgsuAlerte.total > 1 ? "s" : ""} à prévoir (${roleStr})` +
        (d.afgsuAlerte.rouge > 0 ? ` — dont ${d.afgsuAlerte.rouge} en urgence` : ""),
      14,
      50
    );
  }

  const formStartY = d.afgsuAlerte.total > 0 ? 62 : 38;
  autoTable(doc, {
    startY: formStartY,
    head: [["Formation", "Agents formés", "Objectif", "Statut"]],
    body: d.formations.map((f) => [
      f.nom,
      fmt(f.pct),
      `${f.objectif}%`,
      f.pct === null ? "—" : f.pct >= f.objectif ? "✓ Atteint" : "⚠ En dessous",
    ]),
    headStyles: { fillColor: MARINE, fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 1: { halign: "center" }, 2: { halign: "center" }, 3: { halign: "center", cellWidth: 30 } },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        const row = d.formations[data.row.index];
        if (row?.pct !== null && row?.pct !== undefined && row.pct < row.objectif) {
          data.cell.styles.textColor = [220, 38, 38];
        } else if (row?.pct !== null && row?.pct !== undefined) {
          data.cell.styles.textColor = [22, 163, 74];
        }
      }
    },
  });

  footer(doc);
  doc.save(`certif-HAS-${d.etablissement.replace(/\s+/g, "-")}-${d.date.replace(/\//g, "-")}.pdf`);
}
