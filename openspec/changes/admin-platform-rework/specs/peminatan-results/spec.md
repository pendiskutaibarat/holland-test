## MODIFIED Requirements

### Requirement: Peminatan result page rendering
When the user selected "peminatan" mode, the results step SHALL render the PeminatanResults component instead of the default KarirResults component. After rendering results, the system SHALL automatically submit results to the database via the API. The "Simpan Hasil ke Google Spreadsheet" and "Kirim ke Google Form" buttons SHALL be replaced with a status indicator showing submission state.

#### Scenario: Peminatan mode result display with auto-submission
- **WHEN** user completes all test sections and mode is "peminatan"
- **THEN** the system renders PeminatanResults with name, birthDate, test date, calculated IPA/IPS/Bahasa percentages, and auto-submits results to the database

#### Scenario: Submission success indicator
- **WHEN** auto-submission succeeds
- **THEN** the system displays "Hasil telah dikirim ke guru BK" below the results

#### Scenario: Submission failure with retry
- **WHEN** auto-submission fails
- **THEN** the system displays "Gagal mengirim hasil" with a "Coba Lagi" button