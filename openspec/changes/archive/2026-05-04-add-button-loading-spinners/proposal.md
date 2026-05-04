## Why

Multiple user interactions across the app provide no visual feedback during async operations. Admin actions like toggling session active state, deleting sessions, and logging out have zero loading indication — users can double-click or think the app is broken. Even buttons that swap text ("Masuk" → "Masuk...") lack an animated spinner, making them feel unresponsive. The test submission flow in WizardContainer already demonstrates a good pattern (animated spinner + status banners), but it's the only place in the app that does.

## What Changes

- Add an animated spinner to every button that triggers an async operation
- Disable and visually freeze the surrounding form while submitting
- Add loading/disabled state to action buttons that currently have no feedback: toggle active, delete session, logout, export CSV
- Extract a reusable `LoadingButton` component to ensure consistent spinner + disabled behavior across all instances
- Replace existing text-only loading states (login, create session) with the spinner-enhanced version

## Capabilities

### New Capabilities
- `loading-button`: A reusable button component that shows an animated spinner and disables interaction during async operations. Covers spinner animation, text swap, and form-level disabled state.

### Modified Capabilities
<!-- No existing specs are being modified — this is purely a UI enhancement to existing components -->

## Impact

- `src/components/LoadingButton.tsx` (new)
- `src/app/admin/login/page.tsx` — login button
- `src/app/admin/dashboard/DashboardClient.tsx` — create session, toggle active, delete session, logout buttons
- `src/app/admin/sessions/[sessionId]/SessionDetailClient.tsx` — export CSV, copy link buttons