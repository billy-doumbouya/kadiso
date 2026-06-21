import type { Metadata } from "next";
import Image from "next/image";
import { Download, HeartHandshake, Droplets, GraduationCap, Stethoscope } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { SourceThread } from "@/components/ui/source-thread";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { testimonials } from "@/lib/data/faq";
import { Impact } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engagement solidaire",
  description: "20% des bénéfices Kadi'so financent la Fondation Kadi's Humanitaire — transparence et impact.",
};

const programs = [
  { icon: Droplets, title: "Accès à l'eau", text: "Forages et points d'eau potable dans les zones rurales." },
  { icon: GraduationCap, title: "Éducation", text: "Bourses et fournitures scolaires pour les enfants de familles partenaires." },
  { icon: Stethoscope, title: "Santé", text: "Appui aux centres de santé communautaires en région." },
];

const reports = [
  { year: "2025", label: "Rapport d'impact 2025" },
  { year: "2024", label: "Rapport d'impact 2024" },
  { year: "2023", label: "Rapport d'impact 2023" },
];

export default async function EngagementPage() {
  const impact = await Impact.current();
  return (
    <>
      <section className="relative overflow-hidden bg-night py-20 text-paper sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTag tone="mur" className="bg-mur/15 text-mur">
              Engagement solidaire
            </SectionTag>
            <h1 className="text-balance mt-5 max-w-lg font-display text-4xl font-extrabold sm:text-5xl">
              20% de nos bénéfices, chaque année, sans exception
            </h1>
            <p className="mt-4 max-w-md text-paper/75">
              Ce taux est appliqué depuis la création de Kadi&rsquo;so et finance les programmes de la
              Fondation Kadi&rsquo;s Humanitaire en Guinée.
            </p>
          </div>
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1722963220475-979db2dbf216?auto=format&fit=crop&w=1200&q=80"
                alt="Groupe de personnes réunies en cercle, mains jointes"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-8 text-center">
          <SourceThread height={100} />
          <SectionTag tone="mur">Compteur solidaire</SectionTag>
          <p className="font-display text-5xl font-extrabold text-terre sm:text-6xl">
            <AnimatedCounter value={Number(impact?.total_amount ?? 0)} /> GNF
          </p>
          <p className="max-w-md text-ink-soft">
            reversés à la Fondation Kadi&rsquo;s Humanitaire depuis 2023. Ce montant est mis à jour
            manuellement par l&rsquo;équipe Kadi&rsquo;so à chaque clôture trimestrielle.
          </p>
        </Container>
      </section>

      <section className="bg-paper-deep py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag>Où va cet argent</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Trois programmes prioritaires
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-3 rounded-card border border-ink/10 bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mur-light text-mur-dark">
                    <p.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display font-semibold">{p.title}</h3>
                  <p className="text-sm text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag tone="source">Témoignages</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Ce que ces programmes changent au quotidien
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col justify-between rounded-card border border-ink/10 bg-white p-6">
                  <blockquote className="text-sm leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5">
                    <p className="font-display text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-ink-soft">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-deep py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTag>Transparence</SectionTag>
            <h2 className="mt-4 font-display text-2xl font-bold">Rapports annuels</h2>
            <ul className="mt-5 divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
              {reports.map((r) => (
                <li key={r.year} className="flex items-center justify-between p-4 text-sm">
                  <span>{r.label}</span>
                  <span className="inline-flex items-center gap-1.5 text-terre-dark">
                    <Download className="h-4 w-4" /> PDF
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-card border border-ink/10 bg-white p-6">
            <HeartHandshake className="h-9 w-9 text-mur" />
            <h3 className="font-display text-lg font-semibold">Partenaires solidaires</h3>
            <p className="text-sm text-ink-soft">
              La Fondation Kadi&rsquo;s Humanitaire travaille avec des ONG locales et des collectivités pour
              identifier les zones prioritaires d&rsquo;intervention. Une liste à jour des partenaires est
              publiée dans chaque rapport annuel.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
