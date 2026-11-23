# IMPLEMENTATION_PLAN — TPS3R Site Intelligence

**Project:** Sistem Penunjang Keputusan Penentuan Lokasi Pembangunan TPS3R Baru  
**Unit:** UPT III Pengelolaan Sampah Wilayah III Ciawi — DLH Kabupaten Bogor  
**Version:** 0.1 — Phase 3 Approved  
**Status:** Phase 3 disetujui; coding menunggu approval eksekusi M0  
**Frontend stack:** React, Vite, JavaScript, CSS3, Recharts, Lucide React  
**MVP architecture:** Frontend-only prototype, mock data, LocalStorage


## 1. Execution Contract

- Implement only requirements explicitly defined in PRD and UI-GUIDELINE.
- Report export is limited to Excel `.xlsx` and browser print/save-as-PDF; direct PDF generation is out of scope.
- No coding begins until Phase 3 is approved.
- Do not add GIS/maps, API integration, authentication, backend, database, export, AI/ML, IoT, or unrequested modules.
- Use mock/sample data and clearly label it as **Data Contoh**.
- TOPSIS computation must be deterministic, testable, and transparent.
- C3 is locked as `Kepadatan pemukiman sekitar` with cost semantics; do not alter the criterion or invent a C3 rubric beyond the approved PRD/UI-GUIDELINE.
- No phase/task expansion without user approval.

## 2. Application Routes / Screens

Implement the six screen areas in the approved UI-GUIDELINE:
1. Dashboard
2. Kandidat Lokasi
3. Penilaian Kriteria
4. Analisis TOPSIS
5. Hasil & Ranking
6. Pengaturan Bobot

Route strategy: use a lightweight client-side router (React Router) unless a simple internal navigation approach is explicitly chosen before implementation. Keep URL navigation consistent and avoid unnecessary routing complexity.

## 3. Project Setup

### Tasks
- Initialize Vite React JavaScript project.
- Install only required dependencies: `recharts`, `lucide-react`, and `react-router-dom` (routing dependency only if chosen).
- Establish scripts: `dev`, `build`, and `preview`.
- Set up base CSS, design tokens, responsive breakpoints, and font fallback.
- Create project README with setup/run instructions.

### Deliverable
- A runnable starter app with App shell and navigation, no feature logic yet.

### Acceptance
- `npm install` and `npm run dev` work without setup errors.
- `npm run build` succeeds.
- UI follows the agreed palette, typography, and shell dimensions.

## 4. Design System & App Shell

### Tasks
- Define CSS variables for brand, surface, text, border, status, spacing, radius, and shadows.
- Build responsive AppShell, Sidebar, Topbar, PageHeader, and content container.
- Build shared components: Button, Card, Badge, Input, Select, NumericInput, RatingControl, Table, Modal, ConfirmDialog, Toast, EmptyState, ValidationMessage, and ChartCard.
- Add keyboard focus states and non-color-only status cues.

### Acceptance
- All screens use shared components and design tokens.
- Sidebar collapses to a mobile drawer/menu.
- Layout supports desktop, tablet, and mobile breakpoints.
- Components have clear labels, focus behavior, and responsive handling.

## 5. Mock Data & State Model

### Data entities
- Alternative: `id`, `name`, `district`, `notes`, `criteriaValues`, `createdAt`, `updatedAt`.
- Criteria definition: `id`, `code`, `name`, `weight`, `type`, `unit`, `inputType`, `helpText`.
- Analysis result: decision matrix, normalized matrix, weighted matrix, positive ideal, negative ideal, distances, preference coefficients, ranking, calculatedAt, input snapshot.

### Default criteria
- C1 Volume sampah belum terlayani — 0.30 — Benefit — ton/hari.
- C2 Ketersediaan luas lahan — 0.25 — Benefit — m².
- C3 Kepadatan pemukiman sekitar — 0.20 — Cost — 1–5 ordinal scale; the scoring rubric must be shown consistently.
- C4 Aksesibilitas jalan truk — 0.15 — Benefit — rating 1–5.
- C5 Partisipasi & kesiapan masyarakat — 0.10 — Benefit — rating 1–5.

### Tasks
- Prepare small illustrative dataset of at least five candidates, labelled Data Contoh.
- Provide criteria descriptions/rubric help for ordinal 1–5 values.
- Create central state/data utilities with validation.
- Load initial sample data on first use only; preserve user edits afterward.
- Persist alternatives and weight settings in LocalStorage.
- Provide reset-to-sample-data/reset-default-weights actions with confirmation where data loss is possible.

### Acceptance
- Data example label is visible.
- Candidate/weight changes survive refresh.
- Reset actions are explicit and confirmed.
- Invalid or incomplete values are not silently accepted.

## 6. Feature Implementation Sequence

### 6.1 Dashboard
- KPI cards: alternative count, top-ranked candidate, highest Ci, data completeness.
- Candidate ranking chart.
- Criteria-weight visualization.
- Empty/insufficient-data state.

Acceptance: all dashboard summaries are derived from the same dataset and analysis snapshot; no hard-coded conflicting numbers.

### 6.2 Kandidat Lokasi
- Candidate list/table with name, parent district, criteria summary/completeness, and actions.
- Search and basic sorting.
- Add/edit form and detail view.
- Delete confirmation.

Acceptance: CRUD works; duplicate/blank names and invalid values are rejected; empty state offers a clear action.

### 6.3 Penilaian Kriteria
- Candidate selection.
- Input C1 ton/day, C2 m², C3 configured numeric field, C4 1–5 rating, C5 1–5 rating.
- Inline units, helper descriptions, range checks, and incomplete-data indicators.
- Save/cancel behavior.

