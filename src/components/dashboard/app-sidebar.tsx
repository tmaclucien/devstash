"use client";

import Link from "next/link";
import { ChevronDown, Clock, Folder, Star, Layers } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  collections,
  currentUser,
  itemTypes,
  type Collection,
} from "@/lib/mock-data";
import { getItemTypeIcon } from "@/lib/item-type-icons";

/** Maximum number of "Recent" collections surfaced in the sidebar. */
const RECENT_COLLECTIONS_LIMIT = 5;

/**
 * Compute the most-recently-created collections, newest first.
 *
 * @param all The full collection list (typically the mock dataset).
 * @param limit How many entries to return.
 * @returns A new array of up to `limit` collections, sorted by `createdAt` desc.
 */
function getRecentCollections(all: Collection[], limit: number): Collection[] {
  // Copy before sorting — `Array.prototype.sort` mutates in place and we
  // don't want to disturb the imported mock array's order.
  return [...all]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

/** Initials shown in the avatar fallback when a user has no profile image. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Primary navigation for the dashboard. Renders item-type links, favorite
 * collections, most-recent collections, and the signed-in user's avatar.
 * Wrapped by `SidebarProvider` in the dashboard layout so it can collapse
 * to an icon rail on desktop and slide in as a drawer on mobile.
 */
export function AppSidebar() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = getRecentCollections(
    collections,
    RECENT_COLLECTIONS_LIMIT,
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="DevStash">
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                  <Layers className="size-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  DevStash
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <CollapsibleGroup label="Quick Access">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="All Items">
                <Link href="/dashboard">
                  <Folder />
                  <span>All Items</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Favorites">
                <Link href="/favorites">
                  <Star />
                  <span>Favorites</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Recent">
                <Link href="/recent">
                  <Clock />
                  <span>Recent</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </CollapsibleGroup>

        <SidebarSeparator />

        <CollapsibleGroup label="Types">
          <SidebarMenu>
            {itemTypes.map((type) => {
              const Icon = getItemTypeIcon(type.icon);
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton asChild tooltip={type.name}>
                    <Link href={`/items/${type.slug}`}>
                      {/* Inline color drives the type's brand accent; */}
                      {/* keeps the registry-driven icon component pluggable. */}
                      <Icon style={{ color: type.color }} />
                      <span>{type.name}s</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </CollapsibleGroup>

        <SidebarSeparator />

        {favoriteCollections.length > 0 && (
          <CollapsibleGroup label="Favorites">
            <SidebarMenu>
              {favoriteCollections.map((collection) => (
                <CollectionMenuItem
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </SidebarMenu>
          </CollapsibleGroup>
        )}

        {favoriteCollections.length > 0 && <SidebarSeparator />}

        <CollapsibleGroup label="Recent Collections">
          <SidebarMenu>
            {recentCollections.map((collection) => (
              <CollectionMenuItem
                key={collection.id}
                collection={collection}
              />
            ))}
          </SidebarMenu>
        </CollapsibleGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={currentUser.name}>
              <Avatar className="size-8 rounded-md">
                <AvatarFallback className="rounded-md text-xs">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col text-left leading-tight">
                <span className="truncate text-sm font-medium">
                  {currentUser.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.isPro ? "Pro Plan" : "Free Plan"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * Sidebar group whose body can be hidden via a chevron on its label.
 * Keeps the four sidebar sections visually consistent and lets users
 * compact long lists (e.g. Types, Recent Collections).
 *
 * @param label Heading text shown next to the chevron trigger.
 * @param defaultOpen Whether the group starts expanded. Defaults to `true`.
 * @param children Menu items rendered inside the collapsible body.
 */
function CollapsibleGroup({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    // `group/collapsible` scopes the chevron rotation to *this* collapsible,
    // so nested groups (if added later) don't fight over the same animation.
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center hover:text-sidebar-accent-foreground">
            {label}
            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>{children}</SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

/**
 * A single collection row in the sidebar. Renders the collection name, links
 * to the (future) collection detail page, and shows the item count as a badge.
 *
 * @param collection The collection to render.
 */
function CollectionMenuItem({ collection }: { collection: Collection }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={collection.name}>
        <Link href={`/collections/${collection.id}`}>
          <Folder />
          <span>{collection.name}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
    </SidebarMenuItem>
  );
}
