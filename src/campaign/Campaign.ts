export type CampaignName = "VPR" | "VSC";

export interface VPR {
  readonly _tag: "VPR";
}

export interface VCS {
  readonly _tag: "VCS";
}

export const isVPR = (c: Campaign): c is VPR => c._tag === "VPR";
export const isVCS = (c: Campaign): c is VCS => c._tag === "VCS";

export type Campaign = VPR | VCS;

export function fold<B>(onVPR: () => B, onVCS: () => B): (c: Campaign) => B {
  return (c) => (isVPR(c) ? onVPR() : onVCS());
}

export function fromString(s: CampaignName): Campaign {
  return s === "VPR" ? { _tag: "VPR" } : { _tag: "VCS" };
}
