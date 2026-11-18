# Next.js Production Frontend Architecture & Project Structure Guideline
> **Universal Blueprint for AI Agents & Developers**  
> *Use this guideline to initialize, scaffold, and maintain any production-ready Next.js App Router (React 19 + TypeScript + Tailwind CSS v4) frontend project following the enterprise Shop architecture.*

---

## 1. Executive Summary & Core Philosophy

This document defines the standardized frontend architecture used across our production Next.js web applications. Any AI agent or developer tasked with building or maintaining a frontend project **must follow this blueprint verbatim**.

### Key Architectural Tenets:
1. **Self-Contained Feature Modules (`src/features/` & `src/admin/`):** Business logic, components, types, schemas, and queries are encapsulated within dedicated feature folders.
2. **Strict Barrel Export Pattern:** Features expose their public API exclusively through an auto-generated `index.ts`. Deep imports (e.g., `@/features/cart/components/cart-drawer`) are strictly forbidden. Consumers must import via `@/features/cart`.
3. **Atomic Component Hierarchy (`src/components/`):** Universal, non-domain components follow Atomic Design (`atoms/` for primitives, `molecules/` for combinations, `organisms/` for full layout sections).
4. **Context-Aware 3-Tier API Client:** Differentiated Axios instances (`apiBase`, `apiClient`, `apiServer`) ensure zero runtime errors with Next.js Server Components, Client Components, and `"use cache"` boundaries.
5. **Multi-Layered State Management:**
   - **Server State:** TanStack React Query (cached server data, optimistic updates).
   - **Persistent Client State:** Zustand stores with `persist` middleware (cart, wishlist, theme).
   - **URL State:** `nuqs` (search queries, filters, pagination).
   - **Form State:** `react-hook-form` + `zod` validation resolvers.
6. **Built-in Dynamic SEO & Metadata Engine:** Dynamic metadata generation cascading from global company settings down to page-level overrides.

---

## 2. Master Project Directory Layout

Every new frontend project created under this standard must replicate this exact directory tree:

