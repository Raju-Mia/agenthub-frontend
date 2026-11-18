# AgentHub Frontend — Design Phase Plan

> **Scope of this document:** Static UI design only.  
> **Stack target:** Next.js App Router + TypeScript + Tailwind CSS v4 (see `project-structure-guideline.md`).  
> **Backend:** `../agenthub-backend` (API wiring comes **after** design is complete).  
> **Mobile lock client:** `../lockapp` (device lock / unlock product).  
> **Status:** Design Phase **10 DONE** — static design complete. Next: API Integration (separate plan).  
> **Last updated:** 2026-11-17

---

## 0. Design principle (read first)

| Rule | Meaning |
|------|---------|
| **Design complete first** | Every page below must look finished with **mock / hardcoded data**. |
| **No API** | Do not call Django, JWT, React Query mutations, or real auth. |
| **No backend dependency** | Forms submit → navigate or toast only; lists use local fixture JSON. |
| **Clickable prototype** | Links, tabs, filters, and role switchers work via static routes. |
| **API later** | After Design Phase 10 is signed off, a separate “API Integration” roadmap replaces fixtures. |

**Goal of this plan:** Build a complete visual administration shell so product, layout, and flows are approved before any network code.

---

## 1. Product vision (what we are designing)

**AgentHub** is the web administration panel for a **phone Lock App** business.

### Business flow (product story)

```text
Customer installs Lock App
        │
        ▼
Phone becomes LOCKED
        │
        ▼
Worker solves / unlocks the device
        │
        ▼
Customer pays  →  1 TK = 1 point
        │
        ▼
Earning starts as PENDING on worker profile
        │
        ▼
Agent verifies the job / amount
        │
        ▼
Admin approves  →  amount becomes REAL (approved) earning
        │
        ▼
Money / settlement is tracked under Admin control
Agent sees rollup of workers; commission default 50%
```

### Hierarchy

```text
Admin
 └── Agents (Managers) — default commission 50% of workers under them
      └── Workers — do unlock jobs; earn points (1 TK = 1 point)
           └── Clients / Customers — records only (no login)
                └── Devices — lock status, contact, location, IP, address
```

### Money & commission (UI must show this clearly)

| Concept | Design meaning |
|---------|----------------|
| **1 TK = 1 point** | Display amount as BDT and points interchangeably in cards |
| **Pending** | Earned but waiting agent verify + admin approve |
| **Approved / Real** | Admin approved; counts toward real earnings |
| **Agent commission** | Per-agent setting; **default 50%** of that agent’s workers’ approved work |
| **Admin view** | Sees total work value per agent and per worker; money control lives with admin |
| **Agent pays workers from share** | UI shows agent commission vs worker share (static labels + mock numbers) |

### Device statuses (Devices list is a core admin page)

| Status | Meaning |
|--------|---------|
| **Locked** | Device currently locked |
| **Auto solved** | Resolved automatically |
| **Unlocked / Solved by worker** | Worker completed unlock |
| **Pending payment / pending verify** | Optional sub-state for job + earning pipeline |

Each device row should surface: **contact**, **location**, **IP**, **address**, lock status, linked worker/agent if known.

---

## 2. Roles & who sees what (static routing)

| Role | Login? | After “login” (static) goes to |
|------|--------|--------------------------------|
| **Admin** | Yes | Admin dashboard |
| **Agent** | Yes | Agent dashboard |
| **Worker** | Yes | Worker dashboard |
| **Client / Customer** | **No** | Never appears in login; admin-managed list only |

**Design shortcut for prototype:** Login page has a **role demo switcher** (Admin / Agent / Worker) that routes to the matching dashboard **without** calling an API. Real auth comes later.

---

## 3. Page inventory — 10 design pages (core)

These **10 pages** are the minimum structure to call “design complete” for the main product shell. Extra role pages (agent/worker) are listed in §5 and built in later design phases using the same shell.

