"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  BookMarked,
  Settings,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/dashboard/study-plan", label: "Study Plan", icon: BookMarked },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname.startsWith(link.href) && (link.href.length > 10 ? true : pathname === link.href)}
              className={cn(
                "w-full justify-start",
                 (pathname.startsWith(link.href) && (link.href.length > 10 ? true : pathname === link.href)) && "font-bold"
              )}
            >
              <link.icon className="mr-2 h-5 w-5" />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
