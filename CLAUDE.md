# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Where new rules go**: this file, not auto-memory. When the user corrects how you work or states a convention, write it here so it is versioned and visible to the whole team — never into the private memory directory.

## Working Agreement

- **One branch per ticket.** The branch name carries the ticket number, and commits on it use that number. Work spanning several tickets in one branch needs a stated reason.
- **Land each finished piece before starting the next**, so the working tree holds one ticket at a time.
- **Show the diff and name the ticket before moving on.** Group the change by intent — tooling, autofix, hand-fixed findings — and say which files fall in each group. A long unbroken run of edits across many files is unreviewable, however sound each edit is.

## Common Development Commands

```bash
npm run build_interfaces  # Generate TS interfaces from OpenAPI (required before dev)
npm start                 # Dev server with HTTPS + hot reload
npm run build             # Production build
npm run build.watch       # Dev build with watching
npm test                  # Unit tests
npm run test.watch        # Watch unit tests
npm run release           # Local release with version bump
npm run release.ci        # CI release
```

**E2E is not maintained** — `npm run test.e2e` / `npm run test.watchE2E` do not currently run. Don't use them to validate changes; rely on unit tests plus a manual check in the dev server.

**Clearing `dist/`**: remove `.stencil` alongside it. `rm -rf dist` on its own leaves the build cache, the next build emits a partial `dist/`, and the Storybook build then fails on it with `Could not resolve "../../dist/loader"` — which reads like a code fault rather than a stale cache.

**OpenAPI sync**: Local spec at `openapi/merchant-openapi.yaml` must be kept in sync with upstream. Run `npm run update.openapi` to fetch latest (requires `gh` CLI auth). CI uses the committed local file.

## Architecture Overview

**Technology Stack**: Stencil.js web components, TypeScript, PostCSS, Jest, Storybook.

**Main Widgets**:

- `vviinn-vps-widget`: Visual Product Search (modal-based image search)
- `vviinn-vpr-widget`: Visual Product Recommendations
- `vviinn-shop-the-look`: Interactive image hotspots with product recommendations
- `vviinn-vps-button` / `vviinn-vpr-button`: Trigger buttons. `vviinn-text-search` in `mode="extended"` renders `vviinn-vps-button` internally to handle image upload.
- `vviinn-cropper`: Image cropping interface with geometry validation
- `vviinn-product-card`: Product display with intersection tracking
- `vviinn-filters` / `vviinn-extended-filters` / `vviinn-selected-filters`: filter row, modal and chips. Public, usable standalone alongside `vviinn-results`.
- `vviinn-suggestions`: AI suggestions. Rendered only inside `vviinn-vps-widget`, so it is absent from standalone-component integrations.

Global CSS variables in `src/variables.css`.

**Two integration shapes**: the widget (`vviinn-vps-button` → `vviinn-vps-widget`), or standalone components wired together by events. Anything living only inside the widget is absent from the standalone shape — check which one you are reasoning about before concluding a feature is broken.

**Event reach**: `@Listen` without a target binds to the host, so it only sees events from its own subtree. Cross-component wiring uses `addEventListenersWithSignal(document, …)`, which sees them wherever they originate.

## Code Style Guidelines

**Stencil Components**:

- Class-based components for main components with state/lifecycle
- Document props with inline comments above @Prop when used in Storybook Playground or behavior is non-obvious
- Shadow DOM for encapsulation
- `@Prop` for public API, `@State` for internal state, `@Event` for custom events

**TypeScript**:

- Always type props, state, and events explicitly
- Avoid `any`, use `unknown` or specific types
- **Prefer arrow functions** for utility/helper files, **regular functions** for class methods
- **Object Comparison**: NEVER use `===` for comparing objects. Compare individual properties or use deep comparison

**CSS & Styling**:

- Use CSS variables from `src/variables.css` for colors, spacing, border-radius, typography
- Spacing variables (--spacing-\*) only for margins, padding, gaps — NOT for width/height
- Avoid `!important` — use proper CSS specificity
- Minimal CSS comments: only for non-obvious layout logic

**Code Quality**:

