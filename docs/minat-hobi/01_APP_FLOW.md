# App Flow

## Roles

- `student`
- `teacher`
- `counselor`
- `admin`
- `super_admin`

## Student Flow

1. Student logs in with username and password, school-managed login, or a
   single-use access code.
2. Student opens the assigned assessment session.
3. Student reads the instructions page.
4. Student acknowledges the instructions before starting.
5. Student answers 100 activity statements using `SS`, `S`, `KS`, or `TS`.
6. The app auto-saves progress after each answer.
7. The app shows progress percentage and answered/unanswered status.
8. Student submits after all 100 questions are answered.
9. The system validates completion and answer codes.
10. The scoring engine calculates all 10 category scores.
11. The result page is shown if session visibility allows immediate student
    access.
12. Student may download a simplified report if enabled by school settings.

## Counselor Flow

1. Counselor logs in.
2. Counselor selects school, grade, class, cohort, or assessment session.
3. Counselor reviews completion status.
4. Counselor filters students by class, grade, session, and completion status.
5. Counselor opens individual student results.
6. Counselor reviews top 3 interests, all category scores, and recommended
   activities.
7. Counselor compares scores across assigned students.
8. Counselor exports individual PDF reports or group summaries.

## Teacher Flow

1. Teacher logs in.
2. Teacher opens assigned class dashboard.
3. Teacher views completion status for assigned classes.
4. Teacher views aggregate class trends only when permission is granted.
5. Teacher downloads class-level summary reports only when enabled.

Teachers must not automatically receive full individual counseling reports unless
the school grants explicit permission.

## School Admin Flow

1. Admin creates an assessment session.
2. Admin imports or creates student accounts.
3. Admin assigns students to grade, class, cohort, counselor, and teacher.
4. Admin configures session dates and result visibility.
5. Admin monitors completion progress.
6. Admin exports school-level reports.
7. Admin deactivates users when needed without deleting historical results.

## Super Admin Flow

1. Super admin manages official question bank and category mappings.
2. Super admin can view all school-level administration tools.
3. Super admin handles platform-level configuration and support tasks.

## Session States

| Status | Meaning | Student Behavior |
| --- | --- | --- |
| `draft` | Setup is incomplete. | Students cannot start. |
| `active` | Session is open. | Students can answer and submit. |
| `closed` | Session is finished. | Students cannot submit unless reopened. |
| `archived` | Historical session. | Read-only reporting only. |

## Result Visibility Modes

| Mode | Behavior |
| --- | --- |
| `immediate` | Student can view result immediately after submission. |
| `counselor_only` | Result is hidden from student and available to authorized staff. |
| `scheduled` | Result becomes visible at a configured date or time. |

## Validation Flow

Before submission:

- Every active question must have exactly one answer.
- Every answer code must be one of `SS`, `S`, `KS`, or `TS`.
- Missing answers are highlighted.
- Submission is blocked until complete.

After submission:

- Student cannot change answers unless an authorized staff member resets or
  reopens the session.
- Raw responses and computed scores are both persisted.
- Result is reproducible from saved response data.

## Edge Cases

| Case | Expected Behavior |
| --- | --- |
| Student loses connection mid-assessment | Previously saved answers remain stored. |
| Student refreshes browser | Saved answers are restored. |
| Student submits incomplete assessment | Submission is blocked and missing items are shown. |
| Two categories tie | Show tied categories with shared ranks or apply configured tie-breaker. |
| Admin edits student class after submission | Result remains linked to student and session; class summary updates. |
| Session is closed | Students cannot submit unless admin reopens it. |
| Question bank changes after session starts | Existing session keeps its locked question version. |
