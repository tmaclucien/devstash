import { PinnedItems } from "@/components/dashboard/pinned-items";
import { RecentCollections } from "@/components/dashboard/recent-collections";
import { RecentItems } from "@/components/dashboard/recent-items";
import { StatsCards } from "@/components/dashboard/stats-cards";

/**
 * Dashboard index page. Phase 3 wires up the main column with stash
 * summary stats, a recent-collections grid, pinned items, and the most
 * recent items. Data still comes from `src/lib/mock-data.ts` until the
 * database lands.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <StatsCards />
      <RecentCollections />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}