| # | Page | Route (suggested) | Purpose |
|--:|------|-------------------|---------|
| 1 | **Welcome / Landing** | `/` | Brand only: “Welcome to Agent Hub” + **Login** CTA |
| 2 | **Login** | `/login` | Email + password form + demo role buttons |
| 3 | **Admin Dashboard** | `/admin` | Overview cards: devices lock %, earnings, agents, workers, pending approvals |
| 4 | **Agents Manage (List)** | `/admin/agents` | Searchable agent table + create-agent modal/page |
| 5 | **Agent Profile** | `/admin/agents/[id]` | Agent detail, commission %, workers count, earning rollup cards |
| 6 | **Workers Manage (List)** | `/admin/workers` | Global worker table; filter by agent / status |
| 7 | **Worker Profile + Earnings** | `/admin/workers/[id]` | Profile + earning showcase cards (pending / approved / points) |
| 8 | **Customers Manage** | `/admin/customers` | Customer/client records (no login); list + detail drawer/page |
| 9 | **Devices List** | `/admin/devices` | Lock statuses, % breakdown, contact / location / IP / address |
| 10 | **Transactions / Earnings** | `/admin/transactions` | Transaction list + approve/pending pipeline UI |

Supporting shells (built once, reused):

- Admin layout: sidebar, top bar, breadcrumbs, logout (static)
- Shared UI: tables, filters, status badges, stat cards, empty states

Optional but recommended in the same design track (not counted in the “10”):

- Admin profile / settings (`/admin/profile`)
- Agent dashboard + my workers (`/agent`, `/agent/workers`)
- Worker dashboard + my earnings (`/worker`, `/worker/earnings`)

---

## 4. Information architecture

```text
/                          Landing (Welcome + Login)
/login                     Login (demo role → dashboards)

/admin                     Admin Dashboard
/admin/agents              Agents list + create
/admin/agents/[id]         Agent profile + commission + rollup
/admin/workers             Workers list
/admin/workers/[id]        Worker profile + earnings cards
/admin/customers           Customers list (+ detail)
/admin/devices             Devices list + lock % widgets
/admin/transactions        Transactions / earnings pipeline
/admin/profile             Admin profile (optional Phase)

/agent                     Agent Dashboard (Phase 9)
/agent/workers             My workers
/agent/workers/[id]        Worker profile (scoped UI)
/agent/earnings            My commission / rollup
/agent/profile             My agent profile

/worker                    Worker Dashboard (Phase 10)
/worker/earnings           My earnings (pending / approved)
/worker/profile            My profile
/worker/devices            My assigned / unlocked devices (optional)
```

---

## 5. Design phases (step by step)

> Implement **in order**. Each phase ends with a checkbox Done-when.  
> Use **fixture data** under something like `src/mocks/` or `src/admin/*/constants/mock-*.ts`.

### Phase status overview

| Phase | Name | Status |
|------:|------|--------|
| 0 | Scaffold + design tokens + app shell folders | **DONE** |
| 1 | Landing + Login (static) | **DONE** |
| 2 | Admin shell layout (sidebar / header) | **DONE** |
| 3 | Admin Dashboard (stats + lock % overview) | **DONE** |
| 4 | Agents list + Agent profile (+ commission UI) | **DONE** |
| 5 | Workers list + Worker profile + earning cards | **DONE** |
| 6 | Customers manage | **DONE** |
| 7 | Devices list + lock status percentages | **DONE** |
| 8 | Transactions list + pending → approve UI | **DONE** |
| 9 | Agent role screens (static) | **DONE** |
| 10 | Worker role screens + design QA pass | **DONE** |

---

### Phase 0 — Scaffold & design system foundation

**Purpose:** Empty Next.js project structured per `project-structure-guideline.md`, ready for static pages.

**Deliverables**
- Next.js App Router project initialized (pnpm, TypeScript, Tailwind v4, shadcn/ui atoms as needed)
- Folder skeleton: `src/app`, `src/components/{atoms,molecules,organisms}`, `src/admin/*`, `src/features/*`, `src/styles`, `src/mocks`
- Design tokens in `globals.css` (colors, radius, typography) — **no purple-default AI look**; pick a clear admin visual direction
- Mock data modules: agents, workers, customers, devices, transactions, earnings
- README: how to run `pnpm dev` for design preview

