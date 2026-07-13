# CLIuno Next template

Next.js 15 (app router) + TypeScript SPA-style client implementing the CLIuno demo app
(auth, todos, posts+comments, users, follows) against the shared CLIuno REST contract.

## Commands

```bash
pnpm dev          # next dev --turbopack on :5002
pnpm build        # next build
pnpm start        # next start
pnpm lint         # oxlint
pnpm type-check   # tsc --noEmit
pnpm format       # oxfmt src/
```

## Structure

- `src/apis/` — the API layer (`auth-api`, `user-api`, `todo-api`, `post-api`,
  `follow-api`) on an axios instance in `http.ts`; base URL from
  `NEXT_PUBLIC_API_BASE` (default `http://localhost:3000/api/v1`); Bearer token from
  localStorage with `typeof window` guards (SSR-safe), 401 → redirect to `/login`.
- `src/stores/auth.ts` — zustand store (`'use client'`, hydrate() reads localStorage
  in an effect — never at module scope, that breaks SSR).
- `src/app/*` — pages are client components (`'use client'`): login, register,
  forgot-password, todos(+[id]), posts(+[id]), users(+[id]), profile.
- Explicit React imports everywhere — this template does NOT use auto-imports.

## The API contract (what backends guarantee)

Login sends `{usernameOrEmail, password}` and reads `data.token`. Responses are
`{status, message, data}` with exact keys `data.users/user/todos/todo/posts/post/`
`followers/following/isFollowing`. Any CLIuno backend template serves this contract.
Keep all URLs inside `src/apis/`.

## Conventions

oxc tooling (`semi: false`, single quotes); prettier for css/md/json; Tailwind v4 (no
prefix) + shadcn/ui on Base UI primitives (`src/components/ui/`, `cn()` in
`src/lib/utils.ts`, theme tokens in `src/assets/globals.css`, dark mode = `.dark` class);
conventional commits (commitlint + husky).
