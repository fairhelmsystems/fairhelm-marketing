import { Building2, Layers3, Sprout, type LucideIcon } from "lucide-react";
import type { PlanId } from "@/content/commercial";

export const planIcons = {
  starter: Sprout,
  pro: Layers3,
  enterprise: Building2,
} satisfies Record<PlanId, LucideIcon>;
