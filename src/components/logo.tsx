import { cn } from "@/lib/utils";

type Tone = "brand" | "white" | "ink";

const toneMap: Record<Tone, { square: string; wave: string; dot: string; word: string }> = {
  brand: { square: "#2e7d32", wave: "#f6f7f1", dot: "#f57c00", word: "#20241f" },
  white: { square: "rgba(255,255,255,0.12)", wave: "#ffffff", dot: "#f57c00", word: "#ffffff" },
  ink: { square: "#20241f", wave: "#f6f7f1", dot: "#f57c00", word: "#20241f" },
};

export function LogoMark({
  tone = "brand",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  const c = toneMap[tone];
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="Symbole Kadi'so"
    >
      <rect x="1" y="1" width="46" height="46" rx="14" fill={c.square} />
      <path
        d="M9 32 C 16 18, 20 30, 24 22 C 28 14, 33 24, 39 16"
        fill="none"
        stroke={c.wave}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="39" cy="16" r="3" fill={c.dot} />
    </svg>
  );
}

export function Logo({
  tone = "brand",
  className,
  wordmarkClassName,
}: {
  tone?: Tone;
  className?: string;
  wordmarkClassName?: string;
}) {
  const c = toneMap[tone];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} />
      <span
        className={cn("font-display text-lg font-bold tracking-tight", wordmarkClassName)}
        style={{ color: c.word }}
      >
        Kadi&rsquo;so
      </span>
    </span>
  );
}
