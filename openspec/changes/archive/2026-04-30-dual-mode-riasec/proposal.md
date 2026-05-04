## Why

The Holland RIASEC instrument currently serves only one purpose: career mapping. However, Indonesian students face two distinct transition points — choosing a peminatan (IPA/IPS/Bahasa) when entering SMA/MA, and choosing a career/study program when graduating. The same 90-question RIASEC test can serve both purposes by forking the result interpretation while keeping the questionnaire identical. This eliminates the need for two separate instruments and makes the tool significantly more useful to BK counselors and students.

## What Changes

- Add a **mode selector screen** before the user info form, offering two paths: "Peminatan SMA/MA" (Option A) and "Karir & Program Studi" (Option B). The selected mode is stored in state and persisted to localStorage.
- Add **peminatan mapping logic** that translates weighted RIASEC scores into percentage recommendations across three first-class peminatan groups: IPA, IPS, and Bahasa. Each RIASEC type carries tunable weights per group. Bahasa is a full third option, not a footnote.
- Split the **results page** into two distinct components: `PeminatanResults` (bar chart showing IPA/IPS/Bahasa percentages with narrative descriptions) and `KarirResults` (evolved from current ResultsDisplay with radar chart, badges, and program studi clusters).
- Add a **radar chart** (Chart.js) to KarirResults showing the 6-axis RIASEC profile.
- Add a **badge/profile system** assigning personality names to top-3 Holland code combinations (e.g., I-A-S → "Inovator Analitis"). Badge data lives in a separate data file for easy editing.
- Add **program studi recommendation logic** for KarirResults that maps top-3 Holland codes to clusters of study programs and professions.
- Add **PDF export** via html2pdf.js, producing a one-page result certificate including chart, code, and recommendations.
- Add **Google Form auto-fill URL** construction, appending test results as query parameters to a configurable Form URL.
- Persist **mode, name, birthDate, selections, and currentStep** to localStorage so the entire test state survives page refresh.

## Capabilities

### New Capabilities

- `mode-selection`: Mode selector UI component and state management for dual-path flow, including localStorage persistence of mode choice
- `peminatan-mapping`: Weighted algorithm translating RIASEC scores into IPA/IPS/Bahasa percentage recommendations, with tunable weight data
- `peminatan-results`: Result page for Option A showing bar chart, percentage breakdown, and narrative peminatan descriptions
- `karir-results`: Enhanced result page for Option B with radar chart, badge names, top-3 Holland code, and program studi clusters
- `pdf-export`: One-page PDF download of test results using html2pdf.js
- `google-form-integration`: Auto-fill URL construction for configurable Google Form entry

### Modified Capabilities

(none — no existing specs to modify)

## Impact

- **WizardContainer.tsx**: Major refactor — add mode state, add step 0 (mode selector), update step count from 8→9, conditional result rendering, localStorage read/write for full test state
- **ResultsDisplay.tsx**: Replaced by two new components (PeminatanResults, KarirResults). Current code becomes the foundation for KarirResults.
- **UserInfoStep.tsx**: Minor — may need visual adjustment to work as step 1 of 9 instead of step 0
- **ProgressBar.tsx**: Step count change from 8→9
- **New data files**: `peminatan.ts` (weights + descriptions), `badges.ts` (badge names), `programStudi.ts` (study program clusters)
- **types.ts**: New types for mode, PeminatanWeights, PeminatanType, Badge, etc.
- **New dependencies**: `chart.js`, `react-chartjs-2`, `html2pdf.js`
- **package.json**: Add three new dependencies