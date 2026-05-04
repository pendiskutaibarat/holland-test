## 1. Component Setup

- [x] 1.1 Create `src/components/LoadingButton.tsx` with the base component: accepts `loading`, `loadingText`, `disabled`, standard button props, and children. Renders spinner + text when loading, normal children when idle. Applies `disabled`, `opacity-70`, `cursor-not-allowed` when loading.
- [x] 1.2 Add icon-only mode support to `LoadingButton`: when loading, replace icon children with a spinner of matching size (w-4 h-4). Maintain button dimensions during transition.

## 2. Admin Login Page

- [x] 2.1 Replace the submit button in `src/app/admin/login/page.tsx` with `LoadingButton`. Pass `loading={loading}` and `loadingText="Masuk..."`. Default text: "Masuk".
- [x] 2.2 Add form-level disabling: when `loading` is true, disable all `<input>` fields and apply `opacity-50 pointer-events-none`.

## 3. Admin Dashboard

- [x] 3.1 Replace the "Buat Sesi" submit button in `DashboardClient.tsx` with `LoadingButton`. Pass `loading={loading}` and `loadingText="Membuat..."`.
- [x] 3.2 Add form-level disabling to the create-session form: disable all inputs/selects/textarea when `loading` is true.
- [x] 3.3 Add loading state to the "Keluar" (logout) button: add `logoutLoading` state, wrap button in `LoadingButton` with icon-only spinner mode.
- [x] 3.4 Add loading state to the toggle active checkbox: add `toggleLoadingId` state (string | null). Show spinner next to label, disable checkbox while request is in flight. Revert on failure.
- [x] 3.5 Add loading state to the delete session button: add `deleteLoadingId` state (string | null). Replace trash icon with spinner during request, disable button.

## 4. Session Detail Page

- [x] 4.1 Add loading state to the "Unduh CSV" (export CSV) button in `SessionDetailClient.tsx`: add `exporting` state, wrap in `LoadingButton` with `loadingText="Mengunduh..."`.

## 5. Verification

- [x] 5.1 Visually verify all buttons show spinner and disabled state during async operations. Verify no layout shift occurs on text buttons when switching between idle and loading states.