# Backend Architecture

## Responsibilities

The backend owns:

- Authentication and session management.
- Role-based access control.
- Assessment session lifecycle.
- Student, teacher, counselor, and admin data.
- Question bank and locked session question versions.
- Response auto-save and submission.
- Deterministic scoring.
- Result storage and retrieval.
- PDF and CSV report generation.
- Audit logging.
- Product and school analytics.

## Recommended Architecture

```text
API Layer
  Auth Controller
  Assessment Controller
  Result Controller
  Admin Controller
  Report Controller

Service Layer
  Auth Service
  Permission Service
  Assessment Session Service
  Question Service
  Response Service
  Scoring Service
  Result Service
  Reporting Service
  Audit Log Service
  Analytics Service

Persistence Layer
  Relational Database
  Object Storage for generated reports, if needed
```

REST or GraphQL is acceptable. The PRD lists REST endpoints as the baseline.

## Scoring Service

The scoring service must be deterministic and test-covered.

Input:

- Exactly 100 answers.
- Each answer code is one of `SS`, `S`, `KS`, `TS`.
- A locked category mapping for the assessment session.

Output:

- `total_score`
- `category_scores`
- `ranked_categories`
- `top_categories`

Score map:

```text
SS = 4
S = 3
KS = 2
TS = 1
```

Tie handling:

- Preferred: show shared ranks for equal scores.
- If exactly 3 categories must be forced, use:
  1. Higher number of `SS` answers in the category.
  2. Higher number of `S` answers in the category.
  3. Lower original category order index.

## Security

- All traffic must use HTTPS.
- Passwords must be securely hashed.
- Student responses are sensitive educational data.
- Every result and export endpoint must enforce backend authorization.
- Raw response exports are restricted to admin-level roles.
- Admin exports must be logged.
- Data retention and deletion policies must be configurable by school.

## Audit Logging

Log these events:

- User login.
- Assessment submission.
- Result calculation.
- Report export.
- User data update.
- Permission changes.

Every export event records:

- Acting user.
- Timestamp.
- Export type.
- School/session/class/student scope.

## Analytics

### Product Analytics

- Assessment start rate.
- Assessment completion rate.
- Average completion time.
- Drop-off question range.
- Report download count.

### School Analytics

- Completion by class.
- Completion by grade.
- Average category score by cohort.
- Most frequent dominant category.
- Category distribution across school.

Analytics must not expose individual student results to unauthorized roles.

## Infrastructure

- Environment separation: `development`, `staging`, `production`.
- Scheduled backups.
- Secure configuration through environment variables or managed secrets.
- Report generation service for PDFs and CSV files.
- Background job support can be added for large imports and exports.

## MVP Scope

Included:

- Student login or access code.
- Assessment instruction page.
- 100-question assessment form.
- Auto-save answers.
- Submission validation.
- Automatic scoring.
- Student result page.
- Counselor dashboard.
- Individual PDF report.
- Class completion monitoring.
- Basic CSV export.
- Role-based access control.

Excluded:

- AI-generated recommendations.
- Parent portal.
- Native mobile app.
- Advanced benchmarking.
- Multi-school district dashboard.
- Integration with external school information systems.
