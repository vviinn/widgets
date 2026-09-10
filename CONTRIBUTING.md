# Contributing

Thank you for looking at the source. Please read this before opening anything.

## Pull requests are not accepted

**We do not accept pull requests from outside the team.** The widgets are the client-side
surface of a hosted service: changes have to be validated against the Vviinn API, real
merchant product feeds and the internal QA setup, none of which are available outside the
company. We cannot review or merge code we are unable to verify, so an outside pull request
would sit open indefinitely — which is worse than not opening it.

The repository is published so that integrators can read the source, understand the
behaviour they are embedding, and file precise reports. That part we very much want.

## Reporting a bug

[Open an issue](https://github.com/vviinn/widgets/issues) and include:

- the package version (or the CDN URL you load),
- the component tag and the props you set, ideally as a minimal HTML snippet,
- browser and operating system, and whether it happens on mobile, desktop or both,
- what you expected and what happened instead, plus any console errors.

Please do not include your read-only token in an issue, and never include any other
credential.

Integration or account questions — product feed, panel configuration, billing — go to
[support@vviinn.com](mailto:support@vviinn.com) rather than the issue tracker.

## Reporting a security issue

Do not open a public issue. See [SECURITY.md](SECURITY.md).

## Development setup

This section is for maintainers; it is here so the setup is documented in one place.

### Requirements

- Node.js `>=22.22.1 <23.0.0` — enforced by `engines` in `package.json`
- npm
- A POSIX-compatible shell. `build` and `start` prefix an inline `ENV=` assignment and
  `update.openapi` pipes through `base64 -d`, none of which `cmd.exe` can run. On Windows,
  work under WSL or Git Bash.

### Install

```bash
npm ci
```

### Environment

Create a `.env` file in the repository root. `.env.dev` is committed as a working starting
point:

```bash
cp .env.dev .env
```

`OPENAPI_URL` must be set — `scripts/generate-interfaces.js` reads it from `.env`
specifically, not from the shell environment.

### Generate interfaces

TypeScript interfaces are generated from the OpenAPI spec and are not committed. Run this
before the first build or dev server, and again whenever the spec changes:

```bash
npm run build_interfaces
```

To refresh the local spec at `openapi/merchant-openapi.yaml` from upstream (requires an
authenticated `gh` CLI):

```bash
npm run update.openapi
```

### TLS certificate for the dev server

`npm start` serves over HTTPS — the search widget needs it for camera access — and reads
`localhost.pem` and `localhost-key.pem` from the repository root. Both are gitignored, so
generate them once per machine, for example with [mkcert](https://github.com/FiloSottile/mkcert):

```bash
mkcert localhost
```

That writes the two files under exactly the names the dev server expects.

### Run

```bash
npm start        # dev server with HTTPS and hot reload
npm run build    # production build
```

The dev harness takes its token and product id from `dev/dev-config.js`, which is gitignored.
Copy the example and fill both in:

```bash
cp dev/dev-config.example.js dev/dev-config.js
```

`token` is needed by every embeddable widget; `productId` is needed on top of it by
`vviinn-vpr-button` and `vviinn-vpr-widget`. The harness sets each attribute only where the
markup does not already carry one, so hardcoding a value in `src/index.html` is how you test
a second tenant. The file is copied at build start rather than watched, so editing it needs a
dev-server restart.

## Storybook

`storybook/` is a separate project with its own `package.json`, published at
https://widgets.vviinn.com.

```bash
cd storybook
npm ci
```

Its demo tokens are supplied per developer and are not committed. Copy the example file and
fill it in:

```bash
cp .env.local.example .env.local
```

Then:

```bash
npm run storybook
```

Storybook imports the widgets from `../../dist/loader`, so run `npm run build` in the
repository root before starting it.

## Tests

```bash
npm test              # unit tests
npm run test.watch    # watch mode
npm run test.coverage # with coverage
```

The end-to-end suite is **not maintained** and does not currently run — do not use
`npm run test.e2e` to validate a change. Rely on unit tests plus a manual check in the dev
server.

## Linting and formatting

```bash
npm run lint      # ESLint
npm run lint.fix  # ESLint with autofix
npm run format    # Prettier over src/
```

A Husky `pre-commit` hook runs lint-staged over staged files: Prettier writes, then ESLint
reports. Formatting is applied silently because it is deterministic; ESLint findings are
reported rather than autofixed, because an autofix changes behaviour and should be seen
before it is committed.

## Commit messages

- **User-facing changes** — `feat:` for features, `fix:` for fixes. These land in the
  published changelog, so write them for the people integrating the widgets. Add a component
  segment when the change targets one component:
  `feat: Vviinn Cropper: toggle cropper visibility by OCR filter`.
- **Routine work** — intermediate fixes, chores, review changes, refactors — use
  `#<issue> Description`, referencing the internal issue tracker.
- **Automation** — releases, CI, changelog bumps — prefix with `[skip ci]`.

Subject line only, no body: the mechanism belongs in the pull request description.

## Code style

Prettier and ESLint cover formatting and the mechanical rules. The conventions below are the
ones a tool cannot check.

### Components

- Class-based components with Shadow DOM. `@Prop` is the public API, `@State` is internal,
  `@Event` emits.
- Keep the main component file about state and lifecycle. Rendering goes to
  `render-helpers.tsx`, everything else to `helpers.ts`, alongside the component.
- Document a `@Prop` with an inline comment above it when it appears in the Storybook
  playground or when its behaviour is not obvious from the name.
- The JSDoc block carrying `@part`, `@slot` and `@cssprop` must sit **immediately** above
  `@Component`, with no declaration in between — otherwise Stencil attaches it to that
  declaration and the parts and slots disappear from the generated docs.
- Build class names as a map: `{ base: true, active: this.isActive }`.

### TypeScript

- Type props, state and events explicitly. Prefer `unknown` over `any`.
- Arrow functions in utility and helper files, regular functions for class methods.
- Never compare objects with `===`. Compare the fields that matter, or use a deep
  comparison.
- Import domain types from `src/interfaces/` — `product.ts`, `search.ts`, `discovery.ts`,
  `interactions.ts`. Never import `generated.ts` directly; it is regenerated from the
  OpenAPI spec and its names are not stable.

### CSS

- Take colours, spacing, radii and typography from the variables in `src/variables.css`.
- The `--spacing-*` variables are for margin, padding and gap — not for width or height.
- Prefer CSS over JavaScript for positioning and layout.
- Avoid `!important`; reach for correct specificity instead.

### Before adding anything

Look for an existing type, constant or helper first: the component's own folder
(`types.ts`, `helpers.ts`, `constants.ts`), then `src/interfaces/`, `src/geometry/`,
`src/constants/`. The intersection-observer and device-detection utilities in particular
already exist and are shared.

### Comments

Comment the intent, the constraint, the edge case — not what the line already says. Delete a
comment together with the code it described, and describe the code as it stands rather than
how it got there; that history belongs in the commit. One line is the default, two the
ceiling: past that, extract a named helper or move the reasoning into the function's JSDoc.

## Code of conduct

Everyone taking part in this project — issues, discussions and reviews included — is
expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
