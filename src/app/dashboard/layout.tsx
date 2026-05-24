import { Plus, Search } from "lucide-react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Layout shell for the dashboard route. Provides the persistent sidebar
 * (collapsible on desktop, drawer on mobile) and the top bar shared across
 * every `/dashboard/*` page. The top bar controls are display-only — wiring
 * lands in later phases.
 *
 * @param children Page content rendered inside the main column.
 * @returns The dashboard layout wrapper.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-background">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
            <SidebarTrigger aria-label="Toggle sidebar" />

            <div className="relative ml-auto w-full max-w-sm">
              {/* Icon overlay must be non-interactive so clicks fall through to the input */}
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder="Search..."
                aria-label="Search items"
                className="pl-8"
              />
            </div>

            <Button aria-label="Create new item">
              <Plus />
              New item
            </Button>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
