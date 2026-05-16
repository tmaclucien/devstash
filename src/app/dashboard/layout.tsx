import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Layout shell for the dashboard route. Renders the persistent top bar and a
 * two-column body (sidebar + main) shared across every `/dashboard/*` page.
 * The top bar controls are display-only in Phase 1 — wiring lands in later phases.
 * @param children Page content rendered inside the main column.
 * @returns The dashboard layout wrapper.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <span className="text-sm font-semibold tracking-tight">DevStash</span>

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

      <div className="grid flex-1 grid-cols-[240px_1fr]">
        <aside className="border-r border-border p-4">
          <h2 className="text-lg font-semibold">Sidebar</h2>
        </aside>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
