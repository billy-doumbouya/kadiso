"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminResellersPage() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/resellers");
    setResellers(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (reseller, status) => {
    const res = await fetch(`/api/resellers/${reseller.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Action impossible");
      return;
    }
    toast.success(status === "validee" ? "Revendeur validé" : "Candidature refusée");
    load();
  };

  return (
    <div>
      <PageHeader title="Revendeurs" description="Candidatures soumises via l'espace revendeurs." />

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-ink-soft">Chargement...</p>
        ) : resellers.length === 0 ? (
          <p className="text-sm text-ink-soft">Aucune candidature pour l'instant.</p>
        ) : (
          resellers.map((r) => (
            <div key={r.id} className="rounded-card border border-ink/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">{r.company_name}</p>
                  <p className="text-sm text-ink-soft">{r.contact_name} · {r.city}</p>
                  <p className="text-sm text-ink-soft">{r.email} · {r.phone}</p>
                  <p className="mt-2 text-xs text-ink-soft">RCCM : {r.rccm} — IFU : {r.ifu}</p>
                  {r.message && <p className="mt-2 text-sm text-ink">{r.message}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.status === "en_attente" && (
                    <>
                      <button onClick={() => decide(r, "validee")} className="rounded-full bg-terre-light p-2 text-terre-dark hover:bg-terre/20" aria-label="Valider">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => decide(r, "refusee")} className="rounded-full bg-mur-light p-2 text-mur-dark hover:bg-mur/20" aria-label="Refuser">
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
