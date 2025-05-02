import {
  CrossSellingRequest,
  SimilarProductsRequest,
  RequestStaticFilters,
  Recommendation,
} from "../interfaces/recommendation";
import { RequestDynamicFilterItem } from "../campaign/VPRCampaignService";
import {
  addIfNotEmpty,
  parseStringToExcluded,
} from "../utils/collections/collectionsUtils";

type GetRecommendationsBodyProps = {
  productId: string;
  color?: string;
  excluded?: string;
  campaigns?: string;
  dynamicFilters?: RequestDynamicFilterItem[];
};

const parseCampaigns = (campaigns: string) =>
  !campaigns.length
    ? ""
    : campaigns.split(",").map((value) => {
        const trimmedValue = value.trim();
        return !isNaN(parseInt(trimmedValue))
          ? parseInt(trimmedValue)
          : trimmedValue;
      });

export const getRecommendationsBody = ({
  productId,
  campaigns,
  color,
  excluded,
  dynamicFilters = [],
}: GetRecommendationsBodyProps):
  | SimilarProductsRequest
  | CrossSellingRequest => {
  const staticFilters: RequestStaticFilters = {
    ...addIfNotEmpty("color", color),
    ...addIfNotEmpty("excluded", parseStringToExcluded(excluded)),
  };
  return {
    productId,
    ...addIfNotEmpty("dynamicFilters", dynamicFilters),
    ...addIfNotEmpty("campaigns", parseCampaigns(campaigns)),
    ...addIfNotEmpty("staticFilters", staticFilters),
  };
};

export const getCustomLabels = (recommendation: Recommendation) => {
  const {
    custom_label_0,
    custom_label_1,
    custom_label_2,
    custom_label_3,
    custom_label_4,
  } = recommendation;

  return [
    custom_label_0,
    custom_label_1,
    custom_label_2,
    custom_label_3,
    custom_label_4,
  ]
    .filter((label) => label)
    .join(",");
};