**Explicitly out of scope**
- Axios / API client wiring to Django
- NextAuth / JWT
- React Query fetching real endpoints

**Done when**
- [x] App boots locally
- [x] Shared Button, Input, Badge, Card, Table primitives exist
- [x] Mock JSON/TS fixtures exist for all 10 pages

**Completed:** 2026-11-17 — Next.js 16 + Tailwind v4 scaffold, Steel Ops tokens, atoms, `src/mocks/*`, folder skeleton, README.

---

### Phase 1 — Landing + Login (static)

**Purpose:** Public entry matching backend product plan §2 — welcome + login only.

**Page 1 — Landing `/`**
- Hero composition: brand **Agent Hub** dominant
- One headline + one short supporting line about lock-device administration
- Single primary CTA: **Login**
- No dashboard widgets on this page

**Page 2 — Login `/login`**
- Email + password fields (client validation only)
- Submit → based on demo role selector, navigate to `/admin` | `/agent` | `/worker`
- Link back to landing
- Error / empty-state UI for invalid form (local only)

**Done when**
- [x] Landing looks complete and branded
- [x] Login form is polished; demo navigation works without API

**Completed:** 2026-11-17 — `/` brand landing + `/login` form with Admin/Agent/Worker demo routes; placeholders at `/admin`, `/agent`, `/worker`.

---

### Phase 2 — Admin shell layout

**Purpose:** One reusable admin chrome for all `/admin/*` pages.

**Deliverables**
- Sidebar nav items: Dashboard, Agents, Workers, Customers, Devices, Transactions, Profile
- Top bar: page title, user chip (“Admin”), logout → `/login`
- Responsive collapse for mobile
- Active route highlighting

**Done when**
- [x] All admin child pages can mount inside this layout
- [x] Nav covers the 10-page inventory destinations

**Completed:** 2026-11-17 — `AdminShell` + sidebar/header; routes under `/admin/*` (dashboard, agents, workers, customers, devices, transactions, profile) with active nav + mobile drawer.

---

### Phase 3 — Admin Dashboard (Page 3)

**Purpose:** At-a-glance operations + money + lock health.

**UI blocks (mock data)**
- Stat cards: Total Agents, Total Workers, Total Customers, Total Devices
- **Lock status percentage** strip/chart: Locked % · Auto solved % · Unlocked/Solved %
- Earnings summary cards: Pending TK · Approved TK · Today’s volume
- Pending approvals queue (last N transactions needing admin approve)
- Top agents by volume (mini table)

**Done when**
- [x] Dashboard feels complete with realistic mock numbers
- [x] Lock % and earning cards are visually clear

**Completed:** 2026-11-17 — `/admin` overview with stats, lock % strip, earnings cards, approval queue, top agents table (all mock).

---

### Phase 4 — Agents manage + Agent profile (Pages 4–5)

**Purpose:** Admin creates/views agents; sets commission (default 50%).

**Page 4 — Agents list `/admin/agents`**
- Table: name, email, serial (`AGT-0001`), status, workers count, commission %, approved volume
- Search + status filter (UI only)
- Primary action: **Create Agent** (modal or `/admin/agents/new` form — static submit)

**Page 5 — Agent profile `/admin/agents/[id]`**
- Header: name, serial, status, email
- Commission control UI (default shown as **50%**; editable mock)
- Rollup cards: Workers under agent · Pending · Approved · Agent commission share
- Nested workers table (link to worker profile)
- Activity / recent transactions for this agent

**Done when**
- [x] List + profile + create form all look production-ready
- [x] Commission default 50% is obvious in UI copy and mock values

**Completed:** 2026-11-17 — `/admin/agents` list + filters, `/admin/agents/new` create form, `/admin/agents/[id]` profile with commission editor, workers table, transactions.

---

### Phase 5 — Workers manage + Worker profile / earnings (Pages 6–7)

**Purpose:** Global worker administration and earning showcase.

**Page 6 — Workers list `/admin/workers`**
- Table: name, email, linked agent (serial), status, pending, approved, jobs count
- Filters: agent, status, search

