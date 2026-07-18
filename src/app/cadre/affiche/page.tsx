import { getDb } from "@/lib/db";
import {
  serviceConformite,
  axesPrioritaires,
  statutFromScore,
  piresItemsTheme,
  serviceEvolution,
} from "@/lib/scoring";
import PrintButton from "@/components/PrintButton";

export default async function AffichePage() {
  const db = await getDb();
  const conformite = serviceConformite(db);
  const statut = statutFromScore(conformite, db.config);
  const axes = axesPrioritaires(db, 3);

  // Tendance : delta vs audit précédent
  const evol = serviceEvolution(db);
  const n = evol.length;
  const trend = n >= 2 ? evol[n - 1].score - evol[n - 2].score : null;

  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const scoreHex =
    statut === "vert" ? "#16a34a" : statut === "orange" ? "#d97706" : "#dc2626";

  // Couleurs des 3 axes (rouge → orange → bleu)
  const AXIS_COLORS = [
    { border: "#dc2626", bg: "#fff5f5", badge: "#fecaca", text: "#991b1b" },
    { border: "#d97706", bg: "#fffbeb", badge: "#fde68a", text: "#92400e" },
    { border: "#0891b2", bg: "#ecfeff", badge: "#a5f3fc", text: "#164e63" },
  ];

  return (
    <>
      {/* ── Barre d'outils (masquée à l'impression) ── */}
      <div className="mb-5 flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-marine-900">Affiche A3 — Portrait</h1>
          <p className="text-sm text-ardoise-500">
            Cliquez « Imprimer » puis choisissez A3 portrait dans les options de l&apos;imprimante.
          </p>
        </div>
        <PrintButton label="Imprimer l'affiche" />
      </div>

      {/* ══════════════════════════════════════════════
          AFFICHE — A3 portrait (297 × 420 mm)
          ══════════════════════════════════════════════ */}
      <div
        id="affiche"
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        }}
      >
        {/* ─── EN-TÊTE ─── */}
        <div
          style={{
            background: "linear-gradient(135deg, #0b2447 0%, #19376d 100%)",
            padding: "28px 36px 24px",
          }}
        >
          {/* Ligne décorative */}
          <div
            style={{
              width: "44px",
              height: "3px",
              backgroundColor: "#14b8c4",
              borderRadius: "2px",
              marginBottom: "14px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            {/* Titre */}
            <div>
              <p
                style={{
                  color: "#67e8f9",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                {db.config.nomService}
              </p>
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "26px",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Axes qualité<br />du moment
              </h1>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "12px",
                  marginTop: "6px",
                }}
              >
                Pratiques prioritaires · {date}
              </p>
            </div>

            {/* Score global + trend */}
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: "14px",
                padding: "14px 18px",
                textAlign: "center",
                minWidth: "108px",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Conformité
              </p>
              <p
                style={{
                  color: scoreHex,
                  fontSize: "44px",
                  fontWeight: 900,
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {conformite === null ? "—" : `${conformite}%`}
              </p>
              {/* Tendance */}
              {trend !== null && (
                <p
                  style={{
                    color: trend >= 0 ? "#4ade80" : "#f87171",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginTop: "3px",
                  }}
                >
                  {trend >= 0 ? `↑ +${trend}` : `↓ ${trend}`} pts
                </p>
              )}
              <p style={{ color: "#475569", fontSize: "10px", marginTop: "3px" }}>
                objectif {db.config.objectif}%
              </p>

              {/* Mini barre de progression */}
              {conformite !== null && (
                <div
                  style={{
                    marginTop: "8px",
                    height: "4px",
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(conformite, 100)}%`,
                      height: "100%",
                      backgroundColor: scoreHex,
                      borderRadius: "2px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── BANDEAU INTRO ─── */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            borderBottom: "1px solid #dcfce7",
            padding: "9px 36px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "13px" }}>💡</span>
          <p style={{ color: "#166534", fontSize: "11.5px", fontWeight: 600, margin: 0 }}>
            Pour chaque axe : les points à renforcer et le geste attendu au quotidien.
          </p>
        </div>

        {/* ─── AXES PRIORITAIRES ─── */}
        {axes.length === 0 ? (
          <div
            style={{
              padding: "48px 36px",
              textAlign: "center",
              color: "#16a34a",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            ✅ Toutes les thématiques atteignent l&apos;objectif. Bravo !
          </div>
        ) : (
          axes.map((a, i) => {
            const pires = piresItemsTheme(db, a.theme.id, 3);
            const colors = AXIS_COLORS[i] ?? AXIS_COLORS[2];
            const gap = db.config.objectif - (a.score ?? 0);
            const pctBar = Math.min((a.score ?? 0), 100);

            // "Ce que je fais" : PAQSS actifs → ceQueJeFais non vide,
            // sinon on prend les vigilances du thème
            const paqssTheme = db.paqss
              .filter(
                (p) =>
                  p.themeId === a.theme.id &&
                  p.statut !== "realisee" &&
                  p.statut !== "non_concerne" &&
                  p.ceQueJeFais.trim() !== "",
              )
              .slice(0, 3);

            const actions: string[] =
              paqssTheme.length > 0
                ? paqssTheme.map((p) => p.ceQueJeFais)
                : (a.theme.vigilances ?? []).slice(0, 3);

            return (
              <div
                key={a.theme.id}
                style={{
                  borderTop: i > 0 ? "1px solid #f1f5f9" : "none",
                  padding: "20px 36px",
                  position: "relative",
                }}
              >
                {/* Bande colorée gauche */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "5px",
                    backgroundColor: colors.border,
                  }}
                />

                {/* En-tête axe */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Numéro */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "26px",
                        height: "26px",
                        borderRadius: "8px",
                        backgroundColor: colors.border,
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p
                        style={{
                          color: "#0f172a",
                          fontSize: "15px",
                          fontWeight: 800,
                          margin: 0,
                          lineHeight: 1.2,
                        }}
                      >
                        {a.theme.nom}
                      </p>
                      {a.theme.description && (
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: "10.5px",
                            margin: "2px 0 0",
                          }}
                        >
                          {a.theme.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score + gap */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p
                      style={{
                        color: colors.border,
                        fontSize: "34px",
                        fontWeight: 900,
                        lineHeight: 1,
                        margin: 0,
                      }}
                    >
                      {a.score === null ? "—" : `${a.score}%`}
                    </p>
                    <p style={{ color: "#94a3b8", fontSize: "10px", marginTop: "1px" }}>
                      {gap > 0 ? `−${gap} pts vs objectif` : "✓ objectif atteint"}
                    </p>
                  </div>
                </div>

                {/* Barre de progression */}
                <div
                  style={{
                    height: "5px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "3px",
                    overflow: "hidden",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      width: `${pctBar}%`,
                      height: "100%",
                      backgroundColor: colors.border,
                      borderRadius: "3px",
                    }}
                  />
                  {/* Marqueur objectif */}
                  <div
                    style={{
                      position: "relative",
                      marginTop: "-5px",
                      marginLeft: `${db.config.objectif}%`,
                      width: "1px",
                      height: "5px",
                      backgroundColor: "#cbd5e1",
                    }}
                  />
                </div>

                {/* Deux colonnes */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {/* Points à améliorer */}
                  {pires.length > 0 && (
                    <div
                      style={{
                        backgroundColor: colors.bg,
                        borderRadius: "10px",
                        padding: "11px 13px",
                        borderLeft: `3px solid ${colors.border}`,
                      }}
                    >
                      <p
                        style={{
                          color: colors.text,
                          fontSize: "9.5px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          marginBottom: "7px",
                        }}
                      >
                        Points à renforcer
                      </p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {pires.map((item, j) => (
                          <li
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "5px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                color: colors.border,
                                fontSize: "12px",
                                lineHeight: 1.3,
                                flexShrink: 0,
                              }}
                            >
                              ▸
                            </span>
                            <span
                              style={{
                                color: "#1e293b",
                                fontSize: "11.5px",
                                lineHeight: 1.4,
                              }}
                            >
                              {item.libelle}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ce que je fais */}
                  {actions.length > 0 && (
                    <div
                      style={{
                        backgroundColor: "#f0fdf4",
                        borderRadius: "10px",
                        padding: "11px 13px",
                        borderLeft: "3px solid #16a34a",
                      }}
                    >
                      <p
                        style={{
                          color: "#166534",
                          fontSize: "9.5px",
                          fontWeight: 700,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          marginBottom: "7px",
                        }}
                      >
                        Ce que je fais
                      </p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {actions.map((action, j) => (
                          <li
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "5px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                color: "#16a34a",
                                fontSize: "12px",
                                lineHeight: 1.3,
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </span>
                            <span
                              style={{
                                color: "#1e293b",
                                fontSize: "11.5px",
                                lineHeight: 1.4,
                              }}
                            >
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* ─── PIED DE PAGE ─── */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            padding: "10px 36px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: "9.5px", margin: 0 }}>
            {db.config.nomService} · Usage interne · Données issues du dernier audit
          </p>
          <p style={{ color: "#cbd5e1", fontSize: "9.5px", margin: 0 }}>
            Application Qualité
          </p>
        </div>
      </div>

      {/* ─── CSS impression ─── */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, .print\\:hidden { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; }
          #affiche {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          @page { size: A3 portrait; margin: 10mm; }
        }
      `}</style>
    </>
  );
}
