"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Modal } from "@/components/admin/modal";
import { Field, inputClasses } from "@/components/forms/field";
import { blogAdminSchema } from "@/lib/validation/admin-schemas";

const CATEGORIES = [
  { id: "actualites", name: "Actu Kadi'so" },
  { id: "recettes", name: "Recettes & nutrition" },
  { id: "evenements", name: "Événements" },
  { id: "presse", name: "Presse" },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(blogAdminSchema) });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/blog");
    setPosts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", slug: "", category: "actualites", date: new Date().toISOString().slice(0, 10), image: "", excerpt: "", content: "" });
    setModalOpen(true);
  };

  const openEdit = (post) => {
    setEditing(post);
    reset({ ...post, image: post.image || "", content: (post.content || []).join("\n\n") });
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    const payload = { ...values, content: values.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) };
    const res = await fetch(editing ? `/api/blog/${editing.id}` : "/api/blog", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Une erreur est survenue");
      return;
    }
    toast.success(editing ? "Article mis à jour" : "Article publié");
    setModalOpen(false);
    load();
  };

  const remove = async (post) => {
    if (!confirm(`Supprimer "${post.title}" ?`)) return;
    const res = await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Article supprimé");
    load();
  };

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Articles publiés sur le site."
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-terre px-4 py-2.5 text-sm font-semibold text-white hover:bg-terre-dark">
            <Plus className="h-4 w-4" /> Nouvel article
          </button>
        }
      />

      <div className="overflow-hidden rounded-card border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-soft">Chargement...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-soft">Aucun article.</td></tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-ink-soft">{CATEGORIES.find((c) => c.id === p.category)?.name || p.category}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.date}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'article" : "Nouvel article"}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Field label="Titre" error={errors.title}>
            <input {...register("title")} className={inputClasses} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug (URL)" error={errors.slug}>
              <input {...register("slug")} className={inputClasses} />
            </Field>
            <Field label="Date" error={errors.date}>
              <input {...register("date")} type="date" className={inputClasses} />
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
            <Field label="Image (URL, optionnel)" error={errors.image}>
              <input {...register("image")} className={inputClasses} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Résumé" error={errors.excerpt}>
            <textarea {...register("excerpt")} rows={2} className={inputClasses} />
          </Field>
          <Field label="Contenu (paragraphes séparés par une ligne vide)" error={errors.content}>
            <textarea {...register("content")} rows={6} className={inputClasses} />
          </Field>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 rounded-full bg-terre py-2.5 text-sm font-semibold text-white hover:bg-terre-dark disabled:opacity-60"
          >
            {editing ? "Enregistrer" : "Publier l'article"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
