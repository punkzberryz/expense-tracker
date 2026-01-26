# RULES

## General

- Prefer `pnpm` for dependency management.
- Follow existing patterns and conventions in nearby files.
- Keep changes small and reviewable when possible.
- Run lint after big code changes.
- Update `docs/PLANS.md` when scope, priorities, or roadmap items change.
- Write useful, relevant commit messages.

## Code quality

- Add or update tests when changing behavior.
- Run lint/format checks when touching code quality concerns.
- Break large components into subcomponents.
- Keep page-level files around 200–300 lines for readability.
- Co-locate components with the route when they are page-specific; promote to `src/components/` when reused across routes.
- Use Zustand for global state management.
- Use local state where appropriate and optimize renders with proper state scoping.
- Use React Query for client-side data fetching.
- Send notifications with toasts for success, error, and info.

## Documentation

- Update docs when workflows or behavior change.
- Keep `docs/PLANS.md` current with roadmap changes.
