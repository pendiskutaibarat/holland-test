## ADDED Requirements

### Requirement: Google Form auto-fill URL generation
The results page (both PeminatanResults and KarirResults) SHALL display a "Kirim ke Google Form" button that constructs a Google Form pre-fill URL with the student's test results as query parameters.

#### Scenario: Karir mode URL construction
- **WHEN** user clicks "Kirim ke Google Form" on KarirResults
- **THEN** the system constructs a URL: `https://docs.google.com/forms/d/e/{FORM_ID}/viewform?entry.NAME={name}&entry.CODE={hollandCode}&entry.R={score}&entry.I={score}&entry.A={score}&entry.S={score}&entry.E={score}&entry.C={score}` and opens it in a new tab

#### Scenario: Peminatan mode URL construction
- **WHEN** user clicks "Kirim ke Google Form" on PeminatanResults
- **THEN** the system constructs a URL including name, date, IPA percentage, IPS percentage, Bahasa percentage, and raw RIASEC scores as query parameters, and opens it in a new tab

### Requirement: Configurable Form ID and entry fields
The Google Form ID and entry field IDs SHALL be stored in `src/config.ts`. The default Form ID MAY be empty string, in which case the "Kirim ke Google Form" button SHALL not be rendered.

#### Scenario: No Form ID configured
- **WHEN** FORM_ID is empty or not configured in config.ts
- **THEN** the "Kirim ke Google Form" button is hidden from both result pages

#### Scenario: Form ID is configured
- **WHEN** FORM_ID is set to a valid Google Form ID
- **THEN** the "Kirim ke Google Form" button is visible and functional

### Requirement: Keep existing Google Sheets save functionality
The existing SaveButton (Google Apps Script POST) SHALL remain functional in both KarirResults and PeminatanResults. The submission payload SHALL include the `mode` field indicating whether the test was peminatan or karir.

#### Scenario: Peminatan mode submission
- **WHEN** user clicks "Simpan Hasil ke Google Spreadsheet" in PeminatanResults
- **THEN** the payload includes mode="peminatan" along with existing fields plus IPA/IPS/Bahasa percentages

#### Scenario: Karir mode submission  
- **WHEN** user clicks "Simpan Hasil ke Google Spreadsheet" in KarirResults
- **THEN** the payload includes mode="karir" along with existing fields