# Product Vision

## Product

**Interest & Hobby Assessment Web App** is a web-based assessment platform for
students, teachers, counselors, school administrators, and super admins.

The app digitizes an interest and hobby assessment adapted from the Rothwell
Miller Interest Blank concept. Students answer 100 concrete activity statements
using a four-point preference scale. The system scores responses automatically,
ranks 10 interest categories, identifies each student's top 3 dominant
interests, and produces student and school reports.

## Core Outcome

After completing the assessment, each student receives:

- A ranked profile of 10 interest categories.
- Top 3 dominant interest categories.
- Scores for each category, shown out of 40.
- Student-friendly descriptions and suggested hobbies or activities.
- A disclaimer that the result is an exploration aid, not a diagnosis or
  measure of ability.

## Assessment Scale

| Code | Label | Score |
| --- | --- | ---: |
| SS | Strongly Like | 4 |
| S | Like | 3 |
| KS | Less Like | 2 |
| TS | Dislike | 1 |

## Interest Categories

Each category has 10 questions. The minimum category score is 10 and the maximum
category score is 40.

| Category | Question Numbers |
| --- | --- |
| Outdoor | 1, 11, 21, 31, 41, 51, 61, 71, 81, 91 |
| Mechanical & Practical | 2, 12, 22, 32, 42, 52, 62, 72, 82, 92 |
| Computational & Clerical | 3, 13, 23, 33, 43, 53, 63, 73, 83, 93 |
| Scientific | 4, 14, 24, 34, 44, 54, 64, 74, 84, 94 |
| Persuasive | 5, 15, 25, 35, 45, 55, 65, 75, 85, 95 |
| Aesthetic | 6, 16, 26, 36, 46, 56, 66, 76, 86, 96 |
| Literary | 7, 17, 27, 37, 47, 57, 67, 77, 87, 97 |
| Musical | 8, 18, 28, 38, 48, 58, 68, 78, 88, 98 |
| Social Service | 9, 19, 29, 39, 49, 59, 69, 79, 89, 99 |
| Medical | 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 |

## Goals

### Business Goals

- Enable schools to administer student interest assessments digitally.
- Reduce manual scoring work for teachers and counselors.
- Provide structured student interest data for guidance, extracurricular
  planning, and career exploration.
- Create exportable reports for students, parents, teachers, and school
  records.

### User Goals

- Students can complete the assessment easily without confusion.
- Counselors can quickly view dominant interests and recommendations.
- Teachers can identify class-level completion and interest trends.
- School administrators can aggregate results by class, grade, cohort, and
  session.

### Product Goals

- Deliver a simple and reliable assessment experience.
- Calculate accurate category scores automatically.
- Present results in clear English.
- Support future Indonesian localization.
- Preserve student data securely.

## Non-Goals

The first version will not:

- Diagnose psychological conditions.
- Replace professional counseling judgment.
- Provide definitive career placement decisions.
- Use adaptive questioning.
- Use AI-generated scoring.
- Let students edit category mappings.
- Support offline native mobile usage.

## Target Users

| User | Primary Needs |
| --- | --- |
| Student | Clear wording, simple answer choices, understandable result. |
| Counselor | Accurate scoring, student comparison, reports, suggested activities. |
| Teacher | Completion monitoring and class-level summaries with limited sensitive data. |
| School Admin | Session, user, class, cohort, permission, and export management. |
| Parent or Guardian | Optional generated reports when enabled by the school. |

## Success Metrics

- At least 80% of assigned students complete the assessment within the active
  session period.
- At least 90% of counselors can access individual results without admin help.
- Median assessment completion time is under 25 minutes.
- Less than 5% incomplete submission attempts after validation improvements.
- Category scores are 100% reproducible from raw responses.
- There are zero unresolved scoring mismatches between UI, PDF, and CSV export.

## Required Disclaimer

This assessment is designed to help explore student interests and hobbies. It is
not a psychological diagnosis, career placement test, or measure of ability.
Results should be discussed with a counselor, teacher, or trusted adult and used
together with other information about the student's learning, personality,
values, and goals.
