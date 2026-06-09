# Backend Frontend Integration Plan

## Integration Principles

- Backend authorization is the source of truth.
- Frontend permission guards are for navigation and usability only.
- Scoring must happen on the backend.
- Raw responses and computed results must both be persisted.
- UI, PDF, and CSV exports must read from the same stored result data.
- Question mappings must be locked per assessment session.

## Phase 1: Foundation

### Backend

- Implement auth and role model.
- Create school, user, student profile, class, and session tables.
- Seed official categories and 100 English questions.
- Add permission middleware.

### Frontend

- Build login and access-code entry.
- Add authenticated app shell.
- Add role-aware navigation.
- Add session fetch and loading/error states.

### Contract Checks

- `GET /assessment-sessions/:id`
- `GET /assessment-sessions/:id/questions`
- Role-based `403` behavior.

## Phase 2: Student Assessment

### Backend

- Implement response save endpoint.
- Implement submit endpoint.
- Validate all 100 answers.
- Block duplicate submission unless reset by authorized staff.
- Store scores per response.

### Frontend

- Build instructions page.
- Build 100-question assessment form with 10 questions per page.
- Add auto-save after each answer.
- Add refresh recovery.
- Add missing answer summary.
- Add submit flow.

### Contract Checks

- Auto-save returns answered count and timestamp.
- Submit returns result id and student visibility flag.
- Closed sessions return `409`.

## Phase 3: Scoring and Result

### Backend

- Implement deterministic scoring service.
- Store `total_score`, `category_scores`, `ranked_categories`, and
  `top_categories`.
- Add tie handling.
- Add result endpoint.
- Add audit log for submission and result calculation.

### Frontend

- Build student result page.
- Display top 3 category cards.
- Display full ranking chart and table.
- Show category descriptions and recommended activities.
- Show required disclaimer.

### Contract Checks

- Sum of category scores equals sum of all item scores.
- Result is reproducible from saved responses.
- UI score values match API response.

## Phase 4: Counselor and Teacher Views

### Backend

- Add assigned student and class summary queries.
- Add aggregate category averages.
- Add dominant category distribution.
- Enforce teacher restrictions for individual reports.

### Frontend

- Build counselor dashboard filters.
- Build counselor student result view.
- Build teacher completion dashboard.
- Add class-level summary charts and tables.

### Contract Checks

- Counselors see assigned students.
- Teachers see only assigned classes.
- Teacher individual report access is configurable.

## Phase 5: Admin and Reporting

### Backend

- Implement session create/edit.
- Implement CSV student import.
- Implement user activation/deactivation.
- Implement PDF individual report.
- Implement PDF group summary.
- Implement CSV raw scores.
- Implement admin-only CSV raw responses.
- Log every export.

### Frontend

- Build session management.
- Build student import UI.
- Build assignment UI for counselors and teachers.
- Build export center.
- Build question bank view.

### Contract Checks

- Admin can create a session in under 5 minutes.
- CSV imports reject duplicate student numbers within a school.
- Exported files include session identifier.
- PDF data matches result page data.

## Phase 6: Quality, Security, and Launch

### Required Tests

- Scoring unit tests for all category mappings.
- Tie-handling tests.
- Response validation tests.
- Permission tests for every role.
- Result visibility tests.
- Export consistency tests between UI, PDF, and CSV.
- Accessibility checks for keyboard and screen-reader labels.

### Launch Readiness

- HTTPS enabled.
- Environment separation configured.
- Scheduled backups configured.
- Audit logs enabled.
- Admin export logging verified.
- Retention policy configurable by school.
- Internal prototype tested with mock student data.
- Pilot run validated with one class or grade.

## Open Decisions

- Should students see results immediately or only after counselor review?
- Should tied categories use shared ranks or be forced into exactly 3 dominant
  categories?
- Should schools be allowed to customize question wording?
- Should reports include parent-facing language?
- Should Indonesian be included in MVP or planned as a later localization?

## Implementation Order

1. Data model and seed data.
2. Auth and permissions.
3. Student assessment and auto-save.
4. Scoring and result persistence.
5. Student result page.
6. Counselor dashboard.
7. Teacher view.
8. Admin session and student management.
9. Reporting and exports.
10. Audit logs, analytics, and launch hardening.
