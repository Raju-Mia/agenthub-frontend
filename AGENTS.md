# AgentHub Frontend — Agent Notes

> **Status:** Design Phase **10 DONE** — static UI complete.  
> **Next:** API Integration Phase (do not start until requested).  
> **Rule:** No API / backend calls in design fixtures until integration starts.  
> **Plan:** `PROJECT_PLAN.md` · **Structure:** `project-structure-guideline.md`

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

## Demo login roles (static)

| Role | Goes to | Fixture |
|------|---------|---------|
| Admin | `/admin` | admin@agenthub.local (chip only) |
| Agent | `/agent` | `agt-1` / AGT-0001 · Karim Hossain |
| Worker | `/worker` | `wrk-1` · Imran Khan under AGT-0001 |

## Portals complete

- Public: `/`, `/login`
- Admin: dashboard, agents, workers, customers, devices, transactions, profile
- Agent: dashboard, workers, create worker, earnings, profile
- Worker: dashboard, earnings, devices, profile

## Do not

- Wire Axios / React Query / JWT until API Integration is explicitly started
- Break fixture IDs used across portals (`agt-1`, `wrk-1`, etc.)
