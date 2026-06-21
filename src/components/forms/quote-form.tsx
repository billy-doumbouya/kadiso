"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { quoteSchema, type QuoteFormValues } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email";
import { Field, inputClasses } from "@/components/forms/field";

export function QuoteForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({ resolver: yupResolver(quoteSchema) });

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("save-failed");
      await sendEmail({ form: "devis-b2b", ...values });
      toast.success("Demande de devis envoyée au service commercial.");
      reset();
    } catch {
      toast.error("L'envoi a échoué. Réessayez dans un instant.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Raison sociale" error={errors.companyName}>
          <input {...register("companyName")} className={inputClasses} />
        </Field>
        <Field label="Localisation" error={errors.location}>
          <input {...register("location")} className={inputClasses} placeholder="Ville, quartier" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email}>
          <input {...register("email")} type="email" className={inputClasses} />
        </Field>
        <Field label="Téléphone" error={errors.phone}>
          <input {...register("phone")} className={inputClasses} />
        </Field>
      </div>
      <Field label="Produits souhaités" error={errors.products}>
        <textarea
          {...register("products")}
          rows={3}
          className={inputClasses}
          placeholder="Ex : Eau de source 1L, Nectar d'orange 1L..."
        />
      </Field>
      <Field label="Quantité totale (unités)" error={errors.quantity}>
        <input {...register("quantity")} type="number" className={inputClasses} placeholder="500" />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-source px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-source-dark disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Envoi..." : "Demander un devis"}
      </button>
    </form>
  );
}
