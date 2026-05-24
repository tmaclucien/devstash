import { ItemCard } from "@/components/dashboard/item-card";
import { items } from "@/lib/mock-data";

/**
 * Section listing every pinned item. Rendered between the recent collections
 * grid and the recent items list. Hides itself when no items are pinned so
 * we don't waste vertical space on an empty header.
 */
export function PinnedItems() {
  // Sort newest-first so the most-recently-pinned items surface first.
  const pinned = items
    .filter((item) => item.isPinned)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  if (pinned.length === 0) return null;

  return (
    <section aria-labelledby="pinned-items-heading" className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2
          id="pinned-items-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Pinned Items
        </h2>
        <span className="text-xs text-muted-foreground">
          {pinned.length} {pinned.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pinned.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
