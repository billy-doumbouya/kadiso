import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { BlogPosts } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Nouveautés produits, recettes, nutrition et événements Kadi'so.",
};

const tabs = [
  { id: "tous", label: "Tout" },
  { id: "actualites", label: "Actu Kadi'so" },
  { id: "recettes", label: "Recettes & nutrition" },
  { id: "evenements", label: "Événements" },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const active = categorie ?? "tous";
  
  // AJOUT DU AWAIT ICI 👇
  const allPosts = await BlogPosts.all();
  const posts = active === "tous" ? allPosts : allPosts.filter((p) => p?.category === active);

  return (
    <>
      <section className="bg-night py-16 text-paper sm:py-20">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Blog & actualités
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Nouveautés, recettes et vie de l&rsquo;entreprise
          </h1>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={t.id === "tous" ? "/blog" : `/blog?categorie=${t.id}`}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium",
                  active === t.id ? "border-terre bg-terre text-white" : "border-ink/15 bg-white hover:border-terre/40"
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => post && (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-card border border-ink/10 bg-white"
              >
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
                      <Newspaper className="h-9 w-9 text-terre-dark/40" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-mur-dark">
                    {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <h2 className="mt-2 font-display font-semibold leading-snug group-hover:text-terre-dark">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}