"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validation/schemas";
import { Field, inputClasses } from "@/components/forms/field";

const paymentMethods = [
  { id: "credit-money", label: "Crédit Money" },
  { id: "virement", label: "Virement bancaire" },
  { id: "carte", label: "Carte bancaire (agrégateur)" },
];

export function CheckoutForm({
  onSubmit,
  submitting,
  zones,
}: {
  onSubmit: (values: CheckoutFormValues) => void;
  submitting: boolean;
  zones: { zone: string; fee: string }[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: yupResolver(checkoutSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet" error={errors.fullName}>
          <input {...register("fullName")} className={inputClasses} />
        </Field>
        <Field label="Téléphone" error={errors.phone}>
          <input {...register("phone")} className={inputClasses} placeholder="+224 6XX XX XX XX" />
        </Field>
      </div>
      <Field label="Email" error={errors.email}>
        <input {...register("email")} type="email" className={inputClasses} />
      </Field>
      <Field label="Adresse de livraison" error={errors.address}>
        <input {...register("address")} className={inputClasses} placeholder="Quartier, rue, repère" />
      </Field>
      <Field label="Zone de livraison" error={errors.zone}>
        <select {...register("zone")} className={inputClasses} defaultValue="">
          <option value="" disabled>
            Sélectionnez votre zone
          </option>
          {zones.map((z) => (
            <option key={z.zone} value={z.zone}>
              {z.zone} — {z.fee}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Mode de paiement" error={errors.paymentMethod}>
        <div className="grid gap-2 sm:grid-cols-3">
          {paymentMethods.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-ink/15 px-3 py-2.5 text-sm has-[:checked]:border-terre has-[:checked]:bg-terre-light"
            >
              <input {...register("paymentMethod")} type="radio" value={m.id} className="accent-terre" />
              {m.label}
            </label>
          ))}
        </div>
      </Field>
      <p className="text-xs text-ink-soft">
        Aucune donnée de paiement n&rsquo;est stockée sur nos serveurs : la transaction est traitée par un
        agrégateur tiers via des jetons sécurisés.
      </p>
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-full bg-terre px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-terre-dark disabled:opacity-60"
      >
        {submitting ? "Validation..." : "Confirmer la commande"}
      </button>
    </form>
  );
}
