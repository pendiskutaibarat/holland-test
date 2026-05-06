## ADDED Requirements

### Requirement: Admin can view all teachers
The system SHALL provide an admin-only API endpoint and UI to list all users with role `TEACHER`, including their id, name, email, status, and session count.

#### Scenario: Admin views teacher list via API
- **WHEN** an admin sends `GET /api/admin/users` with a valid admin JWT
- **THEN** the system SHALL return a list of all users with `role: "TEACHER"` including id, name, email, status, created_at, and session count

#### Scenario: Teacher attempts to view teacher list
- **WHEN** a teacher sends `GET /api/admin/users`
- **THEN** the system SHALL return 403 Forbidden

#### Scenario: Admin views teacher list in UI
- **WHEN** an admin visits the "Guru" tab on the dashboard
- **THEN** the system SHALL display all teachers grouped by status (PENDING, ACTIVE, REJECTED) with name, email, and action buttons

### Requirement: Admin can approve teacher accounts
The system SHALL allow admins to change a teacher's status from PENDING to ACTIVE.

#### Scenario: Admin approves a pending teacher via API
- **WHEN** an admin sends `PATCH /api/admin/users/[userId]/approve` with a valid admin JWT
- **THEN** the system SHALL set the user's status to "ACTIVE" and return the updated user

#### Scenario: Admin approves a teacher in UI
- **WHEN** an admin clicks "Setujui" on a PENDING teacher in the teacher management tab
- **THEN** the system SHALL update the teacher's status to ACTIVE and refresh the teacher list

### Requirement: Admin can reject teacher accounts
The system SHALL allow admins to change a teacher's status from PENDING to REJECTED (soft reject).

#### Scenario: Admin rejects a pending teacher via API
- **WHEN** an admin sends `PATCH /api/admin/users/[userId]/reject` with a valid admin JWT
- **THEN** the system SHALL set the user's status to "REJECTED" and return the updated user

#### Scenario: Admin rejects a teacher in UI
- **WHEN** an admin clicks "Tolak" on a PENDING teacher in the teacher management tab
- **THEN** the system SHALL update the teacher's status to REJECTED and refresh the teacher list

#### Scenario: Rejected teacher's email remains unique
- **WHEN** a teacher's status is set to REJECTED
- **THEN** the email SHALL remain in the database and prevent new registrations with the same email

### Requirement: Admin can drill into a teacher's sessions
The system SHALL allow admins to view all sessions belonging to a specific teacher.

#### Scenario: Admin views a teacher's sessions via API
- **WHEN** an admin sends `GET /api/admin/users/[userId]/sessions` with a valid admin JWT
- **THEN** the system SHALL return all sessions owned by that teacher, with session details and result counts

#### Scenario: Admin navigates to teacher detail in UI
- **WHEN** an admin clicks on a teacher's name in the teacher list
- **THEN** the system SHALL navigate to `/admin/dashboard/guru/[userId]` showing that teacher's sessions

### Requirement: Admin-only access control
The system SHALL restrict teacher management and cross-teacher session viewing to users with role ADMIN.

#### Scenario: requireAdmin guard on API routes
- **WHEN** a request to a teacher management endpoint (`/api/admin/users/*`) is made by a user with role TEACHER
- **THEN** the system SHALL return 403 Forbidden

#### Scenario: Admin sees teacher management UI
- **WHEN** an admin views the dashboard
- **THEN** the system SHALL display the "Guru" tab for teacher management

#### Scenario: Teacher does not see teacher management UI
- **WHEN** a teacher views the dashboard
- **THEN** the system SHALL NOT display the "Guru" tab and SHALL only show the teacher's own sessions