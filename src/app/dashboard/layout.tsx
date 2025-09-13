import { Sidebar, SidebarProvider, SidebarInset, SidebarHeader, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard-nav";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary-foreground">
            <Logo className="h-8 w-8" />
            <span className="font-headline text-sidebar-foreground">StudyFlowAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <DashboardNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
            <SidebarTrigger className="md:hidden"/>
            <div className="ml-auto flex items-center gap-2">
                <UserNav />
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
