"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { CategoryIcon } from "@/components/ui/category-icon";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { useCart } from "@/components/cart/cart-context";
import { getCategory } from "@/lib/data/categories";
import { sendEmail } from "@/lib/email";
import { formatGNF } from "@/lib/utils";
import type { CheckoutFormValues } from "@/lib/validation/schemas";

type Step = "panier" | "livraison" | "confirmation";
type DeliveryZone = { id: number; zone: string; fee: string; delay: string };

export default function BoutiquePage() {
  const { lines, setQuantity, removeItem, totalAmount, clear } = useCart();
  const [step, setStep] = useState<Step>("panier");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingResult, setTrackingResult] = useState<string | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);

  useEffect(() => {
    fetch("/api/delivery-zones")
      .then((res) => res.json())
      .then(setZones)
      .catch(() => setZones([]));
  }, []);

  const deliveryFee = lines.length > 0 ? 15000 : 0;

  const handleCheckout = async (values: CheckoutFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, quantity: l.quantity, price: l.product.price })),
          totalAmount: totalAmount + deliveryFee,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Échec de la commande");
      }
      const order = await res.json();
      await sendEmail({ form: "commande", orderNumber: order.order_number, ...values, lines, totalAmount });
      setOrderNumber(order.order_number);
      setStep("confirmation");
      clear();
    } catch {
      toast.error("La commande n'a pas pu être validée. Réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-night py-16 text-paper sm:py-20">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Boutique
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Votre commande
          </h1>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="mb-10 flex items-center gap-3 text-sm font-medium">
          <StepDot active={step === "panier"} done={step !== "panier"} label="1. Panier" />
          <span className="h-px w-8 bg-ink/15" />
          <StepDot active={step === "livraison"} done={step === "confirmation"} label="2. Livraison & paiement" />
          <span className="h-px w-8 bg-ink/15" />
          <StepDot active={step === "confirmation"} done={false} label="3. Confirmation" />
        </div>

        <AnimatePresence mode="wait">
          {step === "panier" && (
            <motion.div key="panier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {lines.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-card border border-ink/10 bg-white py-20 text-center">
                  <ShoppingBag className="h-10 w-10 text-ink-soft/50" />
                  <p className="text-ink-soft">Votre panier est vide.</p>
                  <Link href="/produits" className="rounded-full bg-terre px-5 py-2.5 text-sm font-semibold text-white hover:bg-terre-dark">
                    Voir le catalogue
                  </Link>
                </div>
              ) : (
                <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                  <ul className="divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
                    {lines.map(({ product, quantity }) => {
                      const category = getCategory(product.category);
                      return (
                        <li key={product.id} className="flex items-center gap-4 p-4 sm:p-5">
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-terre-light">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            ) : (
                              category && <CategoryIcon icon={category.icon} className="h-6 w-6 text-terre-dark" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-display font-semibold">{product.name}</p>
                            <p className="text-sm text-ink-soft">{formatGNF(product.price)}</p>
                          </div>
                          <div className="flex items-center rounded-full border border-ink/15">
                            <button onClick={() => setQuantity(product.id, quantity - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-ink/5" aria-label="Diminuer">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm">{quantity}</span>
                            <button onClick={() => setQuantity(product.id, quantity + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-ink/5" aria-label="Augmenter">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(product.id)} aria-label="Retirer" className="text-ink-soft hover:text-mur-dark">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="h-fit rounded-card border border-ink/10 bg-white p-6">
                    <h2 className="font-display font-semibold">Résumé</h2>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-ink-soft">
                        <span>Sous-total</span>
                        <span>{formatGNF(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-ink-soft">
                        <span>Livraison estimée</span>
                        <span>{formatGNF(deliveryFee)}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-display font-bold">
                      <span>Total estimé</span>
                      <span>{formatGNF(totalAmount + deliveryFee)}</span>
                    </div>
                    <button
                      onClick={() => setStep("livraison")}
                      className="mt-6 w-full rounded-full bg-terre py-3 text-sm font-semibold text-white hover:bg-terre-dark"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "livraison" && (
            <motion.div key="livraison" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl">
              <CheckoutForm onSubmit={handleCheckout} submitting={submitting} zones={zones} />
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 rounded-card border border-ink/10 bg-white py-16 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-terre" />
              <h2 className="font-display text-2xl font-bold">Commande confirmée</h2>
              <p className="text-ink-soft">
                Votre numéro de commande est <span className="font-semibold text-ink">{orderNumber}</span>.
                Conservez-le pour suivre la livraison.
              </p>
              <Link href="/produits" className="mt-2 rounded-full bg-terre px-6 py-3 text-sm font-semibold text-white hover:bg-terre-dark">
                Continuer mes achats
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <section className="bg-paper-deep py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTag tone="source">Suivi de commande</SectionTag>
            <h2 className="mt-4 font-display text-2xl font-bold">Où en est ma commande ?</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTrackingResult(
                  trackingQuery.trim()
                    ? `Commande ${trackingQuery.trim().toUpperCase()} — en cours de préparation à l'usine de Kindia.`
                    : null
                );
              }}
              className="mt-5 flex max-w-md gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  placeholder="N° de commande, ex : KS-482913"
                  className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-terre focus:outline-none focus:ring-2 focus:ring-terre/20"
                />
              </div>
              <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/85">
                Suivre
              </button>
            </form>
            {trackingResult && <p className="mt-4 text-sm text-ink-soft">{trackingResult}</p>}
          </div>

          <div>
            <SectionTag>Zones de livraison</SectionTag>
            <h2 className="mt-4 font-display text-2xl font-bold">Délais et tarifs</h2>
            <ul className="mt-5 divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
              {zones.map((z) => (
                <li key={z.id} className="flex items-center justify-between p-4 text-sm">
                  <span>{z.zone}</span>
                  <span className="text-right text-ink-soft">
                    {z.fee}
                    <br />
                    {z.delay}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span className={active ? "text-ink" : done ? "text-terre-dark" : "text-ink-soft"}>{label}</span>
  );
}
