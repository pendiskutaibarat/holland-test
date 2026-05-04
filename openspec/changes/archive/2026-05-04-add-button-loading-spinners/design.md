## Context

The app is a Holland RIASEC personality test platform with an admin dashboard and a student test flow. Currently, async user interactions have inconsistent or absent loading feedback:

- **Good pattern**: `WizardContainer` uses a state machine (`idle` → `submitting` → `success`/`error`/`duplicate`) with an animated spinner (`animate-spin` on a border-based circle) and colored banners.
- **Text-only pattern**: Login and Create Session buttons swap text ("Masuk" → "Masuk...") but show no animation.
- **No feedback**: Toggle active, delete session, logout, and export CSV have zero loading indication.

The app uses Tailwind CSS and no external UI component library. All buttons are styled inline with Tailwind classes.

## Goals / Non-Goals

**Goals:**
- Provide clear, animated visual feedback on every async button action
- Prevent double-submission by disabling buttons during async operations
- Create a reusable component so all buttons share consistent behavior
- Dim/freeze surrounding form inputs while submitting to prevent edits

**Non-Goals:**
- Adding `loading.tsx` route-level skeletons (separate concern)
- Adding global navigation progress indicators (NProgress etc.)
- Changing the existing submission status banners in WizardContainer (they work well)
- Adding toast/notification system for failed operations (future scope)

## Decisions

### 1. `LoadingButton` component over individual inline implementations

**Choice**: Create a single `<LoadingButton>` component used everywhere.

**Rationale**: The app has 6+ async button locations. A shared component guarantees consistency (same spinner, same disabled behavior, same text swap pattern) and makes future changes trivial.

**Alternative considered**: Copy-paste the pattern into each button. Rejected — drift is inevitable with 6+ locations.

### 2. Spinner design: Tailwind border-spinner (matching existing pattern)

**Choice**: Use the same `animate-spin` + border trick already in `WizardContainer`:
```
<span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
```

**Rationale**: Already in the codebase, consistent appearance, no external dependency, works with Tailwind color inheritance.

**Alternative considered**: SVG spinner or external library. Rejected — unnecessary dependency for a single animation.

### 3. Component API: `loading` prop + children pattern

**Choice**: `<LoadingButton loading={isSubmitting} ...>Submit</LoadingButton>`

When `loading={true}`:
- Prepends the animated spinner before children text
- Applies `disabled:cursor-not-allowed` and `disabled:opacity-70`
- Sets `disabled={true}` on the underlying `<button>`
- Accepts `loadingText` prop for optional text replacement (e.g., "Membuat..." instead of "Buat Sesi")

**Rationale**: Keeps the component simple — parent manages loading state, button just renders it. Avoids over-abstraction.

**Alternative considered**: `onClick` async wrapper that auto-manages loading. Rejected — some handlers have multiple async steps or conditional logic (the existing `handleToggleActive` doesn't always follow a single promise).

### 4. Icon buttons get a replacement spinner pattern

**Choice**: For icon-only buttons (delete, logout, external-link), when loading, replace the icon with the spinner of the same size. Keep the button's existing dimension so layout doesn't shift.

**Rationale**: Icon buttons can't show text. Replacing the icon with a same-sized spinner is the clearest signal.

### 5. Form-level disabling for forms with multiple inputs

**Choice**: When the Login form or Create Session form is submitting, all `<input>`, `<select>`, and `<textarea>` elements receive `disabled` and `opacity-50 pointer-events-none`.

**Rationale**: Prevents the user from modifying data that's already being submitted. Reduces confusion about what's happening.

## Risks / Trade-offs

- **[Layout shift on text change]** → `loadingText` is optional. If used, the button should have `min-width` via the natural width of the loading text to avoid size jumps. Alternative: always size to the wider of the two states via `inline-flex` and consistent padding.
- **[Icon button ambiguity]** → An icon replaced by a spinner might confuse users who don't know what the spinner means. Mitigation: the spinner replaces the icon only momentarily during the async action; the action was initiated by the user so context is clear.
- **[Toggle checkbox optimistic update]** → The current toggle active handler switches the checkbox immediately. The proper pattern is to either (a) show spinner on the checkbox until confirmed, or (b) use optimistic update with rollback on error. Decision: show a brief spinner state on the checkbox label and revert on failure with no error toast (keep it simple).