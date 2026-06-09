# Design System

## Design Principles

- Student-friendly, clear, and calm.
- Avoid clinical or judgmental language.
- Keep the assessment focused and low-distraction.
- Make progress, completion, and missing answers obvious.
- Use readable typography and high contrast.
- Keep numeric scores visible in result views.

## Tone

Use plain English. Avoid labels such as:

- weak
- bad
- low ability
- failed
- poor

Preferred wording:

- "lower preference" instead of "weakness"
- "dominant interest" instead of "best ability"
- "suggested activities" instead of "career decision"
- "exploration tool" instead of "diagnostic test"

## Layout

### Assessment

- Use a single-column flow on mobile.
- Use a constrained reading width on desktop.
- Display 10 questions per page.
- Keep the answer scale visible during the assessment.
- Use stable page navigation so students do not lose context.

### Result

- Show top 3 categories as prominent cards.
- Show all 10 categories in a bar chart and table.
- Display scores as `score / 40`.
- Keep explanations short and student-friendly.
- Show the disclaimer near report and result interpretation content.

### Dashboards

- Prioritize filters, completion status, and report actions.
- Use dense but readable tables for staff workflows.
- Make incomplete students easy to identify.
- Do not expose sensitive individual reports to unauthorized teacher views.

## Components

| Component | Notes |
| --- | --- |
| Scale Reference | Shows `SS`, `S`, `KS`, `TS`, labels, and scores. |
| Question Item | Statement plus exactly one selected answer. |
| Progress Indicator | Percentage and answered count text. |
| Missing Answer Summary | Links to unanswered questions before submit. |
| Top Category Card | Category name, rank, score, description, activities. |
| Ranking Table | Rank, category, score, score bar. |
| Completion Badge | `not_started`, `in_progress`, `submitted`. |
| Export Button | Visible only when permission allows export. |
| Role Guard Empty State | Explains unavailable access without leaking data. |

## Answer Options

| Code | Label | Score |
| --- | --- | ---: |
| SS | Strongly Like | 4 |
| S | Like | 3 |
| KS | Less Like | 2 |
| TS | Dislike | 1 |

Each option should be clickable by label and control. Keyboard users must be able
to select options without a mouse.

## Status Labels

| State | User-Facing Label |
| --- | --- |
| `not_started` | Not started |
| `in_progress` | In progress |
| `submitted` | Submitted |
| `closed` | Closed |
| `saving` | Saving |
| `saved` | Saved |
| `save_failed` | Save failed |

## Accessibility Checklist

- Minimum touch target: 44x44 px.
- Visible focus styles for all controls.
- Text equivalent for charts and progress bars.
- Form errors announced to screen readers.
- Do not rely on color alone for missing answers or completion state.
- Maintain readable font sizes on mobile and desktop.
