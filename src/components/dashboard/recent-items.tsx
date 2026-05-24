import Link from "next/link";

import { ItemCard } from "@/components/dashboard/item-card";
import { items } from "@/lib/mock-data";

/** Cap on how many items the dashboard surfaces in its "Recent Items" list. */
const RECENT_ITEMS_LIMIT = 10;

/**
 * Section listing the most recently updated items. Anchors the bottom of
 * the dashboard. The 10-item cap comes straight from the phase 3 spec.
 */
export function RecentItems() {
  const recent = [...items]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_ITEMS_LIMIT);

  return (
    <section aria-labelledby="recent-items-heading" className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2
          id="recent-items-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Recent Items
        </h2>
        <Link
          href="/items"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recent.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
