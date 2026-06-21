import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTag } from "@/components/ui/section-tag";
import { faqItems } from "@/lib/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Réponses aux questions fréquentes sur les commandes, la livraison et les partenariats Kadi'so.",
};

export default function FaqPage() {
  return (
    <>
      <section className="bg-night py-20 text-paper sm:py-28">
        <Container>
          <SectionTag tone="mur" className="bg-mur/15 text-mur">
            FAQ
          </SectionTag>
          <h1 className="text-balance mt-5 max-w-xl font-display text-4xl font-extrabold sm:text-5xl">
            Questions fréquentes
          </h1>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl divide-y divide-ink/10 rounded-card border border-ink/10 bg-white">
          {faqItems.map((item) => (
            <details key={item.question} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
