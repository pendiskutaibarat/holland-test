## REMOVED Requirements

### Requirement: Google Form auto-fill URL generation
**Reason**: Replaced by database submission. Google Form integration is no longer needed as results are stored in PostgreSQL.
**Migration**: The "Kirim ke Google Form" button and `buildGoogleFormUrl` utility are removed entirely. Students submit results via the database API instead.

### Requirement: Configurable Form ID and entry fields
**Reason**: Google Form configuration is no longer needed without Google Form integration.
**Migration**: `src/config.ts` Google Form constants and `src/utils/googleFormUrl.ts` are removed.

### Requirement: Keep existing Google Sheets save functionality
**Reason**: The `SaveButton` component that POSTs to Google Apps Script is replaced by automatic database submission on test completion.
**Migration**: `src/components/SaveButton.tsx` is removed. Result submission happens automatically via `POST /api/results` on test completion.

## MODIFIED Requirements

### Requirement: Karir result page rendering
When the user selected "karir" mode, the results step SHALL render the KarirResults component. This component SHALL evolve from the current ResultsDisplay with added radar chart, badge, and program studi cluster features. After rendering results, the system SHALL automatically submit results to the database via the API. The "Simpan Hasil ke Google Spreadsheet" and "Kirim ke Google Form" buttons SHALL be replaced with a status indicator showing submission state.

#### Scenario: Karir mode result display with auto-submission
- **WHEN** user completes all test sections and mode is "karir"
- **THEN** the system renders KarirResults with name, birthDate, test date, radar chart, badge, top-2 personality descriptions, career tables, Holland code, program studi clusters, and full score summary, then automatically submits results to the database

#### Scenario: Submission success indicator
- **WHEN** auto-submission succeeds
- **THEN** the system displays "Hasil telah dikirim ke guru BK" below the results

#### Scenario: Submission failure with retry
- **WHEN** auto-submission fails
- **THEN** the system displays "Gagal mengirim hasil" with a "Coba Lagi" button that retries submission