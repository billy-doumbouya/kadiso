import type { Metadata } from "next";
import { Percent, FileText, Truck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { ResellerForm } from "@/components/forms/reseller-form";
import { QuoteForm } from "@/components/forms/quote-form";

export const metadata: Metadata = {
  title: "Espace revendeurs",
  description: "Conditions de partenariat B2B, devis automatique et candidature revendeur Kadi'so.",
};

const advantages = [
  { icon: Percent, title: "Tarifs préférentiels", text: "Une grille de prix dégressive selon les volumes commandés." },
  { icon: Truck, title: "Livraison planifiée", text: "Des tournées régulières vers les principaux marchés et dépôts." },
  { icon: FileText, title: "Facturation simplifiée", text: "Un interlocuteur commercial dédié pour le suivi de vos commandes." },
];

export default function ResellersPage() {
  return (
    <>
      <section className="bg-night py-20 text-paper sm:py-28">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Espace revendeurs
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Distribuez la gamme Kadi&rsquo;so dans votre zone
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag>Conditions de partenariat</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Ce que propose le programme revendeur
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {advantages.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-card border border-ink/10 bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mur-light text-mur-dark">
                    <a.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display font-semibold">{a.title}</h3>
                  <p className="text-sm text-ink-soft">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-deep py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionTag tone="source">Devis automatique</SectionTag>
            <h2 className="mt-4 font-display text-3xl font-bold">Demander un tarif B2B</h2>
            <p className="mt-4 max-w-sm text-ink-soft">
              Indiquez les produits, la quantité et votre localisation : la demande part directement
              vers notre service commercial.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-card border border-ink/10 bg-white p-6 sm:p-8">
            <QuoteForm />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionTag>Candidature revendeur</SectionTag>
            <h2 className="mt-4 font-display text-3xl font-bold">Inscrire mon établissement</h2>
            <p className="mt-4 max-w-sm text-ink-soft">
              Aucun compte personnel n&rsquo;est requis : votre dossier (RCCM, IFU) est étudié
              manuellement par notre équipe avant validation.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-card border border-ink/10 bg-white p-6 sm:p-8">
            <ResellerForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