```text
<project-root>/
│
├── public/                          # Static assets (favicons, logos, placeholders)
├── scripts/                         # Build & developer automation scripts
│   └── generate-exports.js          # Canonical barrel export generator for features & admin
│
├── src/                             # Application source code
│   │
│   ├── app/                         # Next.js App Router (Routing, Layouts, Metadata)
│   │   ├── (main)/                  # Public/Customer route group (shares customer layout)
│   │   │   ├── layout.tsx           # Customer layout (Navbar, Footer, Modals, Dynamic CSS)
│   │   │   ├── page.tsx             # Storefront homepage
│   │   │   ├── products/            # Product listing & [slug] details
│   │   │   ├── cart/                # Cart page
│   │   │   ├── checkout/            # Multi-step checkout flow
│   │   │   ├── account/             # Customer profile & address book
│   │   │   ├── orders/              # Order history & live tracking
│   │   │   ├── (legal)/             # Dynamic policy pages ([slug])
│   │   │   └── ...                  # Other public pages (contact, about, faq, etc.)
│   │   │
│   │   ├── admin/                   # Admin panel route group
│   │   │   ├── (dashboard)/         # Protected admin dashboard layouts & routes
│   │   │   │   ├── layout.tsx       # Admin shell layout (Sidebar, Header, Breadcrumbs)
│   │   │   │   ├── products/        # Product CRUD
│   │   │   │   ├── orders/          # Order management & POS
│   │   │   │   ├── settings/        # Theme, SEO, Payment & Store settings
│   │   │   │   └── ...              # Customers, Invoices, Media Gallery, etc.
│   │   │   └── sign-in/             # Dedicated admin authentication
│   │   │
│   │   ├── auth/                    # Customer auth routes (login, register, forgot-password)
│   │   ├── api/                     # Next.js Route Handlers (e.g., api/auth/[...nextauth])
│   │   ├── layout.tsx               # Root HTML layout (Fonts, Providers, Head metadata)
│   │   ├── not-found.tsx            # Global 404 handler
│   │   ├── robots.ts                # Dynamic robots.txt generator
│   │   └── sitemap.ts               # Dynamic sitemap.xml generator
│   │
│   ├── features/                    # Customer-facing domain modules (Self-contained)
│   │   ├── auth/                    # Auth modals, forms, queries, schemas
│   │   ├── cart/                    # Cart drawer, calculations, persistence hooks
│   │   ├── checkout/                # Checkout steps, payment options, addresses
│   │   ├── products/                # Product cards, grids, filters, variant selector
│   │   ├── landing/                 # Homepage sections, hero banners, category sliders
│   │   └── ...                      # Each folder has components, lib, schema, types, index.ts
│   │
│   ├── admin/                       # Admin-facing domain modules (Self-contained)
│   │   ├── products/                # Product admin tables, variant builders, image managers
│   │   ├── orders/                  # Admin order inspectors, status changers
│   │   ├── settings/                # Theme customizer, SEO meta tags, tracking pixels
│   │   ├── media-gallery/           # Asset library, image picker modal
│   │   └── ...                      # Each folder has components, lib, schema, types, index.ts
│   │
│   ├── components/                  # Universal reusable UI components (Atomic Design)
│   │   ├── atoms/                   # Primitive design system components (shadcn/ui)
│   │   │   ├── button.tsx, input.tsx, badge.tsx, dialog.tsx, card.tsx, ...
│   │   ├── molecules/               # Reusable composed elements
│   │   │   ├── search-input.tsx, date-range-picker.tsx, confirm-dialog.tsx, ...
│   │   ├── organisms/               # App-level compositions & context providers
│   │   │   ├── navbar.tsx, footer.tsx, admin-sidebar.tsx, providers.tsx, ...
│   │   ├── tiptap/                  # Rich text editor toolbars, extensions & renderers
│   │   └── theme-provider.tsx       # next-themes wrapper
│   │
│   ├── lib/                         # Global utilities, clients, and helpers
│   │   ├── api-client.ts            # The 3 Axios instances (apiBase, apiClient, apiServer)
│   │   ├── api-client-core.ts       # Request/Response interceptors & auth injection
│   │   ├── get-query-client.ts      # TanStack QueryClient factory for SSR
│   │   ├── seo-helpers.ts           # Dynamic Next.js Metadata builder & OpenGraph mapper
│   │   ├── currency.ts              # Localized currency formatting helpers
│   │   ├── fonts.ts                 # Google Fonts dynamic loading helper
│   │   └── utils.ts                 # cn() merge helper, getMediaUrl() media resolver
│   │
│   ├── store/                       # Global Zustand stores (Persistent cross-feature state)
│   │   ├── use-cart-store.ts        # Client-side cart state with localStorage persistence
│   │   ├── use-wishlist-store.ts    # Wishlist state with localStorage persistence
│   │   └── use-company-store.ts     # Company info & global storefront settings
│   │
│   ├── hooks/                       # Cross-cutting custom React hooks
│   │   ├── use-debounce.ts          # Input debouncing hook
│   │   ├── use-role-guard.ts        # Client-side RBAC permission verifier
│   │   └── admin-*.ts               # Generic administrative data hooks
│   │
│   ├── styles/                      # Global styles & design system tokens
│   │   └── globals.css              # Tailwind CSS v4 styling & CSS variables
│   │
│   ├── types/                       # Shared global TypeScript definitions
│   │   └── next-auth.d.ts           # Session & JWT interface augmentations
│   │
│   ├── auth.ts                      # NextAuth v5 configuration & JWT refresh cycle
│   └── proxy.ts                     # Route protection & role-based redirect engine
│
├── .env                             # Active environment variables (gitignored!)
├── .env.example                     # Sample configuration template
├── .gitignore                       # Git ignore rules for Next.js, Node, and IDEs
├── .npmrc                           # Package manager configuration (shamefully-hoist=true)
├── components.json                  # shadcn/ui configuration file
├── eslint.config.mjs                # Modern ESLint flat configuration
├── next.config.ts                   # Next.js configuration (images, caching, remotePatterns)
├── package.json                     # Pinned dependencies & automation scripts
├── pnpm-lock.yaml                   # Locked package tree
├── postcss.config.mjs               # PostCSS configuration for Tailwind v4
└── README.md                        # Project documentation & onboarding guide
```

---

## 3. Core Architectural Pillars

### 3.1 Feature Module Structure (`src/features/<name>/` & `src/admin/<name>/`)

Every feature module must be strictly self-contained. It is structured into designated subdirectories:

```text
src/features/<feature-name>/
├── components/          # React UI components specific to this feature
├── lib/                 # Query hooks, mutation functions, and feature helpers
├── schema/              # Zod validation schemas for forms and payloads
├── types/               # TypeScript interfaces matching backend response schemas
├── constants/           # (Optional) Enums, tabs, filter defaults, static data
├── store/               # (Optional) Feature-scoped Zustand stores
└── index.ts             # AUTO-GENERATED barrel exporting everything from above
```

