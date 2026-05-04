## ADDED Requirements

### Requirement: Mode selector screen
The system SHALL present a mode selector screen as step 0 of the wizard, before user info input. The screen SHALL display two options: "Peminatan SMA/MA" (Option A) and "Karir & Program Studi" (Option B). Each option SHALL include a title, a brief description of purpose, and a distinct visual card or button.

#### Scenario: User selects Peminatan mode
- **WHEN** user clicks the "Peminatan SMA/MA" option
- **THEN** the system stores `mode: "peminatan"` in state and advances to step 1 (user info)

#### Scenario: User selects Karir mode
- **WHEN** user clicks the "Karir & Program Studi" option
- **THEN** the system stores `mode: "karir"` in state and advances to step 1 (user info)

### Requirement: Mode persists in localStorage
The system SHALL persist the selected mode to localStorage under the key `holland-test-state` alongside other test state. On page load, if a stored mode exists, the system SHALL skip the mode selector and resume the test from the stored step.

#### Scenario: Returning user with saved state
- **WHEN** user reloads the page after selecting a mode and starting the test
- **THEN** the system restores mode, name, birthDate, selections, and currentStep from localStorage and renders the appropriate step

#### Scenario: Fresh user with no saved state
- **WHEN** user loads the page with no localStorage data
- **THEN** the system displays the mode selector screen (step 0)

### Requirement: Restart functionality
The system SHALL provide a "Mulai Ulang" (restart) button on the mode selector screen (visible when stored state exists). Clicking it SHALL clear all localStorage data and reset state to initial values.

#### Scenario: User clicks restart
- **WHEN** user clicks "Mulai Ulang" on the mode selector
- **THEN** localStorage is cleared, all state resets to defaults, and the mode selector is displayed fresh

### Requirement: Total step count update
The wizard total step count SHALL increase from 8 to 9 to accommodate the mode selector as step 0. The progress bar SHALL reflect this update.

#### Scenario: Progress bar shows 9 steps
- **WHEN** user is on step 1 (user info)
- **THEN** the progress bar shows step 1 of 9 (or equivalent visual indicator)

### Requirement: Mode type definition
The system SHALL define a `Mode` type with values `"peminatan"` and `"karir"`. This type SHALL be stored in `src/data/types.ts`.

#### Scenario: Type usage
- **WHEN** any component accesses the mode state
- **THEN** the mode value conforms to the `Mode` type (`"peminatan"` or `"karir"`)