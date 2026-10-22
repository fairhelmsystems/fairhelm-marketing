import type { ElementType } from "react";

export type NavigationLink = {
  href: string;
  label: string;
  description?: string;
  icon?: ElementType<{ className?: string; "aria-hidden"?: boolean }>;
};
export type NavigationGroup = {
  label: string;
  links: readonly NavigationLink[];
  footer?: NavigationLink;
};
export type NavigationItem = NavigationGroup | NavigationLink;
export function isNavigationGroup(item: NavigationItem): item is NavigationGroup {
  return "links" in item;
}
export function normaliseNavigationPath(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}
