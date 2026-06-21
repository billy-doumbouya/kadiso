"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validation/schemas";
import { sendEmail } from "@/lib/email";

export function NewsletterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({ resolver: yupResolver(newsletterSchema) });

  const onSubmit = async (values: NewsletterFormValues) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("save-failed");
      await sendEmail({ form: "newsletter", ...values });
      toast.success("Inscription confirmée — merci !");
      reset();
    } catch {
      toast.error("L'inscription a échoué. Réessayez dans un instant.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <div className="flex overflow-hidden rounded-full bg-paper/10 focus-within:ring-2 focus-within:ring-mur">
        <input
          {...register("email")}
          type="email"
          placeholder="vous@email.com"
          className="w-full bg-transparent px-4 py-2.5 text-sm text-paper placeholder:text-paper/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="S'inscrire à la newsletter"
          className="flex items-center justify-center bg-mur px-3.5 text-white transition-colors hover:bg-mur-dark disabled:opacity-60"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {errors.email && <p className="mt-1.5 text-xs text-mur">{errors.email.message}</p>}
    </form>
  );
}
