import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the `icon` strings stored on `ItemType` (see `src/lib/mock-data.ts`)
 * to their concrete Lucide components. Keeping the lookup in one place lets
 * the mock data — and later the database — stay icon-library agnostic.
 */
const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  Link,
  File,
  Image,
};

/**
 * Resolve a Lucide icon component from an `ItemType.icon` name.
 *
 * @param name The icon identifier stored on the item type (e.g. "Code").
 * @returns The matching Lucide component, or `File` as a safe default when
 * the name is unknown (e.g. a future user-defined type).
 */
export function getItemTypeIcon(name: string): LucideIcon {
  return ITEM_TYPE_ICONS[name] ?? File;
}
