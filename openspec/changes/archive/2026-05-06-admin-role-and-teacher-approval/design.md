## Context

The Holland RIASEC test platform currently has a flat `Admin` model (mapped to `admins` table) that doubles as "teacher". Every authenticated user only sees their own sessions. There is no registration flow (seeding only), no role distinction, and no approval mechanism.

The existing stack:
- **Next.js 16** (App Router) with React 19
- **Prisma** with PostgreSQL
- **Custom JWT auth** (bcryptjs + jsonwebtoken) with httpOnly cookies
- All routes under `/admin/*` with `requireAuth()` guard returning `{ adminId, email }`

## Goals / Non-Goals

**Goals:**
- Introduce `ADMIN` and `TEACHER` roles in a single `User` table via `role` column
- Add `status` column (`ACTIVE` | `PENDING` | `REJECTED`) to control account lifecycle
- Teachers can self-register and await admin approval before gaining access
- Admins can view all teachers, drill into a specific teacher's sessions, and approve/reject registrations
- Teachers continue to see only their own sessions (existing behavior preserved)
- Login provides clear error messages for PENDING and REJECTED accounts

**Non-Goals:**
- Teacher authentication via OAuth or SSO
- Email notifications on approval/rejection (could be added later)
- Admin can create sessions on behalf of a teacher
- Bulk teacher management (CSV import, bulk approve)
- Soft-delete or account reactivation flows for rejected teachers

## Decisions

### 1. Single User table with role + status columns
**Choice**: Add `role` (default "TEACHER") and `status` (default "PENDING") columns to a renamed `User` model (was `Admin`).
**Rationale**: Two tables would require polymorphic auth or two separate login flows. A single table with role branching keeps auth simple — one login endpoint, one JWT structure, one `requireAuth` check. The role distinction is a business logic concern, not an architectural one.
**Alternatives considered**: Separate `Admin` and `Teacher` tables (duplicates auth logic, more complex login), RBAC with a separate roles table (overkill for two roles with fixed permissions).

### 2. Status state machine: PENDING → ACTIVE or REJECTED
**Choice**: Three-state status with no automatic transitions. Admin approves (PENDING → ACTIVE) or rejects (PENDING → REJECTED). REJECTED stays REJECTED until admin manually changes it.
**Rationale**: Simple state machine covers the use cases. No automatic expiration, no re-apply flow for rejected teachers. Keeping the record preserves the unique email constraint and audit trail.
**Alternatives considered**: Auto-approve with admin review (risky — teacher could access data before vetting), allow re-registration after rejection (complicates email uniqueness).

### 3. Keep /admin/* routes for both roles
**Choice**: All authenticated routes stay under `/admin/*`. The dashboard conditionally renders based on role.
**Rationale**: Both roles share the same authentication mechanism. Splitting into `/admin/*` and `/teacher/*` would double the route structure for minimal benefit. Conditional rendering in the dashboard is simpler and avoids route duplication.
**Alternatives considered**: Separate route trees (more files, shared logic needs abstraction), middleware-based rewrites (complex for little gain).

### 4. JWT payload includes role and status
**Choice**: Token payload becomes `{ userId, email, role, status }`. `requireAuth()` returns the full payload and verifies `status === "ACTIVE"`.
**Rationale**: Role and status need to be available on every authenticated request. Encoding in the JWT avoids an extra DB query per request. Status changes (approval/rejection) invalidate only on token expiry (24h) — acceptable since approval is not time-sensitive.
**Alternatives considered**: DB lookup on every request (adds latency), separate session store (overkill).

### 5. Admin dashboard: tab-based teacher management
**Choice**: Admin dashboard gains a "Guru" tab alongside "Sesi". The Guru tab lists all teachers with their status and provides approve/reject actions. Clicking a teacher navigates to a per-teacher session view.
**Rationale**: Tab-based navigation keeps the existing session view intact while adding the new management surface. The per-teacher drill-down matches the admin's mental model: "I want to see what this specific teacher's sessions look like."
**Alternatives considered**: Separate management page (extra navigation), inline expansion (cluttered for many teachers).

### 6. Registration at /admin/register
**Choice**: New page at `/admin/register` with name, email, password form. On success, shows "Pendaftaran berhasil! Akun Anda menunggu persetujuan admin." and links back to login.
**Rationale**: Keeps the registration flow under the same `/admin` route namespace. The page is unauthenticated. Minimal fields (name, email, password) — no school verification or additional metadata at this stage.
**Alternatives considered**: Invitation-only (requires admin to manually create accounts — adds workload), third-party signup (overkill).

## Risks / Trade-offs

- **[Token staleness on approval]** → A teacher who is approved won't see the effect until they re-login (their old token still has `status: PENDING`). Mitigation: `requireAuth()` checks status from the token; login is the refresh point. Acceptable for this use case.
- **[REJECTED email blocks re-registration]** → Once an email is REJECTED, the same email can't register again. Mitigation: Admin can change status back to PENDING or ACTIVE from the management UI if they want to re-allow.
- **[Migration of existing admins]** → All existing `admins` rows become `users` with `role: ADMIN, status: ACTIVE` via migration. The seed script must also be updated. Mitigation: Add a migration that sets defaults explicitly for existing rows.
- **[No email verification]** → Anyone can register with any email. Mitigation: Accept for now — the approval gate prevents unauthorized access. Could add email verification later.

## Migration Plan

1. **Prisma migration**: Rename `admins` → `users` via `@map` and `@@map`, add `role` and `status` columns with defaults, add `user_id` field on `Session` (keeping `admin_id` as DB column name for migration simplicity)
2. **Data migration**: Update all existing rows to `role = 'ADMIN'` and `status = 'ACTIVE'`
3. **Auth refactor**: Update `auth.ts` (signToken, verifyToken, requireAuth, new requireAdmin), update login endpoint to check status and return role-appropriate errors
4. **Registration endpoint & page**: New `/api/auth/register` and `/admin/register` page
5. **User management endpoint & UI**: New `/api/admin/users` endpoints (list, approve, reject), new "Guru" tab on admin dashboard
6. **Dashboard role branching**: Conditionally show teacher management for admin role, session-only view for teacher role; admin gets per-teacher drill-down
7. **Seed script update**: Default user has `role: ADMIN, status: ACTIVE`

**Rollback**: Each step is independently deployable. If role branching causes issues, the `status` checks can be softened (treat all roles as before) without data loss.