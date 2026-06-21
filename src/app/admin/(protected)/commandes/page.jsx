"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatGNF } from "@/lib/utils";

const STATUSES = ["en_attente", "payee", "expediee", "livree", "annulee"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (order, status) => {
    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Mise à jour impossible");
      return;
    }
    toast.success("Statut mis à jour");
    load();
  };

  return (
    <div>
      <PageHeader title="Commandes" description="Suivi des commandes passées sur la boutique." />

      <div className="overflow-hidden rounded-card border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">N°</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Zone</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-soft">Chargement...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-soft">Aucune commande pour l'instant.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-medium">{o.order_number}</td>
                  <td className="px-4 py-3">
                    <p>{o.full_name}</p>
                    <p className="text-xs text-ink-soft">{o.phone} · {o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{o.zone}</td>
                  <td className="px-4 py-3">{formatGNF(o.total_amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.status} />
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o, e.target.value)}
                        className="rounded-lg border border-ink/15 bg-white px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
