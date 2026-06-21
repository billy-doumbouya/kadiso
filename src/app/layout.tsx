import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnalyticsBeacon } from "@/components/analytics-beacon";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kadiso.com"),
  title: {
    default: "Kadi'so — Eaux, jus, farines et huiles guinéennes",
    template: "%s — Kadi'so",
  },
  description:
    "Kadi'so transforme les produits agricoles locaux guinéens en aliments, boissons et eaux minérales, et reverse 20% de ses bénéfices à la Fondation Kadi's Humanitaire.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} ${openSans.variable} antialiased`}>
        <CartProvider>
          <AnalyticsBeacon />
          <TopNav />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-right" richColors closeButton />
        </CartProvider>
      </body>
    </html>
  );
}
