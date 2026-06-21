"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Handshake,
  Sprout,
  Mail,
  Newspaper,
  Truck,
  HeartHandshake,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/revendeurs", label: "Revendeurs", icon: Handshake },
  { href: "/admin/fournisseurs", label: "Fournisseurs", icon: Sprout },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/livraison", label: "Livraison", icon: Truck },
  { href: "/admin/impact", label: "Impact solidaire", icon: HeartHandshake },
];

export function AdminSidebar({ adminName }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Déconnecté");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-white">
      <div className="border-b border-ink/10 p-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                active ? "bg-terre-light text-terre-dark" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              )}
            >
              <l.icon className="h-4 w-4" strokeWidth={1.8} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ink/10 p-4">
        <p className="truncate text-xs text-ink-soft">{adminName}</p>
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-mur-dark hover:underline"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
