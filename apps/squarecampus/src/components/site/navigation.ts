import { blogHref } from "@fairhelm/config/urls";
import {
  BookOpen,
  Building2,
  CalendarCheck,
  CircleHelp,
  ClipboardList,
  FileCheck2,
  GitCompareArrows,
  GraduationCap,
  Handshake,
  Layers3,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  Network,
  Rocket,
  School,
  Server,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  Workflow,
} from "lucide-react";
import { isNavGroup, primaryNavigation } from "@/content/site-content";
import type { NavigationItem, NavigationLink } from "@fairhelm/ui/navigation/types";

const navIcons = {
  "/enterprise": Building2,
  "/platform": LayoutDashboard,
  "/aegis": Sparkles,
  "/ecosystem": Network,
  "/security": ShieldCheck,
  "/what-is-squarecampus": GraduationCap,
  "/school-admission-management-software": UsersRound,
  "/school-attendance-management-system": CalendarCheck,
  "/fee-management-software-for-schools": WalletCards,
  "/school-exam-management-software": FileCheck2,
  "/parent-communication-app-for-schools": MessagesSquare,
  "/school-erp-software": Layers3,
  "/multi-campus-school-management-software": Building2,
  "/school-management-system": School,
  "/rollout": Rocket,
  "/services": Workflow,
  "/infrastructure": Server,
  "/why-squarecampus": ShieldCheck,
  "/compare": GitCompareArrows,
  "/faq": CircleHelp,
  [blogHref("/")]: BookOpen,
  "/launch-partners": Handshake,
  "/about": Building2,
  "/contact": Mail,
  "/pricing": WalletCards,
  "/pricing/#plans": Layers3,
  "/pricing/#model": ClipboardList,
  "/pricing/#scoped-separately": FileCheck2,
  "/pricing/#pilot": Rocket,
  "/pricing/#procurement-faq": CircleHelp,
  "/contact/": Mail,
} as const;

function withIcon(link: NavigationLink): NavigationLink {
  return { ...link, icon: navIcons[link.href as keyof typeof navIcons] || ClipboardList };
}
export const navigationItems: readonly NavigationItem[] = primaryNavigation.map((item) =>
  isNavGroup(item)
    ? {
        ...item,
        links: item.links.map(withIcon),
        ...(item.footer ? { footer: withIcon(item.footer) } : {}),
      }
    : withIcon(item)
);