#### The Strict Barrel Export Rule:
- When a file in `src/app/` or another feature needs a component or function, it **must** import from the barrel:
  ```typescript
  // ✅ CORRECT: Clean, decoupled, maintainable
  import { ProductCard, useProductsQuery, type Product } from "@/features/products";

  // ❌ FORBIDDEN: Deep imports create tight coupling and break architecture
  import { ProductCard } from "@/features/products/components/product-card";
  import { useProductsQuery } from "@/features/products/lib/queries";
  ```
- To update all barrel files automatically, run:
  ```bash
  pnpm generate:exports
  ```

---

### 3.2 Automated Export Generator (`scripts/generate-exports.js`)

Every project following this architecture includes this script to automatically parse and maintain `index.ts` barrels across all feature directories:

```javascript
const fs = require('fs');
const path = require('path');

function generateExports(featurePath, featureName) {
    const folders = ['components', 'lib', 'schema', 'types', 'store', 'constants'];
    const exports = [];

    folders.forEach(folder => {
        const folderPath = path.join(featurePath, folder);
        if (!fs.existsSync(folderPath)) return;

        const files = fs.readdirSync(folderPath)
            .filter(file => {
                const isTs = file.endsWith('.ts') || file.endsWith('.tsx');
                const isNotIndex = file !== 'index.ts' && file !== 'index.tsx';
                return isTs && isNotIndex;
            });

        files.forEach(file => {
            const fileName = file.replace(/\.(ts|tsx)$/, '');
            exports.push(`export * from './${folder}/${fileName}';`);
        });
    });

    const indexPath = path.join(featurePath, 'index.ts');
    const content = exports.length > 0 ? exports.join('\n') + '\n' : '// No exports found\n';
    fs.writeFileSync(indexPath, content);
    console.log(`✓ Generated ${exports.length} exports for feature: ${featureName}`);
}

function generateAllFeatures(featuresPath) {
    if (!fs.existsSync(featuresPath)) return;
    const features = fs.readdirSync(featuresPath).filter(item => {
        return fs.statSync(path.join(featuresPath, item)).isDirectory();
    });
    features.forEach(feature => {
        generateExports(path.join(featuresPath, feature), feature);
    });
}

const defaultFeaturesPath = path.join(process.cwd(), 'src/features');
const defaultAdminPath = path.join(process.cwd(), 'src/admin');
generateAllFeatures(defaultFeaturesPath);
generateAllFeatures(defaultAdminPath);
```

---

### 3.3 Context-Aware 3-Tier API Client (`src/lib/api-client.ts`)

In Next.js App Router, using dynamic authentication calls (like `auth()`) inside cached server functions breaks Next.js caching. To solve this, three distinct Axios instances are used:

| Client Instance | Authentication | Runtime Scope | Safe in `"use cache"`? | Primary Use Case |
|---|---|---|---|---|
| **`apiBase`** | None (Public) | Server & Client | **YES (Only safe choice)** | Public product listings, categories, SEO metadata, auth login/register endpoints |
| **`apiClient`** | Bearer from `getSession()` | Client-side only (`window !== 'undefined'`) | No | Interactive client components, user mutations, checkout forms |
| **`apiServer`** | Bearer from `auth()` | Server-side only (SSR / Server Actions) | **NO** | Server components fetching private customer profile, orders, admin queries |

#### Implementation:
```typescript
// src/lib/api-client.ts
import { createAxiosInstance, attachClientSessionAuth, attachServerSessionAuth, setupResponseInterceptor } from "./api-client-core";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. Base / Public (Zero auth - safe for static & cached fetches)
export const apiBase = createAxiosInstance(API_URL);
setupResponseInterceptor(apiBase, { name: "Base" });

// 2. Client-Side (Injects Bearer token in the browser)
export const apiClient = createAxiosInstance(API_URL);
attachClientSessionAuth(apiClient);
setupResponseInterceptor(apiClient, { name: "Client", isClient: true });

// 3. Server-Side (Injects Bearer token in Server Components)
export const apiServer = createAxiosInstance(API_URL);
attachServerSessionAuth(apiServer);
setupResponseInterceptor(apiServer, { name: "Server" });
```

---

### 3.4 Atomic Component Hierarchy (`src/components/`)

All reusable UI components are organized strictly by complexity:
- **`src/components/atoms/`**: Unstyled or base primitive components (Buttons, Inputs, Checkboxes, Dialogs, Dropdowns, Badges, Tabs). Sourced from **shadcn/ui** and Radix UI.
- **`src/components/molecules/`**: Combinations of 2+ atoms with specific UI behavior (e.g., `search-input.tsx` combining an Input, Search icon, and Clear button; `confirm-dialog.tsx`).
- **`src/components/organisms/`**: Complex application-level sections (e.g., `navbar.tsx`, `footer.tsx`, `admin-sidebar.tsx`, `bottom-navigation.tsx`, `promotional-popup.tsx`).
- **`src/components/organisms/providers.tsx`**: The centralized client-side provider tree combining NextAuth `SessionProvider`, TanStack `QueryClientProvider`, `ThemeProvider`, and `NuqsAdapter`.

