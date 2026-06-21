"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Field, inputClasses } from "@/components/forms/field";
import { impactAdminSchema } from "@/lib/validation/admin-schemas";
import { formatGNF } from "@/lib/utils";

export default function AdminImpactPage() {
  const [current, setCurrent] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(impactAdminSchema) });

  const load = async () => {
    const res = await fetch("/api/impact");
    const data = await res.json();
    setCurrent(data);
    reset({ totalAmount: data?.total_amount ?? 0, note: "" });
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    const res = await fetch("/api/impact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error("Mise à jour impossible");
      return;
    }
    toast.success("Compteur solidaire mis à jour");
    load();
  };

  return (
    <div>
      <PageHeader title="Impact solidaire" description="Montant reversé à la Fondation Kadi's Humanitaire, affiché sur le site." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-card border border-ink/10 bg-white p-6">
          <p className="text-sm text-ink-soft">Montant affiché actuellement</p>
          <p className="mt-2 font-display text-3xl font-bold text-terre">
            {current ? formatGNF(current.total_amount) : "..."}
          </p>
          {current?.updated_at && (
            <p className="mt-1 text-xs text-ink-soft">Dernière mise à jour : {current.updated_at}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid h-fit gap-4 rounded-card border border-ink/10 bg-white p-6">
          <Field label="Nouveau montant (GNF)" error={errors.totalAmount}>
            <input {...register("totalAmount")} type="number" className={inputClasses} />
          </Field>
          <Field label="Note (optionnel, contexte interne)" error={errors.note}>
            <input {...register("note")} className={inputClasses} placeholder="Clôture T2 2026" />
          </Field>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-terre py-2.5 text-sm font-semibold text-white hover:bg-terre-dark disabled:opacity-60"
          >
            Mettre à jour le compteur
          </button>
        </form>
      </div>
    </div>
  );
}
