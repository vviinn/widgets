import demoSites from "./demoSites.json";

export type DemoSiteId = keyof typeof demoSites;

export const SITE_STORAGE_KEY = "vviinn-site";

const [defaultSiteId] = Object.keys(demoSites) as DemoSiteId[];

const isDemoSiteId = (value: string | null): value is DemoSiteId =>
  value !== null && value in demoSites;

const storedSiteId = localStorage.getItem(SITE_STORAGE_KEY);

export const vviinnSite: DemoSiteId = isDemoSiteId(storedSiteId)
  ? storedSiteId
  : defaultSiteId;
