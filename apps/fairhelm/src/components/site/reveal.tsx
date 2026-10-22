import type { ReactNode } from "react";
import { Reveal as SharedReveal } from "@fairhelm/ui/components/reveal";
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  threshold?: number;
}) {
  return (
    <SharedReveal className={className} staggerChildren={stagger} delay={delay}>
      {children}
    </SharedReveal>
  );
}
