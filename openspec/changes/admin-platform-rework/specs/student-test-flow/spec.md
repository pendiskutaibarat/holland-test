## ADDED Requirements

### Requirement: Session-based test entry
The student test flow SHALL be accessible at `/test/[code]` where `code` is the unique session code created by an admin. When a student navigates to this URL, the system SHALL validate the session code and, if valid and active, present the test.

#### Scenario: Valid session link
- **WHEN** student navigates to `/test/Jk92xRm7` and the session exists and is active
- **THEN** the system shows the student identity form (name + class)

#### Scenario: Invalid session link
- **WHEN** student navigates to `/test/invalidcode`
- **THEN** the system shows an error message "Sesi tidak ditemukan" with a prompt to contact the teacher

#### Scenario: Inactive session link
- **WHEN** student navigates to `/test/Jk92xRm7` and the session is inactive
- **THEN** the system shows a message "Sesi ini sudah ditutup. Hubungi guru BK Anda."

### Requirement: Student identity collection
Before starting the test, the system SHALL collect the student's name (required) and class (required). These fields SHALL be validated before allowing the student to proceed.

#### Scenario: Submitting identity
- **WHEN** student enters name "Budi Santoso" and class "X IPA 1" and clicks "Mulai"
- **THEN** the system stores the identity in session state and advances to the mode selector (or test sections if mode is forced)

#### Scenario: Missing identity fields
- **WHEN** student leaves name or class empty and clicks "Mulai"
- **THEN** the system shows validation errors: "Silakan isi nama lengkap" and/or "Silakan isi kelas"

### Requirement: Mode handling per session
When a session has a forced mode ("peminatan" or "karir"), the system SHALL skip the mode selector step and lock the student into that mode. When the session mode is "bebas", the student SHALL see the mode selector step.

#### Scenario: Forced peminatan mode
- **WHEN** student enters a session with mode "peminatan"
- **THEN** the mode selector step is skipped and the test proceeds directly to user info with mode locked to "peminatan"

#### Scenario: Free mode selection
- **WHEN** student enters a session with mode "bebas"
- **THEN** the student sees the mode selector step and can choose between peminatan and karir

### Requirement: Result submission to database
Upon completing the test, the system SHALL automatically submit results to the API via `POST /api/results`. The payload SHALL include session_id, student_name, student_class, mode, birth_date, all 6 RIASEC scores, holland_code, peminatan percentages (if applicable), and individual question answers.

#### Scenario: Successful result submission
- **WHEN** student completes the test and the submission API returns 200
- **THEN** results are stored in the database and the student sees their full results page with a confirmation message "Hasil telah dikirim ke guru BK"

#### Scenario: Submission failure
- **WHEN** student completes the test and the submission API returns an error
- **THEN** the system shows an error message "Gagal mengirim hasil. Silakan coba lagi." with a retry button, while still displaying the student's results visually

#### Scenario: Duplicate submission prevention
- **WHEN** a student attempts to submit results for a session where they already have a result with the same name and class
- **THEN** the system prevents duplicate submission and shows a message "Anda sudah mengirim hasil tes untuk sesi ini"

### Requirement: Root route redirect
The `/` route SHALL redirect to `/admin/login` or display a landing page with a link to the admin login. It SHALL NOT render the standalone wizard.

#### Scenario: Navigating to root
- **WHEN** a user navigates to `/`
- **THEN** the system redirects to `/admin/login` or shows a page with a link to the admin dashboard

### Requirement: Student result persistence in localStorage removed
The system SHALL NOT persist in-progress test state to localStorage for session-based tests. State management SHALL be in-memory only during the test session.

#### Scenario: Student refreshes mid-test
- **WHEN** student refreshes the page during a session-based test
- **THEN** the test restarts from the beginning (identity form), since no localStorage state is preserved for session tests

### Requirement: Results API endpoint
The system SHALL expose `POST /api/results` (unauthenticated, but scoped to a session) for student result submission. The payload SHALL include all fields needed to reconstruct the result view.

#### Scenario: Valid submission
- **WHEN** student posts result data with all required fields and a valid session_code
- **THEN** the system creates a test_result record and associated result_answers, and returns HTTP 201

#### Scenario: Missing required fields
- **WHEN** student posts incomplete data
- **THEN** the system returns HTTP 400 with field-level validation errors