import { VCSCampaignResponse } from "./VCSCampaignResponse";
export declare const getVCSRecommendations: (productId: string) => (options: RequestInit) => import("fp-ts/lib/TaskEither").TaskEither<import("../error").BasicError<string | Response>, VCSCampaignResponse>;
