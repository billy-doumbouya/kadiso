"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { getCategory } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/ui/category-icon";
import { formatGNF } from "@/lib/utils";

export function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, removeItem, totalAmount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-night/40"
          onClick={closeCart}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-paper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink/10 p-5">
              <h2 className="font-display text-lg font-semibold">Votre panier</h2>
              <button onClick={closeCart} aria-label="Fermer le panier" className="rounded-full p-1.5 hover:bg-ink/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-soft">
                  <ShoppingBag className="h-10 w-10 text-ink-soft/50" />
                  <p>Votre panier est vide pour le moment.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map(({ product, quantity }) => {
                    const category = getCategory(product.category);
                    return (
                      <li key={product.id} className="flex gap-3">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-terre-light">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          ) : (
                            category && <CategoryIcon icon={category.icon} className="h-6 w-6 text-terre-dark" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/produits/${product.slug}`} onClick={closeCart} className="text-sm font-medium leading-snug hover:text-terre-dark">
                              {product.name}
                            </Link>
                            <button onClick={() => removeItem(product.id)} aria-label="Retirer" className="text-ink-soft hover:text-mur-dark">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="text-xs text-ink-soft">{formatGNF(product.price)}</span>
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              onClick={() => setQuantity(product.id, quantity - 1)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-ink/15 hover:bg-ink/5"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-sm">{quantity}</span>
                            <button
                              onClick={() => setQuantity(product.id, quantity + 1)}
                              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-ink/15 hover:bg-ink/5"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 p-5">
                <div className="mb-4 flex items-center justify-between font-display font-semibold">
                  <span>Total</span>
                  <span>{formatGNF(totalAmount)}</span>
                </div>
                <Link
                  href="/boutique"
                  onClick={closeCart}
                  className="block rounded-full bg-terre py-3 text-center text-sm font-semibold text-white hover:bg-terre-dark"
                >
                  Passer la commande
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
