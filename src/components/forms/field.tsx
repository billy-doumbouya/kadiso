import { cn } from "@/lib/utils";
import type { FieldError } from "react-hook-form";

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="text-xs text-mur-dark">{error.message}</span>}
    </label>
  );
}

export const inputClasses =
  "rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-terre focus:outline-none focus:ring-2 focus:ring-terre/20";
