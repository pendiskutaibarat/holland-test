## 1. Database Schema Migration

- [x] 1.1 Rename `Admin` model to `User` in `prisma/schema.prisma`, change `@@map("admins")` to `@@map("users")`, and update `Session.admin_id` / `Session.admin` to `Session.user_id` / `Session.user`
- [x] 1.2 Add `role` (String, default "TEACHER") and `status` (String, default "PENDING") columns to the `User` model
- [x] 1.3 Create a Prisma migration that renames the `admins` table to `users`, adds `role` and `status` columns with defaults, and updates existing rows to `role = 'ADMIN'` and `status = 'ACTIVE'`
- [x] 1.4 Run `npx prisma migrate dev` to apply the migration
- [x] 1.5 Update `prisma/seed.ts` to create the first User with `role: "ADMIN"` and `status: "ACTIVE"`

## 2. Auth System Refactor

- [x] 2.1 Update `src/lib/auth.ts`: change `signToken` and `verifyToken` payload to `{ userId, email, role, status }` (replace `adminId` with `userId`)
- [x] 2.2 Update `requireAuth()` to check `status === "ACTIVE"` and throw specific errors for PENDING ("Akun Anda masih menunggu persetujuan admin") and REJECTED ("Akun ditolak") statuses
- [x] 2.3 Add `requireAdmin()` helper in `src/lib/auth.ts` that calls `requireAuth()` and verifies `role === "ADMIN"`, throwing 403 otherwise
- [x] 2.4 Update `POST /api/auth/login` to differentiate error responses for PENDING and REJECTED statuses
- [x] 2.5 Update all existing API routes that use `requireAuth()` to destructure `userId` instead of `adminId` (sessions route, session detail route, result detail route)
- [x] 2.6 Update all server components that manually verify tokens to use `userId` instead of `adminId` and check status

## 3. Teacher Registration

- [x] 3.1 Create `POST /api/auth/register` endpoint — accepts `{ name, email, password }`, hashes password, creates User with `role: "TEACHER"`, `status: "PENDING"`, returns 201 with user data
- [x] 3.2 Handle duplicate email: return 409 with `{ error: "Email sudah terdaftar" }`
- [x] 3.3 Create `/admin/register/page.tsx` — teacher registration form with name, email, password fields, validation, and success message "Pendaftaran berhasil! Akun Anda menunggu persetujuan admin."
- [x] 3.4 Add "Belum punya akun? Daftar" link on `/admin/login` page pointing to `/admin/register`

## 4. Admin User Management API

- [x] 4.1 Create `GET /api/admin/users` — admin-only endpoint returning all users with role "TEACHER" including id, name, email, status, created_at, and session count
- [x] 4.2 Create `PATCH /api/admin/users/[userId]/approve` — admin-only endpoint that sets user status to "ACTIVE"
- [x] 4.3 Create `PATCH /api/admin/users/[userId]/reject` — admin-only endpoint that sets user status to "REJECTED"
- [x] 4.4 Create `GET /api/admin/users/[userId]/sessions` — admin-only endpoint returning all sessions for a specific teacher with result counts

## 5. Admin Dashboard — Teacher Management UI

- [x] 5.1 Add role-based conditional rendering to the dashboard: admin sees "Guru" tab + "Sesi" tab, teacher sees only "Sesi" tab
- [x] 5.2 Create "Guru" tab UI listing all teachers grouped by status (PENDING, ACTIVE, REJECTED) with name, email, and action buttons (Setujui / Tolak for PENDING)
- [x] 5.3 Implement approve action: PATCH call to `/api/admin/users/[userId]/approve`, refresh teacher list on success
- [x] 5.4 Implement reject action: PATCH call to `/api/admin/users/[userId]/reject`, refresh teacher list on success
- [x] 5.5 Create `/admin/dashboard/guru/[userId]/page.tsx` — admin drill-down into a specific teacher's sessions with full session list and result counts
- [x] 5.6 Add navigation from teacher list to teacher detail page (click teacher name → `/admin/dashboard/guru/[userId]`)

## 6. Update Existing Dashboard for userId

- [x] 6.1 Update `DashboardClient.tsx` to use `userId` instead of `adminId` in auth and API calls
- [x] 6.2 Update `SessionDetailClient.tsx` to use `userId` instead of `adminId`
- [x] 6.3 Update `ResultViewClient.tsx` and result page server components to use `userId`
- [x] 6.4 Update `ResultViewClient` navigation links to use `userId`-based routes where applicable
- [x] 6.5 Update `TestPageClient.tsx` "hubungi admin" message if needed

## 7. Verification

- [x] 7.1 Manual test: teacher can register, sees "menunggu persetujuan" on login attempt
- [x] 7.2 Manual test: admin can approve a teacher, teacher can then log in and see own sessions
- [x] 7.3 Manual test: admin can reject a teacher, teacher sees "akun ditolak" on login
- [x] 7.4 Manual test: admin can view teacher list, drill into a teacher's sessions
- [x] 7.5 Manual test: teacher cannot access admin-only user management routes (returns 403)
- [x] 7.6 Manual test: existing sessions still work correctly after userId migration