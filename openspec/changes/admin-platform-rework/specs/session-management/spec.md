## ADDED Requirements

### Requirement: Session creation API
The system SHALL expose a `POST /api/admin/sessions` endpoint that creates a new session. The request body SHALL include `name` (required string), `mode` (required: "peminatan" | "karir" | "bebas"), and optional `description` (string). The system SHALL generate a unique 8-character alphanumeric session code and return the full session object.

#### Scenario: Successful session creation
- **WHEN** an authenticated admin posts `{ name: "Kelas 10A", mode: "peminatan" }`
- **THEN** the system creates a session with a unique code, sets `is_active` to true, `admin_id` to the authenticated admin's ID, and returns HTTP 201 with the session object including the generated code

#### Scenario: Missing required fields
- **WHEN** an unauthenticated or missing-field request is posted
- **THEN** the system returns HTTP 400 with a validation error message

### Requirement: Session list API
The system SHALL expose a `GET /api/admin/sessions` endpoint that returns all sessions belonging to the authenticated admin, ordered by creation date descending. Each session object SHALL include `id`, `name`, `code`, `mode`, `is_active`, `created_at`, and a `result_count` field indicating the number of submitted results.

#### Scenario: Fetching sessions
- **WHEN** an authenticated admin requests `GET /api/admin/sessions`
- **THEN** the system returns an array of session objects with result counts

### Requirement: Session detail API
The system SHALL expose `GET /api/admin/sessions/[sessionId]` that returns a session with its results. The response SHALL include the session object and an array of `test_results` with each result's student name, class, mode, scores, holland code, peminatan percentages, and timestamp.

#### Scenario: Fetching session with results
- **WHEN** an authenticated admin requests session detail
- **THEN** the system returns the session object and all associated test_results with associated answer details

#### Scenario: Session not found or not owned by admin
- **WHEN** admin requests a session that doesn't exist or belongs to another admin
- **THEN** the system returns HTTP 404

### Requirement: Session activation toggle API
The system SHALL expose `PATCH /api/admin/sessions/[sessionId]` that allows toggling `is_active` and updating the session name or description. The request body SHALL accept `is_active` (boolean), `name` (string), or `description` (string).

#### Scenario: Deactivating a session
- **WHEN** admin sends `PATCH /api/admin/sessions/[id]` with `{ is_active: false }`
- **THEN** the session's `is_active` field is set to false and the updated session is returned

### Requirement: Session lookup by code
The system SHALL expose `GET /api/sessions/[code]` (unauthenticated) that returns session metadata needed by the student test flow: session name, mode, and `is_active` status. This endpoint SHALL NOT return results or admin information.

#### Scenario: Valid active session code
- **WHEN** a student requests `GET /api/sessions/Jk92xRm7`
- **THEN** the system returns `{ name: "Kelas 10A", mode: "peminatan", is_active: true }` without exposing admin info or results

#### Scenario: Invalid session code
- **WHEN** a student requests `GET /api/sessions/invalid`
- **THEN** the system returns HTTP 404 with a message "Sesi tidak ditemukan"

#### Scenario: Inactive session code
- **WHEN** a student requests a session with `is_active: false`
- **THEN** the system returns HTTP 200 with `{ is_active: false }` so the frontend can show the closed session message

### Requirement: Session code generation
Session codes SHALL be 8 characters long, using characters [a-zA-Z0-9] (base62). The system SHALL check for uniqueness before inserting and retry on collision.

#### Scenario: Code collision during creation
- **WHEN** a generated code already exists in the database
- **THEN** the system generates a new code and attempts insertion again, up to a maximum of 10 retries