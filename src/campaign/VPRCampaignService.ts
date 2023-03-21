import { apiGet } from "../network/apiClient";
import { VPRCampaignResponse } from "./VPRCampaignResponse";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";
import { addColorToUrl } from "./Campaign";

export const getVPRRecommendations =
  (productId: string) =>
  (color: string) =>
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
    const urlWithParams = addColorToUrl(url, color);
    return apiGet<VPRCampaignResponse>(urlWithParams, options);
  };
