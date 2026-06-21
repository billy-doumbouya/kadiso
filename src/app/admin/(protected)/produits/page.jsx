"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Modal } from "@/components/admin/modal";
import { Field, inputClasses } from "@/components/forms/field";
import { productAdminSchema } from "@/lib/validation/admin-schemas";
import { formatGNF } from "@/lib/utils";

const CATEGORIES = [
  { id: "eaux", name: "Eaux minérales" },
  { id: "jus", name: "Jus & boissons" },
  { id: "farines", name: "Farines & céréales" },
  { id: "huiles", name: "Huiles" },
  { id: "conserves", name: "Conserves" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(productAdminSchema) });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", slug: "", category: "eaux", price: "", unit: "", image: "", tagline: "", description: "", inStock: true });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    reset({ ...product, image: product.image || "" });
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    const payload = { ...values, details: editing?.details || [] };
    const res = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Une erreur est survenue");
      return;
    }
    toast.success(editing ? "Produit mis à jour" : "Produit créé");
    setModalOpen(false);
    load();
  };

  const remove = async (product) => {
    if (!confirm(`Supprimer "${product.name}" ?`)) return;
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Produit supprimé");
    load();
  };

  return (
    <div>
      <PageHeader
        title="Produits"
        description="Catalogue affiché sur le site public."
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-terre px-4 py-2.5 text-sm font-semibold text-white hover:bg-terre-dark"
          >
            <Plus className="h-4 w-4" /> Ajouter un produit
          </button>
        }
      />

      <div className="overflow-hidden rounded-card border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">Chargement...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">Aucun produit.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {CATEGORIES.find((c) => c.id === p.category)?.name || p.category}
                  </td>
                  <td className="px-4 py-3">{formatGNF(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.inStock ? "text-terre-dark" : "text-mur-dark"}>
                      {p.inStock ? "En stock" : "Rupture"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 rounded-full p-2 hover:bg-ink/5" aria-label="Modifier">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p)} className="rounded-full p-2 text-mur-dark hover:bg-mur-light" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le produit" : "Nouveau produit"}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom" error={errors.name}>
              <input {...register("name")} className={inputClasses} />
            </Field>
            <Field label="Slug (URL)" error={errors.slug}>
              <input {...register("slug")} className={inputClasses} placeholder="eau-source-1l" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Catégorie" error={errors.category}>
              <select {...register("category")} className={inputClasses}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Unité" error={errors.unit}>
              <input {...register("unit")} className={inputClasses} placeholder="1 L" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prix (GNF)" error={errors.price}>
              <input {...register("price")} type="number" className={inputClasses} />
            </Field>
            <Field label="Image (URL, optionnel)" error={errors.image}>
              <input {...register("image")} className={inputClasses} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Accroche" error={errors.tagline}>
            <input {...register("tagline")} className={inputClasses} />
          </Field>
          <Field label="Description" error={errors.description}>
            <textarea {...register("description")} rows={3} className={inputClasses} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input {...register("inStock")} type="checkbox" className="accent-terre" />
            Produit en stock
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 rounded-full bg-terre py-2.5 text-sm font-semibold text-white hover:bg-terre-dark disabled:opacity-60"
          >
            {editing ? "Enregistrer" : "Créer le produit"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
