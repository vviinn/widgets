export function joinTruthy(
  arr: (string | number | false | undefined | null)[],
): string {
  return arr.filter(Boolean).join(" ");
}
