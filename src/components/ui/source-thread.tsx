"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Used sparingly — once per page at most — as the one signature element that
 * threads the "source" (water) and "terroir" (dotted field) motifs from the
 * brand brief through the design, rather than decorating every section.
 */
export function SourceThread({
  className,
  stroke = "#2e7d32",
  height = 160,
}: {
  className?: string;
  stroke?: string;
  height?: number;
}) {
  return (
    <svg
      viewBox={`0 0 40 ${height}`}
      width={40}
      height={height}
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <motion.path
        d={`M20 0 C 6 ${height * 0.18}, 34 ${height * 0.32}, 20 ${height * 0.5} C 6 ${height * 0.68}, 34 ${height * 0.82}, 20 ${height}`}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.55 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      {[0.08, 0.5, 0.92].map((pos, i) => (
        <motion.circle
          key={i}
          cx={20}
          cy={height * pos}
          r={3}
          fill={stroke}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.35 }}
        />
      ))}
    </svg>
  );
}

export function WaveRule({ className, stroke = "#2e7d32" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 240 16" className={cn("h-4 w-full", className)} preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 8 Q 30 0 60 8 T 120 8 T 180 8 T 240 8"
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        opacity="0.45"
      />
    </svg>
  );
}
