"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (supplier, status) => {
    const res = await fetch(`/api/suppliers/${supplier.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Action impossible");
      return;
    }
    toast.success(status === "validee" ? "Fournisseur validé" : "Candidature refusée");
    load();
  };

  return (
    <div>
      <PageHeader title="Fournisseurs" description="Candidatures soumises via l'espace producteurs." />

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-ink-soft">Chargement...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-sm text-ink-soft">Aucune candidature pour l'instant.</p>
        ) : (
          suppliers.map((s) => (
            <div key={s.id} className="rounded-card border border-ink/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">{s.full_name}</p>
                  <p className="text-sm text-ink-soft">{s.region} · {s.crop}</p>
                  <p className="text-sm text-ink-soft">{s.email} · {s.phone}</p>
                  <p className="mt-2 text-xs text-ink-soft">Volume estimé : {s.estimated_volume}</p>
                  {s.message && <p className="mt-2 text-sm text-ink">{s.message}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  {s.status === "en_attente" && (
                    <>
                      <button onClick={() => decide(s, "validee")} className="rounded-full bg-terre-light p-2 text-terre-dark hover:bg-terre/20" aria-label="Valider">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => decide(s, "refusee")} className="rounded-full bg-mur-light p-2 text-mur-dark hover:bg-mur/20" aria-label="Refuser">
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
