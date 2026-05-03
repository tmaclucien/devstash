/**
 * Mock data for the DevStash dashboard UI.
 *
 * This file is the single source of truth for fake data until the database
 * is wired up. Shapes follow the Prisma schema in `context/project-overview.md`,
 * but joins are denormalized (e.g. tags as `string[]`, collection IDs on items)
 * to keep dashboard rendering simple.
 */

/** Kinds of content an item can hold. Mirrors the Prisma `ContentType` enum. */
export type ContentKind = "text" | "url" | "file";

/** Built-in item type slugs. */
export type ItemTypeSlug =
  | "snippet"
  | "prompt"
  | "command"
  | "note"
  | "link"
  | "file"
  | "image";

/** Currently logged-in user. */
export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  isPro: boolean;
}

/** Category metadata used for color-coding cards and sidebar entries. */
export interface ItemType {
  id: string;
  slug: ItemTypeSlug;
  name: string;
  /** Lucide icon name. */
  icon: string;
  /** Hex color used for borders, badges, and dominant-type backgrounds. */
  color: string;
  contentKind: ContentKind;
  isPro: boolean;
}

/** A single stash entry (snippet, prompt, link, etc.). */
export interface Item {
  id: string;
  title: string;
  description: string | null;
  itemTypeId: string;
  /** Markdown body for text types. */
  content: string | null;
  /** Target URL for link items. */
  url: string | null;
  /** R2 URL for file/image items. */
  fileUrl: string | null;
  fileName: string | null;
  /** Optional language hint for snippets, e.g. "typescript". */
  language: string | null;
  tags: string[];
  /** IDs of collections this item belongs to (many-to-many). */
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Named group of items. */
export interface Collection {
  id: string;
  name: string;
  description: string | null;
  /** Hint for the dominant item type — drives card background color. */
  defaultTypeId: string;
  isFavorite: boolean;
  /** Total items in the collection (may exceed `items` array length in mocks). */
  itemCount: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Current user
// ---------------------------------------------------------------------------

export const currentUser: User = {
  id: "user_1",
  email: "tmaclucien@gmail.com",
  name: "tmaclucien",
  image: null,
  isPro: true,
};

// ---------------------------------------------------------------------------
// Item types (system types from project-overview.md)
// ---------------------------------------------------------------------------

export const itemTypes: ItemType[] = [
  {
    id: "type_snippet",
    slug: "snippet",
    name: "Snippet",
    icon: "Code",
    color: "#3b82f6",
    contentKind: "text",
    isPro: false,
  },
  {
    id: "type_prompt",
    slug: "prompt",
    name: "Prompt",
    icon: "Sparkles",
    color: "#8b5cf6",
    contentKind: "text",
    isPro: false,
  },
  {
    id: "type_command",
    slug: "command",
    name: "Command",
    icon: "Terminal",
    color: "#f97316",
    contentKind: "text",
    isPro: false,
  },
  {
    id: "type_note",
    slug: "note",
    name: "Note",
    icon: "StickyNote",
    color: "#fde047",
    contentKind: "text",
    isPro: false,
  },
  {
    id: "type_link",
    slug: "link",
    name: "Link",
    icon: "Link",
    color: "#10b981",
    contentKind: "url",
    isPro: false,
  },
  {
    id: "type_file",
    slug: "file",
    name: "File",
    icon: "File",
    color: "#6b7280",
    contentKind: "file",
    isPro: true,
  },
  {
    id: "type_image",
    slug: "image",
    name: "Image",
    icon: "Image",
    color: "#ec4899",
    contentKind: "file",
    isPro: true,
  },
];

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const collections: Collection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Common React patterns and best practices",
    defaultTypeId: "type_snippet",
    isFavorite: true,
    itemCount: 12,
    createdAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Useful prompts for coding assistants",
    defaultTypeId: "type_prompt",
    isFavorite: false,
    itemCount: 8,
    createdAt: "2026-04-12T10:00:00Z",
  },
  {
    id: "col_terminal_commands",
    name: "Terminal Commands",
    description: "Frequently used CLI commands",
    defaultTypeId: "type_command",
    isFavorite: false,
    itemCount: 24,
    createdAt: "2026-04-14T10:00:00Z",
  },
  {
    id: "col_learning_notes",
    name: "Learning Notes",
    description: "Notes from courses and tutorials",
    defaultTypeId: "type_note",
    isFavorite: false,
    itemCount: 15,
    createdAt: "2026-04-16T10:00:00Z",
  },
  {
    id: "col_useful_links",
    name: "Useful Links",
    description: "Bookmarked resources and documentation",
    defaultTypeId: "type_link",
    isFavorite: false,
    itemCount: 32,
    createdAt: "2026-04-18T10:00:00Z",
  },
  {
    id: "col_project_files",
    name: "Project Files",
    description: "Context files and boilerplates",
    defaultTypeId: "type_file",
    isFavorite: false,
    itemCount: 6,
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Notes and snippets for technical interviews",
    defaultTypeId: "type_note",
    isFavorite: false,
    itemCount: 9,
    createdAt: "2026-04-22T10:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

export const items: Item[] = [
  {
    id: "item_use_debounce",
    title: "useDebounce Hook",
    description: "A custom React hook for debouncing values",
    itemTypeId: "type_snippet",
    content:
      "import { useState, useEffect } from 'react'\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState(value)\n\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay)\n    return () => clearTimeout(id)\n  }, [value, delay])\n\n  return debounced\n}\n",
    url: null,
    fileUrl: null,
    fileName: null,
    language: "typescript",
    tags: ["react", "hooks", "typescript"],
    collectionIds: ["col_react_patterns"],
    isFavorite: true,
    isPinned: true,
    createdAt: "2026-04-25T09:00:00Z",
    updatedAt: "2026-04-25T09:00:00Z",
  },
  {
    id: "item_git_rebase",
    title: "Git Interactive Rebase",
    description: "Squash and reorder commits interactively",
    itemTypeId: "type_command",
    content: "git rebase -i HEAD~5",
    url: null,
    fileUrl: null,
    fileName: null,
    language: "bash",
    tags: ["git", "rebase", "history"],
    collectionIds: ["col_terminal_commands"],
    isFavorite: false,
    isPinned: true,
    createdAt: "2026-04-26T09:00:00Z",
    updatedAt: "2026-04-26T09:00:00Z",
  },
  {
    id: "item_code_review_prompt",
    title: "Code Review Prompt",
    description: "Comprehensive code review assistant",
    itemTypeId: "type_prompt",
    content:
      "Review the following code and provide feedback on:\n- Correctness and edge cases\n- Readability and naming\n- Performance concerns\n- Security issues\n- Suggested improvements\n",
    url: null,
    fileUrl: null,
    fileName: null,
    language: null,
    tags: ["ai", "review", "quality"],
    collectionIds: ["col_ai_prompts"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-04-27T09:00:00Z",
    updatedAt: "2026-04-27T09:00:00Z",
  },
  {
    id: "item_next_app_router_notes",
    title: "Next.js App Router Notes",
    description: "Key concepts for the new App Router",
    itemTypeId: "type_note",
    content:
      "# App Router\n\n- Server components by default\n- `'use client'` only for interactivity\n- Use Server Actions for mutations\n- Layouts persist across navigations\n",
    url: null,
    fileUrl: null,
    fileName: null,
    language: null,
    tags: ["nextjs", "react", "notes"],
    collectionIds: ["col_learning_notes"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-04-28T09:00:00Z",
    updatedAt: "2026-04-28T09:00:00Z",
  },
  {
    id: "item_explain_code_prompt",
    title: "Explain Code Prompt",
    description: "Break down complex code for learning",
    itemTypeId: "type_prompt",
    content:
      "Explain the following code as if teaching a junior developer. Include:\n\n1. What the code does at a high level\n2. Step-by-step breakdown of each significant line\n3. Any patterns or concepts used\n4. Potential improvements or alternatives\n5. Common pitfalls to avoid\n\nKeep explanations clear and concise.\n",
    url: null,
    fileUrl: null,
    fileName: null,
    language: null,
    tags: ["ai", "learning", "explanation"],
    collectionIds: ["col_ai_prompts", "col_interview_prep"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-04-29T09:00:00Z",
    updatedAt: "2026-04-29T09:00:00Z",
  },
  {
    id: "item_tailwind_docs",
    title: "Tailwind CSS Documentation",
    description: "Official Tailwind CSS docs",
    itemTypeId: "type_link",
    content: null,
    url: "https://tailwindcss.com/docs",
    fileUrl: null,
    fileName: null,
    language: null,
    tags: ["css", "tailwind", "docs"],
    collectionIds: ["col_useful_links"],
    isFavorite: true,
    isPinned: false,
    createdAt: "2026-04-30T09:00:00Z",
    updatedAt: "2026-04-30T09:00:00Z",
  },
  {
    id: "item_docker_compose_up",
    title: "Docker Compose Up",
    description: "Start all services in background",
    itemTypeId: "type_command",
    content: "docker compose up -d",
    url: null,
    fileUrl: null,
    fileName: null,
    language: "bash",
    tags: ["docker", "devops", "containers"],
    collectionIds: ["col_terminal_commands"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-01T09:00:00Z",
    updatedAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "item_react_query_cheatsheet",
    title: "React Query Cheatsheet",
    description: "Quick reference for TanStack Query patterns",
    itemTypeId: "type_note",
    content:
      "# React Query\n\n- `useQuery` for reads, `useMutation` for writes\n- Invalidate queries after mutation success\n- Use `queryKey` arrays for cache scoping\n",
    url: null,
    fileUrl: null,
    fileName: null,
    language: null,
    tags: ["react", "data-fetching", "cheatsheet"],
    collectionIds: ["col_learning_notes", "col_react_patterns"],
    isFavorite: false,
    isPinned: false,
    createdAt: "2026-05-02T09:00:00Z",
    updatedAt: "2026-05-02T09:00:00Z",
  },
];
