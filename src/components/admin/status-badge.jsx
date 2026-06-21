import { cn } from "@/lib/utils";

const styles = {
  en_attente: "bg-mur-light text-mur-dark",
  nouveau: "bg-mur-light text-mur-dark",
  payee: "bg-source-light text-source-dark",
  expediee: "bg-source-light text-source-dark",
  livree: "bg-terre-light text-terre-dark",
  validee: "bg-terre-light text-terre-dark",
  traite: "bg-terre-light text-terre-dark",
  refusee: "bg-ink/10 text-ink-soft",
  annulee: "bg-ink/10 text-ink-soft",
};

const labels = {
  en_attente: "En attente",
  nouveau: "Nouveau",
  payee: "Payée",
  expediee: "Expédiée",
  livree: "Livrée",
  validee: "Validée",
  traite: "Traité",
  refusee: "Refusée",
  annulee: "Annulée",
};

export function StatusBadge({ status }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", styles[status] || "bg-ink/10 text-ink-soft")}>
      {labels[status] || status}
    </span>
  );
}
