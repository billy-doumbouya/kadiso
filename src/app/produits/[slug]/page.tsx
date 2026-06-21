import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ProductCard } from "@/components/ui/product-card";
import { AddToCartControl } from "@/components/ui/add-to-cart-control";
import { Products } from "@/lib/db";
import { getCategory } from "@/lib/data/categories";
import { formatGNF } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const product = await Products.bySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // AJOUT DE AWAIT ICI 👇
  const product = await Products.bySlug(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  
  // AJOUT DE AWAIT ICI 👇 + GESTION DES LIENS LIÉS
const allRelated = (await Products.byCategory(product.category)).filter(
  (p): p is NonNullable<typeof p> => p !== null
);
const related = allRelated.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <Container className="py-12 sm:py-16">
      <Link href="/produits" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Retour au catalogue
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div
          className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${
            category?.accent === "source"
              ? "from-source/15 to-source/0"
              : category?.accent === "mur"
              ? "from-mur/15 to-mur/0"
              : "from-terre/15 to-terre/0"
          }`}
        >
          {product.image ? (
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          ) : (
            category && (
              <CategoryIcon
                icon={category.icon}
                className={`h-24 w-24 ${
                  category.accent === "source"
                    ? "text-source-dark"
                    : category.accent === "mur"
                    ? "text-mur-dark"
                    : "text-terre-dark"
                }`}
                strokeWidth={1.2}
              />
            )
          )}
        </div>

        <div>
          {category && <SectionTag>{category.name}</SectionTag>}
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-ink-soft">{product.tagline}</p>
          <p className="mt-6 font-display text-3xl font-extrabold">{formatGNF(product.price)}</p>
          <p className="text-sm text-ink-soft">{product.unit}</p>

          <div className="mt-8">
            <AddToCartControl product={product} />
          </div>

          <p className="mt-8 text-ink-soft">{product.description}</p>

          <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {(product.details || []).map((d: any) => (
              <div key={d.label} className="flex justify-between py-3 text-sm">
                <dt className="text-ink-soft">{d.label}</dt>
                <dd className="font-medium text-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Dans la même catégorie</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}