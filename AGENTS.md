# Repository Guidelines

## Project Structure & Routes
- `app/` hosts the App Router with providers/fonts in `layout.tsx`; `components/` carries shadcn UI, `content/` keeps MDX via `lib/mdx`, `public/brand` stores logos, hero art lives in `public/images/backgrounds`.
- Public routes: `/`, `/about`, `/posts`, `/posts/[slug]`, `/gallery`, `/forum`, `/forum/[id]`, `/join`, `/privacy`, `/terms`; hold `/events` and `/partners` until content ships.
- Admin suite: `/admin/login`, `/admin`, `/admin/posts/new`, `/admin/posts/[id]/edit`, `/admin/media`, `/admin/forum/moderation` behind middleware + Server Actions.
- Custom errors reside in `app/not-found.tsx` (compass 404) and `app/error.tsx` (retry CTA/reporting).

## Navigation & UI Details
- Header: compass button (`/public/brand/compass-logo.jpg`) links home, menu stays right; on the landing view start transparent, lock to `bg-brand-navy/95` after scroll.
- Hero art sources `/images/backgrounds` or `/images/gallery/welcome.jpg` under a navy overlay; headline reads “Делаем город ярче! 🎨 События, гик-культура, креатив тусовки — всё здесь, в Фарватер 𝕋𝕖𝕒𝕞”.
- CTAs: “Присоединиться” → `/join`, “Поддержать” → `#` (TODO) via `btn-primary`/`btn-outline`.
- `/about` adds a social block beneath the mission text with large shadcn buttons; posts pagination aligns right with `bg-brand-sea` active chips, forum moderation mirrors those cards.

## Build, Test, and Development Commands
- `npm run dev` runs the strict TS dev server; `npm run build` emits the production bundle with TS + Tailwind checks.
- `npm run start` serves the optimized output; `npm run lint` covers Next/Tailwind/shadcn rules and `npm run format` applies Prettier.
- `npm run test` triggers Vitest + Testing Library; add `CI=1` for strict snapshots.

## Coding Style & Naming Conventions
- Keep TypeScript `strict`, annotate exports, prefer discriminated unions for UI states.
- Extend `tailwind.config.ts` with `brand.navy '#002A4C'`, `ice '#A8D6E5'`, `sea '#70A2B8'`, `deep '#1D4967'`, `steel '#45728C'`.
- Define `fontFamily.heading/body/script`; register Manrope, Sturkopf Grotesk, The Youngest Script, Nauryz Red Keds, RS RockStar through `@font-face` in `styles/globals.css`, and suffix variants BEM-style (`button--ghost`).

## Testing Guidelines
- Co-locate specs as `Component.test.tsx` using Vitest + Testing Library with `next-router-mock`.
- Maintain ≥80% coverage via `coverage.thresholds` in `vitest.config.ts`.
- Snapshot only stable shells; favour role/text queries over `data-testid`.

## Branding & Assets
- Dark surfaces pair `bg-brand-navy` with `text-brand-ice`; accents lean on `border-brand-sea`, `text-brand-steel`, hover `text-brand-deep`.
- Rotate hero/campaign art through `ECOquiz-bg*.png` with gradient overlays and descriptive alt text.
- Icons stay on `lucide-react`; load imagery and fonts locally with Next tooling.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`) and keep scope tight to a feature or route.
- PRs summarise impact, list executed scripts (`dev`, `lint`, `test`), and attach refreshed UI screenshots.
- Reference the Linear/Jira ticket and request branding + frontend reviewers before merge.
