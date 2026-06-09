# Backend API Contract

## Conventions

- All authenticated endpoints require a valid session or bearer token.
- All response and result endpoints must enforce backend role permissions.
- Validation errors return `422`.
- Permission failures return `403`.
- Missing or inaccessible resources return `404`.
- Session state conflicts return `409`.

## Authentication

### `POST /auth/login`

Logs in a student or staff user.

Request:

```json
{
  "identifier": "student001@example.com",
  "password": "password"
}
```

Response:

```json
{
  "user": {
    "user_id": "uuid",
    "full_name": "Student Name",
    "role": "student",
    "school_id": "uuid"
  },
  "access_token": "token",
  "refresh_token": "token"
}
```

### `POST /auth/logout`

Invalidates the current session.

### `POST /auth/refresh`

Refreshes an access token.

### `POST /auth/access-code`

Optional endpoint for single-use student access code login.

Request:

```json
{
  "access_code": "ABC123"
}
```

## Assessment

### `GET /assessment-sessions/:id`

Returns session metadata visible to the current user.

Response:

```json
{
  "session_id": "uuid",
  "name": "Grade 8 Interest Assessment",
  "start_date": "2026-06-01",
  "end_date": "2026-06-30",
  "status": "active",
  "result_visibility": "immediate"
}
```

### `GET /assessment-sessions/:id/questions`

Returns the locked question set for the session.

Response:

```json
{
  "session_id": "uuid",
  "questions": [
    {
      "question_id": 1,
      "statement": "Planting and caring for plants in a garden or school yard.",
      "display_order": 1,
      "category_code": "outdoor"
    }
  ],
  "scale": [
    { "code": "SS", "label": "Strongly Like", "score": 4 },
    { "code": "S", "label": "Like", "score": 3 },
    { "code": "KS", "label": "Less Like", "score": 2 },
    { "code": "TS", "label": "Dislike", "score": 1 }
  ]
}
```

### `POST /assessment-sessions/:id/responses/save`

Auto-saves partial responses.

Request:

```json
{
  "responses": [
    { "question_id": 1, "answer_code": "SS" },
    { "question_id": 2, "answer_code": "S" }
  ]
}
```

Response:

```json
{
  "saved": true,
  "answered_count": 2,
  "total_questions": 100,
  "saved_at": "2026-06-02T07:00:00Z"
}
```

### `POST /assessment-sessions/:id/submit`

Submits final responses and calculates the result.

Request:

```json
{
  "responses": [
    { "question_id": 1, "answer_code": "SS" }
  ]
}
```

Response:

```json
{
  "submitted": true,
  "result_id": "uuid",
  "result_visible_to_student": true
}
```

Validation:

- Exactly 100 answers are required.
- Every answer code must be `SS`, `S`, `KS`, or `TS`.
- Student can submit only once unless reset by authorized staff.
- Session must be active.

## Results

### `GET /students/:studentId/results/:sessionId`

Returns an individual student result for authorized users.

Response:

```json
{
  "student": {
    "student_id": "uuid",
    "full_name": "Student Name",
    "grade": "8",
    "class_name": "8A"
  },
  "session": {
    "session_id": "uuid",
    "name": "Grade 8 Interest Assessment"
  },
  "total_score": 287,
  "category_scores": {
    "outdoor": 31,
    "scientific": 36
  },
  "ranked_categories": [
    { "rank": 1, "category_code": "scientific", "score": 36 },
    { "rank": 2, "category_code": "outdoor", "score": 31 }
  ],
  "top_categories": [
    { "rank": 1, "category_code": "scientific", "score": 36 }
  ],
  "disclaimer": "This assessment is designed to help explore student interests and hobbies..."
}
```

### `GET /classes/:classId/results-summary`

Returns aggregate class-level trends for authorized users.

Response:

```json
{
  "class_id": "uuid",
  "assigned_students": 30,
  "completed_students": 27,
  "average_category_scores": {
    "outdoor": 28.4,
    "scientific": 30.1
  },
  "most_common_top_category": "scientific",
  "dominant_category_distribution": {
    "scientific": 9,
    "social_service": 6
  }
}
```

### `GET /assessment-sessions/:id/results-export`

Exports results by scope and format.

Query parameters:

- `format`: `pdf` or `csv`
- `scope`: `individual`, `class`, `grade`, `session`, `raw_scores`,
  `raw_responses`
- `student_id`: required for individual export
- `class_id`: optional class filter

Rules:

- Raw responses are admin-only.
- Export files include assessment session identifier.
- Every export creates an audit log entry.

## Admin

### `POST /assessment-sessions`

Creates an assessment session.

Required fields:

- `name`
- `start_date`
- `end_date`
- `result_visibility`

Validation:

- End date must be after start date.

### `PATCH /assessment-sessions/:id`

Updates session metadata and status.

### `POST /students/import`

Imports students from CSV.

Validation:

- Student numbers must be unique within the school.

### `GET /questions`

Returns question bank data.

### `PATCH /questions/:id`

Updates question data. Super-admin only for official mappings.
