export type CategoryId =
  | "eaux"
  | "jus"
  | "farines"
  | "huiles"
  | "conserves";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: "droplet" | "citrus" | "wheat" | "flask" | "package";
  accent: "source" | "mur" | "terre";
}

export const categories: Category[] = [
  {
    id: "eaux",
    name: "Eaux minérales",
    description: "Captées à la source, mises en bouteille sans rien leur retirer.",
    icon: "droplet",
    accent: "source",
  },
  {
    id: "jus",
    name: "Jus & boissons",
    description: "Fruits locaux pressés et nectars, sans arômes artificiels.",
    icon: "citrus",
    accent: "mur",
  },
  {
    id: "farines",
    name: "Farines & céréales",
    description: "Maïs, riz et fonio, moulus près des champs qui les ont fait grandir.",
    icon: "wheat",
    accent: "terre",
  },
  {
    id: "huiles",
    name: "Huiles",
    description: "Palme et arachide, pressées selon un savoir-faire local.",
    icon: "flask",
    accent: "mur",
  },
  {
    id: "conserves",
    name: "Conserves",
    description: "Légumes et sauces préparés au plus près de la récolte.",
    icon: "package",
    accent: "terre",
  },
];

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id);
}
