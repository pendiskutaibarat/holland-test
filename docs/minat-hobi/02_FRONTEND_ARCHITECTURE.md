# Frontend Architecture

## Recommended Stack

- React or Next.js.
- TypeScript.
- Responsive layout for desktop, tablet, and mobile browsers.
- Server API integration through typed client modules.
- Form state with auto-save, validation, and restored progress.

## Application Areas

| Area | Purpose |
| --- | --- |
| Authentication | Login, access-code entry, session refresh, logout. |
| Student Assessment | Instructions, questionnaire, auto-save, submit validation. |
| Student Result | Top 3 interests, ranking, descriptions, recommendations, downloads. |
| Counselor Dashboard | Assigned student list, filters, reports, aggregate trends. |
| Teacher View | Assigned class completion and permitted class summaries. |
| Admin Panel | Session management, imports, assignments, exports, user management. |
| Question Bank | Admin view and super-admin editing for official mappings. |

## Suggested Route Structure

```text
/login
/access-code
/student/sessions/:sessionId/instructions
/student/sessions/:sessionId/assessment
/student/sessions/:sessionId/result
/counselor/dashboard
/counselor/students/:studentId/results/:sessionId
/teacher/classes/:classId
/admin/sessions
/admin/sessions/:sessionId
/admin/students/import
/admin/questions
```

## State Responsibilities

### Auth State

- Current user.
- Role and permissions.
- School scope.
- Assigned classes or student groups.
- Token/session lifecycle.

### Assessment State

- Session metadata.
- Locked question version.
- Current answers by `question_id`.
- Auto-save status.
- Completion progress.
- Validation errors.
- Submission state.

### Result State

- Student identity.
- Session metadata.
- Category scores.
- Ranked categories.
- Top categories.
- Category descriptions and recommendations.
- Export permissions.

## Assessment Form Pattern

Display questions in pages of 10 items.

Each page should include:

- Question range, for example `Questions 21-30`.
- Progress percentage.
- Persistent scale reference.
- One card or row per question.
- Four large radio or card-style options.
- Clear unanswered state.
- Previous and next navigation.
- Submit action only on the final page.

Auto-save should run after each answer and expose these states:

- `saved`
- `saving`
- `failed`
- `offline` or connection error when detectable

## Accessibility Requirements

- Target WCAG 2.1 AA.
- All controls must be keyboard navigable.
- Each answer option needs a screen-reader label including question number,
  answer code, answer label, and score.
- Color must not be the only status indicator.
- Touch targets must be at least 44x44 px.
- Progress indicators need text equivalents.
- Warn users before leaving an unfinished assessment.

## Frontend Permission Rules

Frontend permission checks improve UX but do not replace backend authorization.

| Feature | Student | Teacher | Counselor | Admin | Super Admin |
| --- | --- | --- | --- | --- | --- |
| Take assessment | Yes | No | No | No | No |
| View own result | Configurable | No | No | No | No |
| View class completion | No | Yes | Yes | Yes | Yes |
| View individual reports | No | Configurable | Yes | Yes | Yes |
| Export individual PDF | Configurable | Configurable | Yes | Yes | Yes |
| Export raw responses | No | No | No | Yes | Yes |
| Manage users | No | No | No | Yes | Yes |
| Manage question bank | No | No | No | View only | Yes |
| Manage category mappings | No | No | No | No | Yes |

## Error Handling

- `401`: redirect to login or refresh session.
- `403`: show permission-specific empty state.
- `404`: show not found for missing or inaccessible session/student/class.
- `409`: show conflict when session is closed, already submitted, or reset is
  required.
- `422`: show field-level validation errors.
- `500`: show retry-safe error copy and log client context.
