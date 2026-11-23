# UI-GUIDELINE — TPS3R Site Intelligence

**Versi:** 0.1 — Draft Phase 2  
**Status:** Phase 2 disetujui; menunggu persetujuan pengguna sebelum Phase 3  

## 1. Product UI Direction
- Product concept: Environmental Intelligence SaaS for decision support on strategic TPS3R candidate-site selection.
- Visual direction: modern, futuristic, clean, analytical, professional for government operations.
- Primary UX principles: decision-focused, clear ranking, transparent criteria, low-friction data entry, consistent components.
- Scope remains limited to candidate locations, criteria input, TOPSIS calculation, results and decision support. No GIS, external integrations, IoT, AI prediction, or backend in prototype scope.

## 2. Brand and Color Tokens
| Token | Hex | Use |
|---|---|---|
| Forest Dark | #102C24 | Sidebar/deep surfaces |
| Eco Primary | #1D6B45 | Primary actions, selected states |
| Lime Accent | #B9E769 | Highlights, emphasis |
| Soft Canvas | #F4F7F2 | App background |
| Amber | #E5B94B | Warning / attention |
| Slate | #64748B | Muted text / secondary info |
| White | #FFFFFF | Cards and surfaces |

## 3. Typography and Layout
- Font: Inter (fallback sans-serif).
- Page title: 28px semibold; section heading: 20px semibold; card title: 16px; body: 14px; caption: 12px.
- Desktop sidebar: 248px; topbar: 68px; fluid content with max-width 1440px.
- Spacing base: 8px. Cards radius: 14px. Inputs/buttons radius: 10px.
- Responsive breakpoints: desktop >=1200px; tablet 768–1199px; mobile <768px.

## 4. Navigation / Sitemap
1. Dashboard
2. Kandidat Lokasi
3. Penilaian Kriteria
4. Analisis TOPSIS
5. Hasil & Ranking
6. Pengaturan Bobot

Prototype uses local mock data. Persistent backend, account system, external sync, and integrations are out of scope.

## 5. Screen Guidelines
### Dashboard
- Header: page title, contextual subtitle, primary CTA `Analisis TOPSIS`.
- KPI cards: jumlah alternatif, kandidat ranking #1, skor preferensi tertinggi, status data penilaian.
- Visuals: horizontal ranking chart and criteria-weight visualization.
- Recent/update panel: candidate data completeness (mock/local only).
### Kandidat Lokasi
- Table columns: nama kecamatan/desa, volume belum terlayani, luas lahan, C3 value, akses truk, partisipasi, completeness, actions.
- Actions: tambah kandidat, edit, detail, delete with confirmation.
- Search, sort, filter, empty state.
### Penilaian Kriteria
- Form input per candidate with numeric/unit-aware fields and 1–5 rating controls for ordinal criteria.
- Inline validation, helper text, missing-data state, save/cancel.
- C3 uses `Kepadatan pemukiman sekitar` as a cost criterion with the 1–5 scale.
### Analisis TOPSIS
- Show selected alternatives and criteria weights before calculation.
- Explicit `Mulai Perhitungan` action.
- Calculation state, validation feedback, and explanation of steps: decision matrix, normalization, weighted matrix, ideal positive/negative, distance, preference coefficient.
- Calculation results must be reproducible from visible inputs.
### Hasil & Ranking
- Ranked table with rank, candidate, preference coefficient (Ci), and summary.
- Visual ranking chart; best alternative highlighted.
- Candidate detail drawer/modal with criterion values and contribution context.
- Hasil & Ranking menyediakan ekspor Excel `.xlsx` dan aksi cetak/simpan PDF melalui dialog browser.
### Pengaturan Bobot
- Show C1–C5, benefit/cost type, numeric weight controls.
- Validate weights sum to 1.00; offer an explicit normalization action only if approved as a behavior.
- Reset to default weights.
- Default weights: C1 0.30, C2 0.25, C3 0.20, C4 0.15, C5 0.10.

## 6. Criteria Display
| Code | Label | Default weight | Type | UI input |
|---|---|---:|---|---|
| C1 | Volume sampah belum terlayani | 0.30 | Benefit | Ton/day numeric |
| C2 | Ketersediaan luas lahan | 0.25 | Benefit | m² numeric |
| C3 | Kepadatan pemukiman sekitar | 0.20 | Cost | Rating 1–5 |
| C4 | Aksesibilitas jalan truk | 0.15 | Benefit | Rating 1–5 |
| C5 | Partisipasi & kesiapan masyarakat | 0.10 | Benefit | Rating 1–5 |

## 7. Component Library
- AppShell, Sidebar, Topbar, Breadcrumbs
- KPI Card, Chart Card, Data Table, Ranking Badge
- Primary/Secondary/Ghost buttons
- Numeric input, Select, Rating control, Search input
- Modal, Drawer, Toast, Confirmation dialog
- Loading, Error, Empty, Validation states
- Tooltip and help text

## 8. Interaction and UX Rules
- Primary CTA is visually unique per page.
- Destructive actions require confirmation.
- Form errors appear near the input and use plain-language messages.
- Missing/incomplete values are visible and block calculation where required.
- Ranking table must support sorting and preserve understandable rank ordering.
- TOPSIS calculation only runs after explicit user action.
- Never silently change criteria types, weights, or user-entered data.
- Show empty states with one clear next action.

## 9. Accessibility and Responsive Behavior
- Maintain readable contrast; do not rely on color alone for status.
- Keyboard focus is visible; inputs have persistent labels.
- Table can horizontally scroll on narrow screens; candidate forms stack into single column.
- Sidebar collapses to drawer/navigation menu on mobile.
- Chart summaries should be accompanied by text/table values.

## 10. UI Acceptance Checklist
- All screens use consistent tokenized colors, typography, spacing, and component styles.
- Navigation routes map to the six pages above.
- Dashboard and results reflect the same mock dataset.
- Candidate add/edit/delete flows include validation and confirmation.
- Criteria and weight values are visible before calculation.
- TOPSIS analysis shows its stages and computed ranking transparently.
- C3 is explicitly displayed as `Kepadatan pemukiman sekitar` and treated as a cost criterion.
- Empty, error, loading, and validation states are represented.
- Responsive layout works across desktop/tablet/mobile breakpoints.

## 11. Resolved Design Decision
C3 is defined as `Kepadatan pemukiman sekitar` on a 1–5 cost scale. Higher values indicate a less desirable location condition. The C3 rubric must still be displayed consistently in the input UI so scoring remains comparable.
