import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Formulaire de contact, coordonnées des usines et bureaux, service client Kadi'so.",
};

const offices = [
  { name: "Siège & bureaux commerciaux", address: "Quartier Almamya, Kaloum, Conakry" },
  { name: "Usine de transformation", address: "Zone industrielle, Kindia" },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-night py-20 text-paper sm:py-28">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            Contact
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Une question ? Écrivez-nous
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="rounded-card border border-ink/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Formulaire général</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.05}>
              <div className="rounded-card border border-ink/10 bg-white p-6">
                <h2 className="font-display font-semibold">Service client</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href="tel:+224600000000" className="inline-flex items-center gap-2 hover:text-terre-dark">
                      <Phone className="h-4 w-4 text-terre" /> +224 600 00 00 00
                    </a>
                  </li>
                  <li>
                    <a href="mailto:contact@kadiso.com" className="inline-flex items-center gap-2 hover:text-terre-dark">
                      <Mail className="h-4 w-4 text-terre" /> contact@kadiso.com
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/224600000000" className="inline-flex items-center gap-2 hover:text-terre-dark">
                      <MessageCircle className="h-4 w-4 text-terre" /> WhatsApp
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-card border border-ink/10 bg-white p-6">
                <h2 className="font-display font-semibold">Usines & bureaux</h2>
                <ul className="mt-4 space-y-4">
                  {offices.map((o) => (
                    <li key={o.name} className="flex gap-3 text-sm">
                      <MapPin className="h-4 w-4 shrink-0 text-terre" />
                      <div>
                        <p className="font-medium text-ink">{o.name}</p>
                        <p className="text-ink-soft">{o.address}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            <iframe
              title="Carte des sites Kadi'so à Conakry"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-13.62%2C9.60%2C-13.54%2C9.68&layer=mapnik&marker=9.6412%2C-13.5784"
              className="h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
