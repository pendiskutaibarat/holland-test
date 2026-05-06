## Why

The app currently has a single flat `Admin` model acting as "teacher" — every logged-in user sees only their own sessions. There's no way for an administrator to oversee all teachers, no self-registration for teachers, and no approval workflow. We need a proper two-role hierarchy (admin → teacher) where admins can view all sessions per teacher, manage teacher accounts, and approve/reject teacher registrations.

## What Changes

- **BREAKING**: Rename `Admin` model to `User` (table: `admins` → `users`), add `role` ("ADMIN" | "TEACHER") and `status` ("ACTIVE" | "PENDING" | "REJECTED") columns
- **BREAKING**: Rename `Session.admin_id` foreign key to `Session.user_id` (column stays as `admin_id` in DB for migration simplicity, but app-level field becomes `user_id`)
- **New**: Teacher self-registration with signup form at `/admin/register` — creates a PENDING account
- **New**: Admin approval workflow — admin dashboard gains a "Guru" tab listing pending/active/rejected teachers with approve/reject actions
- **New**: Login guards that differentiate between PENDING ("Akun masih menunggu persetujuan admin") and REJECTED ("Akun ditolak") accounts
- **Modified**: Admin dashboard — admin role sees per-teacher drill-down into sessions; teacher role sees only their own sessions (current behavior)
- **Modified**: Login page gains link to teacher registration
- **Modified**: Auth token payload includes `role` and `status`; `requireAuth` checks active status; new `requireAdmin` helper for admin-only routes
- **Modified**: Seed script sets first user as `role: ADMIN, status: ACTIVE`

## Capabilities

### New Capabilities
- `teacher-registration`: Self-service signup form for teachers, creating PENDING accounts; login rejection with clear messages for PENDING and REJECTED statuses
- `teacher-approval`: Admin-facing UI to list, approve, and reject teacher accounts; approve sets status to ACTIVE, reject sets status to REJECTED (soft reject, email stays unique)

### Modified Capabilities
- `admin-auth`: Auth system branches behavior by role (ADMIN vs TEACHER) and status (ACTIVE, PENDING, REJECTED); JWT payload includes role and status; `requireAuth` enforces ACTIVE status; new `requireAdmin` guard for admin-only API routes

## Impact

- **Database**: Migration renaming `admins` table to `users`, adding `role` and `status` columns with defaults, updating foreign key references
- **Auth system**: `auth.ts` token payload changes, new guard functions, login endpoint handles three error states (unauthorized, pending, rejected)
- **API routes**: All `/api/admin/*` routes need to conditionally filter by role; new `/api/auth/register` and `/api/admin/users` endpoints
- **Frontend**: `/admin/login` gets signup link; new `/admin/register` page; `/admin/dashboard` gains conditional teacher management tab; new teacher list and approval UI components
- **Seed script**: Updated to create ADMIN + ACTIVE user
- **Existing data**: All existing `Admin` rows become `User` rows with `role: ADMIN, status: ACTIVE` via migration default