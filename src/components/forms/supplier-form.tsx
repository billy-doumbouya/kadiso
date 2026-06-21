"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { supplierSchema, type SupplierFormValues } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email";
import { Field, inputClasses } from "@/components/forms/field";
import { typedResolver } from "@/lib/validation/Resolvers";

export function SupplierForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({ resolver: typedResolver(supplierSchema) });

  const onSubmit = async (values: SupplierFormValues) => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("save-failed");
      await sendEmail({ form: "candidature-fournisseur", ...values });
      toast.success("Candidature envoyée — l'équipe achats agricoles vous recontacte sous 5 jours.");
      reset();
    } catch {
      toast.error("L'envoi a échoué. Réessayez dans un instant.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet" error={errors.fullName}>
          <input {...register("fullName")} className={inputClasses} />
        </Field>
        <Field label="Région" error={errors.region}>
          <input {...register("region")} className={inputClasses} placeholder="Kankan, Kindia..." />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone" error={errors.phone}>
          <input {...register("phone")} className={inputClasses} placeholder="+224 6XX XX XX XX" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input {...register("email")} type="email" className={inputClasses} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Production (maïs, mangue...)" error={errors.crop}>
          <input {...register("crop")} className={inputClasses} />
        </Field>
        <Field label="Volume estimé / campagne" error={errors.estimatedVolume}>
          <input {...register("estimatedVolume")} className={inputClasses} placeholder="Ex : 2 tonnes" />
        </Field>
      </div>
      <Field label="Message (optionnel)" error={errors.message}>
        <textarea {...register("message")} rows={4} className={inputClasses} />
      </Field>
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