Acceptance: values are tied to the correct candidate, validated, and persisted. C3 is displayed explicitly as `Kepadatan pemukiman sekitar` and treated as a cost criterion.

### 6.4 Pengaturan Bobot
- Display/edit weights for C1–C5.
- Display benefit/cost types.
- Validate nonnegative weights and sum equals 1.00 (with a defined floating-point tolerance).
- Reset default weights.

Acceptance: cannot start calculation with invalid weights; no automatic silent normalization. Defaults restore exactly 0.30/0.25/0.20/0.15/0.10.

### 6.5 TOPSIS Engine
- Implement calculation as pure functions separate from React UI.
- Validation for minimum alternatives, missing values, nonnegative values, and weight validity.
- Decision matrix construction.
- Vector normalization.
- Weighted normalized matrix.
- Positive/negative ideal solution selection using benefit/cost direction.
- Euclidean distances to ideals.
- Preference coefficient Ci.
- Descending ranking with deterministic tie handling.
- Defensive handling for zero denominators, zero columns, and identical alternatives.

Acceptance: calculation stages can be inspected; identical input produces identical output; edge cases return understandable validation or safe results, not NaN/Infinity or crashes.

### 6.6 Analisis TOPSIS
- Show current alternatives and weights before run.
- Explicit `Mulai Perhitungan` button.
- Show progress/state feedback only as needed (calculation is local and fast).
- Display calculation stages: matrix, normalization, weighted matrix, ideals, distances, Ci.

Acceptance: no calculation runs silently; analysis uses a clearly identified input snapshot and is reproducible.

### 6.7 Hasil & Ranking
- Ranking table with rank, candidate name, Ci, and data completeness.
- Highlight top candidate and show disclaimer: recommendation is decision support, not final field/policy decision.
- Ranking visualization.
- Detail panel/modal with criteria values and TOPSIS calculation details.

Acceptance: results sorted by descending Ci; ranking and chart match the same analysis snapshot; stale results are clearly identified if data/weights changed since last run.

## 7. QA & Testing Plan

### Unit tests
- Criteria and weight validation.
- TOPSIS normalization and weighting.
- Ideal positive/negative for benefit and cost criteria.
- Distance and Ci calculations.
- Ranking and tie handling.
- Zero/constant-column and invalid-data cases.

### UI tests / manual checks
- Navigation across all screens.
- CRUD create/edit/delete and confirmation.
- Criteria input validation.
- Weight validation and default reset.
- Calculate and review TOPSIS stages.
- Data persistence after refresh.
- Empty states and error feedback.
- Keyboard focus and responsive viewport checks.

### Quality gate
- No console errors in core flows.
- Production build succeeds.
- No unrequested feature or external service dependency.

## 8. Suggested Build Milestones

| Milestone | Work | Completion gate |
|---|---|---|
| M0 | Vite setup, scripts, shell, tokens | App starts and builds |
| M1 | Shared components, navigation, responsive shell | UI shell approved against guideline |
| M2 | Mock data, state, LocalStorage | Data model and persistence validated |
| M3 | Candidate CRUD & criteria forms | CRUD and validation pass |
| M4 | Weight settings & TOPSIS engine | Unit tests/known test cases pass |
| M5 | Analysis stages, ranking, detail | Result transparency and consistency pass |
| M6 | Dashboard charts, empty/error states | Dashboard reflects same analysis data |
| M7 | Final QA, polish, README | Acceptance checklist complete |

## 9. Implementation Order (Token-efficient)

1. Read PRD, UI-GUIDELINE, IMPLEMENTATION_PLAN, and project AGENTS.md before changes.
2. Implement M0–M1; stop and report checkpoint.
3. Implement M2; stop and report checkpoint.
4. Implement M3; stop and report checkpoint.
5. Implement M4; run TOPSIS tests and stop/report checkpoint.
6. Implement M5–M6; stop/report checkpoint.
7. Implement M7 and final acceptance report.

Coding agent must not execute all milestones in one unreviewed run unless the user explicitly approves the full execution scope.

## 10. Definition of Done

- All six approved screen areas exist and navigate correctly.
- Candidate CRUD and criterion data entry work.
- Weight editing validates total 1.00 and default weights are correct.
- TOPSIS is implemented and testable, with all calculation steps transparent.
- Ranking/chart/table are consistent with one analysis snapshot.
- LocalStorage persistence works for MVP.
- Sample data is clearly labelled.
- Responsive behavior and basic accessibility checks pass.
- C3 is clearly implemented as kepadatan pemukiman and treated as a cost criterion.
- `npm run build` succeeds.
- README includes setup, run/build commands, limitations, and data disclaimer.
- No out-of-scope feature was added.

## 11. Risks & Decisions to Resolve

- **C3 rubric:** define and consistently display the 1–5 scoring rubric for kepadatan pemukiman while preserving cost semantics.
- **Ordinal scoring:** publish consistent 1–5 rubric for C3 (if ordinal), C4, and C5.
- **Sample data:** ensure examples are synthetic and clearly identified.
- **Stale analysis:** mark results out of date when inputs or weights change after calculation.
- **TOPSIS edge cases:** prevent division-by-zero, NaN, and invalid Ci outputs.

## 12. Phase Gate

Phase 3 is an approved planning artifact. **No coding authorization is granted by this document.** Coding begins only after explicit user approval of M0 execution. M0 is limited to foundation setup and must stop before M1.
