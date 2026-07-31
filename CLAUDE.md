# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Where new rules go**: this file, not auto-memory. When the user corrects how you work or states a convention, write it here so it is versioned and visible to the whole team — never into the private memory directory.

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

**Prop forwarding chains**: a prop that must reach every component has to be copied by hand at each of these hops. All are optional props with defaults, so a missed hop is not a compile error — it silently falls back to the default.

```
vviinn-text-search → vviinn-vps-button → vviinn-vps-widget → vviinn-results
vviinn-results → vviinn-vpr-button → vviinn-recommendations-sidebar → vviinn-vpr-widget
```

Two hops are easy to overlook. `vviinn-results` starts the second chain from inside a `.map()` over results, in a `vviinn-product-card` slot, behind a One-Click Discovery condition that is on under default props (`oneClickDiscoveryMode` defaults to `"append-grid"`; only `"unset"` turns it off). `vviinn-vpr-button` then builds the sidebar imperatively via `document.createElement`, assigning each prop on its own line.

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
- **Comments**: comment the _why_, not the _what_ — explain intent, non-obvious decisions, edge cases, and constraints the code can't express itself. Skip comments that restate the code; prefer self-documenting names over a comment. Keep them short and to the point; delete stale ones with the code they described.
  - **Size**: default to a single line. Two lines is the ceiling for inline comments — if the _why_ needs more, extract a named helper/variable or move the rationale into the function's JSDoc instead. One focused sentence beats a paragraph.
  - **In tests the name is the documentation**: a comment above `it(...)` is only worth it when it carries something the name should not — a non-obvious precondition, an assertion's hidden dependency, a pointer to outside context. Restating the test name, or the JSDoc of the function under test, is noise.
  - **No change history**: describe the code as it stands, never how it got there. No "now", "no longer", "instead of the previous", no naming a rejected alternative. The reader has only the current code — the old behaviour is invisible to them, and within a single PR it never existed on the branch they are reading. Diffs, commits and the PR description are where change belongs.
- **Punctuation in comments & docs**: use an em dash (—), not a hyphen (-) or en dash (–).
- **Component JSDoc**: the `@part` / `@slot` / `@cssprop` JSDoc block must sit **immediately above `@Component`** with no declaration in between — otherwise Stencil attaches it to that declaration and the docs (Storybook Controls table via `docs.json`) lose the parts/slots.

## Git Commit Conventions

- **User-facing changes** — `feat:` for features, `fix:` for fixes. These land in the user-facing changelog, so write them for end users. Semi-free form: add a `Component Name:` segment when the change targets one component (`feat: Vviinn Cropper: toggle cropper visibility by OCR filter`), otherwise a plain summary for cross-cutting changes (`fix: Restore missing CSS parts & slots in component docs`).
- **Routine work** (intermediate fixes, chores, review changes, refactors) — `#<ticket> Description`, where `<ticket>` is the number from the branch name (e.g. `#39690 Ignore local Claude settings file`). No `feat:`/`fix:`/`chore:` prefix.
- **Automation** (releases, CI, changelog bumps) — prefix with `[skip ci]`.
- **Subject line only** — no body, no bullet lists, no rationale paragraph, even when the change spans several files and fixes several things. "Semi-free form" above refers to the subject's wording, not permission to add a body. Explain the mechanism in the PR description, not in the commit.
- **No `Co-Authored-By` trailers** — do not append `Co-Authored-By` (or other AI-attribution) lines to commit messages.

## Key Patterns

**Slot System**: Centralized in `src/components/customized-slots.tsx`. See `/add-slot` command for adding slots to components.

**CSS Parts System**: Centralized in `src/cssParts/`. See `/add-css-part` command for adding parts.

**Interface Types**: Domain-specific aliases in `/src/interfaces/` (product.ts, search.ts, discovery.ts, interactions.ts). See `/add-interface-type` command. Never import directly from `generated.ts` — use domain aliases.

**Intersection Observer**: Consolidated utility at `/src/dom/intersectionObserver.ts`.

**Responsive Detection**: `/src/helpers/device/checkDeviceType.ts` — supports both user-agent and viewport-based detection.

**Swiper**: Custom elements (`<swiper-container>`, `<swiper-slide>`). Register via `import { register } from 'swiper/element'`. Utils at `/src/utils/swiper/swiperUtils.ts`.

**Storybook**: Stories live in `storybook/stories/`. Glob for `**/*component-name*.stories.*` to find them.

## Browser Testing

See `/browser-test` command. Shadow DOM requires JS access via `element.shadowRoot.querySelector()`.

## Environment Configuration

- `OPENAPI_URL` in `.env` — points to local OpenAPI spec for interface generation
- `ENV=local` — HTTPS dev server
- `ENV=production` — optimized builds

## MCP Integration

Project MCP config: `.mcp.json` (root).
