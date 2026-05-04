## ADDED Requirements

### Requirement: PDF download button
The results page (both PeminatanResults and KarirResults) SHALL include a "Unduh PDF" button that generates and downloads a one-page PDF of the test results.

#### Scenario: User clicks PDF download on KarirResults
- **WHEN** user clicks "Unduh PDF" on the Karir results page
- **THEN** the system uses html2pdf.js to capture the result content area and downloads a PDF file named "Hasil-Tes-Holland-{name}-{date}.pdf"

#### Scenario: User clicks PDF download on PeminatanResults
- **WHEN** user clicks "Unduh PDF" on the Peminatan results page
- **THEN** the system generates a PDF containing the bar chart, percentages, narrative descriptions, and RIASEC score summary

### Requirement: PDF content completeness
The generated PDF SHALL include: student name, birth date, test date, the appropriate chart (radar or bar), Holland code or peminatan percentages, personality descriptions or narrative, and career/program recommendations where applicable.

#### Scenario: PDF contains all required fields
- **WHEN** a PDF is generated from KarirResults
- **THEN** the PDF contains name, birthDate, testDate, radar chart image, Holland code badge, top-2 personality descriptions with career tables, and score summary

#### Scenario: PDF contains peminatan fields
- **WHEN** a PDF is generated from PeminatanResults
- **THEN** the PDF contains name, birthDate, testDate, bar chart, percentage breakdown, narrative descriptions, and score summary

### Requirement: html2pdf.js lazy loading
The html2pdf.js library SHALL be dynamically imported only when the PDF generation function is called, not bundled with the initial page load.

#### Scenario: Library not loaded on page open
- **WHEN** the results page first renders
- **THEN** html2pdf.js is not yet loaded in the browser's memory

#### Scenario: Library loaded on download click
- **WHEN** user clicks "Unduh PDF"
- **THEN** html2pdf.js is dynamically imported and executed