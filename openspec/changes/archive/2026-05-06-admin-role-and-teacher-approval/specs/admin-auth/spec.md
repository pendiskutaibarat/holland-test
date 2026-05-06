## MODIFIED Requirements

### Requirement: JWT token includes role and status
The system SHALL issue JWT tokens containing `{ userId, email, role, status }`. The `requireAuth()` function SHALL verify the token, check that `status === "ACTIVE"`, and return the full payload. If status is not ACTIVE, the request SHALL be rejected with an appropriate error.

#### Scenario: Active user passes auth check
- **WHEN** a request includes a valid JWT with `status: "ACTIVE"`
- **THEN** `requireAuth()` SHALL return `{ userId, email, role, status }`

#### Scenario: Pending user fails auth check
- **WHEN** a request includes a valid JWT with `status: "PENDING"`
- **THEN** `requireAuth()` SHALL throw an error with message "Akun Anda masih menunggu persetujuan admin"

#### Scenario: Rejected user fails auth check
- **WHEN** a request includes a valid JWT with `status: "REJECTED"`
- **THEN** `requireAuth()` SHALL throw an error with message "Akun ditolak"

### Requirement: Admin role guard
The system SHALL provide a `requireAdmin()` auth helper that verifies the authenticated user's role is "ADMIN".

#### Scenario: Admin passes requireAdmin check
- **WHEN** a request includes a valid JWT with `role: "ADMIN"` and `status: "ACTIVE"`
- **THEN** `requireAdmin()` SHALL return the full auth payload

#### Scenario: Teacher fails requireAdmin check
- **WHEN** a request includes a valid JWT with `role: "TEACHER"`
- **THEN** `requireAdmin()` SHALL throw an error with status 403

### Requirement: Database model uses User table
The system SHALL use a `User` model (mapped to `users` table) instead of the previous `Admin` model. The model SHALL include `role` (default "TEACHER") and `status` (default "PENDING") columns. The `Session` model SHALL reference `user_id` pointing to `User.id`.

#### Scenario: Session ownership via user_id
- **WHEN** a session is created
- **THEN** the session's `user_id` SHALL reference the authenticated user's id, regardless of role

#### Scenario: Teacher sees only own sessions
- **WHEN** a teacher requests their sessions via `GET /api/admin/sessions`
- **THEN** the system SHALL return only sessions where `user_id` matches the teacher's id

#### Scenario: Admin sees all sessions via per-teacher drill-down
- **WHEN** an admin requests a specific teacher's sessions via `GET /api/admin/users/[userId]/sessions`
- **THEN** the system SHALL return all sessions belonging to that teacher

### Requirement: Seed script creates admin user with role and status
The system SHALL have a seed script that creates a User with `role: "ADMIN"` and `status: "ACTIVE"` using ADMIN_EMAIL and ADMIN_PASSWORD environment variables.

#### Scenario: Seed creates first admin
- **WHEN** `npx prisma db seed` is run
- **THEN** a User record SHALL be created with role "ADMIN", status "ACTIVE", and the provided email and hashed password