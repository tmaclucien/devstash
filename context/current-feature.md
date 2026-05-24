# Current Feature
_No feature in progress._

## Status
—

## Goals

—

## Notes

—

## History

- 2026-05-03 — Initial Next.js + Tailwind setup: scaffolded project, removed default `public/*.svg` assets, customized `globals.css` and `page.tsx`, added `context/` docs, ignored `.claude/settings.local.json`, pushed `main` to `origin` (`github.com/tmaclucien/devstash`).
- 2026-05-13 — Started Dashboard UI Phase 1: documented feature scope (ShadCN init, `/dashboard` route, layout shell, top bar, sidebar/main placeholders, dark mode default).
- 2026-05-16 — Completed Dashboard UI Phase 1: initialized shadcn/ui (radix · nova preset, neutral base), installed `button` and `input` components, scaffolded `/dashboard` route with top bar (DevStash brand, search input, "New item" button) and `[240px _ 1fr]` grid shell containing Sidebar/Main `h2` placeholders, enabled dark mode by default via `dark` class on `<html>`. Build passes.
- 2026-05-24 — Completed Dashboard UI Phase 2: installed shadcn `sidebar`/`sheet`/`separator`/`tooltip`/`skeleton`/`avatar`/`collapsible` (+ `use-mobile` hook); added `src/lib/item-type-icons.ts` registry mapping mock-data icon names to Lucide components; built `src/components/dashboard/app-sidebar.tsx` with brand header, Quick Access (All Items, Favorites, Recent), Types (links to `/items/[slug]`), Favorite + Recent collection groups (sorted by `createdAt` desc, capped at 5), and avatar footer (Pro/Free plan); each group wrapped in a `Collapsible` with a chevron-rotation trigger and separated by `SidebarSeparator`; replaced the dashboard layout's static aside with `SidebarProvider` + `AppSidebar` + `SidebarInset`, added `SidebarTrigger` in the top bar, and wrapped in `TooltipProvider`. Desktop collapses to icon rail (cmd/ctrl+B), mobile renders as a drawer. Build passes.
