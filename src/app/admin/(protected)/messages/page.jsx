"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/messages");
    setMessages(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markTreated = async (message) => {
    const res = await fetch(`/api/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "traite" }),
    });
    if (!res.ok) {
      toast.error("Action impossible");
      return;
    }
    toast.success("Message marqué comme traité");
    load();
  };

  return (
    <div>
      <PageHeader title="Messages" description="Soumissions du formulaire de contact général." />

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-ink-soft">Chargement...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-ink-soft">Aucun message pour l'instant.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-card border border-ink/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-semibold">{m.subject}</p>
                  <p className="text-sm text-ink-soft">{m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                  <p className="mt-2 text-sm text-ink">{m.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={m.status} />
                  {m.status === "nouveau" && (
                    <button onClick={() => markTreated(m)} className="rounded-full bg-terre-light p-2 text-terre-dark hover:bg-terre/20" aria-label="Marquer comme traité">
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
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
