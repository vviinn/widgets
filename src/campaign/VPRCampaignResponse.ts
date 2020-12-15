import { Recommendation } from "../recommendation/recommendation";

export interface VPRCampaignResponse {
  bestFits?: string[];
  extended?: Recommendation[];
}
