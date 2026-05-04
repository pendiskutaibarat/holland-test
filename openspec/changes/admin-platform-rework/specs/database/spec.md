## ADDED Requirements

### Requirement: PostgreSQL database setup
The system SHALL use PostgreSQL as its persistent data store. The database connection SHALL be configured via the `DATABASE_URL` environment variable. The system SHALL use Prisma as the ORM for schema management, migrations, and queries.

#### Scenario: Initial database setup
- **WHEN** `npx prisma migrate deploy` is run
- **THEN** all tables (admins, sessions, test_results, result_answers) are created with proper indexes and foreign key constraints

#### Scenario: Missing DATABASE_URL
- **WHEN** the application starts without a DATABASE_URL environment variable
- **THEN** the application fails to start with a clear error message indicating DATABASE_URL is required

### Requirement: Admins table
The `admins` table SHALL store admin accounts with the following columns:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL (bcrypt hash)
- `name` TEXT NOT NULL
- `created_at` TIMESTAMP DEFAULT now()

#### Scenario: Admin table constraints
- **WHEN** an insert with a duplicate email is attempted
- **THEN** the database rejects it with a unique constraint violation

### Requirement: Sessions table
The `sessions` table SHALL store test sessions with the following columns:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `admin_id` UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE
- `code` TEXT UNIQUE NOT NULL (8-character base62)
- `name` TEXT NOT NULL
- `description` TEXT
- `mode` TEXT NOT NULL DEFAULT 'bebas' (values: 'peminatan', 'karir', 'bebas')
- `is_active` BOOLEAN NOT NULL DEFAULT true
- `created_at` TIMESTAMP DEFAULT now()
- `expires_at` TIMESTAMP (nullable, optional expiration)

The `code` column SHALL have a unique index for fast lookups.

#### Scenario: Session with forced mode
- **WHEN** a session is created with mode 'peminatan'
- **THEN** students accessing that session must take the test in peminatan mode only

### Requirement: Test results table
The `test_results` table SHALL store individual student test submissions:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `session_id` UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE
- `student_name` TEXT NOT NULL
- `student_class` TEXT NOT NULL
- `mode` TEXT NOT NULL (values: 'peminatan', 'karir')
- `birth_date` DATE
- `r_score` INTEGER NOT NULL DEFAULT 0
- `i_score` INTEGER NOT NULL DEFAULT 0
- `a_score` INTEGER NOT NULL DEFAULT 0
- `s_score` INTEGER NOT NULL DEFAULT 0
- `e_score` INTEGER NOT NULL DEFAULT 0
- `c_score` INTEGER NOT NULL DEFAULT 0
- `holland_code` TEXT (precomputed top-3 code, e.g., "SIA")
- `ipa_pct` FLOAT (nullable, peminatan mode only)
- `ips_pct` FLOAT (nullable, peminatan mode only)
- `bahasa_pct` FLOAT (nullable, peminatan mode only)
- `created_at` TIMESTAMP DEFAULT now()

The combination of `(session_id, student_name, student_class)` SHALL have a unique constraint to prevent duplicate submissions.

#### Scenario: Duplicate submission prevention
- **WHEN** the same student (same name + class) in the same session tries to submit again
- **THEN** the database rejects it with a unique constraint violation

### Requirement: Result answers table
The `result_answers` table SHALL store individual question selections for each result:
- `id` UUID PRIMARY KEY DEFAULT gen_random_uuid()
- `result_id` UUID NOT NULL REFERENCES test_results(id) ON DELETE CASCADE
- `section` TEXT NOT NULL (e.g., "Kepribadian 1 - Realistis")
- `question` TEXT NOT NULL (the question text)
- `answer` TEXT NOT NULL DEFAULT 'Selected' (always "Selected" for checked items)

This table enables drill-down analysis of which specific questions students selected within each RIASEC section.

#### Scenario: Answer retrieval for a result
- **WHEN** admin views a student's individual result
- **THEN** all answer rows for that result_id are retrieved to reconstruct the full question-level detail

### Requirement: Prisma schema definition
The database schema SHALL be defined in `prisma/schema.prisma` with the PostgreSQL provider, using Prisma's UUID and DateTime types. The schema SHALL include all four tables with their relations and constraints.

#### Scenario: Schema consistency
- **WHEN** `npx prisma generate` is run
- **THEN** the Prisma client is generated with full TypeScript types matching the database schema

### Requirement: Database seeding
The system SHALL provide a seed script (`prisma/seed.ts`) that creates the initial admin account from environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`. If these variables are not set, the script SHALL use default values (admin@example.com / admin123) and log a warning.

#### Scenario: Seeding with environment variables
- **WHEN** `ADMIN_EMAIL=teacher@school.id ADMIN_PASSWORD=SecurePass1 npx prisma db seed` is run
- **THEN** an admin account is created with that email and hashed password