"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { resellerSchema, type ResellerFormValues } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email";
import { Field, inputClasses } from "@/components/forms/field";

export function ResellerForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResellerFormValues>({ resolver: yupResolver(resellerSchema) });

  const onSubmit = async (values: ResellerFormValues) => {
    try {
      const res = await fetch("/api/resellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("save-failed");
      await sendEmail({ form: "candidature-revendeur", ...values });
      toast.success("Candidature envoyée — notre équipe commerciale vous recontacte sous 5 jours.");
      reset();
    } catch {
      toast.error("L'envoi a échoué. Réessayez dans un instant.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Raison sociale" error={errors.companyName}>
          <input {...register("companyName")} className={inputClasses} placeholder="Établissements..." />
        </Field>
        <Field label="Nom du contact" error={errors.contactName}>
          <input {...register("contactName")} className={inputClasses} placeholder="Votre nom" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email}>
          <input {...register("email")} type="email" className={inputClasses} placeholder="contact@entreprise.com" />
        </Field>
        <Field label="Téléphone" error={errors.phone}>
          <input {...register("phone")} className={inputClasses} placeholder="+224 6XX XX XX XX" />
        </Field>
      </div>
      <Field label="Ville" error={errors.city}>
        <input {...register("city")} className={inputClasses} placeholder="Conakry, Kindia..." />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Numéro RCCM" error={errors.rccm}>
          <input {...register("rccm")} className={inputClasses} placeholder="GC-..." />
        </Field>
        <Field label="Numéro IFU" error={errors.ifu}>
          <input {...register("ifu")} className={inputClasses} />
        </Field>
      </div>
      <Field label="Message (optionnel)" error={errors.message}>
        <textarea
          {...register("message")}
          rows={4}
          className={inputClasses}
          placeholder="Précisez votre zone de distribution actuelle, volumes envisagés..."
        />
      </Field>
      <p className="text-xs text-ink-soft">
        Joignez vos pièces justificatives (RCCM, IFU) en réponse à l&rsquo;email de confirmation — elles sont
        examinées manuellement par l&rsquo;équipe commerciale avant validation.
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-terre px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-terre-dark disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Envoi..." : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
