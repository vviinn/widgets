import {
  CrossSellingRequest,
  SimilarProductsRequest,
  RequestStaticFilters,
} from "../interfaces/recommendation";

import { RequestDynamicFilters } from "../campaign/VPRCampaignService";
import { SearchInterfaces } from "../interfaces/search";

export type Recommendation = SearchInterfaces["ResponseProductItem"];

type GetRecommendationsBodyProps = {
  productId: string;
  color?: string;
  excluded?: string;
  campaigns?: string;
  dynamicFilters?: RequestDynamicFilters;
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
    dynamicFilters: dynamicFilters ?? undefined,
    ...(campaigns.length ? { campaigns: parseCampaigns(campaigns) } : {}),
    ...(Object.keys(staticFilters).length ? { staticFilters } : {}),
  };
};
