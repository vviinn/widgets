export type CampaignName = "VPR" | "VCS";
export type WidgetType = "VPR" | "VPS";
export type CampaignTypeId = "VPR" | "VPS" | "VCS";

export type CampaignTypeTitle =
  | "Similar Products"
  | "Visual Search"
  | "Products Cross-Selling";

export const campaignTypeTitles: Record<CampaignTypeId, CampaignTypeTitle> = {
  VPR: "Similar Products",
  VPS: "Visual Search",
  VCS: "Products Cross-Selling",
};

export interface VPR {
  readonly _tag: "VPR";
}

export interface VCS {
  readonly _tag: "VCS";
}

export const isVPR = (c: Campaign): c is VPR => c._tag === "VPR";
export const isVCS = (c: Campaign): c is VCS => c._tag === "VCS";

export type Campaign = VPR | VCS;

export function fold<A, B>(
  onVPR: () => A,
  onVCS: () => B
): (c: Campaign) => A | B {
  return (c) => (isVPR(c) ? onVPR() : onVCS());
}

export function fromString(s: CampaignName): Campaign {
  return s === "VPR" ? { _tag: "VPR" } : { _tag: "VCS" };
}
