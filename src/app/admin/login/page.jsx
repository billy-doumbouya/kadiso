"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Logo } from "@/components/logo";
import { Field, inputClasses } from "@/components/forms/field";

const loginSchema = yup.object({
  email: yup.string().trim().email("Adresse email invalide").required("L'email est requis"),
  password: yup.string().required("Le mot de passe est requis"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Connexion refusée");
        return;
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      toast.error("Impossible de se connecter pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <div className="w-full max-w-sm rounded-2xl border border-paper/10 bg-paper p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <Lock className="h-3.5 w-3.5" /> Administration
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4">
          <Field label="Email" error={errors.email}>
            <input {...register("email")} type="email" className={inputClasses} placeholder="admin@kadiso.com" />
          </Field>
          <Field label="Mot de passe" error={errors.password}>
            <input {...register("password")} type="password" className={inputClasses} />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-terre py-3 text-sm font-semibold text-white transition-colors hover:bg-terre-dark disabled:opacity-60"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
