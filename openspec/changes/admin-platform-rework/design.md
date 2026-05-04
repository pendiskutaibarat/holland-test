## Context

The Holland RIASEC test app is currently a single-page Next.js client-side application. Students take the test, results are displayed client-side, and data is saved to Google Sheets via a hardcoded Apps Script URL. There is no authentication, no database, no teacher dashboard, and no session management.

The current stack:
- **Next.js 16** (App Router) with React 19
- **Tailwind CSS v4** for styling
- **Chart.js + react-chartjs-2** for radar charts
- **html2pdf.js** for PDF export
- **localStorage** for test state persistence
- **Google Sheets/Apps Script** for result storage (replacing this entirely)

The rework introduces three core primitives: admin auth, session-scoped test links, and PostgreSQL-backed result storage.

## Goals / Non-Goals

**Goals:**
- Teachers/admins can log in, create sessions, share unique test links with students, and view results
- Students access tests via short unique links, enter name + class, take the test, and see results immediately
- Results are stored in PostgreSQL instead of Google Sheets
- Admin dashboard shows per-session results (individual + aggregate stats) with CSV/PDF export
- Clean migration path from the current codebase — reuse the existing test wizard and results components

**Non-Goals:**
- Student authentication or accounts (students only enter name + class per session)
- Multi-tenant organization support (single admin role, no teacher vs superadmin distinction)
- Real-time updates or WebSockets (admin refreshes to see new results)
- Mobile-native app or PWA
- Email notifications when students complete tests
- Integration with school LMS or SSO systems

## Decisions

### 1. ORM: Prisma over raw SQL or Drizzle
**Choice**: Prisma
**Rationale**: Prisma provides strong TypeScript types, migration tooling, and a schema-first workflow that matches our needs. The schema is relatively simple (4 tables), and Prisma's generated client eliminates boilerplate. Drizzle is lighter but requires more manual type alignment. Raw SQL is too error-prone for this project size.
**Alternatives considered**: Drizzle (lighter, but more manual), raw `pg` (no types, no migrations)

### 2. Auth: Custom JWT with bcryptjs (no NextAuth)
**Choice**: Custom JWT-based auth with bcryptjs for password hashing
**Rationale**: The auth requirements are minimal — single admin role, email/password login, no OAuth providers. NextAuth/Auth.js adds significant dependency weight for simple email/password auth. A custom implementation keeps the surface area small and the mental model simple.
**Alternatives considered**: Auth.js/NextAuth (overkill for single-role admin), Supabase Auth (external dependency)

### 3. Session codes: 8-character base62 slugs
**Choice**: Generate 8-character alphanumeric codes (e.g., `Jk92xRm7`) for session URLs
**Rationale**: Short enough to be shareable, long enough to avoid collision (62^8 = 218 trillion). No need for UUIDs in URLs — those are for internal use. Base62 avoids ambiguous characters.
**Alternatives considered**: UUID (ugly URLs), 4-char codes (too collision-prone for production)

### 4. Database schema: Separate result_answers table vs JSON column
**Choice**: Store individual question answers in a separate `result_answers` table
**Rationale**: Normalized storage enables future analytics queries (e.g., "which questions are most often selected in R?"). A JSON column would be simpler but limits querying.
**Alternatives considered**: JSONB column on test_results (simpler schema, less queryable)

### 5. API route structure: Next.js Route Handlers (App Router)
**Choice**: Use `/api/*` route handlers in the App Router
**Rationale**: Already on Next.js App Router. No reason to introduce a separate Express server. Route handlers support streaming, middleware patterns via composition, and co-locate with the frontend.

### 6. Admin dashboard: Server components with client islands
**Choice**: Use Next.js Server Components for dashboard pages (data fetching on server), with client components only for interactive elements (charts, filters, modals)
**Rationale**: Dashboard pages are primarily data-display. Server Components simplify auth checks and data fetching. Client components needed for: aggregate charts, export triggers, session creation forms.

### 7. Student test flow: Client-side wizard (preserved)
**Choice**: Keep the existing client-side wizard architecture for the student test flow
**Rationale**: The test is highly interactive (step-by-step with toggles). Only the entry point (session validation + identity collection) and endpoint (result submission) need server interaction. The middle 9-step wizard stays client-side.
**Alternatives considered**: Server-driven multi-page form (too many round-trips, worse UX)

## Risks / Trade-offs

- **[Session code collision]** → Mitigate with database UNIQUE constraint and retry on insert. 8-char base62 makes collision probability negligible.
- **[JWT secret exposure]** → Store JWT_SECRET in environment variable only. Rotate on deploy. Never send in client-visible payloads except httpOnly cookie.
- **[No rate limiting on result submission]** → Accept for now. A student can only submit once per session (enforced by unique constraint on session_id + student_name + student_class).
- **[Migration from localStorage]** → Students with in-progress tests in localStorage will lose state. Acceptable since this is a rework, and we can show a message on `/` redirecting to session links.
- **[Database availability]** → If PostgreSQL is down, students can't submit results. No offline fallback. Acceptable for school-deployed app. Render Vercel error page.
- **[Admin seeding]** → Need a way to create the first admin. Provide a CLI script (`npx prisma db seed` or custom script) to seed the initial admin account.

## Migration Plan

1. **Phase 1 — Database & API**: Set up Prisma + PostgreSQL, create schema, write API routes for auth, sessions, and results. No frontend changes yet.
2. **Phase 2 — Admin frontend**: Build `/admin/login`, `/admin/dashboard`, session management, result viewer with export. All behind auth middleware.
3. **Phase 3 — Student flow rework**: Create `/test/[sessionId]` route, replace localStorage with API submission, add student identity form, remove Google Sheets integration.
4. **Phase 4 — Cleanup**: Remove `SaveButton.tsx`, `config.ts`, `googleFormUrl.ts`, `GOOGLE_FORM_ID` constant. Update `/` root route.

**Rollback**: Each phase is independently deployable. If admin dashboard has issues, student flow can operate independently. The Google Sheets code is removed in Phase 4 only after DB submission is confirmed working.

## Open Questions

- Should sessions have an expiration date? (Leaning toward optional, not required for MVP)
- Should the admin dashboard support editing/deleting individual results? (Likely yes, but can defer)
- Font/style for admin dashboard — match existing test UI or go neutral/professional? (Recommend neutral, keeping test flow styling separate)