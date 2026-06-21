import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BlogPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BlogPosts.bySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BlogPosts.bySlug(slug);
  if (!post) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>

      <article className="mx-auto mt-6 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wide text-mur-dark">
          {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{post.title}</h1>

        {post.image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="mt-8 space-y-5 text-ink-soft">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  );
}
