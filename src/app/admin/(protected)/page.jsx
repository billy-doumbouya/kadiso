import { ShoppingCart, Wallet, Handshake, Sprout, Mail, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Stats } from "@/lib/db";
import { formatGNF } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = await Stats.summary();
  const cards = [
    { icon: Wallet, label: "Chiffre d'affaires", value: formatGNF(stats.revenue) },
    { icon: ShoppingCart, label: "Commandes", value: stats.ordersCount, hint: `${stats.pendingOrders} en attente` },
    { icon: Handshake, label: "Candidatures revendeurs", value: stats.pendingResellers, hint: "en attente" },
    { icon: Sprout, label: "Candidatures fournisseurs", value: stats.pendingSuppliers, hint: "en attente" },
    { icon: Mail, label: "Nouveaux messages", value: stats.newMessages },
    { icon: Users, label: "Visiteurs (cumulés)", value: stats.pageViews },
  ];
  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité Kadi'so."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-ink/10 bg-white p-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-terre-light text-terre-dark">
              <c.icon className="h-4.5 w-4.5" strokeWidth={1.8} />
            </span>
            <p className="mt-4 font-display text-2xl font-bold text-ink">{c.value}</p>
            <p className="text-sm text-ink-soft">
              {c.label}
              {c.hint && <span className="ml-1 text-ink-soft/70">· {c.hint}</span>}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-card border border-ink/10 bg-white p-6">
        <h2 className="font-display font-semibold">Produits les plus vendus</h2>
        {stats.topProducts.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">Pas encore de commande enregistrée.</p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10">
            {stats.topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between py-2.5 text-sm">
                <span>
                  <span className="mr-2 text-ink-soft">#{i + 1}</span>
                  {p.name}
                </span>
                <span className="font-medium">{p.quantity} unités</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}