## MODIFIED Requirements

### Requirement: Karir result page rendering
When the user selected "karir" mode, the results step SHALL render the KarirResults component. This component SHALL display name, birthDate, test date, bar chart, badge, top-3 personality cards with structured descriptions, career tables, Holland code, and full score summary.

#### Scenario: Karir mode result display
- **WHEN** user completes all test sections and mode is "karir"
- **THEN** the system renders KarirResults with name, birthDate, test date, horizontal bar chart, badge, top-3 personality cards (summary + traits + preferences + avoidances), 4-column career tables with 10 Indonesia-specific careers each, Holland code, and full score summary

### Requirement: RIASEC bar chart
The KarirResults component SHALL display a horizontal bar chart showing all 6 RIASEC scores. The chart SHALL use Chart.js via react-chartjs-2 with responsive sizing, Bahasa Indonesia labels, and indexAxis set to 'y' for horizontal bars.

#### Scenario: Bar chart rendering
- **WHEN** KarirResults is mounted with scores R=8, I=10, A=3, S=2, E=1, C=4
- **THEN** a horizontal bar chart is rendered with 6 bars labeled "Realistis", "Investigatif", "Artistik", "Sosial", "Wirausaha", "Konvensional" and bar lengths proportional to each score

#### Scenario: All scores are zero
- **WHEN** all RIASEC scores are 0
- **THEN** the bar chart shows zero-length bars with a visible message "Belum ada data"

### Requirement: Top-3 Holland code display
KarirResults SHALL display the student's 3-letter Holland code (top 3 RIASEC types by score, e.g., "SIA") prominently in the results header area.

#### Scenario: Code with ties
- **WHEN** two or more RIASEC types have the same score competing for a position in the top 3
- **THEN** the system orders tied types alphabetically by their English letter code and selects the first 3

### Requirement: Personality card display
KarirResults SHALL display personality cards for the student's top 3 RIASEC types (or fewer if fewer than 3 types have scores greater than 0). Each card SHALL contain: a summary paragraph, a Sifat Utama (traits) list, a Preferensi (likes) list, and a Hal yang Dihindari (dislikes) list.

#### Scenario: Top-3 personality cards
- **WHEN** a student's top 3 types are Investigative, Social, and Artistic
- **THEN** three personality cards are rendered, each showing the type label, summary, Sifat Utama, Preferensi, and Hal yang Dihindari

#### Scenario: Only one matching type
- **WHEN** a student has only one RIASEC type with a score greater than 0
- **THEN** only one personality card is displayed for that type

### Requirement: Career tables with program studi recommendations
KarirResults SHALL display a career table for each of the top 3 personality types. Each table SHALL have 4 columns: No, Jenis Karir di Indonesia, Deskripsi Singkat, and Jurusan / Prodi Rekomendasi. Each personality type SHALL have exactly 10 curated careers with Indonesia-specific examples.

#### Scenario: Career table display
- **WHEN** KarirResults renders for a student with top types Realistic and Investigative
- **THEN** two career tables are shown, each listing exactly 10 professions with descriptions and program studi recommendations

#### Scenario: Career table columns
- **WHEN** a career table is rendered
- **THEN** the table SHALL contain columns: No, Jenis Karir di Indonesia, Deskripsi Singkat, Jurusan / Prodi Rekomendasi

## REMOVED Requirements

### Requirement: RIASEC radar chart
**Reason**: Replaced by horizontal bar chart for better readability
**Migration**: Remove Radar chart import and replace with Bar chart component using indexAxis: 'y'

### Requirement: Program studi recommendations
**Reason**: Replaced by per-career Jurusan/Prodi Rekomendasi column in career tables
**Migration**: Remove `getProgramStudiByCode` import and programStudi conditional rendering block from KarirResults. Delete `src/data/programStudi.ts`.

### Requirement: Career tables retained
**Reason**: Superseded by new career table requirement with different structure, column count, and career quantity
**Migration**: Career tables now have 4 columns and 10 careers per type instead of 3 columns and 25 careers per type
