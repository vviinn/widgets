import { VPRCampaignResponse } from "./VPRCampaignResponse";
export declare const getVPRRecommendations: (productId: string) => (options: RequestInit) => import("fp-ts/lib/TaskEither").TaskEither<import("../error").BasicError<string | Response>, VPRCampaignResponse>;
