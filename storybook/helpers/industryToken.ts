export const vviinnIndustry =
  localStorage.getItem("vviinn-industries") ?? "home-living";

const data = {
  "home-living": {
    token: process.env.STORYBOOK_TOKEN_HOME_LIVING,
    productIdSimilarProducts: "590013-6",
    productIdCrossSelling: "598125",
    textSearchQuery: "Grey office chair with armrests",
    filterValue: "Möbel > Schränke & Regale",
    description: "company: 'vviinn', site: 'widgets.vviinn.home&living'",
    shopTheLookImageUrls: [
      "https://cdn.vviinn.com/assets/merchant/default/shop-the-look-v2/home_01v2.jpg",
      "https://cdn.vviinn.com/assets/merchant/default/shop-the-look-v2/home_02v2.jpg",
      "https://cdn.vviinn.com/assets/merchant/default/shop-the-look-v2/home_03v2.jpg",
    ],
  },
  fashion: {
    token: process.env.STORYBOOK_TOKEN_FASHION,
    productIdSimilarProducts: "4078868-1",
    productIdCrossSelling: "4017822-1",
    textSearchQuery: "Pink leather bag with gold hardware",
    filterValue: "Beauty > Düfte",
    description:
      "company: 'Vviinn Demo Company', site: 'widgets.vviinn.fashion'",
    shopTheLookImageUrls: [
      "https://cdn.vviinn.com/assets/merchant/default/shop-the-look-v2/fashion_01v2.jpg",
      "https://cdn.vviinn.com/assets/merchant/default/shop-the-look-v2/fashion_02v2.jpg",
      "https://cdn.vviinn.com/assets/merchant/default/shop-the-look-v2/fashion_03v2.jpg",
    ],
  },
  "manufacturer-spare-parts": {
    // this site is not selectable yet, so the data is incomplete
    token: process.env.STORYBOOK_TOKEN_MANUFACTURER_SPARE_PARTS,
    productIdSimilarProducts: "0010030000vr",
    productIdCrossSelling: "0010120001vr",
    textSearchQuery: "Schlitz",
    filterValue: "",
    shopTheLookImageUrls: [],
  },
};

const selectedIndustry = data[vviinnIndustry] || data["home-living"];

if (!selectedIndustry.token) {
  console.error(
    `Missing demo token for industry "${vviinnIndustry}". Copy storybook/.env.local.example to storybook/.env.local and fill in the STORYBOOK_TOKEN_* values.`,
  );
}

export const vviinnToken = selectedIndustry.token ?? "";
export const productIdSimilarProducts =
  selectedIndustry.productIdSimilarProducts;
export const productIdCrossSelling = selectedIndustry.productIdCrossSelling;
export const textSearchQuery = selectedIndustry.textSearchQuery;
export const filterValue = selectedIndustry.filterValue;
export const shopTheLookImageUrls = selectedIndustry.shopTheLookImageUrls;
