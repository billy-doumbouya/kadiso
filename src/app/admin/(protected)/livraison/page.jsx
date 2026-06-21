"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Field, inputClasses } from "@/components/forms/field";
import { zoneAdminSchema } from "@/lib/validation/admin-schemas";

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(zoneAdminSchema) });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/delivery-zones");
    setZones(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (values) => {
    const res = await fetch("/api/delivery-zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error("Création impossible");
      return;
    }
    toast.success("Zone ajoutée");
    reset({ zone: "", fee: "", delay: "" });
    load();
  };

  const remove = async (zone) => {
    if (!confirm(`Supprimer la zone "${zone.zone}" ?`)) return;
    const res = await fetch(`/api/delivery-zones/${zone.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Zone supprimée");
    load();
  };

  return (
    <div>
      <PageHeader title="Livraison" description="Zones, frais et délais affichés sur la boutique." />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-card border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Zone</th>
                <th className="px-4 py-3 font-medium">Frais</th>
                <th className="px-4 py-3 font-medium">Délai</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-soft">Chargement...</td></tr>
              ) : zones.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-soft">Aucune zone.</td></tr>
              ) : (
                zones.map((z) => (
                  <tr key={z.id}>
                    <td className="px-4 py-3 font-medium">{z.zone}</td>
                    <td className="px-4 py-3 text-ink-soft">{z.fee}</td>
                    <td className="px-4 py-3 text-ink-soft">{z.delay}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(z)} className="rounded-full p-2 text-mur-dark hover:bg-mur-light" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid h-fit gap-4 rounded-card border border-ink/10 bg-white p-6">
          <h2 className="font-display font-semibold">Ajouter une zone</h2>
          <Field label="Zone" error={errors.zone}>
            <input {...register("zone")} className={inputClasses} placeholder="Conakry — Ratoma" />
          </Field>
          <Field label="Frais" error={errors.fee}>
            <input {...register("fee")} className={inputClasses} placeholder="15 000 GNF" />
          </Field>
          <Field label="Délai" error={errors.delay}>
            <input {...register("delay")} className={inputClasses} placeholder="24 à 48h" />
          </Field>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-terre py-2.5 text-sm font-semibold text-white hover:bg-terre-dark disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
