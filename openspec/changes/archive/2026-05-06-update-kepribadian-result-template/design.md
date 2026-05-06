## Context

The karir mode result page (`KarirResults.tsx`) currently displays:
- A radar chart (6-axis) showing RIASEC scores
- Holland code badge + top-3 code
- Program studi cluster recommendations (from `programStudi.ts`)
- Top-2 personality types with single-paragraph descriptions
- 3-column career tables (No, Nama Karir, Deskripsi Singkat) with 25 generic careers per type

The data layer uses `personalities.ts` (single `description` string per type) and `careers.ts` (`name` + `desc` per career, 25 per type).

## Goals / Non-Goals

**Goals:**
- Restructure personality cards with richer content: summary, Sifat Utama, Preferensi, Hal yang Dihindari
- Replace radar chart with horizontal bar chart for clearer score comparison
- Redesign career tables with 4 columns and 10 Indonesia-specific careers per type
- Move program studi recommendations into per-career rows (replacing the standalone section)
- Show top 3 personality types instead of top 2

**Non-Goals:**
- Modify peminatan mode results (out of scope)
- Change the test questions, scoring logic, or Holland code calculation
- Change the badge/profile name system
- Add new pages or navigation
- Modify the print stylesheet beyond existing print classes

## Decisions

### 1. Bar chart over radar chart
**Rationale**: Radar charts with 6 axes are hard to read for score comparisons. A horizontal bar chart makes it immediately obvious which types score highest and by how much. Chart.js `Bar` component with `indexAxis: 'y'` provides this out of the box.

### 2. Inline program studi recommendations per career row
**Rationale**: The standalone program studi cluster section (`programStudi.ts`) was based on top-3 Holland code combinations (e.g., "SIA"), which required maintaining a separate mapping matrix. Moving recommendations into each individual career row is more maintainable and gives students direct, specific guidance without an intermediate abstraction layer.

### 3. 10 careers per type instead of 25
**Rationale**: The example template shows exactly 10 well-curated, Indonesia-specific careers per type. Fewer, higher-quality recommendations are more actionable than 25 generic ones. This also reduces visual clutter.

### 4. Structured personality info object (5 fields) over flat description string
**Rationale**: The new template requires 4 distinct content blocks per type (summary, traits, preferences, avoidances). A single `description` string cannot cleanly support this. Replacing `description: string` with `summary`, `traits`, `preferences`, `avoidances` string arrays makes the component rendering logic declarative and the data validation straightforward.

## Risks / Trade-offs

- **[Risk]** `PersonalityInfo` interface change breaks any other components using `description`. **Mitigation**: Only `KarirResults.tsx` and `PeminatanResults.tsx` consume `personalities.ts`. PeminatanResults will continue using `description` by falling back to `summary` (or we keep a backward-compatible field). Decision: Keep `description` as a computed/derived field or alias `summary` as `description` for backward compatibility.

- **[Risk]** Career content migration is manual and content-heavy (60 career entries total). **Mitigation**: User provided exact content to use. All data entry is copy-paste from the provided template.

- **[Risk]** Removing `programStudi.ts` breaks admin views that might reference it. **Mitigation**: Search codebase confirms only `KarirResults.tsx` imports `getProgramStudiByCode`. Safe to remove.

- **[Trade-off]** Students with only 1 or 2 matching types see fewer career rows than before (10 vs 25). Counter: quality over quantity.
