## Context

The Holland RIASEC web app is a single-page Next.js application with client-side state only. It currently has a linear 8-step wizard: step 0 (user info) → steps 1–6 (test sections) → step 7 (results). All state lives in `WizardContainer.tsx` via `useState`. There is no localStorage persistence, no routing, and no backend beyond a Google Apps Script POST for saving results.

The app uses Tailwind CSS v4, React 19, and Next.js 16.2. It has zero charting dependencies. The data layer is purely static TypeScript files (`questions.ts`, `careers.ts`, `personalities.ts`, `types.ts`).

## Goals / Non-Goals

**Goals:**
- Fork the wizard into two distinct purpose-driven paths (Peminatan vs Karir) without duplicating the 90-question test
- Produce Peminatan-specific results (weighted IPA/IPS/Bahasa percentage bar chart + narrative)
- Produce Karir-specific results (radar chart, badge, Holland code, program studi clusters)
- Persist full test state across page refreshes
- Enable PDF export and Google Form integration

**Non-Goals:**
- Backend server or database — this remains a static site
- User authentication or accounts
- Multi-school configurability (hardcode sensible defaults, make Form ID configurable via env later)
- Replacing the existing Google Sheets submission mechanism
- Internationalization (remains Bahasa Indonesia only)

## Decisions

### D1: Peminatan mapping algorithm — Weighted Percentage (Algorithm A)

**Decision:** Use a tunable weight matrix where each RIASEC type contributes weighted percentages to IPA/IPS/Bahasa. The final result is the normalized weighted sum across all 6 types.

**Rationale:** Three algorithms were considered:
- **Algorithm A (Weighted Percentage):** Each RIASEC type has weights like `realistic: { ipa: 0.80, ips: 0.15, bahasa: 0.05 }`. Final percentages are computed as `Σ(score × weight) / Σ(score)`. Produces smooth percentages, handles edge cases, and is easily tunable.
- **Algorithm B (Group Sum):** IPA = I + R, IPS = S + E + C, Bahasa = A. Simple but biased (IPS has 3 types feeding it, Bahasa only 1 — systematic underscoring for artistic types).
- **Algorithm C (Top-3 Decode):** Plurality vote among top-3 types. More narrative but can produce confusing ties.

Algorithm A avoids the bias of B and the ambiguity of C. The weight table lives in a data file (`peminatan.ts`) separate from logic, making it straightforward for a BK counselor to review and adjust.

### D2: Chart library — Chart.js with react-chartjs-2

**Decision:** Use Chart.js via `react-chartjs-2` for the radar chart. Use Tailwind CSS for the Peminatan bar chart (no library needed).

**Rationale:** The plan mentions Chart.js. It's the most widely used charting library, has a well-maintained React wrapper, and handles radar charts natively. A hand-rolled SVG radar was considered but adds complexity for no meaningful bundle-size saving in this context. The bar chart for Peminatan (3 bars with labels) is trivially achievable with CSS width percentages.

### D3: PDF export — html2pdf.js

**Decision:** Use `html2pdf.js` for PDF generation.

**Rationale:** The app already has print CSS (`print:` prefixes in Tailwind classes). `html2pdf.js` wraps html2canvas + jsPDF and handles canvas elements (radar chart) to image conversion automatically. Alternative `jspdf` would require manual layout code. The one-page result view is already well-structured for direct capture.

### D4: State persistence — localStorage

**Decision:** Persist `mode`, `currentStep`, `name`, `birthDate`, and `selections` to localStorage. Restore on mount.

**Rationale:** Minimal approach for a static site. No server state needed. `selections` (the `Record<PersonalityType, Set<number>>`) must be serialized to/from arrays since `Set` is not JSON-serializable. On mount, check for existing state and skip the mode/info steps if complete. A "Mulai Ulang" (restart) button will be provided on the results page and optionally on the mode selector to clear stored state.

### D5: Component architecture — Split ResultsDisplay, keep singular WizardContainer

**Decision:** `WizardContainer` remains the single orchestrator with `mode` added to its state. `ResultsDisplay` is replaced by two components: `PeminatanResults` and `KarirResults`. The wizard conditionally renders one based on `mode`.

**Rationale:** The wizard pattern already works well. Adding `mode` state and a conditional render at the results step is simpler than introducing a router or state management library. The mode selector becomes step 0, shifting everything by 1 (TOTAL_STEPS: 8 → 9).

### D6: Bahasa as first-class peminatan

**Decision:** Bahasa is a full third option alongside IPA and IPS with its own weight row, narrative description, subject list, and bar in the chart.

**Rationale:** Explicit user requirement. Even though not all schools offer Bahasa as a standalone peminatan, it provides valuable self-knowledge and the result can note that availability varies by school.

### D7: Google Form integration — URL construction with configurable Form ID

**Decision:** Construct a Google Form pre-fill URL with test results as query parameters. The Form ID and entry field IDs will initially be hardcoded in a config file (`src/config.ts`) with a comment noting they should be moved to environment variables later.

**Rationale:** Read-only URL construction (no POST, no CORS issues). The existing SaveButton posts to Google Apps Script and remains unchanged. The Google Form link appears on the results page as a secondary action button.

## Risks / Trade-offs

**[Weight matrix accuracy]** → The initial weights are drafted, not validated by a psychometrician. Mitigation: weights are in a standalone data file, easy to replace. The UI should note results are indicative and not a substitute for professional counseling (this disclaimer already exists in UserInfoStep).

**[Bundle size]** → Adding chart.js + html2pdf.js adds ~200KB gzipped. Mitigation: consider dynamic imports (`next/dynamic`) for the results page so these libraries only load when needed, not on the initial page.

**[localStorage edge cases]** → Users clearing browser data lose progress. Multiple tabs could cause stale state. Mitigation: add a "Mulai Ulang" button that clears localStorage. Don't handle multi-tab sync — for this use case (a student taking a test once), it's unnecessary complexity.

**[Badge content authoring]** → 20+ Holland code combinations need badge names and descriptions. This is psychometric content that requires domain expertise. Mitigation: start with a draft set and mark them as adjustable. The `badges.ts` data file structure makes this straightforward to update.

**[Program studi data]** → Mapping Holland codes to Indonesian study programs requires educational domain knowledge. Mitigation: start with a small curated set and expand over time.

## Open Questions

- Exact weight values for the peminatan mapping — the initial draft in `peminatan.ts` should be reviewed by a BK counselor or educational psychologist
- Badge names and descriptions — to be authored in `badges.ts` as a separate data file, pending domain expert input
- Program studi cluster mapping — to be expanded in `programStudi.ts` over time
- Whether the mode selector should visually match the existing blue theme or have distinct branding for each mode