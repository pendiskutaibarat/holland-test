## Why

The current karir mode result page presents personality types with a single generic paragraph and 25 generic career listings in a 3-column table. This is insufficient for students who need concrete, Indonesia-specific career guidance with clear personality breakdowns and program studi recommendations. A richer, more structured result template will provide actionable insights.

## What Changes

- **Replace radar chart with bar chart** in KarirResults for better readability of score comparisons
- **Restructure personality cards**: Each type now shows: summary paragraph, Sifat Utama (traits), Preferensi (likes), Hal yang Dihindari (dislikes)
- **Redesign career table**: 4 columns (No, Jenis Karir di Indonesia, Deskripsi Singkat, Jurusan/Prodi Rekomendasi) with exactly 10 Indonesia-specific careers per type
- **Display top 3 personality types** instead of top 2 (or fewer if student has fewer matching types)
- **Remove standalone Program Studi recommendations section** — jurusan/prodi recommendations now live per-row inside career tables
- **Delete `src/data/programStudi.ts`** and related code — no longer needed
- **Only affects karir mode** — peminatan mode remains unchanged

## Capabilities

### New Capabilities

*(none — this is a modification of existing display behavior)*

### Modified Capabilities

- `karir-results`: Major structural changes to the result display — personality card layout, chart type, career table structure, career quantity, top-type count, and removal of program studi cluster section. See delta spec for details.

## Impact

- `src/data/personalities.ts` — Complete rewrite of all 6 personality entries with new structured fields
- `src/data/careers.ts` — Replace 25 generic careers with 10 Indonesia-specific careers per type, add `majorRecommendation` field
- `src/data/types.ts` — Update `PersonalityInfo` and `Career` interfaces
- `src/data/programStudi.ts` — Delete (replaced by per-career recommendations)
- `src/data/badges.ts` — Remove `getProgramStudiByCode` export and related imports
- `src/components/KarirResults.tsx` — Refactor: bar chart, top-3 logic, new personality card layout, remove program studi section
- `src/components/CareerTable.tsx` — Add 4th column for Jurusan/Prodi Rekomendasi
- `src/components/PeminatanResults.tsx` — No changes (out of scope)
