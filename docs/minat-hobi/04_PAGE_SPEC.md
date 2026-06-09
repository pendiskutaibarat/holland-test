# Page Specification

## Login Page

### Purpose

Allow staff and students to authenticate.

### Required Elements

- Username/email field.
- Password field.
- Submit button.
- Link or tab for access-code entry when enabled.
- Error state for invalid credentials.

## Access Code Page

### Purpose

Allow students to enter a single-use assessment access code.

### Required Elements

- Access code input.
- Submit button.
- Error state for invalid, expired, or already-used code.

## Assessment Instructions Page

### Purpose

Prepare students before starting the assessment.

### Required Content

- Students should imagine themselves doing each activity.
- There are no right or wrong answers.
- Students should answer honestly based on preference.
- Every activity must be rated with one of four choices.
- Scale table for `SS`, `S`, `KS`, and `TS`.

### Acceptance Criteria

- Student must acknowledge instructions before starting.
- Scale reference remains accessible during the assessment.

## Student Assessment Page

### Purpose

Collect 100 answers from the student.

### Required Elements

- Session name.
- Question range.
- Progress percentage and answered count.
- Persistent scale reference.
- 10 questions per page.
- Exactly one answer per question.
- Previous and next navigation.
- Submit button after all pages are complete.
- Missing answer summary when submission is attempted too early.
- Auto-save status.

### Acceptance Criteria

- Student can answer using keyboard, mouse, or touch.
- Refreshing the page does not erase saved answers.
- Submission is blocked when any answer is missing.
- Incomplete questions are highlighted before submission.

## Student Result Page

### Purpose

Show the student's interest profile after submission when visibility allows it.

### Required Elements

- Student name.
- Assessment date.
- Top 3 interest categories.
- Score cards for top categories.
- Full ranking table.
- Ranking bar chart.
- Suggested activities.
- Optional PDF download.
- Required disclaimer.

### Acceptance Criteria

- Result uses student-friendly language.
- Scores are shown as `score / 40`.
- Page works on desktop, tablet, and mobile.
- Result does not label the student negatively.

## Counselor Dashboard

### Purpose

Help counselors monitor assigned students and review results.

### Required Elements

- Filters by class, grade, session, and completion status.
- Total assigned students.
- Completed assessment count.
- Incomplete assessment count.
- Average category scores.
- Most common top category.
- Most common top 3 combination.
- Student table with completion status.
- Links to individual reports.
- Export individual PDF.
- Export group summary PDF or CSV.

### Acceptance Criteria

- Counselor can identify incomplete students quickly.
- Counselor can view aggregate class-level trends.
- Counselor can download reports in PDF and CSV formats.

## Teacher View

### Purpose

Help teachers monitor class completion and permitted aggregate trends.

### Required Elements

- Assigned class list.
- Completion summary.
- Student completion table.
- Aggregate class trends when permission is granted.
- Class-level report download when enabled.

### Restrictions

- Teachers cannot modify student answers or scoring.
- Teachers do not receive full individual counseling reports unless explicitly
  permitted.

## Admin Panel

### Purpose

Manage assessment sessions, students, assignments, permissions, and exports.

### Required Pages

- Assessment sessions list.
- Create/edit assessment session.
- Student import.
- User management.
- Counselor and teacher assignment.
- Progress monitoring.
- Export center.
- Question bank view.

### Acceptance Criteria

- Admin can create a new assessment session in under 5 minutes.
- Admin can bulk import students.
- Admin can deactivate users without deleting historical results.

## Question Bank Page

### Purpose

Expose the official question bank and mapping.

### Required Elements

- Question number.
- Activity statement.
- Category code.
- Category name.
- Display order.
- Language.
- Active status.

### Permissions

- School admin can view the question bank.
- Super admin can edit official question mappings.

## Reports

### Individual PDF

Must include:

- Student identity fields.
- Assessment date.
- Top 3 categories.
- Scores for all 10 categories.
- Category descriptions.
- Recommended activities.
- Disclaimer.

### Group Report

Must include:

- Class or grade name.
- Number of students assigned.
- Number completed.
- Average score per category.
- Distribution of dominant categories.
- Export timestamp.
- Assessment session identifier.
