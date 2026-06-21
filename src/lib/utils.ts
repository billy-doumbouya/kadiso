import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGNF(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " GNF";
}
