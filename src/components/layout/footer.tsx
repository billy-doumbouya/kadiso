import Link from "next/link";
import { Phone, Mail, MapPin, HeartHandshake } from "lucide-react";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const columns = [
  {
    title: "Kadi'so",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/produits", label: "Produits" },
      { href: "/blog", label: "Actualités" },
      { href: "/presse", label: "Espace presse" },
    ],
  },
  {
    title: "Partenaires",
    links: [
      { href: "/producteurs", label: "Devenir fournisseur" },
      { href: "/revendeurs", label: "Devenir revendeur" },
      { href: "/engagement", label: "Engagement solidaire" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/boutique", label: "Suivi de commande" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-night text-paper">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Logo tone="white" />
            <p className="mt-4 max-w-xs text-sm text-paper/70">
              Produits agricoles transformés en Guinée — eaux, jus, farines, huiles et conserves.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper/10 px-3.5 py-1.5 text-xs font-medium text-paper">
              <HeartHandshake className="h-4 w-4 text-mur" />
              20% reversés à Kadi&rsquo;s Humanitaire
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-paper">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-paper/70 hover:text-paper">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-sm font-semibold text-paper">Restez informés</h3>
            <p className="mt-3 text-sm text-paper/70">
              Recettes, nouveautés produits et nouvelles de la Fondation, une fois par mois.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-paper/10 pt-8 text-sm text-paper/70 sm:grid-cols-3">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-mur" /> Conakry, Guinée
          </span>
          <a href="tel:+224600000000" className="inline-flex items-center gap-2 hover:text-paper">
            <Phone className="h-4 w-4 text-mur" /> +224 600 00 00 00
          </a>
          <a href="mailto:contact@kadiso.com" className="inline-flex items-center gap-2 hover:text-paper">
            <Mail className="h-4 w-4 text-mur" /> contact@kadiso.com
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Kadi&rsquo;so. Tous droits réservés.</span>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-paper/80">
              Mentions légales
            </Link>
            <Link href="/mentions-legales#cgv" className="hover:text-paper/80">
              CGV
            </Link>
            <Link href="/mentions-legales#confidentialite" className="hover:text-paper/80">
              Confidentialité
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
