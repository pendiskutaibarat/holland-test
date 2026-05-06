## ADDED Requirements

### Requirement: Teacher self-registration form
The system SHALL provide a registration page at `/admin/register` with fields for name, email, and password. The page SHALL be accessible without authentication.

#### Scenario: Successful registration
- **WHEN** a visitor submits valid name, email, and password to `/admin/register`
- **THEN** the system SHALL create a new User record with `role: "TEACHER"` and `status: "PENDING"`, and display the message "Pendaftaran berhasil! Akun Anda menunggu persetujuan admin."

#### Scenario: Duplicate email registration
- **WHEN** a visitor submits a registration with an email that already exists in the database (regardless of status)
- **THEN** the system SHALL reject the submission with the error "Email sudah terdaftar"

#### Scenario: Invalid input
- **WHEN** a visitor submits a registration with missing name, email, or password, or an invalid email format
- **THEN** the system SHALL reject the submission with appropriate validation error messages

#### Scenario: Navigation from login
- **WHEN** a visitor is on `/admin/login`
- **THEN** the page SHALL display a link to `/admin/register` with text "Belum punya akun? Daftar"

### Requirement: Login status-based error messages
The system SHALL differentiate between three non-active account states during login and display distinct messages.

#### Scenario: Pending account login attempt
- **WHEN** a user with `status: "PENDING"` attempts to log in
- **THEN** the system SHALL reject the login and display "Akun Anda masih menunggu persetujuan admin"

#### Scenario: Rejected account login attempt
- **WHEN** a user with `status: "REJECTED"` attempts to log in
- **THEN** the system SHALL reject the login and display "Akun ditolak"

#### Scenario: Active account login
- **WHEN** a user with `status: "ACTIVE"` attempts to log in with correct credentials
- **THEN** the system SHALL issue a JWT token and redirect to the dashboard

### Requirement: Registration API endpoint
The system SHALL expose `POST /api/auth/register` that accepts `{ name, email, password }` and creates a teacher account.

#### Scenario: Successful API registration
- **WHEN** a POST request is sent to `/api/auth/register` with valid name, email, and password
- **THEN** the system SHALL hash the password, create a User with `role: "TEACHER"` and `status: "PENDING"`, and return `{ user: { id, email, name } }` with status 201

#### Scenario: Duplicate email via API
- **WHEN** a POST request is sent to `/api/auth/register` with an email that already exists
- **THEN** the system SHALL return `{ error: "Email sudah terdaftar" }` with status 409