- **DRY**: Check for existing types, constants, and functions before creating new ones. Search component folder first (`types.ts`, `helpers.ts`, `constants.ts`), then project-level (`/src/interfaces/`, `/src/geometry/`, `/src/constants/`)
- **Component Organization**: Main file focused on state/lifecycle. Extract rendering to `render-helpers.tsx`, utilities to `helpers.ts`
- **CSS-First**: Prioritize CSS over JS for positioning and layout
- **Class Maps**: `{ 'base': true, active: this.isActive, [this.variant]: !!this.variant }`
- **Adding @Prop()**: See `/add-prop` command. ALWAYS update Storybook story when adding props.
- **Comments**: comment the _why_, not the _what_ — intent, non-obvious decisions, edge cases, constraints the code can't express itself. Skip comments that restate the code; prefer self-documenting names. Delete stale ones with the code they described. Default one line, two-line ceiling — past that, extract a named helper/variable or move the rationale into the function's JSDoc. In tests, only comment what the name itself can't carry (a hidden precondition, a hidden dependency of an assertion) — restating the test name or the tested function's JSDoc is noise. No change history: describe the code as it stands, never how it got there (no "now"/"no longer"/"instead of", no naming a rejected alternative) — that belongs in commits and the PR description.
- **Punctuation in comments & docs**: use an em dash (—), not a hyphen (-) or en dash (–).
- **Component JSDoc**: the `@part` / `@slot` / `@cssprop` JSDoc block must sit **immediately above `@Component`** with no declaration in between — otherwise Stencil attaches it to that declaration and the docs (Storybook Controls table via `docs.json`) lose the parts/slots.

## Git Commit Conventions

- **Commit only when asked.** Finishing a task means leaving the changes in the working tree and reporting them — the commit is a separate request. An approved plan, an approved branch, and green tests are not permission to commit; neither are the conventions below, which say how to word a commit message, not when to make one. Same for `push` and opening a PR. A confirmation prompt on `git commit`/`git push` is expected, not a malfunction.
- **User-facing changes** — `feat:` for features, `fix:` for fixes. These land in the user-facing changelog, so write them for end users. Semi-free form: add a `Component Name:` segment when the change targets one component (`feat: Vviinn Cropper: toggle cropper visibility by OCR filter`), otherwise a plain summary for cross-cutting changes (`fix: Restore missing CSS parts & slots in component docs`).
- **Routine work** (intermediate fixes, chores, review changes, refactors) — `#<ticket> Description`, where `<ticket>` is the number from the branch name (e.g. `#39690 Ignore local Claude settings file`). No `feat:`/`fix:`/`chore:` prefix.
- **Automation** (releases, CI, changelog bumps) — prefix with `[skip ci]`.
- **Avoiding a version bump**: `commit-and-tag-version` bumps at least the patch version on any commit, regardless of prefix (`chore:` included) — `[skip ci]` is the only reliable way to land a commit without triggering a release.
- **Subject line only** — no body, no bullet lists, no rationale paragraph, even when the change spans several files and fixes several things. "Semi-free form" above refers to the subject's wording, not permission to add a body. Explain the mechanism in the PR description, not in the commit.
- **No `Co-Authored-By` trailers** — do not append `Co-Authored-By` (or other AI-attribution) lines to commit messages.

## Key Patterns

| Pattern | Path | Note |
|---|---|---|
| Slot System | `src/components/customized-slots.tsx` | `/add-slot` to add slots to components |
| CSS Parts System | `src/cssParts/` | `/add-css-part` to add parts |
| Interface Types | `/src/interfaces/` (`product.ts`, `search.ts`, `discovery.ts`, `interactions.ts`) | `/add-interface-type`; never import `generated.ts` directly — use the domain alias |
| Intersection Observer | `/src/dom/intersectionObserver.ts` | consolidated utility |
| Responsive Detection | `/src/helpers/device/checkDeviceType.ts` | user-agent + viewport based |
| Swiper | custom elements `<swiper-container>`/`<swiper-slide>`, registered via `import { register } from 'swiper/element'`; utils at `/src/utils/swiper/swiperUtils.ts` | |
| Storybook | `storybook/stories/` | glob `**/*component-name*.stories.*` to find a component's stories |

## Browser Testing

See `/browser-test` command. Shadow DOM requires JS access via `element.shadowRoot.querySelector()`.

## Environment Configuration

- `OPENAPI_URL` in `.env` — points to local OpenAPI spec for interface generation
- `ENV=local` — HTTPS dev server
- `ENV=production` — optimized builds

**Local secrets** — supplied per developer, never in tracked files:

- `storybook/.env.local` — Storybook demo tokens (`STORYBOOK_TOKEN_*`). Copy `storybook/.env.local.example` and fill it in. Cloud Build injects the same names from Secret Manager.
- `vviinn-dev-token` in `localStorage` — token for the `npm start` dev harness (`src/index.html`).

## MCP Integration

Project MCP config: `.mcp.json` (root).

@CLAUDE.local.md
