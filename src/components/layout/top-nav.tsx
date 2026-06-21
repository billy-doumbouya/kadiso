"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, ShoppingBag, HeartHandshake } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { useCart } from "@/components/cart/cart-context";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const aboutLinks = [
  { href: "/a-propos#histoire", label: "Notre histoire" },
  { href: "/a-propos#equipe", label: "Notre équipe" },
  { href: "/a-propos#valeurs", label: "Nos valeurs" },
  { href: "/a-propos#modele", label: "Notre modèle économique" },
];

const mainLinks = [
  { href: "/engagement", label: "Engagement solidaire" },
  { href: "/producteurs", label: "Producteurs" },
  { href: "/revendeurs", label: "Revendeurs" },
  { href: "/blog", label: "Actualités" },
  { href: "/contact", label: "Contact" },
];

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-night text-paper sm:block">
        <Container className="flex h-9 items-center justify-center gap-2 text-xs">
          <HeartHandshake className="h-3.5 w-3.5 text-mur" />
          <span>20% des bénéfices Kadi&rsquo;so soutiennent la Fondation Kadi&rsquo;s Humanitaire</span>
        </Container>
      </div>

      <div
        className={cn(
          "border-b border-ink/0 bg-paper/95 backdrop-blur transition-shadow",
          scrolled && "border-ink/10 shadow-sm"
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="Accueil Kadi'so">
            <Logo />
          </Link>

          <NavigationMenu.Root className="relative hidden lg:block">
            <NavigationMenu.List className="flex items-center gap-1">
              <NavItem href="/">Accueil</NavItem>

              <NavigationMenu.Item className="relative">
                <NavigationMenu.Trigger className="group flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-ink/5">
                  À propos
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute left-0 top-full w-56 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
                  {aboutLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-terre-light"
                    >
                      {l.label}
                    </Link>
                  ))}
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item className="relative">
                <NavigationMenu.Trigger className="group flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-ink/5">
                  Produits
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute left-0 top-full w-64 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/produits?categorie=${c.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-terre-light"
                    >
                      {c.name}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-ink/10" />
                  <Link
                    href="/produits"
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-terre-dark hover:bg-terre-light"
                  >
                    Tous les produits
                  </Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {mainLinks.map((l) => (
                <NavItem key={l.href} href={l.href}>
                  {l.label}
                </NavItem>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <div className="flex items-center gap-2">
            <Link
              href="/boutique"
              className="hidden rounded-full bg-mur px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-mur-dark sm:inline-flex"
            >
              Boutique
            </Link>
            <button
              onClick={openCart}
              aria-label="Voir le panier"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-terre px-1 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-[85%] max-w-sm flex-col gap-1 overflow-y-auto bg-paper p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <MobileLink href="/" onClick={() => setMobileOpen(false)}>
                Accueil
              </MobileLink>
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">À propos</p>
              {aboutLinks.map((l) => (
                <MobileLink key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </MobileLink>
              ))}
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Produits</p>
              <MobileLink href="/produits" onClick={() => setMobileOpen(false)}>
                Tous les produits
              </MobileLink>
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">Kadi&rsquo;so</p>
              {mainLinks.map((l) => (
                <MobileLink key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </MobileLink>
              ))}
              <Link
                href="/boutique"
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-full bg-mur px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Aller à la boutique
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link asChild>
        <Link href={href} className="block rounded-full px-3 py-2 text-sm font-medium text-ink hover:bg-ink/5">
          {children}
        </Link>
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-ink/5"
    >
      {children}
    </Link>
  );
}
