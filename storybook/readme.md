# Storybook

Component playground and changelog for `vviinn-widgets`.

```bash
npm install
npm run storybook        # dev server on :6006, renders the widgets from ../dist
npm run build-storybook  # static build, renders the installed vviinn-widgets package
```

Run `npm run build` in the repository root first — the dev server loads `../dist`.

## Demo sites

The widgets in the stories talk to the live API with a demo merchant token. The selector at the top of the sidebar switches between demo sites; the choice is kept in `localStorage` under `vviinn-site` and applied after a reload.

Each site is one entry in [`helpers/demoSites.json`](helpers/demoSites.json):

| Field                                                | Used for                                              |
| ---------------------------------------------------- | ----------------------------------------------------- |
| `label`                                              | Name in the sidebar selector                          |
| `tokenEnvKey`                                        | Environment variable holding the site's token         |
| `productIdSimilarProducts` / `productIdCrossSelling` | Product ids the recommendation widgets request        |
| `textSearchQuery`                                    | Query the text search stories start with              |
| `filterValue`                                        | Category passed as `filter-value`                     |
| `shopTheLookImageUrls`                               | Images for the Shop the Look stories                  |
| `productCards`                                       | Fixtures for the product-card examples and playground |

Storybook does not read `productIdCrossSelling`, `textSearchQuery`, or the `appendCard` and `minimalisticCard` fixtures; they are kept for the demo site selector planned for the widget previews on docs.vviinn.com.

Product ids and `filterValue` must exist in the site's catalogue. So must the `id` of `mainCard` and `appendCard`: they carry a discovery button that requests recommendations for it. The other card ids are display only.

The file holds data only, so it can be copied as is into another project that renders the same demo. The first entry is the default site.

### Tokens

Tokens never live in tracked files.

- **Locally** — copy `.env.local.example` to `.env.local` and fill in one `STORYBOOK_TOKEN_*` line per site. Ask the team for the values.
- **On deploy** — Cloud Build reads them from Secret Manager (`storybook-token-<site-id>`), see `secretEnv` and `availableSecrets` in `../cloudbuild.yaml`.

A static build fails when a token for any site in `demoSites.json` is missing; any build fails when a site's `productCards` carry a different set of cards than the first site's.

### Switching a site to another catalogue

Change the site's entry in `demoSites.json` — product ids, `filterValue` and `productCards` must come from the new catalogue — and its token in `.env.local` (and in Secret Manager for the deployed Storybook).

### Adding a site

1. Add an entry to `demoSites.json`.
2. Add its `tokenEnvKey` to `.env.local` and `.env.local.example`.
3. For the deployed Storybook: create the `storybook-token-<site-id>` secret and list it in `secretEnv` and `availableSecrets` in `../cloudbuild.yaml`.
