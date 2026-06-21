import type { Metadata } from "next";
import { Leaf, MapPinned, HeartHandshake, Factory, Droplets } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire, l'équipe, les valeurs et le modèle économique de Kadi'so.",
};

const values = [
  { icon: Leaf, title: "Qualité", text: "Des process de transformation suivis de la matière première au produit fini." },
  { icon: MapPinned, title: "Terroir", text: "Des matières premières guinéennes, achetées auprès de producteurs locaux." },
  { icon: HeartHandshake, title: "Solidarité", text: "20% des bénéfices reversés à la Fondation Kadi's Humanitaire." },
  { icon: Droplets, title: "Éco-responsabilité", text: "Réduction progressive de l'empreinte de nos emballages et de nos process." },
];

const team = [
  { initials: "AD", name: "Aïssatou Diallo", role: "Directrice Générale" },
  { initials: "MC", name: "Mamadou Camara", role: "Directeur des Opérations" },
  { initials: "FB", name: "Fatoumata Bah", role: "Responsable Qualité" },
  { initials: "IK", name: "Ibrahima Kourouma", role: "Responsable Achats Agricoles" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-night py-20 text-paper sm:py-28">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            À propos de Kadi&rsquo;so
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-2xl font-display text-4xl font-extrabold sm:text-5xl">
            Une entreprise agro-industrielle guinéenne, ancrée dans son terroir
          </h1>
        </Container>
      </section>

      <section id="histoire" className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SectionTag>Notre histoire</SectionTag>
            <h2 className="mt-4 font-display text-3xl font-bold">De la transformation locale à la vitrine nationale</h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-4 text-ink-soft">
            <p>
              Kadi&rsquo;so est née de la conviction que la valeur des produits agricoles guinéens doit
              davantage rester sur le territoire qui les fait grandir. L&rsquo;entreprise transforme localement
              eaux, fruits, céréales et oléagineux en produits prêts à consommer.
            </p>
            <p>
              Au fil des campagnes, le réseau de producteurs partenaires s&rsquo;est élargi, tout comme la
              gamme de produits proposée — toujours avec la même exigence : transformer près de la source,
              vendre au juste prix, et redistribuer une part des bénéfices à la communauté.
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="modele" className="bg-paper-deep py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionTag tone="mur">Notre modèle économique</SectionTag>
            <h2 className="text-balance mt-4 font-display text-3xl font-bold sm:text-4xl">
              20% des bénéfices vont directement à la Fondation
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Ce taux est fixe et appliqué chaque exercice, indépendamment du résultat. Il finance les
              programmes de la Fondation Kadi&rsquo;s Humanitaire : accès à l&rsquo;eau, éducation, santé.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-end gap-3 rounded-2xl border border-ink/10 bg-white p-8">
              <span className="font-display text-6xl font-extrabold text-terre">
                <AnimatedCounter value={20} />%
              </span>
              <span className="pb-2 text-sm text-ink-soft">des bénéfices nets, chaque année</span>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="valeurs" className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag>Nos valeurs</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Quatre principes qui guident chaque décision
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.07}>
                <div className="flex h-full flex-col gap-3 rounded-card border border-ink/10 bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terre-light text-terre-dark">
                    <v.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display font-semibold">{v.title}</h3>
                  <p className="text-sm text-ink-soft">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="equipe" className="bg-paper-deep py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag tone="source">Notre équipe</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Une équipe locale, du champ à l&rsquo;usine
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.07}>
                <div className="flex flex-col items-center gap-3 rounded-card border border-ink/10 bg-white p-6 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-terre font-display text-lg font-bold text-white">
                    {member.initials}
                  </span>
                  <div>
                    <p className="font-display font-semibold">{member.name}</p>
                    <p className="text-sm text-ink-soft">{member.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="flex flex-col items-center gap-4 text-center">
          <Factory className="h-9 w-9 text-terre" strokeWidth={1.5} />
          <h2 className="max-w-xl font-display text-2xl font-bold sm:text-3xl">
            Nos usines transforment ce que nos producteurs récoltent, dans un rayon de quelques heures de route.
          </h2>
        </Container>
      </section>
    </>
  );
}
