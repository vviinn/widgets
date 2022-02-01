export declare type CampaignName = "VPR" | "VSC";
export interface VPR {
  readonly _tag: "VPR";
}
export interface VCS {
  readonly _tag: "VCS";
}
export declare const isVPR: (c: Campaign) => c is VPR;
export declare const isVCS: (c: Campaign) => c is VCS;
export declare type Campaign = VPR | VCS;
export declare function fold<A, B>(onVPR: () => A, onVCS: () => B): (c: Campaign) => A | B;
export declare function fromString(s: CampaignName): Campaign;
