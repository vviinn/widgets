export const isVPR = (c) => c._tag === "VPR";
export const isVCS = (c) => c._tag === "VCS";
export function fold(onVPR, onVCS) {
  return (c) => (isVPR(c) ? onVPR() : onVCS());
}
export function fromString(s) {
  return s === "VPR" ? { _tag: "VPR" } : { _tag: "VCS" };
}
