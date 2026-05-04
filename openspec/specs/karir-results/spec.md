## ADDED Requirements

### Requirement: Karir result page rendering
When the user selected "karir" mode, the results step SHALL render the KarirResults component. This component SHALL evolve from the current ResultsDisplay with added radar chart, badge, and program studi cluster features.

#### Scenario: Karir mode result display
- **WHEN** user completes all test sections and mode is "karir"
- **THEN** the system renders KarirResults with name, birthDate, test date, radar chart, badge, top-2 personality descriptions, career tables, Holland code, program studi clusters, and full score summary

### Requirement: RIASEC radar chart
The KarirResults component SHALL display a 6-axis radar chart showing all RIASEC scores. The chart SHALL use Chart.js via react-chartjs-2 with responsive sizing and Bahasa Indonesia labels.

#### Scenario: Radar chart rendering
- **WHEN** KarirResults is mounted with scores R=8, I=10, A=3, S=2, E=1, C=4
- **THEN** a radar chart is rendered with 6 axes labeled "Realistis", "Investigatif", "Artistik", "Sosial", "Wirausaha", "Konvensional" and data points proportional to each score

#### Scenario: All scores are zero
- **WHEN** all RIASEC scores are 0
- **THEN** the radar chart shows a flat line at zero with a visible message "Belum ada data"

### Requirement: Badge/profile name system
KarirResults SHALL display a badge name for the student based on their top-3 RIASEC code (e.g., S-I-A → "Inovator Analitis"). Badge names and descriptions SHALL be stored in `src/data/badges.ts`. For combinations without a specific badge, the system SHALL display a generic badge using the Holland code itself.

#### Scenario: Recognized badge combination
- **WHEN** a student's top-3 scores yield the code I-A-S
- **THEN** the badge "Inovator Analitis" is displayed with its description

#### Scenario: Unrecognized combination
- **WHEN** a student's top-3 scores yield a combination not present in badges.ts
- **THEN** the system displays the Holland code (e.g., "C-R-A") as the badge name with a generic description

### Requirement: Top-3 Holland code display
KarirResults SHALL display the student's 3-letter Holland code (top 3 RIASEC types by score, e.g., "SIA") prominently in the results header area.

#### Scenario: Code with ties
- **WHEN** two or more RIASEC types have the same score competing for a position in the top 3
- **THEN** the system orders tied types alphabetically by their English letter code and selects the first 3

### Requirement: Program studi recommendations
KarirResults SHALL display recommended program studi (study program) clusters based on the student's top-3 Holland code. Recommendations SHALL be stored in `src/data/programStudi.ts`. Each cluster SHALL include a cluster name, 2-3 example study programs, and 2-3 example professions.

#### Scenario: Matched program studi
- **WHEN** a student's top-3 code is S-I-A
- **THEN** 3 program studi clusters are recommended, each showing cluster name, example study programs, and example professions

#### Scenario: Unmatched program studi
- **WHEN** a student's top-3 code has no entry in programStudi.ts
- **THEN** the system falls back to showing career recommendations for the top-2 personality types (current behavior) with a note that personalized program recommendations are not available for this combination

### Requirement: Career tables retained
KarirResults SHALL retain the existing career table feature showing 25 professions for each of the top-2 personality types. This is unchanged from the current ResultsDisplay.

#### Scenario: Career table display
- **WHEN** KarirResults renders for a student with top-2 types Social and Investigative
- **THEN** two career tables are shown, each listing 25 professions with descriptions