import * as C from "./Campaign";
import { pipe } from "fp-ts/lib/function";
import { getVPRRecommendations } from "./VPRCampaignService";
import { getVCSRecommendations } from "./VCSCampaignService";

export const getRecommendationsService = (campaignType: C.CampaignName) =>
  pipe(
    C.fromString(campaignType),
    C.fold(
      () => getVPRRecommendations,
      () => getVCSRecommendations
    )
  );
