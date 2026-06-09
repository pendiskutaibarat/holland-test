# Database Schema

## Notes

Use a relational database. Keep scoring logic language-independent by storing
stable category codes separately from localized display text.

The assessment session should lock the question version used by students so
future question-bank edits do not change historical results.

## Tables

### `schools`

| Column | Type | Notes |
| --- | --- | --- |
| `school_id` | UUID | Primary key. |
| `name` | String | School name. |
| `active` | Boolean | Account status. |
| `created_at` | DateTime | Creation timestamp. |

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `user_id` | UUID | Primary key. |
| `full_name` | String | User full name. |
| `email` | String | Optional for students, required for staff. |
| `password_hash` | String | Required for password login. |
| `role` | Enum | `student`, `counselor`, `teacher`, `admin`, `super_admin`. |
| `school_id` | UUID | Linked school. |
| `active` | Boolean | Account status. |
| `created_at` | DateTime | Creation timestamp. |

### `student_profiles`

| Column | Type | Notes |
| --- | --- | --- |
| `student_id` | UUID | Primary key and linked `users.user_id`. |
| `student_number` | String | Unique within school. |
| `grade` | String | Grade level. |
| `class_name` | String | Class or homeroom. |
| `birth_date` | Date | Optional. |
| `gender` | String | Optional, only if school requires it. |

### `classes`

| Column | Type | Notes |
| --- | --- | --- |
| `class_id` | UUID | Primary key. |
| `school_id` | UUID | Linked school. |
| `grade` | String | Grade level. |
| `name` | String | Class name. |
| `active` | Boolean | Status. |

### `assessment_sessions`

| Column | Type | Notes |
| --- | --- | --- |
| `session_id` | UUID | Primary key. |
| `school_id` | UUID | Linked school. |
| `name` | String | Session name. |
| `start_date` | Date | Opening date. |
| `end_date` | Date | Closing date. |
| `status` | Enum | `draft`, `active`, `closed`, `archived`. |
| `result_visibility` | Enum | `immediate`, `counselor_only`, `scheduled`. |
| `question_version_id` | UUID | Locked question set for the session. |
| `created_at` | DateTime | Creation timestamp. |

### `questions`

| Column | Type | Notes |
| --- | --- | --- |
| `question_id` | Integer | Official number from 1 to 100. |
| `statement` | Text | Activity statement shown to student. |
| `category_code` | String | Stable interest category key. |
| `category_name` | String | Display category name. |
| `display_order` | Integer | Order shown to student. |
| `active` | Boolean | Whether item is currently used. |
| `language` | String | Language code, default `en`. |

Constraints:

- Every active question belongs to exactly one category.
- Official mappings are editable only by super admins.
- Category codes remain stable across translations.

### `responses`

| Column | Type | Notes |
| --- | --- | --- |
| `response_id` | UUID | Primary key. |
| `session_id` | UUID | Assessment session. |
| `student_id` | UUID | Student. |
| `question_id` | Integer | Question answered. |
| `answer_code` | Enum | `SS`, `S`, `KS`, `TS`. |
| `score` | Integer | 1 to 4. |
| `answered_at` | DateTime | Timestamp. |

Recommended unique key:

- `session_id`, `student_id`, `question_id`

### `assessment_results`

| Column | Type | Notes |
| --- | --- | --- |
| `result_id` | UUID | Primary key. |
| `session_id` | UUID | Assessment session. |
| `student_id` | UUID | Student. |
| `total_score` | Integer | Sum of all item scores. |
| `category_scores` | JSON | Scores for all 10 categories. |
| `ranked_categories` | JSON | Ordered category ranking. |
| `top_categories` | JSON | Top categories. |
| `calculated_at` | DateTime | Calculation timestamp. |

Recommended unique key:

- `session_id`, `student_id`

### `audit_logs`

| Column | Type | Notes |
| --- | --- | --- |
| `audit_log_id` | UUID | Primary key. |
| `school_id` | UUID | Linked school when applicable. |
| `actor_user_id` | UUID | User performing the action. |
| `event_type` | String | Login, submission, export, update, permission change. |
| `scope` | JSON | Session, class, student, or export scope. |
| `created_at` | DateTime | Event timestamp. |

## Category Codes

| Code | Name |
| --- | --- |
| `outdoor` | Outdoor |
| `mechanical_practical` | Mechanical & Practical |
| `computational_clerical` | Computational & Clerical |
| `scientific` | Scientific |
| `persuasive` | Persuasive |
| `aesthetic` | Aesthetic |
| `literary` | Literary |
| `musical` | Musical |
| `social_service` | Social Service |
| `medical` | Medical |
