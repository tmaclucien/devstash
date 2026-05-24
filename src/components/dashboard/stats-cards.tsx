import { FolderHeart, Layers, Star, StickyNote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { collections, items } from "@/lib/mock-data";

/** One metric tile rendered in the stats row. */
interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
}

/**
 * Compute the four headline stats shown at the top of the dashboard.
 * Counts are derived directly from the mock dataset; once the database
 * lands, this is the function to replace with a single Prisma aggregate.
 *
 * @returns The four ordered tiles: items, collections, favorite items,
 * favorite collections.
 */
function getStats(): Stat[] {
  return [
    { label: "Items", value: items.length, icon: StickyNote },
    { label: "Collections", value: collections.length, icon: Layers },
    {
      label: "Favorite Items",
      value: items.filter((i) => i.isFavorite).length,
      icon: Star,
    },
    {
      label: "Favorite Collections",
      value: collections.filter((c) => c.isFavorite).length,
      icon: FolderHeart,
    },
  ];
}

/**
 * Row of four summary tiles (items, collections, favorite items, favorite
 * collections). Sits at the top of the dashboard main area. Not present in
 * the reference screenshot — added per the phase 3 spec.
 */
export function StatsCards() {
  const stats = getStats();

  return (
    <section
      aria-label="Stash summary"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-xl font-semibold tabular-nums leading-tight">
                  {stat.value}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
