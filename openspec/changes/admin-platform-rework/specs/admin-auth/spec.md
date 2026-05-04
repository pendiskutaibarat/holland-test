## ADDED Requirements

### Requirement: Admin login
The system SHALL provide a login page at `/admin/login` where admins authenticate with email and password. Upon successful authentication, the system SHALL issue a JWT token stored as an httpOnly cookie and redirect to `/admin/dashboard`.

#### Scenario: Successful login
- **WHEN** admin submits valid email and password
- **THEN** the system verifies the password hash using bcrypt, sets an httpOnly cookie with a JWT token, and redirects to `/admin/dashboard`

#### Scenario: Invalid credentials
- **WHEN** admin submits incorrect email or password
- **THEN** the system returns an error message "Email atau kata sandi salah" and does not set a cookie

#### Scenario: Unauthenticated access to admin routes
- **WHEN** a request to any `/admin/*` route (except `/admin/login`) is made without a valid JWT cookie
- **THEN** the system redirects to `/admin/login`

### Requirement: JWT token management
The system SHALL issue JWT tokens with an expiration of 24 hours. Tokens SHALL contain the admin's UUID as the subject claim. The system SHALL validate the token on every admin API request and admin page load.

#### Scenario: Token expiration
- **WHEN** an admin's JWT token has expired
- **THEN** the system redirects to `/admin/login` with no error message

#### Scenario: Token validation on API requests
- **WHEN** an API request to `/api/admin/*` is made with an invalid or missing JWT cookie
- **THEN** the system responds with HTTP 401 Unauthorized

### Requirement: Admin password storage
Admin passwords SHALL be hashed using bcrypt with a minimum cost factor of 10. The system SHALL never store or log plaintext passwords.

#### Scenario: Admin creation
- **WHEN** an admin account is created via the seed script
- **THEN** the password is hashed with bcrypt before storage

### Requirement: Admin seed script
The system SHALL provide a seed script (`prisma/seed.ts`) that creates an initial admin account from environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). This script SHALL be idempotent — running it when the admin already exists SHALL not fail or duplicate the account.

#### Scenario: First-time seed
- **WHEN** the seed script is run with no existing admin
- **THEN** an admin account is created with the provided email and hashed password

#### Scenario: Re-seeding with existing admin
- **WHEN** the seed script is run and an admin with the same email already exists
- **THEN** the script skips creation and logs a message indicating the admin already exists

### Requirement: Admin logout
The system SHALL provide a logout mechanism that clears the JWT cookie and redirects to `/admin/login`.

#### Scenario: Admin logs out
- **WHEN** admin clicks a logout button on the dashboard
- **THEN** the httpOnly cookie is cleared and the admin is redirected to `/admin/login`