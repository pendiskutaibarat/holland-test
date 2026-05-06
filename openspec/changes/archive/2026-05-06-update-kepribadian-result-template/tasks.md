## 1. Update Data Types and Interfaces

- [x] 1.1 Update `PersonalityInfo` interface in `src/data/types.ts`: replace `description: string` with `summary: string`, `traits: string`, `preferences: string`, `avoidances: string`
- [x] 1.2 Update `Career` interface in `src/data/types.ts`: add `majorRecommendation: string` field
- [x] 1.3 Verify TypeScript compilation passes after interface changes

## 2. Rewrite Personality Data

- [x] 2.1 Rewrite `src/data/personalities.ts`: Replace all 6 personality entries with new structured fields (summary, traits, preferences, avoidances) using exact content from the provided template
- [x] 2.2 Verify all 6 types (realistic, investigative, artistic, social, enterprising, conventional) have complete data

## 3. Rewrite Career Data

- [x] 3.1 Rewrite `src/data/careers.ts`: Replace all 25 careers per type with exactly 10 Indonesia-specific careers per type using exact content from the provided template
- [x] 3.2 Ensure each career object includes `name`, `desc`, and `majorRecommendation` fields
- [x] 3.3 Verify all 6 types have exactly 10 careers each (60 total)

## 4. Remove Obsolete Data Layer

- [x] 4.1 Delete `src/data/programStudi.ts` (no longer needed)
- [x] 4.2 Remove `getProgramStudiByCode` import and related code from `src/data/badges.ts` (function was in programStudi.ts, not badges.ts — handled by deletion)
- [x] 4.3 Verify no other files import `programStudi` or `getProgramStudiByCode` (only KarirResults.tsx imported it — will be handled in task 6.6)

## 5. Update CareerTable Component

- [x] 5.1 Add 4th column "Jurusan / Prodi Rekomendasi" to `src/components/CareerTable.tsx`
- [x] 5.2 Update table header and body to render `career.majorRecommendation`
- [x] 5.3 Verify table styling and responsive behavior

## 6. Refactor KarirResults Component

- [x] 6.1 Replace Radar chart with Bar chart (horizontal, indexAxis: 'y') in `src/components/KarirResults.tsx`
- [x] 6.2 Update chart labels and data mapping for Bar chart
- [x] 6.3 Change top-type display from top-2 to top-3 (or fewer if fewer types have scores > 0)
- [x] 6.4 Replace personality description rendering with new structured card layout (summary, Sifat Utama, Preferensi, Hal yang Dihindari)
- [x] 6.5 Remove program studi cluster section and related conditional rendering
- [x] 6.6 Remove `getProgramStudiByCode` import from KarirResults
- [x] 6.7 Update career table rendering to use new 10-item career lists
- [x] 6.8 Verify print view (`print:block`) still renders correctly

## 7. Verify PeminatanResults Unchanged

- [x] 7.1 Confirm `src/components/PeminatanResults.tsx` still compiles and renders with updated `personalities.ts`
- [x] 7.2 Ensure PeminatanResults continues to use `summary` (or backward-compatible `description` alias) for personality descriptions
- [x] 8.1 Run TypeScript compiler (`tsc --noEmit`) and fix any type errors
- [x] 8.2 Build the application (`npm run build`) and verify no build errors — compiled successfully; build failure is from pre-existing error in `admin/dashboard/page.tsx`
- [x] 8.3 Review karir mode result page in browser: verify bar chart, top-3 cards, 4-column career tables, and all 6 personality types render correctly
- [x] 8.4 Verify peminatan mode results still render correctly
