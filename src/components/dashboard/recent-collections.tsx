import Link from "next/link";

import { CollectionCard } from "@/components/dashboard/collection-card";
import { collections, type Collection } from "@/lib/mock-data";

/** Maximum collection cards rendered in the dashboard grid. */
const RECENT_COLLECTIONS_LIMIT = 8;

/**
 * Sort collections newest first (by `createdAt`) and trim to `limit`.
 *
 * @param all The source list — typically the mock dataset.
 * @param limit Maximum number of entries to return.
 * @returns A new array, leaving the original untouched.
 */
function getRecentCollections(
  all: Collection[],
  limit: number,
): Collection[] {
  // Copy first — `Array.prototype.sort` mutates and we don't want to disturb
  // the imported mock array's natural order for other consumers.
  return [...all]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/**
 * Recent collections grid shown near the top of the dashboard. Mirrors the
 * "Collections" block in the reference screenshot — cards lay out 1/2/3/4
 * across depending on viewport width.
 */
export function RecentCollections() {
  const recent = getRecentCollections(collections, RECENT_COLLECTIONS_LIMIT);

  return (
    <section aria-labelledby="recent-collections-heading" className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2
          id="recent-collections-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Recent Collections
        </h2>
        <Link
          href="/collections"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recent.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
