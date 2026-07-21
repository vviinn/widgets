# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
npm run build_interfaces  # Generate TS interfaces from OpenAPI (required before dev)
npm start                 # Dev server with HTTPS + hot reload
npm run build             # Production build
npm run build.watch       # Dev build with watching
npm test                  # Unit tests
npm run test.e2e          # E2E tests
npm run test.watch        # Watch unit tests
npm run test.watchE2E     # Watch E2E with devtools
npm run release           # Local release with version bump
npm run release.ci        # CI release
```

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

Global CSS variables in `src/variables.css`.

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
- **Component Organization**: Main file focused on state/lifecycle. Extract rendering to `render-helpers.ts`, utilities to `helpers.ts`
- **CSS-First**: Prioritize CSS over JS for positioning and layout
- **Class Maps**: `{ 'base': true, active: this.isActive, [this.variant]: !!this.variant }`
- **Adding @Prop()**: See `/add-prop` command. ALWAYS update Storybook story when adding props.
- **Punctuation in comments & docs**: use an em dash (—), not a hyphen (-) or en dash (–).
- **Component JSDoc**: the `@part` / `@slot` / `@cssprop` JSDoc block must sit **immediately above `@Component`** with no declaration in between — otherwise Stencil attaches it to that declaration and the docs (Storybook Controls table via `docs.json`) lose the parts/slots.

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
