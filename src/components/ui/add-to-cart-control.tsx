"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import type { Product } from "@/lib/data/products";

export function AddToCartControl({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-ink/15">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-ink hover:bg-ink/5"
          aria-label="Diminuer la quantité"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-11 w-11 items-center justify-center text-ink hover:bg-ink/5"
          aria-label="Augmenter la quantité"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => addItem(product, quantity)}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-terre px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-terre-dark sm:flex-none"
      >
        <ShoppingBag className="h-4 w-4" />
        Ajouter au panier
      </button>
    </div>
  );
}
