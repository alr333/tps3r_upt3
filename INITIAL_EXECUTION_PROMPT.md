# Initial Execution Prompt — TPS3R Site Intelligence

You are the coding agent working in the TPS3R Site Intelligence project repository.


## Before coding
1. Read `AGENTS.md`, `PRD.md`, `UI-GUIDELINE.md`, and `IMPLEMENTATION_PLAN.md` in full.
2. Confirm the task is **M0 — Foundation only** from the Implementation Plan.
3. Do not implement dashboard pages, CRUD, TOPSIS, rankings, or any later milestone during this first execution.
4. If any document is missing, contradictory, or if an unresolved material decision blocks M0, stop and ask the user. Do not fabricate approval or decisions.

## Task: M0 — Foundation
Create the minimal project foundation for the approved stack:
- React + Vite + JavaScript
- npm scripts for development and production build
- minimal entry point and application shell placeholder
- initial repository structure matching the Implementation Plan as reasonably appropriate, without creating empty files for every future feature
- install only dependencies needed for M0; defer Recharts and Lucide usage until their milestone if not needed now
- include a concise README with setup and run commands
- verify the development/build commands

Do not add backend, database, authentication, API integrations, GIS/maps, AI prediction, IoT, or unrelated functionality.

## Execution constraints
- Keep changes minimal and aligned with SOT.
- Preserve existing user files; inspect before overwriting.
- Do not change criteria, weights, or benefit/cost definitions. C3 is locked as kepadatan pemukiman sekitar with cost semantics; do not introduce or alter its rubric as part of M0.
- No automatic execution of M1 or subsequent milestones.
- If tools/commands fail, report the exact failure and reasonable next step; do not hide it.

## Acceptance criteria for M0
- Vite React app scaffold is present and runnable.
- `npm install` (or package-manager install if already established) completes successfully.
- `npm run dev` starts the development server (verify when environment permits).
- `npm run build` completes successfully.
- Project structure is documented and not bloated with unused scaffolding.

## Final report
When M0 finishes, provide a concise report:
1. M0 status (complete/incomplete)
2. Files created/changed
3. Commands executed and results
4. Build/dev verification
5. Issues or blockers
6. Suggested M1 work summary

Then **STOP**. Wait for explicit user approval before beginning M1.
