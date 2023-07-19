import { argTypes, continuityLayoutArgs, gridLayoutArgs } from "./args";
import { gridDecorator, continuityDecorator } from "./decorators";

export default {
  title: "Widgets/Visual Recommendations/Widget",
  component: "vviinn-vpr-widget",
  argTypes: {
    ...argTypes,
    mode: {
      table: {
        disable: true,
      },
    },
  },
};

const alignmentLeft = `
  vviinn-vpr-widget::part(title),
  vviinn-vpr-widget::part(brand),
  vviinn-vpr-widget::part(type),
  vviinn-vpr-widget::part(deeplink),
  vviinn-vpr-widget::part(price-container) {
    align-self: start;
    text-align: left;
  }`;

const alignmentCenter = `
  vviinn-vpr-widget::part(title),
  vviinn-vpr-widget::part(brand),
  vviinn-vpr-widget::part(type),
  vviinn-vpr-widget::part(deeplink),
  vviinn-vpr-widget::part(price-container) {
    align-self: center;
    text-align: center;
  }`;

const alignmentRight = `
  vviinn-vpr-widget::part(title),
  vviinn-vpr-widget::part(brand),
  vviinn-vpr-widget::part(type),
  vviinn-vpr-widget::part(deeplink),
  vviinn-vpr-widget::part(price-container) {
    align-self: end;
    text-align: right;
  }`;

const alignment = new Map([
  [0, alignmentLeft],
  [1, alignmentCenter],
  [2, alignmentRight],
]);

const Template = (args) => `
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "${args.analyticsId}");
      gtag("require", "ec");
    </script>
    <style>
      ${alignment.get(args.contentAlignment)}
      vviinn-vpr-widget::part(title),
      vviinn-vpr-widget::part(brand),
      vviinn-vpr-widget::part(type),
      vviinn-vpr-widget::part(price-sale),
      vviinn-vpr-widget::part(price-regular) {
        color: ${args.primaryTextColor};
      }

      vviinn-vpr-widget::part(price-outdated) {
        color: ${args.secondaryTextColor};
      }

      vviinn-vpr-widget::part(recommendations-title) {
        display: ${args.showTitle ? "flex" : "none"};
        font-size: ${args.titleFontSize}px;
      }

      @media(min-width: 1024px) {
        * {
          --vviinn-carousel-columns: ${args.recommendationsGridProductsDesktop};
        }
      }

      @media(max-width: 1024px) and (min-width: 768px) {
        * {
        --vviinn-carousel-columns: ${args.recommendationsGridProductsTablet};
        }
      }
 
      @media(max-width: 768px) and (min-width: 460px) {
        * {
          --vviinn-carousel-columns: ${args.recommendationsGridProductsMobile};
        }

        vviinn-product-card::part(title) {
          font-size: 14px; 
        }
      }

      @media(min-width: 1024px) {
        vviinn-product-card,
        vviinn-vpr-widget::part(image) {
          width: ${args.recommendationsContinuityProductsDesktop}px;
          max-width: ${args.recommendationsContinuityProductsDesktop}px;
        }

        vviinn-vpr-widget::part(image) {
          height: 100%;
          aspect-ratio: 1;
        }
      }

      @media(max-width: 1024px) and (min-width: 768px) {
        vviinn-product-card,
        vviinn-vpr-widget::part(image) {
          width: ${args.recommendationsContinuityProductsTablet}px;
          max-width: ${args.recommendationsContinuityProductsTablet}px;
        }

        vviinn-vpr-widget::part(image) {
          height: 100%;
          aspect-ratio: 1;
        }
      }

      @media(max-width: 768px) and (min-width: 460px) {
        vviinn-product-card,
        vviinn-vpr-widget::part(image) {
          width: ${args.recommendationsContinuityProductsMobile}px;
          max-width: ${args.recommendationsContinuityProductsMobile}px;
        }

        vviinn-vpr-widget::part(image) {
          height: 100%;
          aspect-ratio: 1;
        }

        vviinn-vpr-widget::part(title) {
          font-size: 14px; 
        }
      }
    </style>

    <vviinn-vpr-widget
      block-title="${args.blockTitle}"
      css-url="${args.cssUrl}"
      currency-sign="${args.currencySign}"
      show-scroll="${args.showScroll}"
      image-ratio="${args.imageRatio}"
      locale="${args.locale}"
      price-prefix="${args.pricePrefix}"
      api-path="${args.apiPath}"
      product-id="${args.productId}"
      token="${args.token}"
      mode="${args.mode}"
      image-width="${args.imageWidth}"
      campaign-type="${args.campaignType}"
      campaigns="${args.campaigns}"
      product-detail-new-tab="${args.productDetailNewTab}"
      color="${args.color ? args.color.slice(1) : ""}"
      grid-arrows-dynamic="${args.gridArrowsDynamic}"
      no-result-text="${args.noResultText}"
      no-result-show="${args.noResultShow}"
    >
    </vviinn-vpr-widget>
`;

export const Continuity = Template.bind({});
Continuity.args = {
  analyticsId: "UA-34442043-5",
  apiPath: "https://api.vviinn.com",
  campaigns: "",
  campaignType: "VPR",
  contentAlignment: "Left",
  imageWidth: 300,
  mode: "continuity",
  color: "",
  primaryTextColor: "#161616",
  productId: "4114460310",
  recommendationsContinuityProductsDesktop: 200,
  recommendationsContinuityProductsMobile: 160,
  recommendationsContinuityProductsTablet: 150,
  secondaryTextColor: "#757575",
  showScroll: false,
  showTitle: true,
  titleFontSize: 28,
  blockTitle: "Recommended products",
  cssUrl: "",
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  imageRatio: 1,
  productDetailNewTab: false,
  noResultText: "No results! Please, try again later.",
  noResultShow: true,
  gridArrowsDynamic: false,
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
};

Continuity.decorators = [continuityDecorator];

Continuity.argTypes = {
  ...continuityLayoutArgs,
};

export const Grid = Template.bind({});
Grid.args = {
  analyticsId: "UA-34442043-5",
  apiPath: "https://api.vviinn.com",
  campaigns: "",
  campaignType: "VPR",
  contentAlignment: "Centered",
  imageWidth: 420,
  mode: "grid",
  color: "",
  primaryTextColor: "#161616",
  productId: "4114460310",
  recommendationsGridProductsDesktop: 4,
  recommendationsGridProductsMobile: 4,
  recommendationsGridProductsTablet: 4,
  secondaryTextColor: "#757575",
  showScroll: true,
  showTitle: true,
  titleFontSize: 28,
  blockTitle: "Recommended products",
  cssUrl: "",
  locale: "en-US",
  currencySign: "€",
  pricePrefix: "",
  imageRatio: 1,
  productDetailNewTab: false,
  noResultText: "No results! Please, try again later.",
  noResultShow: true,
  gridArrowsDynamic: false,
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgzLCJqdGkiOiI3ZTg2Y2I1YS00ZTFjLTRhYjctYjU2My1lN2FjMTYzZTYyZDIiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.SbaQnBkvoXer3GPCWUthFQStFKLHZNMBfj4Qu44WHM8nzaIt48I74yVy4gVbX29vtd6jIkDPdakqEXRXmAxOCtv7_nsd4iBs1yMegfOWW5g8f10PKfZqmWJcfhwKIEElnUMFmP6rXpogntZ7iFfeTBbiRNzQPhkaa7jUjgQkCC4",
};

Grid.argTypes = {
  ...gridLayoutArgs,
};

Grid.decorators = [gridDecorator];
