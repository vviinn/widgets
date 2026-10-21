import demoSites from "./demoSites.json";
import { vviinnSite } from "./siteSelection";

const selectedSite = demoSites[vviinnSite];
const token = __STORYBOOK_DEMO_TOKENS__[vviinnSite];

if (!token) {
  console.error(
    `Missing demo token for site "${vviinnSite}". Copy storybook/.env.local.example to storybook/.env.local and fill in ${selectedSite.tokenEnvKey}.`,
  );
}

export const vviinnToken = token ?? "";
export const {
  productIdSimilarProducts,
  filterValue,
  shopTheLookImageUrls,
  productCards: siteProductCards,
} = selectedSite;
