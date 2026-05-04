## Requirements

### Requirement: LoadingButton shows animated spinner during async actions
The system SHALL provide a `LoadingButton` component that displays an animated spinning indicator when the `loading` prop is true. The spinner SHALL use a border-based circle with `animate-spin` animation, sized 16x16 (w-4 h-4) for text buttons and matching the icon size for icon buttons.

#### Scenario: Button in idle state
- **WHEN** `loading` is false
- **THEN** the button renders its children (text or icon) normally with no spinner and no disabled state

#### Scenario: Button in loading state
- **WHEN** `loading` is true
- **THEN** the button renders an animated spinner before the text children, sets `disabled={true}`, applies `opacity-70` and `cursor-not-allowed`, and prevents click events

### Requirement: LoadingButton supports optional loading text replacement
The system SHALL allow an optional `loadingText` prop on `LoadingButton`. When provided and `loading` is true, the button SHALL display `loadingText` instead of its children.

#### Scenario: Loading with custom text
- **WHEN** `loading` is true and `loadingText` is "Membuat..."
- **THEN** the button displays the spinner followed by "Membuat..." instead of its default children

#### Scenario: Loading without custom text
- **WHEN** `loading` is true and `loadingText` is not provided
- **THEN** the button displays the spinner followed by its normal children text

### Requirement: LoadingButton works for icon-only buttons
The system SHALL support icon-only usage where the spinner replaces the icon content entirely when loading. The button SHALL maintain its dimensions during the transition to prevent layout shift.

#### Scenario: Icon button in loading state
- **WHEN** `loading` is true and the button contains only an icon (no text)
- **THEN** the spinner replaces the icon content, the button remains disabled, and button dimensions stay the same

### Requirement: Form inputs are disabled during submission
When a form submission is in progress, all input fields, selects, and textareas within the form SHALL be disabled and visually dimmed (`opacity-50`, `pointer-events-none`) to prevent edits during the async operation.

#### Scenario: Form inputs during submission
- **WHEN** a form's submit button is in loading state
- **THEN** all form `<input>`, `<select>`, and `<textarea>` elements SHALL have `disabled`, `opacity-50`, and `pointer-events-none` applied

#### Scenario: Form inputs after submission completes or fails
- **WHEN** the form's submit button returns to idle state
- **THEN** all form inputs SHALL be re-enabled and restored to full opacity

### Requirement: Toggle active checkbox shows loading state
The toggle active checkbox on the dashboard SHALL display a spinner indicator next to the checkbox label while the toggle request is in flight. If the request fails, the checkbox SHALL revert to its previous state.

#### Scenario: Successful toggle
- **WHEN** user clicks the active checkbox
- **THEN** a spinner appears next to the label, the checkbox is disabled during the request, and on success the spinner disappears and the checkbox reflects the new state

#### Scenario: Failed toggle
- **WHEN** user clicks the active checkbox and the request fails
- **THEN** the checkbox SHALL revert to its previous checked state and the spinner disappears

### Requirement: Delete session button shows loading state
The delete session button SHALL show a spinner replacing the trash icon while the delete request is in flight and SHALL be disabled to prevent double-click.

#### Scenario: Deleting a session
- **WHEN** user confirms deletion and the request is in flight
- **THEN** the trash icon is replaced by a spinner, the button is disabled, and on success the session row is removed from the list

### Requirement: Logout button shows loading state
The logout button SHALL show a spinner and disabled state while the logout request is in flight.

#### Scenario: Logging out
- **WHEN** user clicks the logout button
- **THEN** the button shows a spinner, is disabled, and on completion redirects to the login page

### Requirement: Export CSV button shows loading state
The export CSV button on the session detail page SHALL show a spinner and disabled state while generating and downloading the CSV file.

#### Scenario: Exporting CSV
- **WHEN** user clicks the export CSV button
- **THEN** the button shows a spinner with text "Mengunduh..." (or the localized equivalent), is disabled, and on completion returns to idle state