"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/ui/product-card";
import { categories, type CategoryId } from "@/lib/data/categories";
import type { Product } from "@/lib/data/products";
import { cn } from "@/lib/utils";

type Sort = "pertinence" | "prix-asc" | "prix-desc";

export function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categorie") as CategoryId | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryId | "tous">(initialCategory ?? "tous");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("pertinence");

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (active) setProducts(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      activeCategory === "tous" ? true : p.category === activeCategory
    );
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
      );
    }
    if (sort === "prix-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, activeCategory, query, sort]);

  return (
    <>
      <section className="bg-night py-16 text-paper sm:py-20">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Catalogue
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Tous nos produits
          </h1>
          <p className="mt-4 max-w-md text-paper/70">
            Eaux, jus, farines, huiles et conserves — transformés en Guinée, disponibles sur Conakry
            et en région.
          </p>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={activeCategory === "tous"} onClick={() => setActiveCategory("tous")}>
                Tous
              </FilterChip>
              {categories.map((c) => (
                <FilterChip key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>
                  {c.name}
                </FilterChip>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="rounded-full border border-ink/15 bg-white py-2 pl-9 pr-4 text-sm focus:border-terre focus:outline-none focus:ring-2 focus:ring-terre/20"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-ink/15 bg-white px-3 text-sm focus:border-terre focus:outline-none focus:ring-2 focus:ring-terre/20"
              >
                <option value="pertinence">Pertinence</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="mt-16 text-center text-ink-soft">Chargement du catalogue...</p>
          ) : filtered.length === 0 ? (
            <p className="mt-16 text-center text-ink-soft">Aucun produit ne correspond à votre recherche.</p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.05}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "border-terre bg-terre text-white" : "border-ink/15 bg-white text-ink hover:border-terre/40"
      )}
    >
      {children}
    </button>
  );
}
