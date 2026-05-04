## 1. Database & Infrastructure

- [x] 1.1 Install dependencies: `prisma`, `@prisma/client`, `bcryptjs`, `jsonwebtoken`, and their type packages
- [x] 1.2 Create `prisma/schema.prisma` with PostgreSQL provider and all four tables (admins, sessions, test_results, result_answers) with relations, constraints, and indexes
- [x] 1.3 Create `prisma/seed.ts` to seed the initial admin account from ADMIN_EMAIL and ADMIN_PASSWORD env vars (with defaults and warning)
- [x] 1.4 Create `src/lib/prisma.ts` singleton Prisma client
- [x] 1.5 Create `.env.example` with DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
- [ ] 1.6 Run `npx prisma migrate dev` to create and apply the initial migration
- [ ] 1.7 Run `npx prisma db seed` to verify seed script works

## 2. Authentication API & Middleware

- [x] 2.1 Create `src/lib/auth.ts` with JWT signing, verification, and password hashing utilities (bcryptjs)
- [x] 2.2 Create `POST /api/auth/login` route handler — validate email/password, return httpOnly JWT cookie
- [x] 2.3 Create `POST /api/auth/logout` route handler — clear JWT cookie
- [x] 2.4 Create auth middleware helper `requireAuth()` for protecting admin API routes
- [x] 2.5 Create admin login page at `/admin/login` with email/password form
- [x] 2.6 Create admin layout at `/admin/layout.tsx` that checks auth on load and redirects to login if unauthenticated

## 3. Session Management API

- [x] 3.1 Create `POST /api/admin/sessions` — authenticated endpoint to create a session with unique code generation
- [x] 3.2 Create `GET /api/admin/sessions` — authenticated endpoint to list admin's sessions with result counts
- [x] 3.3 Create `GET /api/admin/sessions/[sessionId]` — authenticated endpoint for session detail with results
- [x] 3.4 Create `PATCH /api/admin/sessions/[sessionId]` — authenticated endpoint to toggle active status and update session info
- [x] 3.5 Create `GET /api/sessions/[code]` — unauthenticated endpoint for session lookup by code (returns name, mode, is_active only)

## 4. Result Submission API

- [x] 4.1 Create `POST /api/results` — unauthenticated endpoint to submit test results scoped to a session, including RIASEC scores, holland_code, peminatan percentages, and individual answers
- [x] 4.2 Add unique constraint handling for duplicate (session_id, student_name, student_class) submissions
- [x] 4.3 Create `GET /api/admin/sessions/[sessionId]/results/[resultId]` — authenticated endpoint to fetch a single result with answers for admin detail view

## 5. Admin Dashboard UI

- [x] 5.1 Create `/admin/dashboard/page.tsx` — list admin's sessions with name, code, mode, result count, active status
- [x] 5.2 Create session creation form component (name, mode selector, optional description)
- [x] 5.3 Create session card component with copyable session link (`/test/[code]`)
- [x] 5.4 Implement session active/inactive toggle with PATCH API call
- [x] 5.5 Create `/admin/sessions/[sessionId]/page.tsx` — session detail with results table (student name, class, mode, holland code, scores, timestamp)
- [x] 5.6 Create `/admin/sessions/[sessionId]/results/[resultId]/page.tsx` — individual result view rendering full KarirResults or PeminatanResults component server-side
- [x] 5.7 Implement aggregate statistics on session detail (average RIASEC scores, mode distribution, peminatan average percentages)
- [x] 5.8 Implement CSV export button on session detail page
- [x] 5.9 Implement PDF export button on individual result view (reuse `downloadPdf` utility)
- [x] 5.10 Add logout button to admin dashboard header

## 6. Student Test Flow Rework

- [x] 6.1 Create `/test/[code]/page.tsx` — validates session code on load, shows error/inactive message if invalid/closed
- [x] 6.2 Create `StudentIdentityForm` component — name + class input with validation
- [x] 6.3 Refactor `WizardContainer` to accept props: sessionId, forcedMode, studentName, studentClass, and remove localStorage persistence
- [x] 6.4 Add auto-submission logic on test completion — POST results to `/api/results` with session context, student identity, scores, holland code, percentages, and answers
- [x] 6.5 Add submission status UI — "Hasil telah dikirim ke guru BK" on success, error with retry on failure
- [x] 6.6 Handle duplicate submission — show "Anda sudah mengirim hasil" if API returns 409
- [x] 6.7 Update `/` root route — redirect to `/admin/login`

## 7. Cleanup & Removal

- [x] 7.1 Remove `src/components/SaveButton.tsx`
- [x] 7.2 Remove `src/utils/googleFormUrl.ts`
- [x] 7.3 Remove `src/config.ts` (GOOGLE_FORM_ID and ENTRY_FIELD_IDS)
- [x] 7.4 Remove Google Form link buttons from `PeminatanResults.tsx` and `KarirResults.tsx`
- [x] 7.5 Remove Google Sheets save button from both results components
- [x] 7.6 Remove localStorage persistence logic from WizardContainer (STORAGE_KEY, save/load effects)
- [x] 7.7 Update `package.json` — remove `html2pdf.js` if no longer needed (keep if PDF export still used on admin)
- [x] 7.8 Verify all imports are clean — no references to removed modules

## 8. Testing & Verification

- [ ] 8.1 Manual test: admin can log in, create a session, copy the session link
- [ ] 8.2 Manual test: student can access session link, enter identity, take test, see results, and submission succeeds
- [ ] 8.3 Manual test: admin can view session results (individual + aggregate), export CSV, export PDF
- [ ] 8.4 Manual test: inactive session blocks student entry
- [ ] 8.5 Manual test: duplicate submission is prevented
- [ ] 8.6 Verify all removed code (SaveButton, config, googleFormUrl) has no remaining references