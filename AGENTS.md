# AGENTS.md — TPS3R Site Intelligence

## 1. Mission
Build the web-based decision-support application for prioritizing candidate locations for a new TPS3R in Kabupaten Bogor using TOPSIS, strictly following the approved SOT documents.

## 2. Source of truth
Read these documents before changing code:
- `PRD.md`
- `UI-GUIDELINE.md`
- `IMPLEMENTATION_PLAN.md`

Use this priority if instructions conflict: explicit latest user instruction > approved PRD > approved UI-GUIDELINE > approved IMPLEMENTATION_PLAN > agent assumptions. Never silently make a material assumption; ask the user.

## 3. Scope lock
In scope: candidate location data, five criteria and configured weights, TOPSIS calculations, ranking and transparent calculation details, dashboard visualizations, data validation, local persistence, responsive UI, and quality checks as defined in the SOT.
Out of scope unless the user explicitly approves a scope change: backend, database, authentication/authorization, external API/data integrations, GIS/maps, IoT, predictive AI, procurement/land acquisition workflows, or unrelated modules.
Use mock/sample data only in the initial frontend and label it clearly as sample data.
## 4. Criteria and weights
- C1 Unserved waste volume — 0.30 — Benefit
- C2 Available land area — 0.25 — Benefit
- C3 Kepadatan pemukiman sekitar — 0.20 — Cost — 1–5 ordinal scale. Do not alter the criterion definition or invent a scoring rubric outside approved SOT decisions.
- C4 Truck road accessibility — 0.15 — Benefit
- C5 Community participation/readiness — 0.10 — Benefit
Weights must total 1.00. Do not alter criteria, weights, or benefit/cost types without approval.
## 5. TOPSIS correctness
Implement TOPSIS in a pure, UI-independent JavaScript module. Use the method sequence defined in the SOT: decision matrix, vector normalization, weighted normalized matrix, positive/negative ideal solutions, separation distances, preference coefficient (Ci), and descending ranking. Validate inputs and weights; handle zero denominators, empty/single candidate, invalid or missing values safely. Never return NaN/Infinity or silently produce misleading rankings. Expose sufficient intermediate values for calculation transparency. Add focused tests for the calculation and edge cases.
## 6. Phase-gated workflow
Implementation Plan milestones must be executed one milestone at a time. Start only with M0 (Foundation). When M0 is complete, report files changed, commands executed, build/test outcomes, deviations/issues, and next milestone proposal. Stop and wait for explicit user approval before starting M1. Continue this gate for every milestone; never auto-continue.
## 7. Coding standards
- Use React + Vite + JavaScript, CSS3, Recharts, and Lucide React as specified.
- Keep components modular and readable; avoid premature abstractions and unnecessary dependencies.
- Use accessible labels, keyboard-friendly controls, semantic structure, and responsive behavior.
- Keep design tokens centralized. Match UI-GUIDELINE; do not introduce alternate themes without approval.
- Keep calculation logic out of React components.
- Prefer concise, purposeful code and avoid redundant comments or boilerplate.
- Never delete or overwrite user work without asking first.
## 8. Data and persistence
- Treat mock data as illustrative, not official data.
- Keep LocalStorage keys and data structure deliberate and versionable; validate data loaded from storage and provide a safe fallback.
- No network/API calls or telemetry unless approved.
## 9. Token efficiency
- Avoid reprinting SOT documents in chat or coding reports.
- Inspect only files relevant to the current milestone.
- Make the smallest cohesive change set.
- Summarize outcomes with concise bullets and paths.
- Do not perform unrelated cleanup, redesign, or feature expansion.
## 10. Completion / reporting
For each milestone, report: milestone status, files created/changed, commands run, validation outcomes, issues/blockers, and the next milestone requiring approval. A milestone is not complete based on claims alone; verify with relevant commands/tests.
## 11. Scope-change protocol
If a requested change alters scope, methodology, weights, criterion definitions, architecture, or dependencies: describe the impact and ask for approval before implementing. Do not treat suggestions or assumptions as approval.
