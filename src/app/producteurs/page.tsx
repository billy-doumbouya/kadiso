import type { Metadata } from "next";
import Image from "next/image";
import { ClipboardCheck, ScrollText, CalendarClock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { SupplierForm } from "@/components/forms/supplier-form";

export const metadata: Metadata = {
  title: "Espace producteurs",
  description: "Devenir fournisseur agricole de Kadi'so : conditions, cahier des charges, appels à candidatures.",
};

const criteria = [
  { icon: ClipboardCheck, title: "Critères de qualité", text: "Calibrage, taux d'humidité et absence de traitement non autorisé, contrôlés à la livraison." },
  { icon: ScrollText, title: "Contrat de culture", text: "Prix fixé avant la récolte, volumes engagés des deux côtés, paiement à la livraison." },
  { icon: CalendarClock, title: "Calendrier des campagnes", text: "Appels à candidatures ouverts avant chaque saison de récolte majeure." },
];

export default function ProducersPage() {
  return (
    <>
      <section className="bg-night py-20 text-paper sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTag tone="mur" className="bg-mur/15 text-mur">
              Espace producteurs
            </SectionTag>
            <h1 className="text-balance mt-5 max-w-lg font-display text-4xl font-extrabold sm:text-5xl">
              Cultivez pour Kadi&rsquo;so, avec un prix fixé avant la récolte
            </h1>
            <p className="mt-4 max-w-md text-paper/75">
              Nous travaillons avec des producteurs et coopératives de toute la Guinée pour
              sécuriser l&rsquo;approvisionnement de nos usines.
            </p>
          </div>
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522120679444-b967faef8c38?auto=format&fit=crop&w=1200&q=80"
                alt="Rangs de jeunes plants verts dans un champ agricole"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag>Cahier des charges agricole</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Ce que nous attendons de nos partenaires
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {criteria.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-card border border-ink/10 bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terre-light text-terre-dark">
                    <c.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="text-sm text-ink-soft">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-deep py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionTag tone="source">Devenir fournisseur</SectionTag>
            <h2 className="mt-4 font-display text-3xl font-bold">Soumettre votre candidature</h2>
            <p className="mt-4 max-w-sm text-ink-soft">
              Notre équipe achats agricoles étudie chaque demande et revient vers vous avant le
              démarrage de la prochaine campagne concernée.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-card border border-ink/10 bg-white p-6 sm:p-8">
            <SupplierForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
