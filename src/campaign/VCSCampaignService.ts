import { apiGet } from "../network/apiClient";
import { VCSCampaignResponse } from "./VCSCampaignResponse";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

export const getVCSRecommendations =
  (productId: string) =>
  (color: string) =>
  (campaigns: O.Option<string>) =>
  (options: RequestInit) => {
    const url = pipe(
      campaigns,
      O.map(encodeURIComponent),
      O.match(
        () =>
          `product/${productId}/cross-selling-products${
            color ? `?color=${color}` : ""
          }`,
        (encodedCampaignsIds) =>
          `product/${productId}/cross-selling-products?campaigns=${encodedCampaignsIds}${
            color ? `&color=${color}` : ""
          }`
      )
    );
    return apiGet<VCSCampaignResponse>(url, options);
  };
