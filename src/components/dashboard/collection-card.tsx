import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { items, itemTypes, type Collection, type ItemType } from "@/lib/mock-data";
import { getItemTypeIcon } from "@/lib/item-type-icons";

/**
 * Look up an item type by its id. Returns `undefined` if not found, which
 * lets the card render gracefully if the mock data drifts out of sync.
 *
 * @param id The `ItemType.id` to look up.
 * @returns The matching item type or `undefined`.
 */
function findType(id: string): ItemType | undefined {
  return itemTypes.find((t) => t.id === id);
}

/**
 * Compute the distinct item types appearing in a collection, ordered by the
 * canonical `itemTypes` list. Drives the small icon row at the bottom of each
 * collection card so users can scan the kinds of content inside at a glance.
 *
 * @param collectionId The collection to inspect.
 * @returns Item types that have at least one member in `collectionId`.
 */
function getTypesInCollection(collectionId: string): ItemType[] {
  const typeIds = new Set(
    items
      .filter((item) => item.collectionIds.includes(collectionId))
      .map((item) => item.itemTypeId),
  );
  return itemTypes.filter((type) => typeIds.has(type.id));
}

/**
 * Card representing a single collection in the dashboard grid. The top edge
 * is tinted with the dominant item type's brand color, and the footer surfaces
 * the distinct item-type icons present in the collection.
 *
 * @param collection The collection to render.
 */
export function CollectionCard({ collection }: { collection: Collection }) {
  const dominantType = findType(collection.defaultTypeId);
  const typesInside = getTypesInCollection(collection.id);

  return (
    <Card className="group relative gap-3 pt-5 transition-colors hover:bg-card/80">
      {/* Top accent strip painted in the dominant type's brand color. */}
      {dominantType && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: dominantType.color }}
        />
      )}

      <CardHeader>
        <CardTitle className="truncate">{collection.name}</CardTitle>
        <CardDescription className="text-xs">
          {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {collection.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {collection.description}
          </p>
        )}

        {typesInside.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5">
            {typesInside.map((type) => {
              const Icon = getItemTypeIcon(type.icon);
              return (
                <span
                  key={type.id}
                  title={type.name}
                  className="flex size-6 items-center justify-center rounded-md bg-muted/60"
                >
                  <Icon
                    className="size-3.5"
                    style={{ color: type.color }}
                    aria-hidden="true"
                  />
                  <span className="sr-only">{type.name}</span>
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
