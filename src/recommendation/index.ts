import { RequestFilters } from "../campaign/VPRCampaignService";

type GetRecommendationsBodyProps = {
  productId: string;
  color?: string;
  excluded?: string;
  campaigns?: string;
  filters?: RequestFilters;
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
  color = "",
  excluded = "",
  campaigns = "",
  filters = [],
}: GetRecommendationsBodyProps) => {
  return {
    "product-id": productId,
    filters: filters ?? undefined,
    ...(color.length ? { color } : {}),
    ...(excluded.length ? { excluded: parseExcluded(excluded) } : {}),
    ...(campaigns.length ? { campaigns: parseCampaigns(campaigns) } : {}),
  };
};
