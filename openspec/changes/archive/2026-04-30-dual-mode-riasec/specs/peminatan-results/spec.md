## ADDED Requirements

### Requirement: Peminatan result page rendering
When the user selected "peminatan" mode, the results step SHALL render the PeminatanResults component instead of the default KarirResults component.

#### Scenario: Peminatan mode result display
- **WHEN** user completes all test sections and mode is "peminatan"
- **THEN** the system renders PeminatanResults with name, birthDate, test date, and calculated IPA/IPS/Bahasa percentages

### Requirement: Peminatan bar chart
The PeminatanResults component SHALL display a horizontal bar chart showing the percentage for each peminatan group (IPA, IPS, Bahasa). Each bar SHALL use a distinct color and display the percentage label. The implementation SHALL use Tailwind CSS (no charting library).

#### Scenario: Bar chart rendering
- **WHEN** a peminatan result has IPA=62%, IPS=28%, Bahasa=10%
- **THEN** three bars are displayed with widths proportional to percentages, each showing its label and value

#### Scenario: Very small percentage
- **WHEN** a peminatan group has less than 5%
- **THEN** the bar is still visible with a minimum width and the percentage label remains readable

### Requirement: Peminatan narrative descriptions
For each peminatan group with a non-trivial percentage (≥10%), PeminatanResults SHALL display a narrative card explaining why the student leans toward that group, referencing their dominant RIASEC types.

#### Scenario: Multiple dominant groups
- **WHEN** a student has IPA=55%, IPS=35%, Bahasa=10%
- **THEN** narrative descriptions are shown for IPA and IPS (≥10%), and Bahasa is shown with a note about cross-interest

#### Scenario: Single dominant group
- **WHEN** a student has IPA=80%, IPS=12%, Bahasa=8%
- **THEN** only IPA receives a full narrative, while the other two show brief notes

### Requirement: Peminatan subject recommendations
Each peminatan group in the results SHALL list the relevant school subjects associated with that peminatan (e.g., IPA: Fisika, Kimia, Biologi, Matematika).

#### Scenario: Subject list display
- **WHEN** the IPA group is shown
- **THEN** subjects "Fisika, Kimia, Biologi, Matematika" are listed below or within the IPA result card

### Requirement: Peminatan results show full RIASEC scores
PeminatanResults SHALL include a summary section showing all 6 RIASEC type scores (the same "Detail Semua Hasil" section as KarirResults) so students can see their underlying profile.

#### Scenario: Score summary display
- **WHEN** peminatan results are rendered
- **THEN** all 6 RIASEC scores are listed with labels and point values