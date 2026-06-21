import { Droplet, Citrus, Wheat, FlaskConical, PackageOpen, type LucideProps } from "lucide-react";
import type { Category } from "@/lib/data/categories";

const iconMap: Record<Category["icon"], React.ComponentType<LucideProps>> = {
  droplet: Droplet,
  citrus: Citrus,
  wheat: Wheat,
  flask: FlaskConical,
  package: PackageOpen,
};

export function CategoryIcon({ icon, ...props }: { icon: Category["icon"] } & LucideProps) {
  const Icon = iconMap[icon];
  return <Icon {...props} />;
}
