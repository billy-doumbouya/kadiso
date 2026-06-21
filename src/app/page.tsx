import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Sprout, Handshake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { SourceThread, WaveRule } from "@/components/ui/source-thread";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ProductCard } from "@/components/ui/product-card";
import { categories } from "@/lib/data/categories";
import { testimonials } from "@/lib/data/faq";
import { Products, BlogPosts, Impact, DeliveryZones } from "@/lib/db";

// CHANGEMENT ICI : Le composant devient async 👇
export default async function HomePage() {
  // AJOUT DES AWAIT AVANT TOUTES LES REQUÊTES TURSO
  const allProducts = (await Products.all()).filter((product): product is NonNullable<typeof product> => product !== null);
  const featured = allProducts.slice(0, 4);

const allPosts = (await BlogPosts.all()).filter(
  (post): post is NonNullable<typeof post> => post !== null
);
const latestPosts = allPosts.slice(0, 3);

  const impact = await Impact.current();
  
  const allZones = await DeliveryZones.all();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-paper">
        <Image
          src="https://images.unsplash.com/photo-1763688506555-c73c1b944080?auto=format&fit=crop&w=2000&q=80"
          alt="Rivière sinueuse à travers une forêt tropicale dense"
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/20" />
        <Container className="relative flex min-h-[88vh] flex-col justify-center py-24">
          <Reveal>
            <SectionTag tone="mur" className="bg-mur/15 text-mur">
              Agro-industrie guinéenne
            </SectionTag>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-balance mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              De la terre guinéenne à votre table, avec une part qui revient à la communauté.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-lg text-lg text-paper/80">
              Eaux, jus, farines, huiles et conserves transformés localement. 20% de nos bénéfices
              financent l&rsquo;accès à l&rsquo;eau, à l&rsquo;éducation et à la santé via la Fondation
              Kadi&rsquo;s Humanitaire.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 rounded-full bg-mur px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-mur-dark"
              >
                Découvrir nos produits
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/engagement"
                className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                Notre engagement solidaire
              </Link>
            </div>
          </Reveal>
        </Container>

        <Container className="relative pb-12">
          <Reveal delay={0.35}>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/10 backdrop-blur sm:grid-cols-3">
              <Stat value={20} suffix="%" label="des bénéfices reversés à la Fondation" />
              <Stat value={categories.length} label="catégories de produits transformés en Guinée" />
              {/* UTILISATION DE LA VARIABLE UTILISÉE AVEC AWAIT PLUS HAUT 👇 */}
              <Stat value={allZones.length} label="zones de livraison à Conakry et en région" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Catégories */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal>
              <SectionTag>Notre catalogue</SectionTag>
              <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
                Cinq familles de produits, une même exigence d&rsquo;origine
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/produits" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terre-dark hover:underline">
                Tous les produits <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06}>
                <Link
                  href={`/produits?categorie=${c.id}`}
                  className="group flex h-full flex-col gap-3 rounded-card border border-ink/10 bg-white p-5 transition-colors hover:border-terre/40"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-terre-light text-terre-dark">
                    <CategoryIcon icon={c.icon} className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="font-display font-semibold">{c.name}</h3>
                  <p className="text-sm text-ink-soft">{c.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <WaveRule className="opacity-50" />

      {/* Produits phares */}
      <section className="bg-paper-deep py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag tone="mur">Sélection</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Quelques produits phares
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Engagement solidaire */}
      <section className="relative overflow-hidden bg-night py-20 text-paper sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1722963220475-979db2dbf216?auto=format&fit=crop&w=1200&q=80"
                alt="Groupe de personnes réunies en cercle, mains jointes, symbole de solidarité communautaire"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionTag tone="mur" className="bg-mur/15 text-mur">
              Engagement solidaire
            </SectionTag>
            <h2 className="text-balance mt-4 font-display text-3xl font-bold sm:text-4xl">
              Chaque achat finance un peu plus que votre prochain repas
            </h2>
            <p className="mt-4 max-w-md text-paper/75">
              Depuis la création de Kadi&rsquo;so, 20% de nos bénéfices sont reversés à la Fondation
              Kadi&rsquo;s Humanitaire pour financer l&rsquo;accès à l&rsquo;eau potable, l&rsquo;éducation
              et la santé en Guinée.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <SourceThread height={90} stroke="#f57c00" className="-ml-1" />
              <div>
                <p className="font-display text-4xl font-extrabold text-mur">
                    <AnimatedCounter value={Number(impact?.total_amount ?? 0)} /> GNF
                </p>
                <p className="mt-1 text-sm text-paper/60">reversés à la Fondation depuis 2023</p>
              </div>
            </div>
            <Link
              href="/engagement"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-mur px-6 py-3 text-sm font-semibold text-white hover:bg-mur-dark"
            >
              Voir notre impact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Producteurs */}
      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionTag>Espace producteurs</SectionTag>
            <h2 className="text-balance mt-4 font-display text-3xl font-bold sm:text-4xl">
              Des contrats de culture qui sécurisent nos partenaires agricoles
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Nous fixons des prix d&rsquo;achat avant la récolte et accompagnons nos producteurs sur les
              critères de qualité, pour une chaîne d&rsquo;approvisionnement plus prévisible.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                <Sprout className="h-4 w-4 text-terre" /> Cahier des charges agricole partagé
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                <Handshake className="h-4 w-4 text-terre" /> Appels à candidatures réguliers
              </span>
            </div>
            <Link
              href="/producteurs"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-terre px-6 py-3 text-sm font-semibold text-terre-dark hover:bg-terre-light"
            >
              Devenir fournisseur <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Reveal className="order-1 lg:order-2">
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

      <WaveRule className="opacity-50" />

      {/* Témoignages */}
      <section className="bg-paper-deep py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTag tone="source">Témoignages</SectionTag>
            <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
              Ce que nos partenaires en disent
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col justify-between rounded-card bg-white p-6">
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

      {/* Blog teaser */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal>
              <SectionTag>Actualités</SectionTag>
              <h2 className="text-balance mt-4 max-w-md font-display text-3xl font-bold sm:text-4xl">
                Dernières nouvelles de Kadi&rsquo;so
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-terre-dark hover:underline">
                Tout le blog <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {latestPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08}>
                <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-card border border-ink/10 bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden bg-terre-light">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <HeartHandshake className="h-9 w-9 text-terre-dark/40" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-mur-dark">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-display font-semibold leading-snug group-hover:text-terre-dark">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 p-6">
      <span className="font-display text-3xl font-extrabold text-mur">
        <AnimatedCounter value={value} />
        {suffix}
      </span>
      <span className="text-sm text-paper/70">{label}</span>
    </div>
  );
}