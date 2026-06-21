import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsCatalog } from "@/components/products-catalog";

export const metadata: Metadata = {
  title: "Produits",
  description: "Le catalogue complet Kadi'so : eaux, jus, farines, huiles et conserves.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsCatalog />
    </Suspense>
  );
}
