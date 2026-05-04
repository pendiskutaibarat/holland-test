## 1. Setup & Dependencies

- [x] 1.1 Install chart.js, react-chartjs-2, and html2pdf.js via npm
- [x] 1.2 Add Mode type (`"peminatan" | "karir"`) and PeminatanType (`"ipa" | "ips" | "bahasa"`) to `src/data/types.ts`
- [x] 1.3 Add PeminatanWeights interface and PeminatanInfo interface to `src/data/types.ts`
- [x] 1.4 Update SubmissionPayload type to include `mode` and peminatan percentage fields

## 2. Data Files

- [x] 2.1 Create `src/data/peminatan.ts` with PEMINATAN_WEIGHTS weight matrix (R/I/A/S/E/C → IPA/IPS/Bahasa percentages) and PEMINATAN_INFO with label, description, and subjects for each peminatan group
- [x] 2.2 Create `src/data/badges.ts` with initial badge names and descriptions for top-3 Holland code combinations (start with ~10 most common combos, fallback to code itself for unmatched)
- [x] 2.3 Create `src/data/programStudi.ts` with program studi cluster mapping for top Holland codes (start with ~10 entries, each containing cluster name, study programs, and professions)
- [x] 2.4 Create `src/config.ts` with GOOGLE_FORM_ID constant and ENTRY_FIELD_IDS mapping (default empty string for Form ID)

## 3. Peminatan Mapping Logic

- [x] 3.1 Create `src/utils/peminatan.ts` with `calculatePeminatanPercentages(results: TestResult[]): Record<PeminatanType, number>` that applies the weighted sum algorithm and normalizes to percentages
- [x] 3.2 Handle edge case: if total weighted sum is 0 (student selected nothing), return equal 33.3% distribution
- [x] 3.3 Add unit-testable pure function `getTopPeminatan(percentages): PeminatanType[]` that returns peminatan groups sorted by percentage descending

## 4. Mode Selector & State Persistence

- [x] 4.1 Create `src/components/ModeSelectorStep.tsx` with two cards: "Peminatan SMA/MA" (Option A) and "Karir & Program Studi" (Option B), each with icon, title, brief description, and click handler
- [x] 4.2 Add `mode` state to WizardContainer (type Mode, default null)
- [x] 4.3 Update WizardContainer to render ModeSelectorStep at step 0, shifting UserInfoStep to step 1 and test sections to steps 2-7, results to step 8
- [x] 4.4 Update TOTAL_STEPS from 8 to 9
- [x] 4.5 Add localStorage persistence: on state change, serialize { mode, currentStep, name, birthDate, selections (converted Set→Array) } to key `holland-test-state`
- [x] 4.6 On mount, read localStorage and restore state if present. Deserialize selections (Array→Set). If mode is set, skip mode selector.
- [x] 4.7 Add "Mulai Ulang" button to ModeSelectorStep that clears localStorage and resets all state to initial values

## 5. PeminatanResults Component

- [x] 5.1 Create `src/components/PeminatanResults.tsx` with props: name, birthDate, results, selectedAnswers, mode
- [x] 5.2 Implement horizontal bar chart with Tailwind CSS: three bars (IPA/IPS/Bahasa) with distinct colors, percentage labels, and responsive widths. Minimum width for bars <5%.
- [x] 5.3 Implement narrative description section: for each peminatan group ≥10%, show PEMINATAN_INFO description card with subject list. For groups <10%, show brief note.
- [x] 5.4 Display top-2 RIASEC personality descriptions from existing `personalities.ts` data
- [x] 5.5 Display full RIASEC score summary (all 6 scores with labels)
- [x] 5.6 Include SaveButton and Print button same as current ResultsDisplay

## 6. KarirResults Component

- [x] 6.1 Create `src/components/KarirResults.tsx` — evolve from current ResultsDisplay, preserving top-2 personality display, career tables, and score summary
- [x] 6.2 Register Chart.js radar module and configure radar chart component with Bahasa Indonesia axis labels (Realistis, Investigatif, Artistik, Sosial, Wirausaha, Konvensional)
- [x] 6.3 Add radar chart to KarirResults using react-chartjs-2 Radar component with responsive sizing
- [x] 6.4 Compute top-3 Holland code string from sorted results and display prominently in results header
- [x] 6.5 Look up badge name from badges.ts using top-3 code; display badge name and description. Fall back to the code itself if no match found
- [x] 6.6 Look up program studi clusters from programStudi.ts using top-3 code; display recommended study programs and professions. Fall back to career tables for top-2 if no match found
- [x] 6.7 Include SaveButton (with mode="karir" in payload) and Print button

## 7. WizardContainer Refactor

- [x] 7.1 Refactor WizardContainer to conditionally render PeminatanResults or KarirResults at step 8 based on mode state
- [x] 7.2 Update canProceed and handleNext to handle mode selector step (step 0) — mode must be selected before proceeding
- [x] 7.3 Pass mode to both result components and to SubmissionPayload
- [x] 7.4 Remove direct rendering of ResultsDisplay — it is replaced by the two new components
- [x] 7.5 Update ProgressBar usage if needed for new step count

## 8. PDF Export

- [x] 8.1 Dynamically import html2pdf.js in the PDF download handler (not at module level)
- [x] 8.2 Add "Unduh PDF" button to both PeminatanResults and KarirResults (hidden in print mode)
- [x] 8.3 Configure html2pdf with A4 page size, one-page layout, proper margins, and filename template "Hasil-Tes-Holland-{name}-{date}.pdf"
- [x] 8.4 Ensure the radar chart (canvas) renders correctly in the PDF by converting it to an image before capture

## 9. Google Form Integration

- [x] 9.1 Create `src/utils/googleFormUrl.ts` with `buildGoogleFormUrl(mode, name, results, peminatanPercentages?): string` that constructs the pre-fill URL
- [x] 9.2 Add "Kirim ke Google Form" button to both result components (conditionally rendered only if GOOGLE_FORM_ID is non-empty)
- [x] 9.3 Button opens constructed URL in new tab
- [x] 9.4 Update SaveButton payload to include `mode` field ("peminatan" or "karir") and peminatan percentages when applicable

## 10. Polish & Cleanup

- [x] 10.1 Verify print CSS works for both PeminatanResults and KarirResults (verify `print:` classes, hide interactive elements)
- [x] 10.2 Add dynamic imports for chart.js components to reduce initial bundle size (`next/dynamic` or lazy import)
- [x] 10.3 Review and update any error states (e.g., no selections made) for both result types
- [x] 10.4 Delete or rename old ResultsDisplay.tsx if fully replaced
- [x] 10.5 Run `npm run build` and verify no TypeScript or build errors