**Page 7 — Worker profile `/admin/workers/[id]`**
- Profile header + linked agent chip
- **Earning showcase cards:**
  - Points / TK total
  - Pending amount
  - Approved (real) amount
  - Recent jobs unlocked
- Earnings / transaction mini-table for this worker
- Optional: assigned devices snippet

**Done when**
- [x] Worker list + profile communicate 1 TK = 1 point and pending → approved story
- [x] Navigation Agent → Worker works via static links

**Completed:** 2026-11-17 — `/admin/workers` list + filters; `/admin/workers/[id]` earning cards, transactions, linked devices.

---

### Phase 6 — Customers manage (Page 8)

**Purpose:** Customer/client is a **record only** — no login UI.

**Page 8 — Customers `/admin/customers`**
- Table: name, phone, email (optional), related device count, notes, status
- Create / edit form (static)
- Detail drawer or `/admin/customers/[id]` with linked devices list

**Done when**
- [x] Customers CRUD UI exists with fixtures
- [x] No login affordance for customers anywhere

**Completed:** 2026-11-17 — `/admin/customers` list, `/new`, `/[id]`, `/[id]/edit`; detail shows linked devices; explicitly no login.

---

### Phase 7 — Devices list + lock percentages (Page 9) ★ core product page

**Purpose:** Admin sees which phones are locked, auto-solved, or unlocked; plus contact/geo/network context.

**Page 9 — Devices `/admin/devices`**
- Top widgets: **Locked %**, **Auto solved %**, **Unlocked / Solved %** (and counts)
- Filters: status, agent, worker, date range (UI only)
- Table columns (minimum):
  - Device id / model
  - Status badge
  - Contact
  - Location
  - IP
  - Address
  - Linked customer
  - Linked worker / agent
  - Last updated
- Row click → device detail panel/page with full metadata + status history (mock)

**Done when**
- [x] Status percentages are prominent and readable
- [x] Contact, location, IP, address visible in list or detail
- [x] Status badges visually distinct (locked / auto / solved)

**Completed:** 2026-11-17 — `/admin/devices` lock % widgets + filters + full table; `/admin/devices/[id]` metadata + status history.

---

### Phase 8 — Transactions / earnings pipeline (Page 10)

**Purpose:** Show money path: pay → pending → agent verify → admin approve → real earning.

**Page 10 — Transactions `/admin/transactions`**
- Summary cards: Pending · Awaiting admin · Approved · Rejected/Cancelled
- Table: id, device/job, customer, worker, agent, amount (TK/points), status, dates
- Filters: status, agent, worker, date
- Row actions (static): **Approve**, **Reject**, **View**
- Detail drawer explaining pipeline steps for that transaction

**Copy reminder for UI labels**
```text
Customer paid → Pending (worker)
     → Agent verified
     → Admin approved → Real earning
Agent commission (default 50%) shown on approved rows
```

**Done when**
- [x] Full pipeline is understandable from the page alone
- [x] Approve/reject controls exist as UI (no API)

**Completed:** 2026-11-17 — `/admin/transactions` summary + filters + Approve/Reject/View drawer; `/admin/transactions/[id]` full pipeline page.

---

### Phase 9 — Agent role static screens

**Purpose:** Same design language; narrower data (own workers only).

**Screens**
- `/agent` — dashboard: my workers count, pending, approved, my commission %
- `/agent/workers` — list + create worker form (static)
- `/agent/workers/[id]` — worker profile (scoped)
- `/agent/earnings` — rollup + commission share
- `/agent/profile` — serial, email, commission display

**Done when**
- [x] Agent can click through entire “my workers / earnings” loop with mocks
- [x] No UI that implies creating other agents

**Completed:** 2026-11-17 — Agent shell + `/agent` dashboard, workers list/create/profile, earnings rollup, profile (demo agent `AGT-0001`).

---

### Phase 10 — Worker role screens + design QA

**Purpose:** Worker self-service + final polish across all pages.

**Screens**
- `/worker` — simple dashboard
- `/worker/earnings` — pending vs approved cards + history
- `/worker/profile` — own profile
- Optional: `/worker/devices` — devices they unlocked

