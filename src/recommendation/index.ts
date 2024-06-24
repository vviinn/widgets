import {
  CrossSellingRequest,
  SimilarProductsRequest,
  RequestStaticFilters,
} from "../interfaces/recommendation";

type GetRecommendationsBodyProps = {
  productId: string;
  color?: string;
  excluded?: string;
  campaigns?: string;
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
}: GetRecommendationsBodyProps):
  | SimilarProductsRequest
  | CrossSellingRequest => {
  const staticFilters: RequestStaticFilters = {
    ...(color.length ? { color } : {}),
    ...(excluded.length ? { excluded: parseExcluded(excluded) } : {}),
  };

  return {
    productId,
    ...(campaigns.length ? { campaigns: parseCampaigns(campaigns) } : {}),
    ...(Object.keys(staticFilters).length ? { staticFilters } : {}),
  };
};
