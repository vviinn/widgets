import { apiGet } from "../network/apiClient";
import { VPRCampaignResponse } from "./VPRCampaignResponse";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

export const getVPRRecommendations =
  (productId: string) =>
  (campaigns: O.Option<string>) =>
  (options: RequestInit) => {
    const url = pipe(
      campaigns,
      O.map(encodeURIComponent),
      O.match(
        () => `product/${productId}/similar-products`,
        (encodedCampaignsIds) =>
          `product/${productId}/similar-products?campaigns=${encodedCampaignsIds}`
      )
    );

    return apiGet<VPRCampaignResponse>(url, options);
  };
