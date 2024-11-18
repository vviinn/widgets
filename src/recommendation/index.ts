import {
  CrossSellingRequest,
  SimilarProductsRequest,
  RequestStaticFilters,
  Recommendation,
} from "../interfaces/recommendation";
import { RequestDynamicFilterItem } from "../campaign/VPRCampaignService";

type GetRecommendationsBodyProps = {
  productId: string;
  color?: string;
  excluded?: string;
  campaigns?: string;
  dynamicFilters?: RequestDynamicFilterItem[];
};

const parseExcluded = (excluded: string) =>
  excluded.split(";").map((item) => {
    const [column, values] = item.split(":");
    return {
      column,
      values: [values],
    };
  });

const parseCampaigns = (campaigns: string) =>
  campaigns.split(",").map((value) => {
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
    ...(color.length ? { color } : {}),
    ...(excluded.length ? { excluded: parseExcluded(excluded) } : {}),
  };

  return {
    productId,
    ...(dynamicFilters.length ? { dynamicFilters } : {}),
    ...(campaigns.length ? { campaigns: parseCampaigns(campaigns) } : {}),
    ...(Object.keys(staticFilters).length ? { staticFilters } : {}),
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
