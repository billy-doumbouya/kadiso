import type { Metadata } from "next";
import Image from "next/image";
import { FileDown, Image as ImageIcon, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Espace presse",
  description: "Dossier de presse, photos haute résolution et contacts médias Kadi'so.",
};

const gallery = [
  "https://images.unsplash.com/photo-1763688506555-c73c1b944080?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522120679444-b967faef8c38?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1722963220475-979db2dbf216?auto=format&fit=crop&w=900&q=80",
];

export default function PressPage() {
  return (
    <>
      <section className="bg-night py-20 text-paper sm:py-28">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Espace presse
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Ressources pour les journalistes et créateurs de contenu
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-6 sm:grid-cols-2">
          <Reveal className="flex items-start gap-4 rounded-card border border-ink/10 bg-white p-6">
            <FileDown className="h-8 w-8 shrink-0 text-terre-dark" />
            <div>
              <h2 className="font-display font-semibold">Dossier de presse</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Histoire de l&rsquo;entreprise, chiffres clés et présentation de la Fondation, au format PDF.
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-terre-dark">Télécharger le PDF</span>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="flex items-start gap-4 rounded-card border border-ink/10 bg-white p-6">
            <Mail className="h-8 w-8 shrink-0 text-terre-dark" />
            <div>
              <h2 className="font-display font-semibold">Contact médias</h2>
              <p className="mt-1 text-sm text-ink-soft">Pour toute demande d&rsquo;interview ou de visite d&rsquo;usine.</p>
              <a href="mailto:presse@kadiso.com" className="mt-3 inline-block text-sm font-semibold text-terre-dark">
                presse@kadiso.com
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper-deep py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag tone="source">
              <ImageIcon className="h-3.5 w-3.5" /> Photos haute résolution
            </SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Banque d&rsquo;images libres pour la presse
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((src, i) => (
              <Reveal key={src} delay={i * 0.06}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={src} alt="Visuel Kadi'so pour la presse" fill className="object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
