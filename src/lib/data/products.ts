import type { CategoryId } from "./categories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number; // GNF
  unit: string;
  image?: string;
  tagline: string;
  description: string;
  details: { label: string; value: string }[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "eau-source-kadiso-1l",
    name: "Eau de Source Kadi'so 1L",
    category: "eaux",
    price: 5000,
    unit: "1 L",
    tagline: "Captée dans le Fouta-Djalon, mise en bouteille sur site.",
    description:
      "Une eau minérale naturelle, faiblement minéralisée, puisée à la source et embouteillée sans traitement chimique.",
    details: [
      { label: "Origine", value: "Fouta-Djalon, Guinée" },
      { label: "Conditionnement", value: "Bouteille PET recyclable" },
      { label: "Conservation", value: "24 mois" },
    ],
    inStock: true,
  },
  {
    id: "p2",
    slug: "eau-source-kadiso-50cl",
    name: "Eau de Source Kadi'so 50cl",
    category: "eaux",
    price: 3000,
    unit: "50 cl",
    tagline: "Le format nomade, pour la ville comme pour les champs.",
    description: "Le même profil minéral que notre bouteille 1L, dans un format compact à emporter partout.",
    details: [
      { label: "Origine", value: "Fouta-Djalon, Guinée" },
      { label: "Conditionnement", value: "Bouteille PET recyclable" },
    ],
    inStock: true,
  },
  {
    id: "p3",
    slug: "eau-gazeifiee-kadiso",
    name: "Eau Gazéifiée Kadi'so",
    category: "eaux",
    price: 6000,
    unit: "75 cl",
    tagline: "Notre eau de source, légèrement pétillante.",
    description: "Gazéification naturelle douce pour accompagner les repas ou se rafraîchir autrement.",
    details: [
      { label: "Origine", value: "Fouta-Djalon, Guinée" },
      { label: "Conditionnement", value: "Bouteille verre" },
    ],
    inStock: true,
  },
  {
    id: "p4",
    slug: "nectar-orange-kadiso",
    name: "Nectar d'Orange Kadi'so",
    category: "jus",
    price: 8500,
    unit: "1 L",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1200&q=80",
    tagline: "Oranges des vergers de Kindia, pressées sous 48h.",
    description:
      "Un nectar généreux en pulpe, sans colorant ni conservateur, fait à partir d'oranges cueillies à maturité.",
    details: [
      { label: "Teneur en fruit", value: "65%" },
      { label: "Sucres ajoutés", value: "Aucun" },
      { label: "Origine des fruits", value: "Kindia, Guinée" },
    ],
    inStock: true,
  },
  {
    id: "p5",
    slug: "jus-bissap",
    name: "Jus de Bissap",
    category: "jus",
    price: 7000,
    unit: "1 L",
    tagline: "L'hibiscus local, infusé et légèrement sucré au miel.",
    description: "Une boisson traditionnelle revisitée, riche en couleur et en fraîcheur, sucrée au miel local.",
    details: [
      { label: "Édulcorant", value: "Miel de Guinée" },
      { label: "Colorant", value: "Naturel (hibiscus)" },
    ],
    inStock: true,
  },
  {
    id: "p6",
    slug: "jus-mangue",
    name: "Nectar de Mangue",
    category: "jus",
    price: 8500,
    unit: "1 L",
    tagline: "Mangues Kent de la haute Guinée, à pleine maturité.",
    description: "Onctueux et parfumé, ce nectar capture la mangue guinéenne à son meilleur moment de récolte.",
    details: [
      { label: "Teneur en fruit", value: "60%" },
      { label: "Origine des fruits", value: "Haute Guinée" },
    ],
    inStock: true,
  },
  {
    id: "p7",
    slug: "farine-mais",
    name: "Farine de Maïs",
    category: "farines",
    price: 9000,
    unit: "1 kg",
    tagline: "Moulue à la ferme, sans additif.",
    description: "Une farine de maïs entière, moulue dans les jours suivant la récolte pour préserver son goût.",
    details: [
      { label: "Mouture", value: "Pierre" },
      { label: "Origine", value: "Coopératives de Kankan" },
    ],
    inStock: true,
  },
  {
    id: "p8",
    slug: "riz-local-etuve",
    name: "Riz Local Étuvé",
    category: "farines",
    price: 12000,
    unit: "5 kg",
    tagline: "Issu des bas-fonds rizicoles de Guinée forestière.",
    description: "Un riz étuvé qui conserve davantage de nutriments, cultivé par nos partenaires producteurs.",
    details: [
      { label: "Type", value: "Riz étuvé" },
      { label: "Origine", value: "Guinée forestière" },
    ],
    inStock: true,
  },
  {
    id: "p9",
    slug: "farine-fonio",
    name: "Farine de Fonio",
    category: "farines",
    price: 11000,
    unit: "1 kg",
    tagline: "La céréale ancestrale d'Afrique de l'Ouest, sans gluten.",
    description: "Le fonio, cultivé depuis des siècles en Guinée, offre une farine fine, sans gluten et riche en fibres.",
    details: [
      { label: "Sans gluten", value: "Oui" },
      { label: "Origine", value: "Moyenne Guinée" },
    ],
    inStock: true,
  },
  {
    id: "p10",
    slug: "huile-palme-rouge",
    name: "Huile de Palme Rouge",
    category: "huiles",
    price: 15000,
    unit: "1 L",
    tagline: "Pressée artisanalement, riche en bêta-carotène.",
    description: "Une huile de palme rouge non raffinée, pressée selon des méthodes traditionnelles guinéennes.",
    details: [
      { label: "Procédé", value: "Pression artisanale" },
      { label: "Raffinage", value: "Non raffinée" },
    ],
    inStock: true,
  },
  {
    id: "p11",
    slug: "huile-arachide",
    name: "Huile d'Arachide",
    category: "huiles",
    price: 14000,
    unit: "1 L",
    tagline: "Arachides de Haute Guinée, pressées à froid.",
    description: "Une huile au goût doux et typé, pressée à froid pour préserver ses qualités nutritionnelles.",
    details: [
      { label: "Procédé", value: "Pression à froid" },
      { label: "Origine", value: "Haute Guinée" },
    ],
    inStock: true,
  },
  {
    id: "p12",
    slug: "sauce-tomate-piment",
    name: "Sauce Tomate au Piment",
    category: "conserves",
    price: 6500,
    unit: "350 g",
    image:
      "https://images.unsplash.com/photo-1525027684690-6de2d445842b?auto=format&fit=crop&w=1200&q=80",
    tagline: "Tomates et piments locaux, mis en bocal à la saison.",
    description: "Une base de sauce prête à l'emploi, préparée avec des légumes cultivés par nos producteurs partenaires.",
    details: [
      { label: "Conditionnement", value: "Bocal en verre" },
      { label: "Conservateurs", value: "Aucun" },
    ],
    inStock: true,
  },
  {
    id: "p13",
    slug: "legumes-conserve-melange",
    name: "Mélange de Légumes en Conserve",
    category: "conserves",
    price: 5500,
    unit: "400 g",
    tagline: "Carottes, haricots et maïs doux, mis en bocal le jour de la récolte.",
    description: "Un mélange de légumes pratique pour cuisiner vite, sans perdre le goût du frais.",
    details: [
      { label: "Conditionnement", value: "Bocal en verre" },
    ],
    inStock: true,
  },
  {
    id: "p14",
    slug: "confiture-mangue",
    name: "Confiture de Mangue",
    category: "conserves",
    price: 7000,
    unit: "250 g",
    tagline: "Mangues mûres et sucre de canne, rien d'autre.",
    description: "Une confiture artisanale qui valorise les surplus de mangue de nos producteurs partenaires.",
    details: [
      { label: "Sucre", value: "Canne locale" },
    ],
    inStock: true,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: CategoryId) {
  return products.filter((p) => p.category === category);
}
