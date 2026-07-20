import VisiteGuideeCarousel from "@/components/VisiteGuideeCarousel";
import { Sparkles } from "lucide-react";

export default function VisiteGuideePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-turquoise-600">
          <Sparkles className="h-3.5 w-3.5" /> Visite guidée
        </p>
        <h1 className="text-2xl font-extrabold text-marine-900">Découvrir Prism en 6 étapes</h1>
        <p className="mt-1 text-sm text-ardoise-500">
          Un aperçu rapide de l&apos;application, utile pour présenter le projet.
        </p>
      </div>

      <VisiteGuideeCarousel />
    </div>
  );
}
