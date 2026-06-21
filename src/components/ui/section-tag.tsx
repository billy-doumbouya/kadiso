import { cn } from "@/lib/utils";

export function SectionTag({
  children,
  tone = "terre",
  className,
}: {
  children: React.ReactNode;
  tone?: "terre" | "mur" | "source";
  className?: string;
}) {
  const colors = {
    terre: "text-terre bg-terre-light",
    mur: "text-mur-dark bg-mur-light",
    source: "text-source-dark bg-source-light",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        colors[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