**QA checklist**
- [x] All 10 core admin pages complete visually
- [x] Landing + Login complete
- [x] Agent + Worker secondary shells complete
- [x] Empty, loading (skeleton), and error UI states exist (even if mocked)
- [x] Mobile layout acceptable for tables (horizontal scroll or card fallback)
- [x] No live API calls remain in network tab for happy paths
- [x] Fixture data consistent across pages (same agent id on list and profile)

**Done when**
- [x] Stakeholder can demo the full product story statically
- [x] Ready to start **API Integration Phase** (separate plan)

**Completed:** 2026-11-17 — Worker shell (`/worker`, earnings, devices, profile); demo worker `wrk-1`; full route smoke QA (23 routes = 200); fixtures consistent (`Imran Khan` / `AGT-0001`).

---

## 6. Suggested mock data shapes (for designers/devs)

Use TypeScript types later; for design, fixtures should include at least:

```text
Agent:     id, displayName, email, serial, status, commissionPercent (default 50),
           workersCount, pendingTk, approvedTk

Worker:    id, displayName, email, agentId, agentSerial, status,
           pendingTk, approvedTk, points, jobsCount

Customer:  id, name, phone, email?, notes, status, deviceIds[]

Device:    id, model, status (locked|auto_solved|unlocked),
           contact, location, ip, address, customerId,
           workerId?, agentId?, updatedAt

Transaction:
           id, amountTk, points, status (pending|agent_verified|approved|rejected),
           workerId, agentId, customerId, deviceId?,
           createdAt, verifiedAt?, approvedAt?
```

---

## 7. UX flow (static prototype)

```text
[Welcome to Agent Hub] ──Login──► [Login]
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
              Admin dash      Agent dash      Worker dash
                    │
        ┌───────────┼───────────┬────────────┬──────────────┐
        ▼           ▼           ▼            ▼              ▼
     Agents      Workers    Customers     Devices     Transactions
        │           │
        ▼           ▼
   Agent profile  Worker profile + earning cards
```

---

## 8. Explicit non-goals (Design Phases 0–10)

- Connecting to `agenthub-backend` or any `/api/v1/*` endpoint
- Real JWT login / token refresh
- Real payment gateway
- Push notifications / SMS
- Production deployment hardening
- Replacing LockApp mobile UI (web admin only)

---

## 9. After design: API Integration (preview only)

Do **not** start until Design Phase 10 QA is checked.

Suggested later phases (separate update to this file):

1. Auth (login/me) + route guards  
2. Agents CRUD  
3. Workers CRUD  
4. Customers CRUD  
5. Devices list/detail  
6. Transactions + approve  
7. Earnings rollups + commission  
8. Role-scoped agent/worker dashboards  

Until then, keep fixtures.

---

## 10. Acceptance criteria — “Design complete”

- [x] Landing: Welcome to Agent Hub + Login only  
- [x] Login: email/password UI + static role navigation  
- [x] Admin dashboard with lock % and earning overview  
- [x] Agents list + profile with **default 50% commission** UI  
- [x] Workers list + profile with pending/approved earning cards  
- [x] Customers manage (no login)  
- [x] Devices list with status %, contact, location, IP, address  
- [x] Transactions list with pending → approve pipeline UI  
- [x] Agent + Worker static areas navigable from login demo  
- [x] Zero backend dependency for the demo walkthrough  

---

## 11. Related documents

| File | Role |
|------|------|
| `project-structure-guideline.md` | Next.js folder & coding blueprint |
| `../agenthub-backend/PROJECT_PLAN.md` | Backend product + API phases |
| `../lockapp/` | Mobile lock/unlock client |

---

## 12. Build order reminder

```text
Phase 0  Scaffold
   → 1 Landing + Login
   → 2 Admin shell
   → 3 Admin dashboard
   → 4 Agents list + profile
   → 5 Workers list + profile / earnings
   → 6 Customers
   → 7 Devices (+ lock %)
   → 8 Transactions
   → 9 Agent screens
   → 10 Worker screens + QA
        └── STOP — design complete — then API
```

---

*This plan is the source of truth for AgentHub frontend **static design**. Implement page-by-page; do not mix API work into Design Phases 0–10.*
