## Why

The app currently saves test results to Google Sheets via a hardcoded Apps Script URL, with no authentication, no teacher dashboard, and no database. Teachers have no visibility into student results unless they manually check a spreadsheet. This rework transforms the app from a standalone client-side tool into a multi-user platform where teachers/admins can create sessions, students take tests via unique session links, and results are stored in PostgreSQL for dashboard viewing and export.

## What Changes

- **BREAKING**: Remove all Google Sheets/Google Form integration (SaveButton, config.ts, googleFormUrl.ts)
- **New**: Admin authentication with email/password and JWT
- **New**: Admin dashboard with session management, result viewing, aggregate stats, and CSV/PDF export
- **New**: Session-based test flow — students access tests via unique session links (`/test/[sessionId]`)
- **New**: Student identity collection (name + class) at the start of each session
- **New**: PostgreSQL database with tables for admins, sessions, test_results, and result_answers
- **New**: API routes for auth, session CRUD, and result submission/retrieval
- **Modified**: Student results page auto-submits to DB after test completion, student still sees full results immediately
- **Modified**: Home page (`/`) redirects or shows session entry; the standalone wizard is replaced by session-scoped flow

## Capabilities

### New Capabilities
- `admin-auth`: Admin login/register with email/password, JWT token management, protected API routes
- `admin-dashboard`: Dashboard for admins to view sessions, individual results, aggregate statistics, and export to CSV/PDF
- `session-management`: CRUD for test sessions with unique shareable codes, mode selection (peminatan/karir), and active/inactive status
- `student-test-flow`: Session-based test entry where students enter name + class, take the RIASEC test, and submit results to the database
- `database`: PostgreSQL schema, migrations, and client setup for admins, sessions, test_results, result_answers

### Modified Capabilities
- `karir-results`: Results auto-submit to DB via API instead of Google Sheets; Google Form/Sheets integration removed
- `peminatan-results`: Results auto-submit to DB via API instead of Google Sheets; Google Form/Sheets integration removed

## Impact

- **Core architecture**: App shifts from pure client-side to full-stack Next.js with API routes and database
- **Routing**: New `/admin/*` routes for dashboard; `/test/[sessionId]` for student test entry; `/` route behavior changes
- **Dependencies**: Add `pg` or Prisma for PostgreSQL, `bcryptjs` for password hashing, `jsonwebtoken` for JWT; remove Google Sheets integration code
- **Deployment**: Requires PostgreSQL database and `DATABASE_URL` / `JWT_SECRET` environment variables
- **Removed code**: `SaveButton.tsx`, `config.ts`, `googleFormUrl.ts`, Google Form link buttons from results components
- **Existing specs**: `google-form-integration` spec becomes obsolete; `karir-results` and `peminatan-results` specs need updates to replace Google Sheets with DB submission