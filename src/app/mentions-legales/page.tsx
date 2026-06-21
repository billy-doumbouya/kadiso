import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales, CGU, CGV et politique de confidentialité Kadi'so.",
};

export default function LegalPage() {
  return (
    <>
      <section className="bg-night py-16 text-paper sm:py-20">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Informations légales
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Mentions légales
          </h1>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[200px_1fr]">
        <nav className="hidden lg:block">
          <ul className="space-y-2 text-sm">
            <li><a href="#mentions" className="text-ink-soft hover:text-terre-dark">Mentions légales</a></li>
            <li><a href="#cgu" className="text-ink-soft hover:text-terre-dark">CGU</a></li>
            <li><a href="#cgv" className="text-ink-soft hover:text-terre-dark">CGV</a></li>
            <li><a href="#confidentialite" className="text-ink-soft hover:text-terre-dark">Confidentialité</a></li>
          </ul>
        </nav>

        <div className="max-w-2xl space-y-12 text-ink-soft">
          <section id="mentions">
            <h2 className="font-display text-2xl font-bold text-ink">Mentions légales</h2>
            <p className="mt-4">
              Le site kadiso.com est édité par Kadi&rsquo;so, entreprise agro-industrielle enregistrée en
              République de Guinée. Pour toute question relative à l&rsquo;édition du site, contactez
              contact@kadiso.com.
            </p>
          </section>

          <section id="cgu">
            <h2 className="font-display text-2xl font-bold text-ink">Conditions générales d&rsquo;utilisation</h2>
            <p className="mt-4">
              L&rsquo;utilisation du site kadiso.com implique l&rsquo;acceptation pleine et entière des
              présentes conditions. Kadi&rsquo;so se réserve le droit de modifier le site et ses contenus
              à tout moment, sans préavis.
            </p>
          </section>

          <section id="cgv">
            <h2 className="font-display text-2xl font-bold text-ink">Conditions générales de vente</h2>
            <p className="mt-4">
              Les prix affichés sont en Francs Guinéens (GNF), toutes taxes comprises. Les délais et frais
              de livraison varient selon la zone, consultables sur la page Boutique. Le paiement s&rsquo;effectue
              par Crédit Money, virement bancaire ou carte via un agrégateur tiers ; aucune donnée de paiement
              n&rsquo;est conservée par Kadi&rsquo;so.
            </p>
          </section>

          <section id="confidentialite">
            <h2 className="font-display text-2xl font-bold text-ink">Politique de confidentialité</h2>
            <p className="mt-4">
              Les informations collectées via les formulaires du site (contact, candidature revendeur ou
              fournisseur, commande) sont utilisées exclusivement pour traiter votre demande et ne sont
              transmises à aucun tiers à des fins commerciales. Vous pouvez demander la suppression de vos
              données en écrivant à contact@kadiso.com.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
