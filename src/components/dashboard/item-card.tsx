import { createElement } from "react";
import { Pin, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { itemTypes, type Item, type ItemType } from "@/lib/mock-data";
import { getItemTypeIcon } from "@/lib/item-type-icons";

/**
 * Resolve an item's type from its `itemTypeId`.
 *
 * @param id The `ItemType.id` referenced by the item.
 * @returns The matching type, or `undefined` if the mock data drifts.
 */
function findType(id: string): ItemType | undefined {
  return itemTypes.find((t) => t.id === id);
}

/**
 * Card rendering a single item (snippet, prompt, command, etc.). The left
 * edge is painted with the item type's brand color, the type icon sits next
 * to the title, and pin/favorite badges show in the top-right corner.
 *
 * @param item The item to render.
 */
export function ItemCard({ item }: { item: Item }) {
  const type = findType(item.itemTypeId);
  const accentColor = type?.color;

  return (
    <Card className="group relative gap-3 overflow-hidden pl-4 transition-colors hover:bg-card/80">
      {/* Left accent strip in the item type's brand color. */}
      {accentColor && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: accentColor }}
        />
      )}

      <CardHeader>
        <CardTitle className="flex items-start gap-2">
          {/* Resolve the icon via `createElement` so we don't assign a */}
          {/* component to a local var (avoids the static-components lint rule */}
          {/* which fires when the bound component varies with props). */}
          {type &&
            createElement(getItemTypeIcon(type.icon), {
              className: "mt-0.5 size-4 shrink-0",
              style: { color: type.color },
              "aria-hidden": true,
            })}
          <span className="line-clamp-1 flex-1">{item.title}</span>
          <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
            {item.isPinned && (
              <Pin
                className="size-3.5"
                aria-label="Pinned"
                aria-hidden="false"
              />
            )}
            {item.isFavorite && (
              <Star
                className="size-3.5 fill-yellow-400 text-yellow-400"
                aria-label="Favorite"
                aria-hidden="false"
              />
            )}
          </span>
        </CardTitle>
      </CardHeader>

      {item.description && (
        <CardContent>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {item.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
