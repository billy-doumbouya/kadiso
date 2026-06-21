"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email";
import { Field, inputClasses } from "@/components/forms/field";

const subjects = [
  "Question sur un produit",
  "Suivi de commande",
  "Devenir revendeur",
  "Devenir fournisseur",
  "Presse",
  "Autre",
];

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: yupResolver(contactSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("save-failed");
      await sendEmail({ form: "contact", ...values });
      toast.success("Message envoyé — nous vous répondons sous peu.");
      reset();
    } catch {
      toast.error("L'envoi a échoué. Réessayez ou appelez-nous directement.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet" error={errors.name}>
          <input {...register("name")} className={inputClasses} placeholder="Mariam Camara" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input {...register("email")} type="email" className={inputClasses} placeholder="vous@email.com" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone (optionnel)" error={errors.phone}>
          <input {...register("phone")} className={inputClasses} placeholder="+224 6XX XX XX XX" />
        </Field>
        <Field label="Objet" error={errors.subject}>
          <select {...register("subject")} className={inputClasses} defaultValue="">
            <option value="" disabled>
              Sélectionnez un objet
            </option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message" error={errors.message}>
        <textarea
          {...register("message")}
          rows={5}
          className={inputClasses}
          placeholder="Votre message..."
        />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-terre px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-terre-dark disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}
