// Logo ECG Aliavita — identique partout (Origin & Prism, agent & cadre).
// Fond nuit #0284C7 · tracé ECG lavande white · point terminal orange #FCD34D.
export default function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-xl"
      style={{ width: size, height: size, background: "#0284C7" }}
    >
      <svg viewBox="0 0 32 32" fill="none" style={{ width: size * 0.62, height: size * 0.62 }} aria-hidden="true">
        <path
          d="M 2,16 L 7,16 L 10,5 L 13,16 L 16,16 L 18.5,23 L 21,16 L 30,16"
          stroke="white"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="30" cy="16" r="2.2" fill="#FCD34D" />
      </svg>
    </span>
  );
}
