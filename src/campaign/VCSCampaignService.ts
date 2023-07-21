import { apiGet } from "../network/apiClient";
import { arrayToQueryString } from "../utils/collections/collectionsUtils";
import { VCSCampaignResponse } from "./VCSCampaignResponse";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

export const getVCSRecommendations =
  (productId: string) =>
  (color: string) =>
  (excludedFilters: string) =>
  (campaigns: O.Option<string>) =>
  (options: RequestInit) => {
    const url = pipe(
      campaigns,
      O.map(encodeURIComponent),
      O.match(
        () => {
          const params: string[] = [];
          if (color) params.push(`color=${color}`);
          if (excludedFilters) params.push(excludedFilters);
          const queryString = arrayToQueryString(params);
          return `product/${productId}/cross-selling-products${queryString}`;
        },
        (encodedCampaignsIds) => {
          const params: string[] = [];
          if (encodedCampaignsIds)
            params.push(`campaigns=${encodedCampaignsIds}`);
          if (color) params.push(`color=${color}`);
          if (excludedFilters) params.push(excludedFilters);
          const queryString = arrayToQueryString(params);
          return `product/${productId}/cross-selling-products${queryString}`;
        }
      )
    );
    return apiGet<VCSCampaignResponse>(url, options);
  };
