import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Compass className="h-10 w-10 text-terre" strokeWidth={1.5} />
      <h1 className="font-display text-3xl font-bold">Page introuvable</h1>
      <p className="max-w-sm text-ink-soft">Cette page n&rsquo;existe pas ou a été déplacée.</p>
      <Link href="/" className="rounded-full bg-terre px-6 py-3 text-sm font-semibold text-white hover:bg-terre-dark">
        Retour à l&rsquo;accueil
      </Link>
    </Container>
  );
}
