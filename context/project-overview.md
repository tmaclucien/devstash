# 🗂️ DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all dev knowledge & resources.**

---

## 📌 Table of Contents

1. [Problem](#-problem)
2. [Target Users](#-target-users)
3. [Core Features](#-core-features)
4. [Data Model](#-data-model)
5. [Tech Stack](#-tech-stack)
6. [Monetization](#-monetization)
7. [UI/UX Guidelines](#-uiux-guidelines)
8. [Architecture Diagram](#-architecture-diagram)

---

## 🎯 Problem

Developers keep their essentials scattered across too many places:

| Asset | Where it usually lives |
|---|---|
| Code snippets | VS Code, Notion |
| AI prompts | Chat histories |
| Context files | Buried in projects |
| Useful links | Browser bookmarks |
| Docs | Random folders |
| Commands | `.txt` files |
| Project templates | GitHub gists |
| Terminal commands | `bash_history` |

This causes **context switching**, **lost knowledge**, and **inconsistent workflows**.

**DevStash solves this** by providing a single, fast, searchable, AI-enhanced hub for all dev knowledge and resources.

---

## 👥 Target Users

| User | Primary Need |
|---|---|
| **Everyday Developer** | Fast access to snippets, prompts, commands, links |
| **AI-first Developer** | Storage for prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Code blocks, explanations, course notes |
| **Full-stack Builder** | Patterns, boilerplates, API examples |

---

## ✨ Core Features

### A. Items & Item Types

Items are the atomic unit of DevStash. Each item belongs to a **type**.

Users can eventually create custom types, but the following **system types** ship by default and cannot be modified:

| Type | Color | Icon | Content Kind | Pro Only |
|---|---|---|---|---|
| Snippet | `#3b82f6` 🔵 | `Code` | Text | — |
| Prompt | `#8b5cf6` 🟣 | `Sparkles` | Text | — |
| Command | `#f97316` 🟠 | `Terminal` | Text | — |
| Note | `#fde047` 🟡 | `StickyNote` | Text | — |
| Link | `#10b981` 🟢 | `Link` | URL | — |
| File | `#6b7280` ⚪ | `File` | File | ✅ |
| Image | `#ec4899` 🟤 | `Image` | File | ✅ |

**Content kinds:**
- `text` → snippet, prompt, command, note
- `url` → link
- `file` → file, image

**Routing convention:** `/items/:type` (e.g. `/items/snippets`, `/items/prompts`).

**Access pattern:** Items open in a **drawer** for quick view/create/edit.

---

### B. Collections

Users can group items into named collections. **Items are many-to-many with collections** — a single item (e.g. a React snippet) can live in both `React Patterns` and `Interview Prep`.

Example collections:
- `React Patterns` (snippets, notes)
- `Context Files` (files)
- `Python Snippets` (snippets)
- `Prototype Prompts` (prompts)

Collection cards are **color-coded by their dominant item type** (background color). Items inside use that type's color as a border.

---

### C. Search

Powerful, fast search across:
- Content
- Tags
- Titles
- Types

---

### D. Authentication

- Email + password (NextAuth Credentials provider)
- GitHub OAuth

---

### E. Other Features

- ⭐ Favorites (collections and items)
- 📌 Pin items to top
- 🕒 Recently used view
- 📥 Import code from a file
- ✍️ Markdown editor for text types
- 📤 File upload for file/image types (R2)
- 📦 Export data in multiple formats
- 🌙 Dark mode by default (light mode optional)
- 🔀 Add/remove items across multiple collections
- 👁️ View which collections an item belongs to

---

### F. AI Features (Pro Only)

Powered by **OpenAI `gpt-5-nano`**:

- 🏷️ **Auto-tag suggestions**
- 📝 **AI summaries**
- 💡 **Explain This Code**
- 🪄 **Prompt optimizer**

---

## 🗄️ Data Model

> ⚠️ **Migration policy:** NEVER use `prisma db push` or directly mutate DB structure. Always create migrations, run them in dev, then promote to prod.

### Prisma Schema (draft)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                   String         @id @default(cuid())
  email                String         @unique
  name                 String?
  image                String?
  emailVerified        DateTime?

  // Pro / billing
  isPro                Boolean        @default(false)
  stripeCustomerId     String?        @unique
  stripeSubscriptionId String?        @unique

  // Relations
  accounts             Account[]      // NextAuth
  sessions             Session[]      // NextAuth
  items                Item[]
  collections          Collection[]
  customItemTypes      ItemType[]     // user-created types

  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
}

model Item {
  id           String           @id @default(cuid())
  title        String
  description  String?

  // Content
  contentType  ContentType      // TEXT | FILE | URL
  content      String?          // for text types (markdown)
  url          String?          // for link types
  fileUrl      String?          // R2 URL for file types
  fileName     String?
  fileSize     Int?             // bytes

  // Code metadata
  language     String?          // optional, for snippets

  // Flags
  isFavorite   Boolean          @default(false)
  isPinned     Boolean          @default(false)

  // Relations
  user         User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String
  itemType     ItemType         @relation(fields: [itemTypeId], references: [id])
  itemTypeId   String
  collections  ItemCollection[]
  tags         ItemTag[]

  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  @@index([userId])
  @@index([itemTypeId])
}

model ItemType {
  id        String  @id @default(cuid())
  name      String  // "snippet", "prompt", etc.
  icon      String  // lucide icon name
  color     String  // hex
  isSystem  Boolean @default(false)

  // Null for system types, set for user-created types
  user      User?   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String?

  items     Item[]

  @@unique([userId, name])
}

model Collection {
  id            String           @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean          @default(false)

  // For new/empty collections — hint for the type of items expected
  defaultType   ItemType?        @relation(fields: [defaultTypeId], references: [id])
  defaultTypeId String?

  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId        String
  items         ItemCollection[]

  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  @@index([userId])
}

// Join: Item <-> Collection (many-to-many)
model ItemCollection {
  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  itemId       String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  collectionId String
  addedAt      DateTime   @default(now())

  @@id([itemId, collectionId])
  @@index([collectionId])
}

model Tag {
  id    String    @id @default(cuid())
  name  String    @unique
  items ItemTag[]
}

// Join: Item <-> Tag (many-to-many)
model ItemTag {
  item   Item   @relation(fields: [itemId], references: [id], onDelete: Cascade)
  itemId String
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId  String

  @@id([itemId, tagId])
}

enum ContentType {
  TEXT
  FILE
  URL
}
```

### Entity Relationships

```
User ──┬── owns ──> Item ──┬── has ──> ItemType
       │                   ├── M:N ──> Collection (via ItemCollection)
       │                   └── M:N ──> Tag (via ItemTag)
       │
       ├── owns ──> Collection
       └── owns ──> ItemType (custom types only)
```

---

## 🛠️ Tech Stack

### Framework

- **Next.js 16** + **React 19**
- SSR pages with dynamic components
- API routes for backend needs (items, file uploads, AI calls)
- Single codebase / monorepo for low overhead
- **TypeScript** end-to-end

### Database & ORM

- **Neon** (serverless PostgreSQL in the cloud)
- **Prisma 7** (always fetch latest docs before migrations) — [prisma.io](https://www.prisma.io/docs)
- **Redis** for caching *(maybe — evaluate later)*

### File Storage

- **Cloudflare R2** for file and image uploads — [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2/)

### Authentication

- **NextAuth v5** — [authjs.dev](https://authjs.dev)
  - Email + password (Credentials provider)
  - GitHub OAuth

### AI Integration

- **OpenAI** `gpt-5-nano` — [platform.openai.com](https://platform.openai.com/docs)

### Styling

- **Tailwind CSS v4** — [tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui** components — [ui.shadcn.com](https://ui.shadcn.com)

### Migration Policy ⚠️

> **NEVER** use `prisma db push` or directly mutate the database schema. Generate migrations, run them in dev, then promote to prod.

---

## 💰 Monetization

Freemium model. **During development, all users get full access** — gating is wired up but disabled.

| Feature | Free | Pro ($8/mo or $72/yr) |
|---|---|---|
| Total items | 50 | Unlimited |
| Collections | 3 | Unlimited |
| System types (text/url) | ✅ | ✅ |
| File & image uploads | ❌ | ✅ |
| Custom types | ❌ | ✅ *(later)* |
| Basic search | ✅ | ✅ |
| AI auto-tagging | ❌ | ✅ |
| AI code explanation | ❌ | ✅ |
| AI prompt optimizer | ❌ | ✅ |
| Export (JSON / ZIP) | ❌ | ✅ |
| Priority support | ❌ | ✅ |

Billing handled via **Stripe** (`stripeCustomerId`, `stripeSubscriptionId` on `User`).

---

## 🎨 UI/UX Guidelines

### General Direction

- Modern, minimal, developer-focused
- **Dark mode by default**, light mode optional
- Clean typography, generous whitespace
- Subtle borders and shadows
- Syntax highlighting on all codeblocks
- **References:** Notion, Linear, Raycast

### Layout

```
┌────────────────────────────────────────────────────┐
│  ┌─────────────┬──────────────────────────────┐    │
│  │             │                              │    │
│  │   Sidebar   │       Main Content           │    │
│  │             │                              │    │
│  │  • Types    │   ┌──────┐ ┌──────┐ ┌──────┐ │    │
│  │  • Recent   │   │ Coll │ │ Coll │ │ Coll │ │    │
│  │    colls    │   └──────┘ └──────┘ └──────┘ │    │
│  │             │                              │    │
│  │             │   ┌─ Items grid ──────────┐  │    │
│  │             │   │ [item] [item] [item]  │  │    │
│  │             │   └───────────────────────┘  │    │
│  └─────────────┴──────────────────────────────┘    │
│                                                    │
│      [ Item drawer slides in from right ]          │
└────────────────────────────────────────────────────┘
```

- **Sidebar** (collapsible): item types + latest collections
- **Main**: grid of color-coded collection cards (background = dominant item-type color); items below as cards (border = item-type color)
- **Item drawer**: opens for quick view / create / edit

### Responsive

- Desktop-first, mobile-usable
- Sidebar collapses into a drawer on mobile

### Micro-interactions

- Smooth transitions
- Hover states on all cards
- Toast notifications for create / update / delete
- Loading skeletons (no spinners)

---

## 🏗️ Architecture Diagram

```
                  ┌─────────────────────┐
                  │      Browser        │
                  │   (Next.js client)  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Next.js Server    │
                  │  (SSR + API routes) │
                  └──────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
  ┌───────────┐       ┌────────────┐       ┌────────────┐
  │  NextAuth │       │   Prisma   │       │   OpenAI   │
  │  (sess.)  │       │   Client   │       │ gpt-5-nano │
  └───────────┘       └─────┬──────┘       └────────────┘
        │                   │
        ▼                   ▼
  ┌───────────┐       ┌────────────┐       ┌────────────┐
  │  GitHub   │       │  Neon PG   │       │ Cloudflare │
  │   OAuth   │       │ (Postgres) │       │     R2     │
  └───────────┘       └────────────┘       └────────────┘
                            │
                            ▼
                      ┌────────────┐
                      │   Redis    │
                      │  (cache?)  │
                      └────────────┘
                            │
                            ▼
                      ┌────────────┐
                      │   Stripe   │
                      │ (billing)  │
                      └────────────┘
```

---

## ✅ Development Notes

- TypeScript strict mode on
- Pro gating is **scaffolded but disabled** during development — every user can access every feature
- All system `ItemType` rows are seeded via a migration (not `db push`)
- Drawer-first UX: any item interaction should be reachable without a full page navigation
- Cache hot reads (recent items, favorites) in Redis if it earns its keep — otherwise drop it

---

*Last updated: planning phase*
