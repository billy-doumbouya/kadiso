"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data/products";
import { getCategory } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/ui/category-icon";
import { useCart } from "@/components/cart/cart-context";
import { formatGNF, cn } from "@/lib/utils";

const accentBg: Record<string, string> = {
  source: "from-source/15 to-source/0",
  mur: "from-mur/15 to-mur/0",
  terre: "from-terre/15 to-terre/0",
};
const accentIcon: Record<string, string> = {
  source: "text-source-dark",
  mur: "text-mur-dark",
  terre: "text-terre-dark",
};

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const category = getCategory(product.category);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-ink/10 bg-white",
        className
      )}
    >
      <Link href={`/produits/${product.slug}`} className="block">
        <div
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br",
            category && accentBg[category.accent]
          )}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            category && (
              <CategoryIcon
                icon={category.icon}
                className={cn("h-12 w-12 transition-transform duration-500 group-hover:scale-110", accentIcon[category.accent])}
                strokeWidth={1.5}
              />
            )
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {category?.name}
        </span>
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-display text-base font-semibold leading-snug text-ink hover:text-terre-dark">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-ink-soft">{product.unit}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display font-bold text-ink">{formatGNF(product.price)}</span>
          <button
            onClick={() => addItem(product)}
            aria-label={`Ajouter ${product.name} au panier`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-terre text-white transition-colors hover:bg-terre-dark"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
