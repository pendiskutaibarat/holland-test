## ADDED Requirements

### Requirement: Admin dashboard page
The system SHALL provide an admin dashboard at `/admin/dashboard` that displays a list of all sessions created by the logged-in admin, with summary statistics and navigation to session details.

#### Scenario: Dashboard load
- **WHEN** admin navigates to `/admin/dashboard`
- **THEN** the system displays all sessions belonging to the admin, ordered by most recent first, showing session name, code, mode, creation date, number of submitted results, and active/inactive status

#### Scenario: No sessions yet
- **WHEN** admin has not created any sessions
- **THEN** the dashboard displays an empty state with a prompt to create a new session

### Requirement: Session creation
The dashboard SHALL provide a "Buat Sesi Baru" button that opens a form to create a new session. The form SHALL include fields: session name (required), mode selection (required: "peminatan", "karir", or "bebas" for student choice), and an optional description. On submission, the system SHALL generate a unique 8-character session code and display it with a copyable link.

#### Scenario: Create session with forced mode
- **WHEN** admin creates a session with mode "peminatan"
- **THEN** a new session is created with a unique code, and students who open the session link will be locked to peminatan mode

#### Scenario: Create session with free mode
- **WHEN** admin creates a session with mode "bebas"
- **THEN** students who open the session link can choose between peminatan and karir mode

#### Scenario: Duplicate session code collision
- **WHEN** the system generates a session code that already exists
- **THEN** the system retries generation until a unique code is found

### Requirement: Session detail view
Clicking a session in the dashboard SHALL navigate to `/admin/sessions/[sessionId]` showing all student results for that session, including individual results and aggregate statistics.

#### Scenario: Session with results
- **WHEN** admin views a session that has student submissions
- **THEN** the system displays a table of all students with their name, class, mode, top Holland code, RIASEC scores, and submission timestamp

#### Scenario: Session with no results yet
- **WHEN** admin views a session with no submissions
- **THEN** the system displays an empty state with the shareable link prominently shown

### Requirement: Individual result view
From the session detail view, clicking a student SHALL show their full result page — the same visual output (radar chart, badge, career tables, peminatan percentages, etc.) that the student saw, rendered server-side for the admin.

#### Scenario: Viewing karir result
- **WHEN** admin clicks on a student with karir mode results
- **THEN** the system renders the full KarirResults visual output including radar chart, badge, program studi, career tables, and score summary

#### Scenario: Viewing peminatan result
- **WHEN** admin clicks on a student with peminatan mode results
- **THEN** the system renders the full PeminatanResults visual output including bar chart, narrative descriptions, subject recommendations, and score summary

### Requirement: Aggregate statistics
The session detail view SHALL display aggregate statistics across all students in the session: average RIASEC scores, mode distribution (peminatan vs karir), and for peminatan sessions the average IPA/IPS/Bahasa percentage distribution.

#### Scenario: Aggregate stats for mixed-mode session
- **WHEN** admin views a session where 20 students took peminatan mode and 10 took karir mode
- **THEN** the system displays "20 Peminatan, 10 Karir" as mode distribution, and average RIASEC scores across all 30 students

#### Scenario: Aggregate stats for peminatan session
- **WHEN** admin views a peminatan-only session
- **THEN** the system displays average IPA/IPS/Bahasa percentages across all students and a distribution chart

### Requirement: CSV export
The session detail view SHALL provide a "Unduh CSV" button that exports all student results for the session as a CSV file with columns: name, class, mode, realistic, investigative, artistic, social, enterprising, conventional, holland_code, ipa_pct, ips_pct, bahasa_pct, timestamp.

#### Scenario: CSV export with data
- **WHEN** admin clicks "Unduh CSV" on a session with 25 results
- **THEN** a CSV file is downloaded with 25 data rows plus a header row, containing all specified columns

#### Scenario: CSV export with no data
- **WHEN** admin clicks "Unduh CSV" on a session with no results
- **THEN** a CSV file is downloaded with only the header row

### Requirement: PDF export for individual results
The individual result view SHALL provide a "Unduh PDF" button that generates a PDF of the student's result page, reusing the existing `downloadPdf` utility.

#### Scenario: PDF export for individual student
- **WHEN** admin clicks "Unduh PDF" on a student's result detail page
- **THEN** a PDF is generated and downloaded with the student's full result layout

### Requirement: Session activation toggle
The admin SHALL be able to toggle a session between active and inactive states. Inactive sessions SHALL not accept new student submissions.

#### Scenario: Deactivating a session
- **WHEN** admin toggles a session to inactive
- **THEN** students attempting to access `/test/[code]` for that session see a message "Sesi ini sudah ditutup" and cannot start the test

#### Scenario: Reactivating a session
- **WHEN** admin toggles an inactive session back to active
- **THEN** students can access and submit tests again