---

### 3.5 Media & URL Resolution Protocol (`src/lib/utils.ts`)

To seamlessly support local development (`http://localhost:8080/media/...`) and production cloud object storage (Cloudflare R2 / AWS S3) without breaking image rendering:

```typescript
// src/lib/utils.ts
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  
  // Strip trailing /api/v1 from NEXT_PUBLIC_API_URL to reach media root
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/v1\/?$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${cleanPath}`;
}
```

---

## 4. Standard Configuration Files

### 4.1 `.npmrc`
```ini
shamefully-hoist=true
auto-install-peers=true
```

### 4.2 `components.json` (shadcn/ui Configuration)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/atoms",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### 4.3 `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
  experimental: {
    // Enable Next.js 16 cache features
    cacheLife: {
      default: { stale: 300, revalidate: 900, expire: 86400 },
    },
  },
};

export default nextConfig;
```

### 4.4 `.env.example`
```ini
# ==============================================================================
# FRONTEND APPLICATION SETTINGS
# ==============================================================================
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# NextAuth v5 Configuration
AUTH_SECRET=generate-a-secure-32-character-random-secret-key-here
AUTH_URL=http://localhost:3000

# Optional Image & Media Hostnames
NEXT_PUBLIC_IMAGE_HOSTNAMES=media.yourdomain.com
```

---

## 5. Step-by-Step AI Agent Execution Playbook

When an AI Agent is tasked with setting up a new frontend project from scratch using this standard, it must execute these steps in order:

### Step 0: Initialize Next.js with TypeScript & Tailwind CSS v4
```bash
pnpm create next-app . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

### Step 1: Install Pinned Enterprise Dependencies
```bash
pnpm add axios @tanstack/react-query @tanstack/react-table zustand nuqs next-auth@beta \
  react-hook-form @hookform/resolvers zod lucide-react sonner clsx tailwind-merge \
  class-variance-authority next-themes date-fns motion
```

### Step 2: Establish the Standard Folder Architecture
```bash
# Create Core Subdirectories
mkdir -p src/features src/admin src/components/atoms src/components/molecules \
  src/components/organisms src/components/tiptap src/lib src/store src/hooks \
  src/styles src/types scripts public

# Create Standard App Router Route Groups
mkdir -p "src/app/(main)" "src/app/admin/(dashboard)" src/app/auth src/app/api/auth
```

### Step 3: Configure Scripts and Tooling
1. Add `scripts/generate-exports.js`.
2. Update `package.json` with automation scripts:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "eslint",
     "generate:exports": "node scripts/generate-exports.js"
   }
   ```
3. Set up `.npmrc` with `shamefully-hoist=true`.
4. Configure `components.json` pointing `"ui"` to `@/components/atoms`.

### Step 4: Add Core Library Files
1. Create `src/lib/utils.ts` with `cn()` and `getMediaUrl()`.
2. Create `src/lib/api-client-core.ts` and `src/lib/api-client.ts` with the 3 Axios instances.
3. Create `src/lib/get-query-client.ts` for TanStack Query SSR support.
4. Create `src/components/organisms/providers.tsx` wrapping `SessionProvider`, `QueryClientProvider`, and `NuqsAdapter`.

### Step 5: Establish the First Feature Module
```bash
mkdir -p src/features/landing/{components,lib,types,constants}
touch src/features/landing/types/index.ts
node scripts/generate-exports.js
```

---

## 6. Strict Rules for AI Agents Working on this Project

1. **Always Use the Barrel Import:** Never import across feature boundaries using relative deep paths (`../../components/item`). Always use `@/features/<feature-name>`.
2. **Never Call `auth()` inside `"use cache"`:** In cached server actions or cached layout functions, always use `apiBase`. Never use `apiServer` or `auth()` inside cache scopes.
3. **Run `pnpm generate:exports` after adding files:** Whenever you add or rename a component, type, or query in `src/features/` or `src/admin/`, immediately run the export script.
4. **Pure Semantic HTML in Product Content:** Always render product descriptions and marketing content through semantic HTML (`<h2>`, `<p>`, `<ul>`, `<li>`), never raw markdown symbols.
5. **Form Validation via Zod Schemas:** Every form must have a corresponding schema in `schema/` and be validated with `react-hook-form` + `zodResolver`.

---
*Created as the canonical frontend architecture standard for all future Next.js web platforms.*
