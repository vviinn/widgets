# Development

## Automatic interfaces generations

Before running or build project you should generate interfaces.
Use `npm run build_interfaces` to generate interface schema from Swagger docs. Docs url should be in .env file as value for OPENAPI_URL key.
Interfaces will be saved to /src/interfaces/generated.ts

## Favicons

The icons in `src/` are generated from `src/favicon.svg` and committed, so this
only needs rerunning when the source SVG changes. `sharp` is not a declared
dependency — install it for the run and it is gone again after the next
`npm ci`:

```bash
npm i --no-save sharp@0.35.4
npm run build.favicons
```

The script writes `src/favicon.ico` and `src/apple-touch-icon.png`, then mirrors
all three files into `storybook/public/`.

## Building

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```
