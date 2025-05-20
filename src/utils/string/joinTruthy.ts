export function joinTruthy(arr: (string | false | undefined | null)[]): string {
  return arr.filter(Boolean).join(" ");
}
