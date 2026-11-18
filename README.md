# AgentHub Frontend

Static-first administration UI for **AgentHub** (agents, workers, devices, earnings).

Backend: `../agenthub-backend`  
Mobile Lock App: `../lockapp`  
Plan: [`PROJECT_PLAN.md`](./PROJECT_PLAN.md)

## Design-first rule

Phases **0–10** are **UI only** — mock fixtures in `src/mocks/`, **no API connection**.  
API wiring starts only after Design Phase 10 is signed off.

## Stack

- Next.js App Router (React 19) + TypeScript
- Tailwind CSS v4
- Atomic UI under `src/components/atoms`
- Feature modules: `src/features/*`, `src/admin/*`

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Local design preview |
| `pnpm build` | Production build check |
| `pnpm lint` | ESLint |
| `pnpm generate:exports` | Regenerate feature/admin barrel `index.ts` files |

## Phase 0 checklist

- [x] Next.js scaffold
- [x] Folder skeleton (`app`, `components`, `admin`, `features`, `mocks`, `styles`)
- [x] Design tokens (Steel Ops — teal/slate, not purple)
- [x] Atoms: Button, Input, Label, Badge, Card, Table
- [x] Mock fixtures: agents, workers, customers, devices, transactions, earnings

**Phase 1 done:** `/` landing + `/login` (demo roles → `/admin` | `/agent` | `/worker`).  
**Phase 2 done:** Admin shell — sidebar, header, logout, all `/admin/*` nav stubs.  
**Phase 3 done:** `/admin` dashboard — stats, lock %, earnings, approval queue, top agents.  
**Phase 4 done:** Agents list, create form, profile + commission (default 50%).  
**Phase 5 done:** Workers list + profile earning cards (1 TK = 1 point).  
**Phase 6 done:** Customers list/create/edit/detail (no login) + linked devices.  
**Phase 7 done:** Devices list + lock % widgets + device detail/history.  
**Phase 8 done:** Transactions pipeline + Approve/Reject UI + detail drawer/page.  
**Phase 9 done:** Agent portal — dashboard, workers, earnings, profile (`AGT-0001`).  
**Phase 10 done:** Worker portal + design QA — **static design complete**.

**Next (when ready):** API Integration Phase — wire Django `/api/v1` (separate plan).
